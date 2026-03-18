import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { CreateRecipeSchema } from '@/lib/validation';
import { detectVideoType } from '@/lib/video';

// GET /api/recipes — list/search recipes (public)
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const country = searchParams.get('country');
  const tag = searchParams.get('tag');
  const sort = searchParams.get('sort') ?? 'votes';
  const search = searchParams.get('search');
  const featured = searchParams.get('featured');
  const limit = Math.min(Number(searchParams.get('limit') ?? '20'), 50);

  const supabase = await createClient();

  let query = supabase
    .from('recipes')
    .select(
      '*, author:profiles!recipes_author_id_fkey(id, username, display_name, avatar_url, reward_tier, total_votes)'
    )
    .eq('published', true)
    .limit(limit);

  // Filters
  if (country) {
    query = query.eq('country_code', country.toUpperCase());
  }

  if (featured === 'true') {
    query = query.eq('featured', true);
  }

  if (search) {
    query = query.textSearch('title', search, {
      type: 'websearch',
      config: 'english',
    });
  }

  // Sort
  if (sort === 'newest') {
    query = query.order('created_at', { ascending: false });
  } else {
    query = query
      .order('total_votes', { ascending: false })
      .order('created_at', { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(
      { error: 'Failed to fetch recipes', detail: error.message },
      { status: 500 }
    );
  }

  // If tag filter requested, we do it client-side (join through recipe_tags)
  // For a simpler approach with existing schema
  let recipes = data ?? [];

  if (tag) {
    const { data: taggedIds } = await supabase
      .from('recipe_tags')
      .select('recipe_id, tags!inner(name)')
      .eq('tags.name', tag);

    if (taggedIds) {
      const idSet = new Set(taggedIds.map((t: { recipe_id: string }) => t.recipe_id));
      recipes = recipes.filter((r) => idSet.has(r.id));
    }
  }

  return NextResponse.json({ recipes });
}

// POST /api/recipes — create recipe (auth required)
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  // Validate with Zod
  const parsed = CreateRecipeSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? 'Invalid input';
    return NextResponse.json({ error: firstError }, { status: 400 });
  }

  const data = parsed.data;

  // Detect video type
  const videoType = data.videoUrl ? detectVideoType(data.videoUrl) : null;

  // 1. Insert recipe
  const { data: recipe, error: recipeError } = await supabase
    .from('recipes')
    .insert({
      title: data.title,
      description: data.description,
      emoji: data.emoji,
      image_url: data.imageUrl || null,
      country_code: data.countryCode,
      country_name: data.countryName,
      country_flag: data.countryFlag,
      difficulty: data.difficulty,
      time_minutes: data.timeMinutes,
      servings: data.servings,
      video_url: data.videoUrl || null,
      video_type: videoType,
      video_note: data.videoNote || null,
      published: true,
      featured: false,
      source: 'community',
      author_id: user.id,
      total_votes: 0,
    })
    .select('id')
    .single();

  if (recipeError || !recipe) {
    return NextResponse.json(
      { error: 'Failed to create recipe', detail: recipeError?.message },
      { status: 500 }
    );
  }

  // 2. Insert ingredients
  if (data.ingredients.length > 0) {
    const { error: ingError } = await supabase.from('ingredients').insert(
      data.ingredients.map((ing) => ({
        recipe_id: recipe.id,
        text: ing.text,
        sort_order: ing.sort_order,
      }))
    );
    if (ingError) {
      console.error('Ingredients insert error:', ingError.message);
    }
  }

  // 3. Insert steps
  if (data.steps.length > 0) {
    const { error: stepError } = await supabase.from('recipe_steps').insert(
      data.steps.map((s) => ({
        recipe_id: recipe.id,
        step_number: s.step_number,
        title: s.title,
        body: s.body,
      }))
    );
    if (stepError) {
      console.error('Steps insert error:', stepError.message);
    }
  }

  // 4. Handle tags — find or create, then link
  if (data.tags && data.tags.length > 0) {
    for (const tagName of data.tags) {
      const normalised = tagName.trim().toLowerCase();

      // Try to find existing tag
      let { data: existingTag } = await supabase
        .from('tags')
        .select('id')
        .eq('name', normalised)
        .maybeSingle();

      if (!existingTag) {
        // Create tag
        const { data: newTag } = await supabase
          .from('tags')
          .insert({ name: normalised })
          .select('id')
          .single();
        existingTag = newTag;
      }

      if (existingTag) {
        await supabase.from('recipe_tags').insert({
          recipe_id: recipe.id,
          tag_id: existingTag.id,
        });
      }
    }
  }

  // 5. Increment country recipe_count
  await supabase.rpc('increment_country_count', {
    country_code: data.countryCode,
  });

  return NextResponse.json({ id: recipe.id }, { status: 201 });
}

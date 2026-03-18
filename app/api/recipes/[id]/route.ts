import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { UpdateRecipeSchema } from '@/lib/validation';
import { detectVideoType } from '@/lib/video';

// GET /api/recipes/[id] — single recipe detail (public)
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: recipe, error } = await supabase
    .from('recipes')
    .select(
      '*, author:profiles!recipes_author_id_fkey(*), ingredients(*), steps:recipe_steps(*)'
    )
    .eq('id', id)
    .single();

  if (error || !recipe) {
    return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
  }

  // Fetch tags
  const { data: recipeTags } = await supabase
    .from('recipe_tags')
    .select('tags(id, name)')
    .eq('recipe_id', id);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tags = recipeTags?.flatMap((rt: any) => {
    if (!rt.tags) return [];
    return Array.isArray(rt.tags) ? rt.tags : [rt.tags];
  }) ?? [];

  // Sort ingredients and steps
  if (recipe.ingredients) {
    recipe.ingredients.sort(
      (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order
    );
  }
  if (recipe.steps) {
    recipe.steps.sort(
      (a: { step_number: number }, b: { step_number: number }) => a.step_number - b.step_number
    );
  }

  return NextResponse.json({ ...recipe, tags });
}

// PATCH /api/recipes/[id] — update recipe (owner, community only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch existing recipe
  const { data: existing, error: fetchError } = await supabase
    .from('recipes')
    .select('id, author_id, source, country_code')
    .eq('id', id)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
  }

  // Owner check
  if (existing.author_id !== user.id) {
    return NextResponse.json({ error: 'Not the recipe owner' }, { status: 403 });
  }

  // Community-only check
  if (existing.source !== 'community') {
    return NextResponse.json(
      { error: 'Curated recipes cannot be edited' },
      { status: 403 }
    );
  }

  const body = await request.json();

  // Validate with partial schema
  const parsed = UpdateRecipeSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? 'Invalid input';
    return NextResponse.json({ error: firstError }, { status: 400 });
  }

  const data = parsed.data;

  // Build recipe update fields
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recipeUpdate: Record<string, any> = { updated_at: new Date().toISOString() };

  if (data.title !== undefined) recipeUpdate.title = data.title;
  if (data.description !== undefined) recipeUpdate.description = data.description;
  if (data.emoji !== undefined) recipeUpdate.emoji = data.emoji;
  if (data.countryCode !== undefined) {
    recipeUpdate.country_code = data.countryCode;
    recipeUpdate.country_name = data.countryName;
    recipeUpdate.country_flag = data.countryFlag;
  }
  if (data.difficulty !== undefined) recipeUpdate.difficulty = data.difficulty;
  if (data.timeMinutes !== undefined) recipeUpdate.time_minutes = data.timeMinutes;
  if (data.servings !== undefined) recipeUpdate.servings = data.servings;
  if (data.imageUrl !== undefined) recipeUpdate.image_url = data.imageUrl || null;
  if (data.videoUrl !== undefined) {
    recipeUpdate.video_url = data.videoUrl || null;
    recipeUpdate.video_type = data.videoUrl ? detectVideoType(data.videoUrl) : null;
  }
  if (data.videoNote !== undefined) recipeUpdate.video_note = data.videoNote || null;

  // Update recipe
  const { error: updateError } = await supabase
    .from('recipes')
    .update(recipeUpdate)
    .eq('id', id);

  if (updateError) {
    return NextResponse.json(
      { error: 'Failed to update recipe', detail: updateError.message },
      { status: 500 }
    );
  }

  // Update ingredients (delete + re-insert approach)
  if (data.ingredients !== undefined) {
    await supabase.from('ingredients').delete().eq('recipe_id', id);
    if (data.ingredients.length > 0) {
      await supabase.from('ingredients').insert(
        data.ingredients.map((ing) => ({
          recipe_id: id,
          text: ing.text,
          sort_order: ing.sort_order,
        }))
      );
    }
  }

  // Update steps (delete + re-insert approach)
  if (data.steps !== undefined) {
    await supabase.from('recipe_steps').delete().eq('recipe_id', id);
    if (data.steps.length > 0) {
      await supabase.from('recipe_steps').insert(
        data.steps.map((s) => ({
          recipe_id: id,
          step_number: s.step_number,
          title: s.title,
          body: s.body,
        }))
      );
    }
  }

  // Update tags (delete + re-insert approach)
  if (data.tags !== undefined) {
    await supabase.from('recipe_tags').delete().eq('recipe_id', id);

    for (const tagName of data.tags) {
      const normalised = tagName.trim().toLowerCase();

      let { data: existingTag } = await supabase
        .from('tags')
        .select('id')
        .eq('name', normalised)
        .maybeSingle();

      if (!existingTag) {
        const { data: newTag } = await supabase
          .from('tags')
          .insert({ name: normalised })
          .select('id')
          .single();
        existingTag = newTag;
      }

      if (existingTag) {
        await supabase.from('recipe_tags').insert({
          recipe_id: id,
          tag_id: existingTag.id,
        });
      }
    }
  }

  // Handle country_code change — adjust recipe_counts
  if (data.countryCode && data.countryCode !== existing.country_code) {
    // Decrement old country
    await supabase.rpc('decrement_country_count', {
      country_code: existing.country_code,
    });
    // Increment new country
    await supabase.rpc('increment_country_count', {
      country_code: data.countryCode,
    });
  }

  return NextResponse.json({ id, updated: true });
}

// DELETE /api/recipes/[id] — delete recipe (owner, community only)
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch recipe
  const { data: existing, error: fetchError } = await supabase
    .from('recipes')
    .select('id, author_id, source, country_code')
    .eq('id', id)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
  }

  // Owner check
  if (existing.author_id !== user.id) {
    return NextResponse.json({ error: 'Not the recipe owner' }, { status: 403 });
  }

  // Community-only check
  if (existing.source !== 'community') {
    return NextResponse.json(
      { error: 'Curated recipes cannot be deleted' },
      { status: 403 }
    );
  }

  // Soft delete: set published=false
  const { error: deleteError } = await supabase
    .from('recipes')
    .update({ published: false, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (deleteError) {
    return NextResponse.json(
      { error: 'Failed to delete recipe', detail: deleteError.message },
      { status: 500 }
    );
  }

  // Decrement country count
  await supabase.rpc('decrement_country_count', {
    country_code: existing.country_code,
  });

  return NextResponse.json({ id, deleted: true });
}

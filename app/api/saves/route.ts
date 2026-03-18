import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST /api/saves — toggle save (auth required)
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { recipeId } = body as { recipeId: string };

  if (!recipeId) {
    return NextResponse.json({ error: 'recipeId is required' }, { status: 400 });
  }

  // Check if already saved
  const { data: existing } = await supabase
    .from('saved_recipes')
    .select('recipe_id')
    .eq('user_id', user.id)
    .eq('recipe_id', recipeId)
    .maybeSingle();

  let saved: boolean;

  if (existing) {
    await supabase
      .from('saved_recipes')
      .delete()
      .eq('user_id', user.id)
      .eq('recipe_id', recipeId);
    saved = false;
  } else {
    await supabase.from('saved_recipes').insert({
      user_id: user.id,
      recipe_id: recipeId,
    });
    saved = true;
  }

  return NextResponse.json({ saved });
}

// GET /api/saves — list saved recipes (auth required)
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch saved recipe IDs
  const { data: savedRows, error: savedError } = await supabase
    .from('saved_recipes')
    .select('recipe_id, saved_at')
    .eq('user_id', user.id)
    .order('saved_at', { ascending: false });

  if (savedError) {
    return NextResponse.json(
      { error: 'Failed to fetch saved recipes', detail: savedError.message },
      { status: 500 }
    );
  }

  if (!savedRows || savedRows.length === 0) {
    return NextResponse.json({ recipes: [] });
  }

  const recipeIds = savedRows.map((r) => r.recipe_id);

  // Fetch full recipes with author
  const { data: recipes, error: recipeError } = await supabase
    .from('recipes')
    .select(
      '*, author:profiles!recipes_author_id_fkey(id, username, display_name, avatar_url, reward_tier)'
    )
    .in('id', recipeIds)
    .eq('published', true);

  if (recipeError) {
    return NextResponse.json(
      { error: 'Failed to fetch recipes', detail: recipeError.message },
      { status: 500 }
    );
  }

  // Preserve saved_at ordering
  const recipeMap = new Map((recipes ?? []).map((r) => [r.id, r]));
  const ordered = recipeIds
    .map((id) => recipeMap.get(id))
    .filter(Boolean);

  return NextResponse.json({ recipes: ordered });
}

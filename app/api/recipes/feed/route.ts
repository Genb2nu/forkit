import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Fisher-Yates shuffle — returns a new shuffled array.
 */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// GET /api/recipes/feed — public feed (no auth required)
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const limit = Math.min(Number(searchParams.get('limit') ?? '20'), 50);
  const excludeRaw = searchParams.get('exclude') ?? '';
  const excludeIds = excludeRaw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const supabase = await createClient();

  // Fetch a larger pool (3× limit) so we can shuffle and still have variety.
  // The pool is ordered by votes to stay weighted toward popular recipes,
  // but the final result is shuffled so the sequence differs every session.
  const poolSize = Math.min(limit * 3, 150);

  let query = supabase
    .from('recipes')
    .select(
      '*, author:profiles!recipes_author_id_fkey(id, username, display_name, avatar_url, reward_tier, total_votes)'
    )
    .eq('published', true)
    .order('total_votes', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(poolSize);

  if (excludeIds.length > 0) {
    query = query.not('id', 'in', `(${excludeIds.join(',')})`);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(
      { error: 'Failed to fetch feed', detail: error.message },
      { status: 500 }
    );
  }

  const pool = data ?? [];
  const shuffled = shuffle(pool);
  const recipes = shuffled.slice(0, limit);
  const hasMore = pool.length > limit;

  return NextResponse.json({
    recipes,
    hasMore,
  });
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// ISR: regenerate every hour
export const revalidate = 3600;

// GET /api/leaderboard — leaderboard rankings (public)
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const filter = searchParams.get('filter') ?? 'alltime';
  const countryCode = searchParams.get('country');
  const limit = Math.min(Number(searchParams.get('limit') ?? '50'), 100);

  const supabase = await createClient();

  if (filter === 'month') {
    // Monthly leaderboard: aggregate votes from the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: recentVotes, error } = await supabase
      .from('votes')
      .select('recipe_id, recipes!inner(author_id)')
      .gte('created_at', thirtyDaysAgo.toISOString());

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch leaderboard', detail: error.message },
        { status: 500 }
      );
    }

    // Aggregate votes by author
    const authorVotes = new Map<string, number>();
    for (const vote of recentVotes ?? []) {
      const authorId = (vote.recipes as unknown as { author_id: string })
        ?.author_id;
      if (authorId) {
        authorVotes.set(authorId, (authorVotes.get(authorId) ?? 0) + 1);
      }
    }

    // Get profiles for top authors
    const sortedAuthors = Array.from(authorVotes.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);

    if (sortedAuthors.length === 0) {
      return NextResponse.json({ rankings: [] });
    }

    const authorIds = sortedAuthors.map(([id]) => id);
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .in('id', authorIds)
      .neq('username', 'forkit_curated');

    const profileMap = new Map(
      (profiles ?? []).map((p) => [p.id, p])
    );

    const rankings = sortedAuthors
      .filter(([id]) => profileMap.has(id))
      .map(([id, monthVotes], i) => ({
        ...profileMap.get(id),
        month_votes: monthVotes,
        rank: i + 1,
      }));

    return NextResponse.json({ rankings });
  }

  // All-time or by-country leaderboard
  let query = supabase
    .from('profiles')
    .select('*')
    .neq('username', 'forkit_curated')
    .gt('total_votes', 0)
    .order('total_votes', { ascending: false })
    .limit(limit);

  if (filter === 'country' && countryCode) {
    query = query.eq('country', countryCode.toUpperCase());
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard', detail: error.message },
      { status: 500 }
    );
  }

  const rankings = (data ?? []).map((profile, i) => ({
    ...profile,
    rank: i + 1,
  }));

  return NextResponse.json({ rankings });
}

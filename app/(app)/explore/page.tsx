import { createClient } from '@/lib/supabase/server';
import type { Country, Recipe } from '@/types';
import { ExploreClient } from './explore-client';

export const metadata = {
  title: 'Explore Cuisines — ForkIt',
  description:
    'Discover recipes from 26+ countries. Explore cuisines from around the world on ForkIt.',
};

async function getExploreData() {
  const supabase = await createClient();

  // Countries with recipes sorted by recipe_count DESC
  const { data: countries } = await supabase
    .from('countries')
    .select('*')
    .gt('recipe_count', 0)
    .order('recipe_count', { ascending: false });

  // Stats
  const { count: totalCountries } = await supabase
    .from('countries')
    .select('*', { count: 'exact', head: true })
    .gt('recipe_count', 0);

  const { count: totalRecipes } = await supabase
    .from('recipes')
    .select('*', { count: 'exact', head: true })
    .eq('published', true);

  const { count: totalProfiles } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  // Trending recipes (last 7 days, most voted)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data: trendingRecipes } = await supabase
    .from('recipes')
    .select('*')
    .eq('published', true)
    .gte('created_at', sevenDaysAgo.toISOString())
    .order('total_votes', { ascending: false })
    .limit(5);

  // If not enough recent recipes, fallback to top-voted overall
  let trending = trendingRecipes ?? [];
  if (trending.length < 5) {
    const { data: fallback } = await supabase
      .from('recipes')
      .select('*')
      .eq('published', true)
      .order('total_votes', { ascending: false })
      .limit(5);
    trending = fallback ?? [];
  }

  return {
    countries: (countries ?? []) as Country[],
    trending: trending as Recipe[],
    stats: {
      totalCountries: totalCountries ?? 0,
      totalRecipes: totalRecipes ?? 0,
      totalProfiles: totalProfiles ?? 0,
    },
  };
}

export default async function ExplorePage() {
  const { countries, trending, stats } = await getExploreData();

  return (
    <div className="min-h-screen bg-bg-base text-cream pb-24">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-2xl sm:text-3xl font-display font-bold">
          🌍 Explore Cuisines
        </h1>
        <p className="text-text-2 text-sm mt-1">
          Discover recipes from around the world
        </p>
      </div>

      {/* Stats Banner */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-bg-surface rounded-xl p-3 text-center border border-border">
            <p className="text-xl sm:text-2xl font-bold text-fire">
              {stats.totalCountries}
            </p>
            <p className="text-muted-custom text-xs">Countries</p>
          </div>
          <div className="bg-bg-surface rounded-xl p-3 text-center border border-border">
            <p className="text-xl sm:text-2xl font-bold text-fire">
              {stats.totalRecipes.toLocaleString()}
            </p>
            <p className="text-muted-custom text-xs">Recipes</p>
          </div>
          <div className="bg-bg-surface rounded-xl p-3 text-center border border-border">
            <p className="text-xl sm:text-2xl font-bold text-fire">
              {stats.totalProfiles.toLocaleString()}
            </p>
            <p className="text-muted-custom text-xs">Creators</p>
          </div>
        </div>
      </div>

      {/* Client-side interactive parts: search + grid + trending */}
      <ExploreClient countries={countries} trending={trending} />
    </div>
  );
}

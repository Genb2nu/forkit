import type { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://forkit.app';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/creators`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/discover`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/explore`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/leaderboard`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/create`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ];

  // Dynamic pages from Supabase
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return staticPages;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Fetch all published recipe IDs
  const { data: recipes } = await supabase
    .from('recipes')
    .select('id, updated_at')
    .eq('published', true)
    .order('updated_at', { ascending: false });

  const recipePages: MetadataRoute.Sitemap = (recipes ?? []).map((r) => ({
    url: `${baseUrl}/recipe/${r.id}`,
    lastModified: new Date(r.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Fetch all usernames
  const { data: profiles } = await supabase
    .from('profiles')
    .select('username, updated_at')
    .neq('username', 'forkit_curated')
    .order('updated_at', { ascending: false });

  const profilePages: MetadataRoute.Sitemap = (profiles ?? []).map((p) => ({
    url: `${baseUrl}/profile/${p.username}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  return [...staticPages, ...recipePages, ...profilePages];
}

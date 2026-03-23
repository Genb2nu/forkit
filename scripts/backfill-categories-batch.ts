// ============================================================
// ForkIt — Backfill categories (batch approach)
// Run with: npx tsx scripts/backfill-categories-batch.ts
//
// Uses TheMealDB's filter-by-category endpoint to get all meal
// names per category, then matches against our recipes by title.
// Much faster than individual lookups.
// ============================================================

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import { createClient } from '@supabase/supabase-js';
import { Agent, fetch as undiciFetch } from 'undici';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const insecureAgent = new Agent({ connect: { rejectUnauthorized: false, timeout: 30_000 } });
const safeFetch = (url: string | URL, init?: Record<string, unknown>) =>
  undiciFetch(url, { ...init, dispatcher: insecureAgent } as Parameters<typeof undiciFetch>[1]);

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  global: {
    fetch: (url: string | URL | Request, init?: RequestInit) =>
      safeFetch(url as string | URL, init as Record<string, unknown>) as unknown as Promise<Response>,
  },
});

const BASE = 'https://www.themealdb.com/api/json/v1/1';
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const CATEGORIES = [
  'Beef', 'Breakfast', 'Chicken', 'Dessert', 'Goat', 'Lamb',
  'Miscellaneous', 'Pasta', 'Pork', 'Seafood', 'Side', 'Starter',
  'Vegan', 'Vegetarian',
];

interface MealListItem { strMeal: string; idMeal: string; }

async function main() {
  console.log('📂 ForkIt — Category Backfill (Batch)');
  console.log('========================================\n');

  // 1. Build a map: meal title (lowercase) → category
  const titleToCategory = new Map<string, string>();

  for (const category of CATEGORIES) {
    process.stdout.write(`  Fetching ${category}...`);
    try {
      const res = await safeFetch(`${BASE}/filter.php?c=${category}`) as unknown as Response;
      const data = (await res.json()) as { meals: MealListItem[] | null };
      const meals = data.meals || [];
      for (const m of meals) {
        titleToCategory.set(m.strMeal.toLowerCase(), category);
      }
      console.log(` ${meals.length} meals`);
    } catch (err) {
      console.log(` ❌ ${(err as Error).message}`);
    }
    await sleep(300);
  }

  console.log(`\n📊 Total meals indexed: ${titleToCategory.size}\n`);

  // 2. Fetch all our recipes
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('id, title, category')
    .order('title');

  if (error || !recipes) {
    console.error('❌ Failed to fetch recipes:', error?.message);
    process.exit(1);
  }

  // 3. Match and update
  let updated = 0;
  let notFound = 0;
  const alreadySet = recipes.filter((r) => r.category && r.category !== 'Miscellaneous').length;

  for (const recipe of recipes) {
    // Skip if already categorized
    if (recipe.category && recipe.category !== 'Miscellaneous') continue;

    const category = titleToCategory.get(recipe.title.toLowerCase());
    if (!category) {
      notFound++;
      continue;
    }

    const { error: updateError } = await supabase
      .from('recipes')
      .update({ category })
      .eq('id', recipe.id);

    if (!updateError) {
      updated++;
    }
  }

  console.log('========================================');
  console.log(`✅ Updated: ${updated}`);
  console.log(`📌 Already categorized: ${alreadySet}`);
  console.log(`⚠️  No match on TheMealDB: ${notFound}`);
  console.log(`📊 Total recipes: ${recipes.length}`);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});

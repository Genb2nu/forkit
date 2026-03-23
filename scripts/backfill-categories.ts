// ============================================================
// ForkIt — Backfill recipe categories from TheMealDB
// Run with: npx tsx scripts/backfill-categories.ts
//
// Looks up each recipe's TheMealDB ID from source_url,
// fetches strCategory, and updates the category column.
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

async function main() {
  console.log('📂 ForkIt — Category Backfill');
  console.log('================================\n');

  // Fetch all recipes that have a TheMealDB source_url
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('id, title, source_url, category')
    .like('source_url', '%themealdb.com/meal/%')
    .order('created_at', { ascending: true });

  if (error || !recipes) {
    console.error('❌ Failed to fetch recipes:', error?.message);
    process.exit(1);
  }

  // Filter to those still with default category
  const toProcess = recipes.filter((r) => !r.category || r.category === 'Miscellaneous');
  console.log(`📋 ${toProcess.length} recipes to categorize (out of ${recipes.length} total)\n`);

  if (toProcess.length === 0) {
    console.log('✅ All recipes already have categories!');
    return;
  }

  let updated = 0;
  let failed = 0;

  for (const recipe of toProcess) {
    // Extract TheMealDB ID from source_url
    const mealId = recipe.source_url?.match(/meal\/(\d+)/)?.[1];
    if (!mealId) {
      failed++;
      continue;
    }

    try {
      await sleep(350); // polite rate limiting
      const res = await safeFetch(`${BASE}/lookup.php?i=${mealId}`) as unknown as Response;
      const data = (await res.json()) as { meals: Array<{ strCategory: string }> | null };
      const category = data?.meals?.[0]?.strCategory;

      if (!category) {
        process.stdout.write(`  ⚠️ ${recipe.title} — no category found\n`);
        failed++;
        continue;
      }

      const { error: updateError } = await supabase
        .from('recipes')
        .update({ category })
        .eq('id', recipe.id);

      if (updateError) {
        process.stdout.write(`  ❌ ${recipe.title} — ${updateError.message}\n`);
        failed++;
      } else {
        process.stdout.write(`  ✅ ${recipe.title} → ${category}\n`);
        updated++;
      }
    } catch (err) {
      process.stdout.write(`  ❌ ${recipe.title} — ${(err as Error).message}\n`);
      failed++;
    }
  }

  console.log('\n================================');
  console.log(`✅ Updated: ${updated}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total: ${toProcess.length}`);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});

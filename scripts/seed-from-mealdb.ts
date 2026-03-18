// ============================================================
// ForkIt — TheMealDB Import Script
// Run with: npx tsx scripts/seed-from-mealdb.ts
// Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
// in .env.local
// ============================================================

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load env from project root
dotenv.config({ path: resolve(__dirname, '..', '.env.local') });

const SYSTEM_USER_ID = '00000000-0000-0000-0000-000000000001';
const BASE = 'https://www.themealdb.com/api/json/v1/1';
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    '❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local'
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ---- Cuisine emoji map ----
const CUISINE_EMOJI: Record<string, string> = {
  Japanese: '🍣',
  Chinese: '🥟',
  Indian: '🍛',
  Thai: '🌶️',
  Mexican: '🌮',
  Moroccan: '🫕',
  Italian: '🍝',
  French: '🥐',
  Spanish: '🥘',
  Greek: '🫒',
  Malaysian: '🍲',
  Vietnamese: '🍜',
  Tunisian: '🍳',
  Turkish: '🌯',
  Egyptian: '🧆',
  Kenyan: '🥩',
  Jamaican: '🍗',
  American: '🍔',
  British: '🍖',
  Canadian: '🥞',
  Croatian: '🫙',
  Dutch: '🧀',
  Irish: '🥔',
  Polish: '🫓',
  Portuguese: '🥗',
  Russian: '🥣',
  DEFAULT: '🍴',
};

// ---- Area → country code/flag mapping (all 26 TheMealDB areas) ----
const AREAS: { area: string; code: string; flag: string }[] = [
  { area: 'American', code: 'US', flag: '🇺🇸' },
  { area: 'British', code: 'GB', flag: '🇬🇧' },
  { area: 'Canadian', code: 'CA', flag: '🇨🇦' },
  { area: 'Chinese', code: 'CN', flag: '🇨🇳' },
  { area: 'Croatian', code: 'HR', flag: '🇭🇷' },
  { area: 'Dutch', code: 'NL', flag: '🇳🇱' },
  { area: 'Egyptian', code: 'EG', flag: '🇪🇬' },
  { area: 'French', code: 'FR', flag: '🇫🇷' },
  { area: 'Greek', code: 'GR', flag: '🇬🇷' },
  { area: 'Indian', code: 'IN', flag: '🇮🇳' },
  { area: 'Irish', code: 'IE', flag: '🇮🇪' },
  { area: 'Italian', code: 'IT', flag: '🇮🇹' },
  { area: 'Jamaican', code: 'JM', flag: '🇯🇲' },
  { area: 'Japanese', code: 'JP', flag: '🇯🇵' },
  { area: 'Kenyan', code: 'KE', flag: '🇰🇪' },
  { area: 'Malaysian', code: 'MY', flag: '🇲🇾' },
  { area: 'Mexican', code: 'MX', flag: '🇲🇽' },
  { area: 'Moroccan', code: 'MA', flag: '🇲🇦' },
  { area: 'Polish', code: 'PL', flag: '🇵🇱' },
  { area: 'Portuguese', code: 'PT', flag: '🇵🇹' },
  { area: 'Russian', code: 'RU', flag: '🇷🇺' },
  { area: 'Spanish', code: 'ES', flag: '🇪🇸' },
  { area: 'Thai', code: 'TH', flag: '🇹🇭' },
  { area: 'Tunisian', code: 'TN', flag: '🇹🇳' },
  { area: 'Turkish', code: 'TR', flag: '🇹🇷' },
  { area: 'Vietnamese', code: 'VN', flag: '🇻🇳' },
];

// ---- TheMealDB response types ----
interface MealListItem {
  strMeal: string;
  strMealThumb: string;
  idMeal: string;
}

interface MealDetail {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strYoutube: string | null;
  [key: string]: string | null;
}

// ---- Import logic ----
async function importArea(area: string, code: string, flag: string) {
  console.log(`\n🌍 Importing ${area}...`);

  const listRes = await fetch(`${BASE}/filter.php?a=${area}`);
  const listData = (await listRes.json()) as { meals: MealListItem[] | null };
  const meals = listData.meals;

  if (!meals) {
    console.log(`  ⚠️  No meals found for ${area}`);
    return;
  }

  let importedCount = 0;

  for (const meal of meals) {
    await sleep(500); // polite rate limiting

    const detailRes = await fetch(`${BASE}/lookup.php?i=${meal.idMeal}`);
    const detailData = (await detailRes.json()) as {
      meals: MealDetail[] | null;
    };
    const d = detailData.meals?.[0];
    if (!d) continue;

    // Parse ingredients (strIngredient1-20 + strMeasure1-20)
    const ingredients: { text: string; sort_order: number }[] = [];
    for (let i = 1; i <= 20; i++) {
      const ing = (d[`strIngredient${i}`] ?? '').trim();
      const msr = (d[`strMeasure${i}`] ?? '').trim();
      if (ing) {
        ingredients.push({
          text: [msr, ing].filter(Boolean).join(' '),
          sort_order: i,
        });
      }
    }

    // Parse steps (split instructions on newlines, filter short lines)
    const rawInstructions = (d.strInstructions || '')
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n');

    const stepTexts = rawInstructions
      .split('\n')
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 20);

    const steps =
      stepTexts.length > 0
        ? stepTexts.map((text: string, i: number) => ({
            step_number: i + 1,
            title: `Step ${i + 1}`,
            body: text,
          }))
        : [
            {
              step_number: 1,
              title: 'Instructions',
              body: rawInstructions.trim(),
            },
          ];

    // Insert recipe
    const { data: recipe, error } = await supabase
      .from('recipes')
      .insert({
        title: d.strMeal,
        description: `A classic ${area} dish. ${d.strCategory || 'Traditional'} cuisine.`,
        emoji: CUISINE_EMOJI[area] ?? CUISINE_EMOJI.DEFAULT,
        image_url: d.strMealThumb,
        country_code: code,
        country_name: area,
        country_flag: flag,
        difficulty: 'medium' as const,
        time_minutes: Math.max(15, steps.length * 8),
        servings: 4,
        video_url: d.strYoutube || null,
        video_type: d.strYoutube ? ('youtube' as const) : null,
        video_note: d.strYoutube
          ? 'Official cooking tutorial video.'
          : null,
        published: true,
        featured: false,
        source: 'curated',
        source_url: `https://www.themealdb.com/meal/${d.idMeal}`,
        author_id: SYSTEM_USER_ID,
        total_votes: 0,
      })
      .select('id')
      .single();

    if (error || !recipe) {
      console.error(`  ✗ ${d.strMeal}: ${error?.message}`);
      continue;
    }

    // Insert ingredients
    if (ingredients.length > 0) {
      await supabase.from('ingredients').insert(
        ingredients.map((ing) => ({
          ...ing,
          recipe_id: recipe.id,
        }))
      );
    }

    // Insert steps
    if (steps.length > 0) {
      await supabase.from('recipe_steps').insert(
        steps.map((s) => ({
          ...s,
          recipe_id: recipe.id,
        }))
      );
    }

    // Update country recipe_count
    await supabase.rpc('increment_country_count', { country_code: code });

    importedCount++;
    console.log(`  ✓ ${d.strMeal}`);
  }

  console.log(`  📊 Imported ${importedCount}/${meals.length} meals for ${area}`);
}

// ---- Main ----
(async () => {
  console.log('🍴 Starting TheMealDB import...');
  console.log(`   Supabase URL: ${supabaseUrl}`);
  console.log(`   Areas to import: ${AREAS.length}`);
  console.log('');

  let totalImported = 0;

  for (const { area, code, flag } of AREAS) {
    await importArea(area, code, flag);
    totalImported++;
  }

  console.log(`\n✅ Import complete! Processed ${totalImported} cuisine areas.`);
})();

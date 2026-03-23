// ============================================================
// ForkIt — Import Desserts from TheMealDB
// Run with: npx tsx scripts/seed-desserts.ts
//
// Fetches dessert recipes from TheMealDB, skips duplicates,
// inserts into Supabase, downloads images and uploads to
// Supabase Storage so they're self-hosted.
// ============================================================

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import { createClient } from '@supabase/supabase-js';
import { Agent, fetch as undiciFetch } from 'undici';
import { execSync } from 'child_process';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Undici fetch for Supabase client (handles corporate TLS proxies)
const insecureAgent = new Agent({ connect: { rejectUnauthorized: false, timeout: 30_000 } });
const safeFetch = (url: string | URL, init?: Record<string, unknown>) =>
  undiciFetch(url, { ...init, dispatcher: insecureAgent } as Parameters<typeof undiciFetch>[1]);

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  global: {
    fetch: (url: string | URL | Request, init?: RequestInit) =>
      safeFetch(url as string | URL, init as Record<string, unknown>) as unknown as Promise<Response>,
  },
});

const SYSTEM_USER_ID = '00000000-0000-0000-0000-000000000001';
const BASE = 'https://www.themealdb.com/api/json/v1/1';
const BUCKET = 'recipe-images';
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ---- Area → country code/flag mapping ----
const AREA_MAP: Record<string, { code: string; flag: string }> = {
  American: { code: 'US', flag: '🇺🇸' },
  British: { code: 'GB', flag: '🇬🇧' },
  Canadian: { code: 'CA', flag: '🇨🇦' },
  Chinese: { code: 'CN', flag: '🇨🇳' },
  Croatian: { code: 'HR', flag: '🇭🇷' },
  Dutch: { code: 'NL', flag: '🇳🇱' },
  Egyptian: { code: 'EG', flag: '🇪🇬' },
  Filipino: { code: 'PH', flag: '🇵🇭' },
  French: { code: 'FR', flag: '🇫🇷' },
  Greek: { code: 'GR', flag: '🇬🇷' },
  Indian: { code: 'IN', flag: '🇮🇳' },
  Irish: { code: 'IE', flag: '🇮🇪' },
  Italian: { code: 'IT', flag: '🇮🇹' },
  Jamaican: { code: 'JM', flag: '🇯🇲' },
  Japanese: { code: 'JP', flag: '🇯🇵' },
  Kenyan: { code: 'KE', flag: '🇰🇪' },
  Malaysian: { code: 'MY', flag: '🇲🇾' },
  Mexican: { code: 'MX', flag: '🇲🇽' },
  Moroccan: { code: 'MA', flag: '🇲🇦' },
  Norwegian: { code: 'NO', flag: '🇳🇴' },
  Polish: { code: 'PL', flag: '🇵🇱' },
  Portuguese: { code: 'PT', flag: '🇵🇹' },
  Russian: { code: 'RU', flag: '🇷🇺' },
  Singaporean: { code: 'SG', flag: '🇸🇬' },
  Spanish: { code: 'ES', flag: '🇪🇸' },
  Thai: { code: 'TH', flag: '🇹🇭' },
  Tunisian: { code: 'TN', flag: '🇹🇳' },
  Turkish: { code: 'TR', flag: '🇹🇷' },
  Vietnamese: { code: 'VN', flag: '🇻🇳' },
  Indonesian: { code: 'ID', flag: '🇮🇩' },
  Argentinian: { code: 'AR', flag: '🇦🇷' },
  Algerian: { code: 'DZ', flag: '🇩🇿' },
  Australian: { code: 'AU', flag: '🇦🇺' },
  Danish: { code: 'DK', flag: '🇩🇰' },
  Slovak: { code: 'SK', flag: '🇸🇰' },
  Hungarian: { code: 'HU', flag: '🇭🇺' },
  Palestinian: { code: 'PS', flag: '🇵🇸' },
  Uruguayan: { code: 'UY', flag: '🇺🇾' },
  Swedish: { code: 'SE', flag: '🇸🇪' },
  Unknown: { code: 'XX', flag: '🌍' },
};

const CUISINE_EMOJI: Record<string, string> = {
  American: '🍰', British: '🍰', Canadian: '🍁', French: '🥐',
  Italian: '🍝', Japanese: '🍡', Mexican: '🌮', Turkish: '🍯',
  Spanish: '🍮', Greek: '🍯', Polish: '🍰', Norwegian: '🍰',
  Dutch: '🧇', Malaysian: '🍡', Jamaican: '🍌', Moroccan: '🍯',
  Tunisian: '🍊', DEFAULT: '🍰',
};

// ---- TheMealDB types ----
interface MealListItem { strMeal: string; strMealThumb: string; idMeal: string; }
interface MealDetail { [key: string]: string | null; }

// ---- Download image with PowerShell (reliable on Windows) ----
function downloadImage(url: string): { buffer: Uint8Array; contentType: string } | null {
  try {
    const psScript = `
      [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
      try {
        $wc = New-Object System.Net.WebClient
        $wc.Headers.Add('User-Agent', 'Mozilla/5.0 ForkIt/1.0')
        $bytes = $wc.DownloadData('${url.replace(/'/g, "''")}')
        [Convert]::ToBase64String($bytes)
      } catch {
        Write-Output "ERROR:$($_.Exception.Message)"
      }
    `.trim();

    const result = execSync(
      `powershell -NoProfile -Command "${psScript.replace(/"/g, '\\"').replace(/\n/g, '; ')}"`,
      { timeout: 20_000, maxBuffer: 10 * 1024 * 1024, encoding: 'utf-8' }
    ).trim();

    if (result.startsWith('ERROR:') || !result || result.length < 100) return null;

    const buffer = Buffer.from(result, 'base64');
    let contentType = 'image/jpeg';
    if (buffer[0] === 0x89 && buffer[1] === 0x50) contentType = 'image/png';
    else if (buffer[0] === 0x52 && buffer[1] === 0x49) contentType = 'image/webp';

    return { buffer: new Uint8Array(buffer), contentType };
  } catch {
    return null;
  }
}

// ---- Upload to Supabase Storage ----
async function uploadToSupabase(recipeId: string, buffer: Uint8Array, contentType: string): Promise<string | null> {
  const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
  const path = `recipes/${recipeId}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, { contentType, upsert: true });
  if (error) return null;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// ---- Guess country from strArea or title ----
function resolveCountry(area: string | null): { code: string; name: string; flag: string } {
  const name = (area || 'Unknown').trim();
  const mapped = AREA_MAP[name];
  if (mapped) return { code: mapped.code, name, flag: mapped.flag };
  // Fallback
  return { code: 'XX', name: name || 'International', flag: '🌍' };
}

// ---- Main ----
async function main() {
  console.log('🍰 ForkIt — Dessert Importer');
  console.log('================================\n');

  // 1. Get all dessert IDs from TheMealDB
  console.log('📡 Fetching dessert list from TheMealDB...');
  const listRes = await fetch(`${BASE}/filter.php?c=Dessert`);
  const listData = (await listRes.json()) as { meals: MealListItem[] | null };
  const allDesserts = listData.meals || [];
  console.log(`   Found ${allDesserts.length} desserts on TheMealDB\n`);

  // 2. Get existing recipe titles to skip duplicates
  const { data: existing } = await supabase.from('recipes').select('title');
  const existingTitles = new Set((existing || []).map((r) => r.title.toLowerCase()));
  console.log(`   ${existingTitles.size} recipes already in DB\n`);

  // 3. Filter to new ones only
  const newDesserts = allDesserts.filter((d) => !existingTitles.has(d.strMeal.toLowerCase()));
  console.log(`🆕 ${newDesserts.length} new desserts to import\n`);

  if (newDesserts.length === 0) {
    console.log('✅ All desserts are already imported!');
    return;
  }

  let imported = 0;
  let failed = 0;

  for (const dessert of newDesserts) {
    process.stdout.write(`  🔄 ${dessert.strMeal}...`);

    try {
      // Fetch full details
      await sleep(500);
      const detailRes = await fetch(`${BASE}/lookup.php?i=${dessert.idMeal}`);
      const detailData = (await detailRes.json()) as { meals: MealDetail[] | null };
      const d = detailData.meals?.[0];
      if (!d) {
        console.log(' ⚠️ No detail found');
        failed++;
        continue;
      }

      // Parse ingredients
      const ingredients: { text: string; sort_order: number }[] = [];
      for (let i = 1; i <= 20; i++) {
        const ing = (d[`strIngredient${i}`] ?? '').trim();
        const msr = (d[`strMeasure${i}`] ?? '').trim();
        if (ing) {
          ingredients.push({ text: [msr, ing].filter(Boolean).join(' '), sort_order: i });
        }
      }

      // Parse steps
      const rawInstructions = (d.strInstructions || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
      const stepTexts = rawInstructions.split('\n').map((s: string) => s.trim()).filter((s: string) => s.length > 20);
      const steps = stepTexts.length > 0
        ? stepTexts.map((text: string, i: number) => ({ step_number: i + 1, title: `Step ${i + 1}`, body: text }))
        : [{ step_number: 1, title: 'Instructions', body: rawInstructions.trim() }];

      // Resolve country
      const country = resolveCountry(d.strArea);
      const emoji = CUISINE_EMOJI[country.name] ?? CUISINE_EMOJI.DEFAULT;

      // Tags from strTags
      const tagNames = (d.strTags || '')
        .split(',')
        .map((t: string) => t.trim().toLowerCase())
        .filter((t: string) => t.length > 0);
      // Always add 'dessert' tag
      if (!tagNames.includes('dessert')) tagNames.push('dessert');

      // Insert recipe
      const { data: recipe, error } = await supabase
        .from('recipes')
        .insert({
          title: d.strMeal!,
          description: `A delightful ${country.name} dessert. ${d.strCategory || 'Sweet'} treat.`,
          emoji,
          image_url: null, // Will be set after upload
          country_code: country.code,
          country_name: country.name,
          country_flag: country.flag,
          difficulty: 'medium' as const,
          time_minutes: Math.max(15, steps.length * 8),
          servings: 4,
          video_url: d.strYoutube || null,
          video_type: d.strYoutube ? ('youtube' as const) : null,
          video_note: d.strYoutube ? 'Cooking tutorial video.' : null,
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
        console.log(` ❌ Insert failed: ${error?.message}`);
        failed++;
        continue;
      }

      // Insert ingredients
      if (ingredients.length > 0) {
        await supabase.from('ingredients').insert(
          ingredients.map((ing) => ({ ...ing, recipe_id: recipe.id }))
        );
      }

      // Insert steps
      if (steps.length > 0) {
        await supabase.from('recipe_steps').insert(
          steps.map((s) => ({ ...s, recipe_id: recipe.id }))
        );
      }

      // Insert tags
      for (const tagName of tagNames) {
        // Upsert tag
        const { data: tag } = await supabase
          .from('tags')
          .upsert({ name: tagName }, { onConflict: 'name' })
          .select('id')
          .single();
        if (tag) {
          await supabase.from('recipe_tags').insert({ recipe_id: recipe.id, tag_id: tag.id }).select();
        }
      }

      // Download image and upload to Supabase Storage
      let imageUrl: string | null = null;
      if (d.strMealThumb) {
        const imgData = downloadImage(d.strMealThumb);
        if (imgData) {
          imageUrl = await uploadToSupabase(recipe.id, imgData.buffer, imgData.contentType);
        }
      }

      // Update recipe with image URL
      if (imageUrl) {
        await supabase.from('recipes').update({ image_url: imageUrl }).eq('id', recipe.id);
      }

      // Ensure country exists in countries table
      await supabase
        .from('countries')
        .upsert({ code: country.code, name: country.name, flag: country.flag, recipe_count: 0 }, { onConflict: 'code' })
        .select();
      await supabase.rpc('increment_country_count', { country_code: country.code });

      console.log(imageUrl ? ' ✅' : ' ✅ (no image)');
      imported++;
    } catch (err) {
      console.log(` ❌ Error: ${(err as Error).message}`);
      failed++;
    }
  }

  console.log('\n================================');
  console.log(`✅ Imported: ${imported}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total new desserts: ${newDesserts.length}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});

// ============================================================
// ForkIt — Migrate Recipe Images to Supabase Storage
// Run with: npx tsx scripts/add-recipe-images.ts
//
// Strategy:
// 1. Fetch recipes with TheMealDB image URLs
// 2. Download the image from TheMealDB
// 3. Upload to Supabase Storage
// 4. Update the recipe record with the Supabase public URL
//
// This ensures all images are self-hosted in Supabase Storage
// and won't break if TheMealDB goes down.
//
// Flags:
//   --all        Update ALL recipes (re-download to Supabase)
//   --migrate    Migrate TheMealDB URLs to Supabase Storage (default)
// ============================================================

// Bypass corporate TLS-inspection proxies
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import { createClient } from '@supabase/supabase-js';
import { Agent, fetch as undiciFetch } from 'undici';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { execSync } from 'child_process';

dotenv.config({ path: resolve(__dirname, '..', '.env.local') });

// Use undici fetch with insecure agent for Supabase client only
const insecureAgent = new Agent({ connect: { rejectUnauthorized: false, timeout: 30_000 } });
const safeFetch = (url: string | URL, init?: Record<string, unknown>) =>
  undiciFetch(url, { ...init, dispatcher: insecureAgent } as Parameters<typeof undiciFetch>[1]);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  global: {
    fetch: (url: string | URL | Request, init?: RequestInit) =>
      safeFetch(url as string | URL, init as Record<string, unknown>) as unknown as Promise<Response>,
  },
});
const BUCKET = 'recipe-images';
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Prevent unhandled errors from crashing the process
process.on('unhandledRejection', (err) => {
  console.error('\n  ⚠️ Unhandled rejection:', (err as Error)?.message || err);
});
process.on('uncaughtException', (err) => {
  console.error('\n  ⚠️ Uncaught exception:', err.message);
});

// ---- Check if URL is already in our Supabase Storage ----
function isSupabaseStorageUrl(url: string): boolean {
  return url.includes(`${supabaseUrl}/storage/v1/object/public/${BUCKET}`);
}

// ---- Download image using PowerShell/curl (out-of-process to avoid Node crashes) ----
function downloadImage(url: string): Promise<{ buffer: Uint8Array; contentType: string } | null> {
  return new Promise((resolve) => {
    try {
      // Use PowerShell to download the image as base64 — avoids Node.js TLS/connection issues
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

      if (result.startsWith('ERROR:')) {
        const errMsg = result.substring(6);
        // Check for 403/404 type errors
        if (errMsg.includes('403') || errMsg.includes('404') || errMsg.includes('Forbidden')) {
          console.error(`    Download failed: ${errMsg}`);
        } else {
          console.error(`    Download error: ${errMsg}`);
        }
        resolve(null);
        return;
      }

      if (!result || result.length < 100) {
        console.error('    Download returned empty data');
        resolve(null);
        return;
      }

      const buffer = Buffer.from(result, 'base64');
      // Detect content type from magic bytes
      let contentType = 'image/jpeg';
      if (buffer[0] === 0x89 && buffer[1] === 0x50) contentType = 'image/png';
      else if (buffer[0] === 0x52 && buffer[1] === 0x49) contentType = 'image/webp';
      
      resolve({ buffer: new Uint8Array(buffer), contentType });
    } catch (err) {
      const msg = (err as Error).message || String(err);
      if (msg.includes('TIMEDOUT') || msg.includes('timed out')) {
        console.error('    Download timeout');
      } else {
        console.error(`    Download error: ${msg.substring(0, 100)}`);
      }
      resolve(null);
    }
  });
}

// ---- Upload image to Supabase Storage, return public URL ----
async function uploadToSupabase(
  recipeId: string,
  buffer: Uint8Array,
  contentType: string
): Promise<string | null> {
  const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
  const path = `recipes/${recipeId}.${ext}`;

  // Upsert: overwrite if exists
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, {
      contentType,
      upsert: true,
    });

  if (uploadError) {
    console.error(`    Upload failed: ${uploadError.message}`);
    return null;
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(path);

  return urlData.publicUrl;
}

// ---- Unsplash search ----
interface UnsplashPhoto {
  urls: { raw: string; full: string; regular: string; small: string; thumb: string };
  user: { name: string };
}
interface UnsplashSearchResponse {
  total: number;
  results: UnsplashPhoto[];
}

async function searchUnsplash(query: string): Promise<string | null> {
  if (!unsplashKey) return null;

  const searchQuery = `${query} food dish`;
  const url = new URL('https://api.unsplash.com/search/photos');
  url.searchParams.set('query', searchQuery);
  url.searchParams.set('per_page', '3');
  url.searchParams.set('orientation', 'landscape');
  url.searchParams.set('content_filter', 'high');

  try {
    const res = await safeFetch(url.toString(), {
      headers: { Authorization: `Client-ID ${unsplashKey}` },
    });

    if (res.status === 403 || res.status === 429) {
      console.warn('  ⏳ Unsplash rate limit hit. Waiting 60 seconds...');
      await sleep(60_000);
      const retryRes = await safeFetch(url.toString(), {
        headers: { Authorization: `Client-ID ${unsplashKey}` },
      });
      if (!retryRes.ok) return null;
      const retryData = (await retryRes.json()) as UnsplashSearchResponse;
      return retryData.results[0]?.urls.regular ?? null;
    }

    if (!res.ok) return null;

    const data = (await res.json()) as UnsplashSearchResponse;
    if (data.results.length === 0) return null;

    return `${data.results[0].urls.regular}&w=800&q=80`;
  } catch {
    return null;
  }
}

// ---- Cuisine search hints ----
const CUISINE_HINTS: Record<string, string> = {
  PH: 'filipino cuisine', ID: 'indonesian cuisine', SG: 'singaporean cuisine',
  US: 'american cuisine', GB: 'british cuisine', CA: 'canadian cuisine',
  CN: 'chinese cuisine', HR: 'croatian cuisine', NL: 'dutch cuisine',
  EG: 'egyptian cuisine', FR: 'french cuisine', GR: 'greek cuisine',
  IN: 'indian cuisine', IE: 'irish cuisine', IT: 'italian cuisine',
  JM: 'jamaican cuisine', JP: 'japanese cuisine', KE: 'kenyan cuisine',
  MY: 'malaysian cuisine', MX: 'mexican cuisine', MA: 'moroccan cuisine',
  PL: 'polish cuisine', PT: 'portuguese cuisine', RU: 'russian cuisine',
  ES: 'spanish cuisine', TH: 'thai cuisine', TN: 'tunisian cuisine',
  TR: 'turkish cuisine', VN: 'vietnamese cuisine',
};

// ---- Main ----
async function main() {
  console.log('🖼️  ForkIt — Recipe Image Manager');
  console.log('===================================\n');

  const updateAll = process.argv[2] === '--all';

  // ---- Build query: target TheMealDB image URLs ----
  let query = supabase
    .from('recipes')
    .select('id, title, country_code, country_name, image_url')
    .order('created_at', { ascending: true });

  if (!updateAll) {
    // Only recipes still pointing to TheMealDB
    query = query.like('image_url', '%themealdb.com%');
  }

  const { data: recipes, error } = await query;

  if (error) {
    console.error('❌ Failed to fetch recipes:', error.message);
    process.exit(1);
  }

  if (!recipes || recipes.length === 0) {
    console.log('✅ All images are already in Supabase Storage! Nothing to migrate.');
    return;
  }

  // For --all mode, filter out already-migrated ones
  const toProcess = updateAll
    ? recipes
    : recipes.filter((r) => r.image_url && !isSupabaseStorageUrl(r.image_url));

  if (toProcess.length === 0) {
    console.log('✅ All images are already in Supabase Storage!');
    return;
  }

  console.log(`📋 ${toProcess.length} recipes to migrate (TheMealDB → Supabase)\n`);

  let uploaded = 0;
  let failed = 0;

  for (const recipe of toProcess) {
    process.stdout.write(`  🔄 ${recipe.title}...`);

    try {
      const sourceImageUrl = recipe.image_url;

      if (!sourceImageUrl) {
        console.log(' ⚠️  No image URL');
        failed++;
        continue;
      }

      // Skip if already in Supabase
      if (isSupabaseStorageUrl(sourceImageUrl)) {
        console.log(' ✅ Already in Supabase');
        continue;
      }

      // Download the image directly from TheMealDB
      let imageData: { buffer: Uint8Array; contentType: string } | null = null;
      try {
        imageData = await downloadImage(sourceImageUrl);
      } catch (dlErr) {
        console.log(` ❌ Download crashed: ${(dlErr as Error).message}`);
        failed++;
        await sleep(500);
        continue;
      }

      if (!imageData) {
        console.log(' ❌ Download failed');
        failed++;
        await sleep(500);
        continue;
      }

      // Upload to Supabase Storage
      const publicUrl = await uploadToSupabase(recipe.id, imageData.buffer, imageData.contentType);
      if (!publicUrl) {
        console.log(' ❌ Upload failed');
        failed++;
        await sleep(500);
        continue;
      }

      // Update recipe record with Supabase Storage URL
      const { error: updateError } = await supabase
        .from('recipes')
        .update({ image_url: publicUrl })
        .eq('id', recipe.id);

      if (updateError) {
        console.log(` ❌ DB update failed: ${updateError.message}`);
        failed++;
      } else {
        console.log(' ✅');
        uploaded++;
      }

      // Small delay to avoid hammering servers
      await sleep(500);
    } catch (loopErr) {
      console.log(` ❌ Unexpected error: ${(loopErr as Error).message}`);
      failed++;
      await sleep(500);
    }
  }

  console.log('\n===================================');
  console.log(`✅ Uploaded to Supabase Storage: ${uploaded}`);
  console.log(`⚠️  Failed/Skipped: ${failed}`);
  console.log(`📊 Total processed: ${toProcess.length}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});

import { ImageResponse } from '@vercel/og';
import { createClient } from '@supabase/supabase-js';
import { CUISINE_GRADIENTS } from '@/lib/rewards';

export const runtime = 'edge';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Use service role for OG images (edge route can't use cookie-based client)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: recipe } = await supabase
    .from('recipes')
    .select(
      'title, emoji, country_code, country_flag, country_name, total_votes, author:profiles!recipes_author_id_fkey(username, display_name)'
    )
    .eq('id', id)
    .single();

  // Resolve gradient
  const gradient =
    CUISINE_GRADIENTS[recipe?.country_code ?? ''] ?? CUISINE_GRADIENTS.DEFAULT;

  // Parse gradient for background
  const colors = gradient.match(/#[a-fA-F0-9]{6}/g) ?? ['#2c3e50', '#8e44ad', '#c0392b'];

  const authorUsername =
    recipe?.author && !Array.isArray(recipe.author)
      ? (recipe.author as { username: string }).username
      : 'ForkIt';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${colors[0]}, ${colors[1] ?? colors[0]}, ${colors[2] ?? colors[0]})`,
          color: '#f5f0e8',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Dark overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.5) 100%)',
            display: 'flex',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <span style={{ fontSize: 96 }}>{recipe?.emoji ?? '🍴'}</span>

          <span
            style={{
              fontSize: 48,
              fontWeight: 700,
              textAlign: 'center',
              maxWidth: '900px',
              lineHeight: 1.2,
            }}
          >
            {recipe?.title ?? 'Recipe'}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: 24 }}>
              {recipe?.country_flag} {recipe?.country_name}
            </span>
            <span style={{ fontSize: 24, color: '#f97316' }}>
              ❤️ {recipe?.total_votes ?? 0}
            </span>
          </div>

          <span style={{ fontSize: 20, color: '#f5f0e8', opacity: 0.8 }}>
            by @{authorUsername} on ForkIt
          </span>
        </div>

        {/* ForkIt logo bottom right */}
        <div
          style={{
            position: 'absolute',
            bottom: 32,
            right: 40,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: 24, fontWeight: 700, color: '#f5f0e8' }}>
            Fork
          </span>
          <span style={{ fontSize: 24, color: '#f97316' }}>🔥</span>
          <span style={{ fontSize: 24, fontWeight: 700, color: '#f5f0e8' }}>
            It
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

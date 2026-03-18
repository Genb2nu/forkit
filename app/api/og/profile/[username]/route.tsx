import { ImageResponse } from '@vercel/og';
import { createClient } from '@supabase/supabase-js';
import { TIER_CONFIG } from '@/lib/rewards';
import type { RewardTier } from '@/types';

export const runtime = 'edge';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  // Fetch profile data
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, display_name, username, reward_tier, total_votes, avatar_url')
    .eq('username', username)
    .single();

  const { count: recipeCount } = await supabase
    .from('recipes')
    .select('*', { count: 'exact', head: true })
    .eq('author_id', profile?.id ?? '')
    .eq('published', true);

  const displayName = profile?.display_name ?? username;
  const tier = (profile?.reward_tier ?? 'starter') as RewardTier;
  const tierConfig = TIER_CONFIG[tier];
  const initials = displayName
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

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
          background: 'linear-gradient(135deg, #0f0d0a 0%, #1a1710 50%, #2a2010 100%)',
          color: '#f5f0e8',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Fire accent glow */}
        <div
          style={{
            position: 'absolute',
            top: -80,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Avatar circle */}
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #f97316, #ef4444)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 48,
            fontWeight: 700,
            color: 'white',
            marginBottom: 24,
          }}
        >
          {initials}
        </div>

        {/* Display name */}
        <span
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: '#f5f0e8',
          }}
        >
          {displayName}
        </span>

        {/* Username */}
        <span
          style={{
            fontSize: 24,
            color: '#6b6454',
            marginTop: 8,
          }}
        >
          @{username}
        </span>

        {/* Tier badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 20,
            padding: '8px 20px',
            borderRadius: 9999,
            background: 'rgba(249,115,22,0.15)',
            border: '1px solid rgba(249,115,22,0.3)',
          }}
        >
          <span style={{ fontSize: 20 }}>{tierConfig.emoji}</span>
          <span style={{ fontSize: 18, color: tierConfig.color, fontWeight: 600 }}>
            {tierConfig.label}
          </span>
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            gap: 40,
            marginTop: 28,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: 28, fontWeight: 700, color: '#f97316' }}>
              {recipeCount ?? 0}
            </span>
            <span style={{ fontSize: 14, color: '#6b6454' }}>recipes</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: 28, fontWeight: 700, color: '#f97316' }}>
              {profile?.total_votes ?? 0}
            </span>
            <span style={{ fontSize: 14, color: '#6b6454' }}>votes</span>
          </div>
        </div>

        {/* ForkIt branding */}
        <div
          style={{
            position: 'absolute',
            bottom: 32,
            right: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ fontSize: 20, fontWeight: 700, color: '#f5f0e8' }}>Fork</span>
          <span style={{ fontSize: 20, color: '#f97316' }}>🔥</span>
          <span style={{ fontSize: 20, fontWeight: 700, color: '#f5f0e8' }}>It</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

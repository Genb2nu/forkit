'use client';

import Link from 'next/link';
import type { Profile } from '@/types';

interface RankedProfile extends Profile {
  rank: number;
}

interface PodiumProps {
  top3: RankedProfile[];
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

const PODIUM_CONFIG = [
  { idx: 1, medal: '🥈', height: 'h-24', avatarSize: 'w-14 h-14', textSize: 'text-sm', order: 'order-1' },
  { idx: 0, medal: '🥇', height: 'h-32', avatarSize: 'w-18 h-18', textSize: 'text-base', order: 'order-2' },
  { idx: 2, medal: '🥉', height: 'h-20', avatarSize: 'w-12 h-12', textSize: 'text-sm', order: 'order-3' },
];

export function Podium({ top3 }: PodiumProps) {
  if (top3.length < 3) return null;

  return (
    <div className="flex items-end justify-center gap-3 sm:gap-6 py-8 px-4">
      {PODIUM_CONFIG.map(({ idx, medal, height, avatarSize, textSize, order }) => {
        const profile = top3[idx];
        return (
          <Link
            key={profile.id}
            href={`/profile/${profile.username}`}
            className={`flex flex-col items-center ${order} group`}
          >
            {/* Medal */}
            <span className="text-2xl sm:text-3xl mb-2">{medal}</span>

            {/* Avatar */}
            <div
              className={`${avatarSize} rounded-full bg-fire/20 flex items-center justify-center text-fire font-bold text-xs sm:text-sm mb-2 ring-2 ring-fire/30 group-hover:ring-fire/60 transition-all`}
            >
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.display_name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                getInitials(profile.display_name)
              )}
            </div>

            {/* Name */}
            <p
              className={`text-cream ${textSize} font-semibold truncate max-w-22.5 sm:max-w-30 group-hover:text-fire transition-colors`}
            >
              @{profile.username}
            </p>

            {/* Votes */}
            <p className="text-fire text-xs font-mono mt-0.5">
              {profile.total_votes.toLocaleString()} votes
            </p>

            {/* Podium bar */}
            <div
              className={`${height} w-16 sm:w-20 bg-bg-surface border border-border rounded-t-xl mt-2 animate-podium-rise`}
              style={{ animationDelay: `${idx * 150}ms` }}
            />
          </Link>
        );
      })}
    </div>
  );
}

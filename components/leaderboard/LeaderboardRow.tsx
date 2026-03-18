'use client';

import Link from 'next/link';
import type { Profile } from '@/types';

interface LeaderboardRowProps {
  profile: Profile;
  rank: number;
  maxVotes: number;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function LeaderboardRow({ profile, rank, maxVotes }: LeaderboardRowProps) {
  const progress = maxVotes > 0 ? (profile.total_votes / maxVotes) * 100 : 0;

  return (
    <Link
      href={`/profile/${profile.username}`}
      className="flex items-center gap-3 py-3 px-3 border-b border-border hover:bg-bg-muted/50 transition-colors rounded-lg group"
    >
      <span className="text-muted-custom font-mono text-sm w-8 text-right shrink-0">
        #{rank}
      </span>

      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-fire/20 flex items-center justify-center text-fire text-xs font-bold shrink-0">
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

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-cream text-sm font-semibold truncate group-hover:text-fire transition-colors">
            @{profile.username}
          </p>
          {profile.country && (
            <span className="text-xs text-muted-custom">{profile.country}</span>
          )}
        </div>
        <div className="w-full bg-bg-muted rounded-full h-1.5 mt-1">
          <div
            className="bg-linear-to-r from-fire to-ember h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <span className="text-fire text-sm font-mono font-semibold shrink-0">
        {profile.total_votes.toLocaleString()}
      </span>
    </Link>
  );
}

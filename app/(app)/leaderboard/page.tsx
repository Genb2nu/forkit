'use client';

import { useState, useEffect } from 'react';
import type { Profile } from '@/types';
import { Podium } from '@/components/leaderboard/Podium';
import { LeaderboardRow } from '@/components/leaderboard/LeaderboardRow';

type Filter = 'alltime' | 'month' | 'country';

interface RankedProfile extends Profile {
  rank: number;
  month_votes?: number;
}

const FILTER_TABS: { key: Filter; label: string; emoji: string }[] = [
  { key: 'alltime', label: 'All Time', emoji: '🏆' },
  { key: 'month', label: 'This Month', emoji: '📅' },
  { key: 'country', label: 'By Country', emoji: '🌍' },
];

export default function LeaderboardPage() {
  const [filter, setFilter] = useState<Filter>('alltime');
  const [countryCode, setCountryCode] = useState('');
  const [rankings, setRankings] = useState<RankedProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      try {
        let url = `/api/leaderboard?filter=${filter}`;
        if (filter === 'country' && countryCode) {
          url += `&country=${countryCode}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        setRankings(data.rankings ?? []);
      } catch {
        setRankings([]);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, [filter, countryCode]);

  const top3 = rankings.slice(0, 3);
  const rest = rankings.slice(3);
  const maxVotes = rankings[0]?.total_votes ?? 0;

  return (
    <div className="min-h-screen bg-bg-base text-cream pb-24">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-2xl sm:text-3xl font-display font-bold">
          🏆 Hall of Flavor
        </h1>
        <p className="text-text-2 text-sm mt-1">
          Top creators ranked by community votes
        </p>
      </div>

      {/* Filter tabs */}
      <div className="px-4 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setFilter(tab.key);
                if (tab.key !== 'country') setCountryCode('');
              }}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === tab.key
                  ? 'bg-fire text-white'
                  : 'bg-bg-surface border border-border text-text-2 hover:text-cream'
              }`}
            >
              {tab.emoji} {tab.label}
            </button>
          ))}
        </div>

        {/* Country input for country filter */}
        {filter === 'country' && (
          <div className="mt-3">
            <input
              type="text"
              placeholder="Enter country code (e.g. US, GB, JP)..."
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
              maxLength={2}
              className="w-full px-4 py-2.5 rounded-xl bg-bg-surface border border-border text-cream text-sm placeholder:text-muted-custom focus:outline-none focus:border-fire/50 transition-colors"
            />
          </div>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="px-4 space-y-4">
          {/* Podium skeleton */}
          <div className="flex items-end justify-center gap-6 py-8">
            {[80, 112, 64].map((h, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 animate-pulse"
              >
                <div className="w-12 h-12 rounded-full bg-bg-surface" />
                <div className="h-3 w-16 bg-bg-surface rounded" />
                <div
                  className="w-16 bg-bg-surface rounded-t-xl"
                  style={{ height: h }}
                />
              </div>
            ))}
          </div>
          {/* Row skeletons */}
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 py-3 animate-pulse"
            >
              <div className="w-8 h-4 bg-bg-surface rounded" />
              <div className="w-8 h-8 rounded-full bg-bg-surface" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-bg-surface rounded w-1/3" />
                <div className="h-1.5 bg-bg-surface rounded" />
              </div>
              <div className="h-3 w-10 bg-bg-surface rounded" />
            </div>
          ))}
        </div>
      ) : rankings.length === 0 ? (
        <div className="text-center py-16 px-4">
          <p className="text-4xl mb-3">🍽️</p>
          <p className="text-text-2">
            {filter === 'country' && !countryCode
              ? 'Enter a country code to see rankings.'
              : 'No creators with votes yet. Be the first!'}
          </p>
        </div>
      ) : (
        <div className="px-4">
          {/* Podium for top 3 */}
          {top3.length >= 3 && <Podium top3={top3} />}

          {/* Remaining rankings */}
          {rest.length > 0 && (
            <div className="mt-4">
              {rest.map((profile) => (
                <LeaderboardRow
                  key={profile.id}
                  profile={profile}
                  rank={profile.rank}
                  maxVotes={maxVotes}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

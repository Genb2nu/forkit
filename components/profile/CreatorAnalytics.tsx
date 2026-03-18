'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { Recipe } from '@/types';

const BarChart = dynamic(
  () => import('recharts').then((mod) => mod.BarChart),
  { ssr: false }
);
const Bar = dynamic(
  () => import('recharts').then((mod) => mod.Bar),
  { ssr: false }
);
const XAxis = dynamic(
  () => import('recharts').then((mod) => mod.XAxis),
  { ssr: false }
);
const YAxis = dynamic(
  () => import('recharts').then((mod) => mod.YAxis),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import('recharts').then((mod) => mod.Tooltip),
  { ssr: false }
);
const ResponsiveContainer = dynamic(
  () => import('recharts').then((mod) => mod.ResponsiveContainer),
  { ssr: false }
);

interface CreatorAnalyticsProps {
  recipes: Recipe[];
}

interface ChartData {
  name: string;
  fullTitle: string;
  votes: number;
}

export function CreatorAnalytics({ recipes }: CreatorAnalyticsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (recipes.length === 0) return null;

  const chartData: ChartData[] = recipes
    .sort((a, b) => b.total_votes - a.total_votes)
    .slice(0, 10)
    .map((r) => ({
      name: r.title.length > 15 ? r.title.slice(0, 15) + '…' : r.title,
      fullTitle: r.title,
      votes: r.total_votes,
    }));

  const totalVotes = recipes.reduce((sum, r) => sum + r.total_votes, 0);
  const avgVotes = recipes.length > 0 ? Math.round(totalVotes / recipes.length) : 0;
  const topRecipe = recipes.reduce(
    (best, r) => (r.total_votes > best.total_votes ? r : best),
    recipes[0]
  );

  if (!mounted) {
    return (
      <div className="bg-bg-surface rounded-xl border border-border p-4 animate-pulse">
        <div className="h-4 bg-bg-muted rounded w-1/3 mb-4" />
        <div className="h-48 bg-bg-muted rounded" />
      </div>
    );
  }

  return (
    <div className="bg-bg-surface rounded-xl border border-border p-4">
      <h3 className="text-base font-display font-bold text-cream mb-4">
        📊 Recipe Analytics
      </h3>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="text-center">
          <p className="text-lg font-bold text-fire">{totalVotes}</p>
          <p className="text-muted-custom text-xs">Total Votes</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-cream">{avgVotes}</p>
          <p className="text-muted-custom text-xs">Avg per Recipe</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-cream">{recipes.length}</p>
          <p className="text-muted-custom text-xs">Recipes</p>
        </div>
      </div>

      {/* Top recipe */}
      {topRecipe && (
        <div className="bg-bg-muted rounded-lg p-3 mb-4 flex items-center gap-3">
          <span className="text-xl">{topRecipe.emoji}</span>
          <div className="min-w-0 flex-1">
            <p className="text-cream text-sm font-medium truncate">
              🏆 {topRecipe.title}
            </p>
            <p className="text-muted-custom text-xs">
              {topRecipe.total_votes} votes — your best performer
            </p>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="w-full h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <XAxis
              dataKey="name"
              tick={{ fill: 'rgba(245,240,232,0.45)', fontSize: 10 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.07)' }}
              tickLine={false}
              angle={-35}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tick={{ fill: 'rgba(245,240,232,0.45)', fontSize: 10 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.07)' }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1710',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '8px',
                color: '#f5f0e8',
                fontSize: 12,
              }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => [`${value} votes`, 'Votes']}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              labelFormatter={(label: any) => {
                const item = chartData.find((d) => d.name === String(label));
                return item?.fullTitle ?? String(label);
              }}
              cursor={{ fill: 'rgba(249,115,22,0.1)' }}
            />
            <Bar
              dataKey="votes"
              fill="#f97316"
              radius={[4, 4, 0, 0]}
              label={{
                position: 'top',
                fill: 'rgba(245,240,232,0.65)',
                fontSize: 10,
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

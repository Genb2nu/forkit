import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Leaderboard — Hall of Flavor',
  description:
    'Top recipe creators ranked by community votes. Filter by all-time, monthly, or by country.',
  openGraph: {
    title: 'Leaderboard — ForkIt',
    description: 'Top recipe creators ranked by community votes.',
  },
};

export default function LeaderboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

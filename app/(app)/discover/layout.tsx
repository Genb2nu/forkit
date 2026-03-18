import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Discover Recipes',
  description:
    'Swipe through recipes from 20+ countries. Vote for your favourites, save them to your cookbook. No account needed.',
  openGraph: {
    title: 'Discover Recipes — ForkIt',
    description:
      'Swipe through recipes from 20+ countries. Vote, save, cook.',
  },
};

export default function DiscoverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

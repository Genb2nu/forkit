import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'ForkIt — Cook. Swipe. Conquer.',
  description:
    'Discover recipes from 20+ countries. Swipe through dishes, vote for your favourites, and join a community of food creators. No ads, no life stories, just food.',
  openGraph: {
    title: 'ForkIt — Cook. Swipe. Conquer.',
    description:
      'Discover recipes from 20+ countries. Swipe, vote, cook. No ads, no life stories.',
    type: 'website',
  },
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Submit a Recipe',
  description:
    'Share your recipe with the ForkIt community. Add ingredients, steps, videos, and earn votes.',
  openGraph: {
    title: 'Submit a Recipe — ForkIt',
    description: 'Share your recipe with the ForkIt community.',
  },
};

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

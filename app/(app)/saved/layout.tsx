import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Saved Recipes',
  description: 'Your personal recipe collection on ForkIt.',
};

export default function SavedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

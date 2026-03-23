import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans, DM_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { Toaster } from '@/components/ui/sonner';
import { QueryProvider } from '@/components/providers/QueryProvider';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'ForkIt — Cook. Swipe. Conquer.',
    template: '%s — ForkIt',
  },
  description:
    'Discover recipes from 20+ countries. Swipe through dishes, vote for your favourites, and join a community of food creators. No ads, no life stories, just food.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  ),
  openGraph: {
    title: 'ForkIt — Cook. Swipe. Conquer.',
    description:
      'Discover recipes from 20+ countries. Swipe, vote, cook. No ads, no life stories.',
    type: 'website',
    locale: 'en_US',
    siteName: 'ForkIt',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ForkIt — Cook. Swipe. Conquer.',
    description:
      'Discover recipes from 20+ countries. Swipe, vote, cook. No ads, no life stories.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${playfair.variable} ${dmSans.variable} ${dmMono.variable} font-body antialiased bg-bg-base text-cream`}
      >
        <QueryProvider>
          {children}
        </QueryProvider>
        <Toaster richColors position="top-right" />
        <Analytics />
      </body>
    </html>
  );
}

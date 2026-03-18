import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About ForkIt',
  description:
    'ForkIt is a recipe discovery platform. Swipe through dishes from 20+ countries. No ads, no life stories, no account required.',
};

const VALUES = [
  {
    emoji: '🍴',
    title: 'Recipe First',
    desc: 'No life stories. No SEO walls. The recipe is the first thing you see, every time.',
  },
  {
    emoji: '🔓',
    title: 'Free to Browse',
    desc: 'You don\'t need an account to discover, swipe, or cook. ForkIt is open by default.',
  },
  {
    emoji: '🌍',
    title: '20+ Countries',
    desc: 'Authentic recipes from around the world — curated, indexed, and ready to cook from day one.',
  },
  {
    emoji: '🚫',
    title: 'Zero Ads',
    desc: 'No pop-ups. No banners. No sponsored placements (yet). Just food.',
  },
  {
    emoji: '🏆',
    title: 'Community Voted',
    desc: 'The best recipes rise to the top — decided by the people who actually cook them.',
  },
  {
    emoji: '💚',
    title: 'Creator Honest',
    desc: 'We can\'t pay creators today. We tell them that upfront. We build tools and audience instead.',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-bg-base text-cream pt-24">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-5 lg:px-8 py-20 text-center">
        <span className="text-sm text-fire font-mono uppercase tracking-wider">About</span>
        <h1 className="font-display font-black text-5xl lg:text-6xl mt-4 leading-tight">
          Recipes were boring.<br />
          <span className="text-gradient-fire">We fixed that.</span>
        </h1>
        <p className="text-text-2 text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
          ForkIt is a recipe discovery and creator platform built by one person who got tired of
          scrolling through ads and memoirs to find a pasta recipe. We put the food first.
        </p>
      </section>

      {/* Story */}
      <section className="max-w-4xl mx-auto px-5 lg:px-8 py-16">
        <div className="space-y-6 text-text-2 leading-relaxed text-lg">
          <p>
            Every recipe website on the internet follows the same playbook: a 2,000-word personal
            essay, 14 pop-up ads, and the actual recipe buried at the absolute bottom. The people
            searching for &ldquo;how to make pad thai&rdquo; don&apos;t want a vacation memoir.
            They want to cook.
          </p>
          <p>
            ForkIt flips that model. You open the app, you see recipes. Swipe through them like
            you&apos;re on Tinder. Tap one, and you get ingredients, steps, and a video — nothing
            else. No account needed to start.
          </p>
          <p>
            We launched with <span className="text-cream font-medium">300+ curated recipes</span> across{' '}
            <span className="text-cream font-medium">20+ countries</span> so the platform never feels
            empty. Every recipe is sourced, attributed, and includes step-by-step instructions. Many
            include embedded YouTube tutorials.
          </p>
          <p className="text-cream font-medium">
            The goal is simple: make finding good food as easy as swiping right.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-bg-surface py-24">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <h2 className="font-display font-black text-3xl lg:text-4xl text-center mb-14">
            What we believe
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="glass rounded-2xl p-6 hover-fire-border"
              >
                <div className="text-3xl mb-3">{v.emoji}</div>
                <h3 className="font-display font-bold text-lg text-cream">{v.title}</h3>
                <p className="text-text-2 text-sm mt-2 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center">
        <div className="max-w-2xl mx-auto px-5">
          <h2 className="font-display font-black text-3xl lg:text-4xl">
            Ready to <span className="text-gradient-fire">start swiping?</span>
          </h2>
          <p className="text-text-2 mt-4">
            No sign-up required. 300+ recipes waiting.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-bold rounded-full bg-linear-to-r from-fire to-ember text-white hover:opacity-90 transition-opacity shadow-lg shadow-fire/20"
            >
              🔥 Start Browsing Free
            </Link>
            <Link
              href="/creators"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-semibold rounded-full border border-border text-cream hover:bg-bg-muted transition-colors"
            >
              Creator Rewards →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

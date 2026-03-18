import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Creator Rewards',
  description:
    'Earn recognition, build an audience, and grow as a food creator on ForkIt. Four tiers, honest roadmap, zero false promises.',
};

const TIERS = [
  {
    emoji: '🌱',
    name: 'Starter',
    votes: '0–499',
    description: 'Every creator starts here. Submit your first recipe and begin collecting votes from the community.',
    perks: [
      'Profile badge visible on all your recipes',
      'Google-indexed recipe pages (free SEO)',
      'Social links displayed on your profile',
      'Free portfolio page at forkit.app/profile/you',
      'Shareable recipe cards with OG images',
    ],
    featured: false,
  },
  {
    emoji: '🔥',
    name: 'Hot Chef',
    votes: '500–4,999',
    description: 'Your recipes are getting noticed. You\'re part of the active creator community now.',
    perks: [
      'All Starter perks',
      'Homepage feature rotation',
      'Swipe deck priority — your recipes shown more',
      'Recipe analytics dashboard',
      'Monthly creator digest email',
    ],
    featured: false,
  },
  {
    emoji: '⭐',
    name: 'Star Creator',
    votes: '5,000–24,999',
    description: 'You\'re a recognised voice in the ForkIt community. People follow you for your food.',
    perks: [
      'All Hot Chef perks',
      'ForkIt social media shoutout',
      'Verified badge on your profile',
      'Homepage spotlight section',
      'Priority support and feedback channel',
    ],
    featured: true,
  },
  {
    emoji: '🏆',
    name: 'Legend',
    votes: '25,000+',
    description: 'You\'ve built a real following. ForkIt actively works to connect you with opportunities.',
    perks: [
      'All Star Creator perks',
      'Warm brand intro referrals',
      'Press and media opportunities',
      'Dedicated creator page (/creators/you)',
      'Early access to new features',
    ],
    featured: false,
  },
];

const ROADMAP = [
  {
    stage: 1,
    title: 'Recognition Economy',
    timing: 'Now',
    icon: '🏅',
    desc: 'Tier badges, Google-indexed recipe pages, social media shoutouts, and warm brand introductions for top creators.',
    status: 'Active',
  },
  {
    stage: 2,
    title: 'Creator Tipping',
    timing: 'Year 1 (~1k MAU)',
    icon: '💰',
    desc: 'Stripe-powered tipping on creator profiles. Creators keep 100% of tips. Platform takes nothing.',
    status: 'Planned',
  },
  {
    stage: 3,
    title: 'Sponsored Placements',
    timing: 'Year 1–2',
    icon: '📢',
    desc: 'Brands pay ForkIt for featured recipe slots. 30% of placement revenue goes directly to the recipe creator.',
    status: 'Planned',
  },
  {
    stage: 4,
    title: 'Creator Fund',
    timing: 'Year 2+',
    icon: '🏦',
    desc: 'Platform revenue pooled into a monthly fund, distributed to creators based on a vote-weighted formula.',
    status: 'Planned',
  },
];

const FAQ = [
  {
    q: 'Do I get paid for submitting recipes?',
    a: 'Not today. ForkIt is a zero-budget platform built by one person. We can\'t pay creators yet. What we can do is give you free SEO, social reach, and brand introductions. The monetization roadmap above shows when paid rewards become feasible.',
  },
  {
    q: 'How are votes counted?',
    a: 'One vote per user per recipe. You can\'t vote on your own recipes. Votes are togglable (tap again to remove). The leaderboard updates hourly.',
  },
  {
    q: 'Can I edit my recipes after publishing?',
    a: 'Yes — you can always edit your own community recipes. Curated recipes (imported by the ForkIt team) are not editable.',
  },
  {
    q: 'How do I get to the next tier?',
    a: 'Keep submitting great recipes and sharing them. Every community vote across all your recipes counts toward your total. Tier upgrades happen automatically.',
  },
];

export default function CreatorsPage() {
  return (
    <div className="bg-bg-base text-cream pt-24">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-5 lg:px-8 py-20 text-center">
        <span className="text-sm text-fire font-mono uppercase tracking-wider">Creator Rewards</span>
        <h1 className="font-display font-black text-5xl lg:text-6xl mt-4 leading-tight">
          Your recipes deserve<br />
          <span className="text-gradient-fire">an audience.</span>
        </h1>
        <p className="text-text-2 text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
          ForkIt gives food creators a beautiful, Google-indexed portfolio, community recognition,
          and a clear path to monetization. Here&apos;s how it works.
        </p>
      </section>

      {/* Honesty box */}
      <section className="max-w-3xl mx-auto px-5 lg:px-8 pb-16">
        <div className="rounded-2xl p-6 bg-forest/5 border border-forest/20">
          <h3 className="text-forest font-semibold mb-2">💚 A note on honesty</h3>
          <p className="text-text-2 text-sm leading-relaxed">
            ForkIt is built by one person on a zero budget. We can&apos;t pay creators today.
            We won&apos;t pretend otherwise. What we <em>can</em> do right now is give you free
            Google-indexed recipe pages, social media shoutouts, and warm introductions to food
            brands. The monetization roadmap below shows exactly when and how paid creator rewards
            become feasible. No vague promises — just a plan.
          </p>
        </div>
      </section>

      {/* Tier cards */}
      <section className="bg-bg-surface py-24">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <h2 className="font-display font-black text-3xl lg:text-4xl text-center mb-4">
            Four Tiers
          </h2>
          <p className="text-text-2 text-center max-w-lg mx-auto mb-14">
            Every creator starts at Starter. Earn votes from the community to unlock new perks.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl p-6 border ${
                  tier.featured
                    ? 'bg-fire/5 border-fire/30 ring-1 ring-fire/20 relative'
                    : 'glass'
                }`}
              >
                {tier.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-fire text-white text-xs font-semibold">
                    Most Popular
                  </span>
                )}
                <div className="text-4xl mb-3">{tier.emoji}</div>
                <h3 className="font-display font-bold text-xl text-cream">{tier.name}</h3>
                <p className="text-fire text-sm font-semibold mt-1">{tier.votes} votes</p>
                <p className="text-text-2 text-xs mt-3 leading-relaxed">{tier.description}</p>
                <ul className="mt-5 space-y-2">
                  {tier.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2 text-sm text-text-2">
                      <span className="text-forest mt-0.5 shrink-0">✓</span>
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Monetization roadmap */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <h2 className="font-display font-black text-3xl lg:text-4xl text-center mb-4">
            Monetization Roadmap
          </h2>
          <p className="text-text-2 text-center max-w-lg mx-auto mb-14">
            This is the honest timeline for when creators can earn money on ForkIt.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ROADMAP.map((r) => (
              <div key={r.stage} className="glass rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-10 h-10 rounded-full bg-fire/20 text-fire text-lg flex items-center justify-center">
                    {r.icon}
                  </span>
                  <div>
                    <span className="text-xs text-fire font-mono block">{r.timing}</span>
                    <span className={`text-xs font-mono ${r.status === 'Active' ? 'text-forest' : 'text-muted-custom'}`}>
                      {r.status}
                    </span>
                  </div>
                </div>
                <h3 className="font-display font-bold text-lg text-cream">{r.title}</h3>
                <p className="text-text-2 text-sm mt-2 leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-bg-surface py-24">
        <div className="max-w-3xl mx-auto px-5 lg:px-8">
          <h2 className="font-display font-black text-3xl lg:text-4xl text-center mb-14">
            Creator FAQ
          </h2>
          <div className="space-y-6">
            {FAQ.map((item) => (
              <div key={item.q} className="glass rounded-2xl p-6">
                <h3 className="font-semibold text-cream">{item.q}</h3>
                <p className="text-text-2 text-sm mt-2 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center">
        <div className="max-w-2xl mx-auto px-5">
          <h2 className="font-display font-black text-3xl lg:text-4xl">
            Ready to share <span className="text-gradient-fire">your food?</span>
          </h2>
          <p className="text-text-2 mt-4">
            Creating a recipe takes 2 minutes. Your first vote could come in 2 more.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-bold rounded-full bg-linear-to-r from-fire to-ember text-white hover:opacity-90 transition-opacity shadow-lg shadow-fire/20"
            >
              🔥 Submit a Recipe
            </Link>
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-semibold rounded-full border border-border text-cream hover:bg-bg-muted transition-colors"
            >
              Browse Recipes →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

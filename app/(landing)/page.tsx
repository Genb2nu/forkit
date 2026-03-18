'use client';

import { useEffect } from 'react';
import Link from 'next/link';

/* ================================================================
   DATA
   ================================================================ */

const TICKER_RECIPES = [
  '🍣 Sushi Rolls',
  '🌮 Street Tacos',
  '🍝 Carbonara',
  '🥟 Dumplings',
  '🍛 Butter Chicken',
  '🥘 Paella',
  '🍜 Pho',
  '🧆 Falafel',
  '🥐 Croissants',
  '🍔 Smash Burger',
  '🌶️ Pad Thai',
  '🫕 Tagine',
  '🍖 Jerk Chicken',
  '🥞 Pancakes',
];

const CURATED_COUNTRIES = [
  { flag: '🇯🇵', name: 'Japan', code: 'JP', count: '15+', dish: 'Teriyaki Chicken' },
  { flag: '🇨🇳', name: 'China', code: 'CN', count: '12+', dish: 'Kung Pao Chicken' },
  { flag: '🇮🇳', name: 'India', code: 'IN', count: '14+', dish: 'Butter Chicken' },
  { flag: '🇲🇽', name: 'Mexico', code: 'MX', count: '10+', dish: 'Tacos al Pastor' },
  { flag: '🇮🇹', name: 'Italy', code: 'IT', count: '12+', dish: 'Carbonara' },
  { flag: '🇲🇦', name: 'Morocco', code: 'MA', count: '8+', dish: 'Chicken Tagine' },
  { flag: '🇹🇭', name: 'Thailand', code: 'TH', count: '10+', dish: 'Pad Thai' },
  { flag: '🇫🇷', name: 'France', code: 'FR', count: '10+', dish: 'Coq au Vin' },
];

const HOW_IT_WORKS = [
  { step: '01', emoji: '👆', title: 'Discover', desc: 'Swipe through recipes from 20+ countries. Right to save, left to skip. No account needed.' },
  { step: '02', emoji: '🌍', title: 'Explore', desc: 'Browse by country, search by ingredient, or check the leaderboard for trending dishes.' },
  { step: '03', emoji: '🍳', title: 'Cook', desc: 'Follow step-by-step instructions with checkable ingredients and progress tracking.' },
  { step: '04', emoji: '🔥', title: 'Share', desc: 'Share your own recipes, earn votes, climb the leaderboard, and build your reputation.' },
];

const FEATURES = [
  { title: 'Tinder-Style Swiping', desc: 'Swipe right to save, left to skip. Discover recipes the fun way — no scrolling through walls of text.', tag: 'Discovery', tagColor: 'bg-fire/20 text-fire', icon: '👆', wide: true },
  { title: 'Country Explorer', desc: 'Browse 20+ cuisines on a beautiful country grid. Tap to expand, explore top dishes.', tag: 'Browse', tagColor: 'bg-forest/20 text-forest', icon: '🌍', wide: false },
  { title: 'Live Leaderboard', desc: 'Community-voted rankings updated hourly. Filter by country, time, or rising stars.', tag: 'Compete', tagColor: 'bg-ember/20 text-ember', icon: '🏆', wide: false },
  { title: 'Embedded Videos', desc: 'YouTube tutorials baked right into recipe pages. Watch while you cook.', tag: 'Learn', tagColor: 'bg-fire/20 text-fire', icon: '🎬', wide: false },
  { title: 'Cooking Mode', desc: 'Check off ingredients and complete steps as you go. Celebration screen when you finish.', tag: 'Cook', tagColor: 'bg-forest/20 text-forest', icon: '✅', wide: false },
  { title: 'Creator Tools', desc: 'Submit recipes with rich media, track votes, watch your tier climb.', tag: 'Create', tagColor: 'bg-ember/20 text-ember', icon: '✏️', wide: true },
];

const TIERS = [
  { emoji: '🌱', name: 'Starter', votes: '0–499', perks: ['Profile badge', 'Google-indexed recipe pages', 'Social links displayed', 'Free portfolio page'], featured: false },
  { emoji: '🔥', name: 'Hot Chef', votes: '500–4,999', perks: ['Homepage feature rotation', 'Swipe deck priority', 'Recipe analytics dashboard', 'All Starter perks'], featured: false },
  { emoji: '⭐', name: 'Star Creator', votes: '5,000–24,999', perks: ['ForkIt social shoutout', 'Verified badge', 'Homepage spotlight', 'All Hot Chef perks'], featured: true },
  { emoji: '🏆', name: 'Legend', votes: '25,000+', perks: ['Brand intro referrals', 'Press opportunities', 'Dedicated creator page', 'All Star Creator perks'], featured: false },
];

const ROADMAP = [
  { stage: 1, title: 'Recognition Economy', desc: 'Tier badges, SEO portfolio, social shoutouts, brand intros.', timing: 'Now' },
  { stage: 2, title: 'Creator Tipping', desc: 'Stripe tipping on profiles. Creators keep 100%.', timing: 'Year 1' },
  { stage: 3, title: 'Sponsored Placements', desc: 'Brands pay for featured slots. 30% goes to recipe creator.', timing: 'Year 1–2' },
  { stage: 4, title: 'Creator Fund', desc: 'Revenue pooled monthly, distributed by vote-weighted formula.', timing: 'Year 2+' },
];

const COUNTRY_STRIP = [
  { flag: '🇺🇸', name: 'American', count: 12, dish: 'Smash Burger' },
  { flag: '🇬🇧', name: 'British', count: 8, dish: 'Shepherd\'s Pie' },
  { flag: '🇨🇳', name: 'Chinese', count: 12, dish: 'Kung Pao Chicken' },
  { flag: '🇫🇷', name: 'French', count: 10, dish: 'Coq au Vin' },
  { flag: '🇬🇷', name: 'Greek', count: 6, dish: 'Moussaka' },
  { flag: '🇮🇳', name: 'Indian', count: 14, dish: 'Butter Chicken' },
  { flag: '🇮🇹', name: 'Italian', count: 12, dish: 'Carbonara' },
  { flag: '🇯🇵', name: 'Japanese', count: 15, dish: 'Teriyaki Chicken' },
  { flag: '🇯🇲', name: 'Jamaican', count: 6, dish: 'Jerk Chicken' },
  { flag: '🇲🇦', name: 'Moroccan', count: 8, dish: 'Chicken Tagine' },
  { flag: '🇲🇽', name: 'Mexican', count: 10, dish: 'Tacos al Pastor' },
  { flag: '🇲🇾', name: 'Malaysian', count: 8, dish: 'Nasi Lemak' },
  { flag: '🇹🇭', name: 'Thai', count: 10, dish: 'Pad Thai' },
  { flag: '🇹🇷', name: 'Turkish', count: 6, dish: 'Adana Kebab' },
  { flag: '🇻🇳', name: 'Vietnamese', count: 5, dish: 'Pho' },
  { flag: '🇪🇸', name: 'Spanish', count: 8, dish: 'Paella' },
];

const TESTIMONIALS = [
  {
    quote: 'I\'ve tried every recipe app out there. ForkIt is the first one that actually makes discovering food fun. The swipe mechanic is addictive.',
    name: 'Maria Santos',
    handle: '@mariascooks',
    tier: '🔥 Hot Chef',
    stars: 5,
  },
  {
    quote: 'I didn\'t even need an account to start swiping. Found three recipes I wanted to cook in the first five minutes. Signed up to save them.',
    name: 'Jake Thompson',
    handle: '@jakeeats',
    tier: '🌱 Starter',
    stars: 5,
  },
  {
    quote: 'Finally a platform that lets my recipes speak for themselves. No algorithms hiding my content behind a paywall. Just good food, real votes.',
    name: 'Aisha Kone',
    handle: '@aisha.kitchen',
    tier: '⭐ Star Creator',
    stars: 5,
  },
];

const HERO_CARDS = [
  { title: 'Mapo Tofu', emoji: '🥟', country: '🇨🇳 Chinese', gradient: 'from-red-600 to-orange-500', z: 30, rotate: '-1deg', translate: '0px' },
  { title: 'Pad Thai', emoji: '🌶️', country: '🇹🇭 Thai', gradient: 'from-purple-600 to-red-500', z: 20, rotate: '3deg', translate: '20px' },
  { title: 'Tiramisu', emoji: '🍝', country: '🇮🇹 Italian', gradient: 'from-green-600 to-emerald-500', z: 10, rotate: '-4deg', translate: '40px' },
];

/* ================================================================
   SCROLL-REVEAL HOOK
   ================================================================ */

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ================================================================
   PAGE
   ================================================================ */

export default function HomePage() {
  useScrollReveal();

  return (
    <div className="bg-bg-base text-cream overflow-hidden">
      {/* ──────────── 1. HERO ──────────── */}
      <section className="relative min-h-screen flex items-center pt-16">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-150 h-150 rounded-full bg-fire/5 blur-[120px]" />
          <div className="absolute bottom-0 -left-40 w-125 h-125 rounded-full bg-ember/5 blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-5 lg:px-8 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left */}
          <div className="space-y-8">
            {/* Kicker pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-fire/10 border border-fire/20 text-sm text-fire">
              <span className="w-2 h-2 rounded-full bg-fire animate-pulse-dot" />
              🍴 300+ Curated Recipes Ready Now
            </div>

            {/* Headline */}
            <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight">
              Swipe<br />
              <span className="text-gradient-fire">your next</span><br />
              obsession.
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-text-2 max-w-lg leading-relaxed">
              ForkIt is a recipe discovery platform built for people who love food, not ads.
              Swipe through dishes from 20+ countries, cook with step-by-step guides, and
              share your own creations.{' '}
              <span className="text-cream font-medium">No ads. No life stories. No account required.</span>
            </p>

            {/* Guest badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-forest/10 border border-forest/20 text-sm text-forest">
              ✅ No account needed — browse everything for free
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/discover"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-bold rounded-full bg-linear-to-r from-fire to-ember text-white hover:opacity-90 transition-opacity shadow-lg shadow-fire/20"
              >
                🔥 Start Browsing Free
              </Link>
              <Link
                href="/create"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-semibold rounded-full border border-border text-cream hover:bg-bg-muted transition-colors"
              >
                Share Your Recipe ✨
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-6 pt-4">
              {[
                { value: '300+', label: 'Recipes Ready' },
                { value: '20+', label: 'Countries' },
                { value: '0', label: 'Ads. Ever.' },
                { value: '$0', label: 'To Browse' },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl font-display font-bold text-cream">{s.value}</div>
                  <div className="text-xs text-muted-custom mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Floating phone card stack */}
          <div className="relative hidden lg:flex items-center justify-center h-130">
            {HERO_CARDS.map((card, i) => (
              <div
                key={card.title}
                className={`absolute w-72 rounded-3xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10 ${
                  i === 0 ? 'animate-float-fast' : i === 1 ? 'animate-float-mid' : 'animate-float-slow'
                }`}
                style={{
                  zIndex: card.z,
                  transform: `rotate(${card.rotate}) translateY(${card.translate})`,
                  right: `${i * 30}px`,
                  top: `${i * 25}px`,
                }}
              >
                <div className={`bg-linear-to-br ${card.gradient} p-6 h-80 flex flex-col justify-between`}>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-black/30 text-white text-xs backdrop-blur-sm">
                      {card.country}
                    </span>
                    <span className="text-3xl">{card.emoji}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-display font-bold text-xl">{card.title}</h3>
                    <p className="text-white/70 text-sm mt-1">15 min · Medium · 4 servings</p>
                    {i === 0 && (
                      <div className="flex gap-3 mt-4">
                        <span className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl">✕</span>
                        <span className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl">📖</span>
                        <span className="w-12 h-12 rounded-full bg-fire/80 backdrop-blur-sm flex items-center justify-center text-xl">♥</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {/* Floating labels */}
            <div className="absolute -left-4 top-12 px-3 py-1.5 rounded-full bg-bg-surface/90 border border-border text-xs text-text-2 backdrop-blur-sm animate-float-slow">
              ← Swipe to skip
            </div>
            <div className="absolute -right-2 bottom-32 px-3 py-1.5 rounded-full bg-fire/20 border border-fire/30 text-xs text-fire backdrop-blur-sm animate-float-mid">
              ❤️ 4,821 votes this week
            </div>
            <div className="absolute left-4 bottom-12 px-3 py-1.5 rounded-full bg-bg-surface/90 border border-border text-xs text-cream backdrop-blur-sm animate-float-fast">
              🍴 ForkIt Curated
            </div>
          </div>
        </div>
      </section>

      {/* ──────────── 2. TICKER ──────────── */}
      <section className="border-y border-border py-4 overflow-hidden bg-bg-surface/50">
        <div className="animate-ticker flex whitespace-nowrap">
          {[...TICKER_RECIPES, ...TICKER_RECIPES].map((r, i) => (
            <span key={i} className="mx-6 text-sm text-text-2 font-medium">
              {r}
              <span className="text-fire mx-6">·</span>
            </span>
          ))}
        </div>
      </section>

      {/* ──────────── 3. ABOUT ──────────── */}
      <section id="about" className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div className="space-y-6 reveal">
            <span className="text-sm text-fire font-mono uppercase tracking-wider">Why ForkIt?</span>
            <h2 className="font-display font-black text-4xl lg:text-5xl leading-tight">
              Recipes were boring.<br />
              <span className="text-gradient-fire">We fixed that.</span>
            </h2>
            <div className="space-y-4 text-text-2 leading-relaxed">
              <p>
                Every recipe website on the internet is the same: a wall of SEO text, someone&apos;s
                childhood memoir, 14 pop-up ads, and the actual recipe buried at the bottom. We
                built ForkIt because food deserves better.
              </p>
              <p>
                ForkIt puts the recipe first. Swipe to discover. Tap to cook. No scrolling through
                someone&apos;s vacation to Italy to find a pasta recipe.
              </p>
              <p>
                We seeded the platform with <span className="text-cream font-medium">300+ curated recipes</span> across{' '}
                <span className="text-cream font-medium">20+ countries</span> so there&apos;s always something
                great to find — even on day one.
              </p>
              <p className="text-cream font-medium">
                You don&apos;t need an account to start. Browse everything for free.
              </p>
            </div>
            {/* Pill tag cloud */}
            <div className="flex flex-wrap gap-2 pt-4">
              {['Free to browse', 'No sign-up required', 'Swipe to discover', '20+ countries', 'Step-by-step cooking', 'Video tutorials', 'Community voted'].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs bg-bg-muted border border-border text-text-2"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Orbiting emoji ring */}
          <div className="relative flex items-center justify-center h-80 lg:h-96 reveal">
            <span className="text-6xl z-10">🍴</span>
            {['🍣', '🌮', '🥟', '🍛', '🍝', '🥘'].map((emoji, i) => (
              <span
                key={i}
                className="absolute text-3xl animate-orbit"
                style={{ animationDelay: `${i * -3.33}s` }}
              >
                {emoji}
              </span>
            ))}
            {/* Glow ring */}
            <div className="absolute w-48 h-48 rounded-full border border-fire/10" />
            <div className="absolute w-48 h-48 rounded-full bg-fire/5 blur-3xl" />
          </div>
        </div>
      </section>

      {/* ──────────── 4. CURATED LIBRARY ──────────── */}
      <section id="curated" className="py-24 lg:py-32 bg-bg-surface relative">
        {/* Top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-fire/40 to-transparent" />
        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-fire/40 to-transparent" />

        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 reveal">
            <span className="text-sm text-fire font-mono uppercase tracking-wider">Ready on Day One</span>
            <h2 className="font-display font-black text-4xl lg:text-5xl mt-4 leading-tight">
              300+ recipes.<br />
              <span className="text-gradient-fire">20+ countries.</span> Zero wait.
            </h2>
            <p className="text-text-2 mt-5 leading-relaxed">
              Most new platforms launch empty. Not ForkIt. We curated a library of authentic
              recipes from cuisines around the world, so you always find something worth cooking — starting now.
            </p>
          </div>

          {/* Country grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 reveal">
            {CURATED_COUNTRIES.map((c) => (
              <Link
                href="/explore"
                key={c.code}
                className="glass rounded-2xl p-5 hover-fire-border group cursor-pointer"
              >
                <div className="text-3xl mb-3">{c.flag}</div>
                <h3 className="font-display font-bold text-lg text-cream">{c.name}</h3>
                <p className="text-fire text-sm font-semibold mt-1">{c.count} recipes</p>
                <p className="text-text-2 text-xs mt-2 group-hover:text-cream transition-colors">
                  Top: {c.dish}
                </p>
              </Link>
            ))}
          </div>

          {/* Note box */}
          <div className="mt-12 glass rounded-2xl p-6 border-fire/10 max-w-3xl mx-auto text-center reveal">
            <p className="text-sm text-text-2 leading-relaxed">
              <span className="text-fire font-semibold">🍴 Curated by ForkIt</span> — These recipes
              are hand-picked by the ForkIt team. Each includes ingredients, steps, and many include an
              embedded YouTube tutorial. More added every week.
            </p>
          </div>
        </div>
      </section>

      {/* ──────────── 5. HOW IT WORKS ──────────── */}
      <section id="how-it-works" className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 reveal">
            <span className="text-sm text-fire font-mono uppercase tracking-wider">How It Works</span>
            <h2 className="font-display font-black text-4xl lg:text-5xl mt-4">
              Four steps. <span className="text-gradient-fire">Zero friction.</span>
            </h2>
            <p className="text-text-2 mt-4">
              No account needed for any of them. Just show up and start cooking.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((item, i) => (
              <div
                key={item.step}
                className="glass rounded-2xl p-6 hover-fire-border reveal"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <span className="font-mono text-sm text-fire/60">{item.step}</span>
                <div className="text-4xl my-4">{item.emoji}</div>
                <h3 className="font-display font-bold text-xl text-cream">{item.title}</h3>
                <p className="text-text-2 text-sm mt-2 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────── 6. FEATURES BENTO ──────────── */}
      <section id="features" className="py-24 lg:py-32 bg-bg-surface">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 reveal">
            <span className="text-sm text-fire font-mono uppercase tracking-wider">Features</span>
            <h2 className="font-display font-black text-4xl lg:text-5xl mt-4">
              Built for people who <span className="text-gradient-fire">love food.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`glass rounded-2xl p-6 hover-fire-border reveal ${
                  f.wide ? 'md:col-span-2 lg:col-span-1 first:lg:col-span-2 last:lg:col-span-2' : ''
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{f.icon}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${f.tagColor}`}>
                    {f.tag}
                  </span>
                </div>
                <h3 className="font-display font-bold text-lg text-cream">{f.title}</h3>
                <p className="text-text-2 text-sm mt-2 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────── 7. CREATOR REWARDS ──────────── */}
      <section id="creator-rewards" className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 reveal">
            <span className="text-sm text-fire font-mono uppercase tracking-wider">Creator Rewards</span>
            <h2 className="font-display font-black text-4xl lg:text-5xl mt-4">
              Cook. Get recognised. <span className="text-gradient-fire">Grow.</span>
            </h2>
          </div>

          {/* Honest note box */}
          <div className="max-w-3xl mx-auto mb-14 reveal">
            <div className="rounded-2xl p-6 bg-forest/5 border border-forest/20">
              <p className="text-sm text-text-2 leading-relaxed">
                <span className="text-forest font-semibold">💚 A note on honesty</span> — ForkIt is built
                by one person on a zero budget. We can&apos;t pay creators yet. What we <em>can</em> do is
                build you a genuine audience, index your recipes on Google, shout you out on social media,
                and make warm introductions to brands when the time comes. The roadmap below shows exactly
                when monetary rewards become feasible.
              </p>
            </div>
          </div>

          {/* Tier cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {TIERS.map((tier, i) => (
              <div
                key={tier.name}
                className={`rounded-2xl p-6 border reveal ${
                  tier.featured
                    ? 'bg-fire/5 border-fire/30 ring-1 ring-fire/20 relative'
                    : 'glass'
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {tier.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-fire text-white text-xs font-semibold">
                    Most Popular
                  </span>
                )}
                <div className="text-4xl mb-3">{tier.emoji}</div>
                <h3 className="font-display font-bold text-xl text-cream">{tier.name}</h3>
                <p className="text-fire text-sm font-semibold mt-1">{tier.votes} votes</p>
                <ul className="mt-4 space-y-2">
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

          {/* Monetization roadmap */}
          <div className="reveal">
            <h3 className="font-display font-bold text-2xl text-center text-cream mb-8">
              Monetization Roadmap
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {ROADMAP.map((r, i) => (
                <div
                  key={r.stage}
                  className="glass rounded-2xl p-5 reveal"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-7 h-7 rounded-full bg-fire/20 text-fire text-xs font-bold flex items-center justify-center">
                      {r.stage}
                    </span>
                    <span className="text-xs text-fire font-mono">{r.timing}</span>
                  </div>
                  <h4 className="font-display font-bold text-cream">{r.title}</h4>
                  <p className="text-text-2 text-sm mt-1 leading-relaxed">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ──────────── 8. COUNTRIES STRIP ──────────── */}
      <section className="py-24 lg:py-32 bg-bg-surface">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 mb-10 reveal">
          <span className="text-sm text-fire font-mono uppercase tracking-wider">Explore the World</span>
          <h2 className="font-display font-black text-4xl lg:text-5xl mt-4">
            20+ Cuisines from <span className="text-gradient-fire">Day One.</span>
          </h2>
          <p className="text-text-2 mt-4 max-w-lg">
            The whole world is on the menu. Every cuisine has authentic recipes ready to cook now.
          </p>
        </div>

        <div className="overflow-x-auto pb-4 scrollbar-hide reveal">
          <div className="flex gap-4 px-5 lg:px-8 w-max">
            {COUNTRY_STRIP.map((c) => (
              <Link
                href="/explore"
                key={c.name}
                className="glass rounded-2xl p-5 w-44 shrink-0 hover-fire-border group"
              >
                <div className="text-3xl mb-2">{c.flag}</div>
                <h3 className="font-semibold text-cream text-sm">{c.name}</h3>
                <p className="text-fire text-xs mt-0.5">{c.count} recipes</p>
                <p className="text-text-2 text-xs mt-2 group-hover:text-cream transition-colors">
                  {c.dish}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────── 9. TESTIMONIALS ──────────── */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 reveal">
            <span className="text-sm text-fire font-mono uppercase tracking-wider">What People Say</span>
            <h2 className="font-display font-black text-4xl lg:text-5xl mt-4">
              Loved by <span className="text-gradient-fire">food people.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                className="glass rounded-2xl p-6 hover-fire-border reveal"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, si) => (
                    <span key={si} className="text-fire text-sm">★</span>
                  ))}
                </div>
                <p className="text-text-2 text-sm leading-relaxed mb-6 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-fire to-ember flex items-center justify-center text-white font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-cream">{t.name}</p>
                    <p className="text-xs text-muted-custom">{t.handle} · {t.tier}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────── 10. CTA BAND ──────────── */}
      <section className="py-24 lg:py-32 relative">
        {/* Top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-fire/40 to-transparent" />

        <div className="max-w-3xl mx-auto px-5 lg:px-8 text-center reveal">
          <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl leading-tight">
            Your next favourite meal<br />
            <span className="text-gradient-fire">is one swipe away.</span>
          </h2>
          <p className="text-text-2 text-lg mt-6 max-w-xl mx-auto">
            300+ recipes across 20+ countries. Free forever for explorers.
          </p>

          {/* Guest callout */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 mt-6 rounded-lg bg-forest/10 border border-forest/20 text-sm text-forest">
            ✅ Browse, swipe &amp; cook — completely free, no sign-up
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 px-8 py-4 text-lg font-bold rounded-full bg-linear-to-r from-fire to-ember text-white hover:opacity-90 transition-opacity shadow-lg shadow-fire/20"
            >
              🔥 Start Browsing Free
            </Link>
          </div>

          {/* App store badges (placeholder) */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <div className="px-5 py-2.5 rounded-xl bg-bg-muted border border-border text-sm text-text-2 flex items-center gap-2">
              <span>🍎</span> App Store
            </div>
            <div className="px-5 py-2.5 rounded-xl bg-bg-muted border border-border text-sm text-text-2 flex items-center gap-2 opacity-60">
              <span>▶️</span> Coming soon to Google Play
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

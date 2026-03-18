import Link from 'next/link';

const PRODUCT_LINKS = [
  { href: '/discover', label: 'Browse Recipes' },
  { href: '/explore', label: 'Explore Countries' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/create', label: 'Submit a Recipe' },
];

const COMPANY_LINKS = [
  { href: '/about', label: 'About ForkIt' },
  { href: '/creators', label: 'Creator Rewards' },
  { href: '/login', label: 'Log In' },
  { href: '/signup', label: 'Sign Up' },
];

const SOCIAL_LINKS = [
  { href: 'https://twitter.com/forkitapp', label: 'Twitter / X', icon: '𝕏' },
  { href: 'https://instagram.com/forkitapp', label: 'Instagram', icon: '📸' },
  { href: 'https://tiktok.com/@forkitapp', label: 'TikTok', icon: '🎵' },
  { href: 'https://github.com/forkitapp', label: 'GitHub', icon: '🐙' },
];

export function Footer() {
  return (
    <footer className="bg-bg-base border-t border-border">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block">
              <span className="font-display font-bold text-2xl text-cream">
                Fork<span className="text-fire">🔥</span>It
              </span>
            </Link>
            <p className="text-text-2 text-sm mt-3 max-w-xs">
              Discover recipes from 20+ countries. Swipe, vote, cook.
              No ads, no life stories — just food.
            </p>
            <div className="flex gap-3 mt-5">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full bg-bg-muted border border-border flex items-center justify-center text-sm hover:border-fire/40 hover:bg-fire/5 transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-cream mb-4 uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-2.5">
              {PRODUCT_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-text-2 hover:text-cream transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-cream mb-4 uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-text-2 hover:text-cream transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold text-cream mb-4 uppercase tracking-wider">
              Stay in the loop
            </h4>
            <p className="text-sm text-text-2 mb-4">
              New recipes, features, and creator spotlights — straight to your inbox.
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-3 py-2 text-sm rounded-lg bg-bg-muted border border-border text-cream placeholder:text-muted-custom focus:outline-none focus:ring-1 focus:ring-fire/50"
              />
              <button
                type="button"
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-fire text-white hover:bg-fire/90 transition-colors"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-custom text-xs">
            © {new Date().getFullYear()} ForkIt. Built with ♥ and zero ads.
          </p>
          <div className="flex gap-6 text-xs text-muted-custom">
            <span>Free to browse, always.</span>
            <span>·</span>
            <span>No account required.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

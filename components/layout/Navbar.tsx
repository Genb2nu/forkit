'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#curated', label: 'Recipes' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#features', label: 'Features' },
  { href: '/creators', label: 'Creators' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-bg-base/80 backdrop-blur-xl border-b border-border shadow-lg shadow-black/20'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-5 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 shrink-0">
          <span className="font-display font-bold text-xl text-cream tracking-tight">
            Fork<span className="text-fire">🔥</span>It
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-text-2 hover:text-cream transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-text-2 hover:text-cream transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/discover"
            className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-semibold rounded-full bg-linear-to-r from-fire to-ember text-white hover:opacity-90 transition-opacity"
          >
            🔥 Browse Free
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle navigation menu"
        >
          <span
            className={`block w-5 h-0.5 bg-cream transition-transform ${
              mobileOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-cream transition-opacity ${
              mobileOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-cream transition-transform ${
              mobileOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-bg-base/95 backdrop-blur-xl border-t border-border px-5 pb-6 pt-4 space-y-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-base text-text-2 hover:text-cream transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-border space-y-3">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="block text-base text-text-2 hover:text-cream"
            >
              Log in
            </Link>
            <Link
              href="/discover"
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold rounded-full bg-linear-to-r from-fire to-ember text-white"
            >
              🔥 Browse Free
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { useAuthPromptStore } from '@/stores/authPromptStore';

interface NavItem {
  href: string;
  label: string;
  icon: string;
  authOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/discover', label: 'Swipe', icon: '🔥' },
  { href: '/explore', label: 'Explore', icon: '🌍' },
  { href: '/leaderboard', label: 'Board', icon: '🏆' },
  { href: '/create', label: 'Create', icon: '✨', authOnly: true },
];

export function BottomNav() {
  const pathname = usePathname();
  const { isAuthenticated } = useUser();
  const openAuthPrompt = useAuthPromptStore((s) => s.openAuthPrompt);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-bg-base/90 backdrop-blur-md border-t border-border flex items-center justify-around md:hidden safe-area-pb">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname?.startsWith(item.href);

        // Create tab triggers auth prompt for guests
        if (item.authOnly && !isAuthenticated) {
          return (
            <button
              key={item.href}
              onClick={() => openAuthPrompt('submit')}
              className="flex flex-col items-center gap-0.5 text-muted-custom transition-colors"
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 transition-colors ${
              isActive
                ? 'text-fire'
                : 'text-muted-custom hover:text-cream'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className={`text-[10px] font-medium ${isActive ? 'text-fire' : ''}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

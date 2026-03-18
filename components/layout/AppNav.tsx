'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import type { Notification, NotificationType } from '@/types';

const NOTIFICATION_ICONS: Record<NotificationType, string> = {
  new_vote: '❤️',
  new_follower: '👤',
  tier_upgrade: '🏆',
  recipe_featured: '⭐',
};

function getNotificationMessage(n: Notification): string {
  switch (n.type) {
    case 'new_vote':
      return `${n.payload.voter_username ?? 'Someone'} voted on "${n.payload.recipe_title ?? 'your recipe'}"`;
    case 'new_follower':
      return `${n.payload.follower_username ?? 'Someone'} started following you`;
    case 'tier_upgrade':
      return `You've reached ${n.payload.new_tier ?? 'a new'} tier! 🎉`;
    case 'recipe_featured':
      return `Your recipe "${n.payload.recipe_title ?? ''}" was featured!`;
    default:
      return 'New notification';
  }
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 1000
  );
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function AppNav() {
  const { user, isAuthenticated } = useUser();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await fetch('/api/notifications?limit=10');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications ?? []);
        setUnreadCount(data.unreadCount ?? 0);
      }
    } catch {
      // silently fail
    }
  }, [isAuthenticated]);

  // Fetch on mount + poll every 60s
  useEffect(() => {
    if (!isAuthenticated) return;
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60_000);
    return () => clearInterval(interval);
  }, [isAuthenticated, fetchNotifications]);

  const handleMarkAllRead = async () => {
    try {
      await fetch('/api/notifications', { method: 'PATCH' });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {
      // silently fail
    }
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  const initials = user?.display_name
    ?.split(' ')
    .map((w: string) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() ?? '';

  return (
    <nav className="sticky top-0 z-50 h-14 bg-bg-base/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4">
      {/* Logo */}
      <Link href="/discover" className="font-display font-bold text-lg text-cream">
        Fork<span className="text-fire">It</span>
      </Link>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {isAuthenticated && user ? (
          <>
            {/* Notification bell dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger
                className="relative text-muted-custom hover:text-cream transition-colors focus:outline-none"
                aria-label="Notifications"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-ember rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-bg-surface border-border w-72 max-h-96 overflow-y-auto"
              >
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-cream text-sm font-semibold">
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-fire text-xs hover:text-fire/80 transition-colors"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <DropdownMenuSeparator className="bg-border" />
                {notifications.length === 0 ? (
                  <div className="px-3 py-6 text-center">
                    <p className="text-muted-custom text-sm">
                      No notifications yet
                    </p>
                  </div>
                ) : (
                  notifications.slice(0, 10).map((n) => (
                    <DropdownMenuItem
                      key={n.id}
                      className={`px-3 py-2.5 cursor-pointer ${
                        !n.read ? 'bg-fire/5' : ''
                      }`}
                    >
                      <div className="flex gap-2 w-full">
                        <span className="text-base shrink-0">
                          {NOTIFICATION_ICONS[n.type]}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-xs leading-snug ${
                              n.read ? 'text-text-2' : 'text-cream'
                            }`}
                          >
                            {getNotificationMessage(n)}
                          </p>
                          <p className="text-muted-custom text-[10px] mt-0.5">
                            {timeAgo(n.created_at)}
                          </p>
                        </div>
                        {!n.read && (
                          <div className="w-2 h-2 bg-fire rounded-full shrink-0 mt-1" />
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Avatar dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger
                className="w-8 h-8 rounded-full bg-fire/20 flex items-center justify-center text-fire text-xs font-bold focus:outline-none focus:ring-2 focus:ring-fire/50"
                aria-label="Profile menu"
              >
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.display_name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  initials
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-bg-surface border-border min-w-45"
              >
                <DropdownMenuItem>
                  <Link href={`/profile/${user.username}`} className="text-cream w-full">
                    👤 My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/saved" className="text-cream w-full">
                    🔖 Saved Recipes
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={`/profile/${user.username}/edit`} className="text-cream w-full">
                    ⚙️ Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-400 focus:text-red-400"
                >
                  🚪 Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Link href="/login">
            <Button variant="outline" size="sm" className="rounded-full border-fire text-fire hover:bg-fire hover:text-white">
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

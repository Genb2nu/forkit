'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import type { Profile } from '@/types';
import { TierBadge } from './TierBadge';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { useAuthPromptStore } from '@/stores/authPromptStore';

interface ProfileHeaderProps {
  profile: Profile;
  isOwnProfile?: boolean;
  isFollowing?: boolean;
  followerCount?: number;
  followingCount?: number;
}

const SOCIAL_ICONS: Record<string, { label: string; prefix: string }> = {
  instagram: { label: '📸', prefix: 'https://instagram.com/' },
  tiktok: { label: '🎵', prefix: 'https://tiktok.com/@' },
  youtube: { label: '▶️', prefix: 'https://youtube.com/@' },
  facebook: { label: '👥', prefix: 'https://facebook.com/' },
  twitter: { label: '𝕏', prefix: 'https://x.com/' },
  website: { label: '🌐', prefix: '' },
};

export function ProfileHeader({
  profile,
  isOwnProfile,
  isFollowing: initialIsFollowing = false,
  followerCount: initialFollowerCount = 0,
  followingCount = 0,
}: ProfileHeaderProps) {
  const { user } = useAuthStore();
  const openAuthPrompt = useAuthPromptStore((s) => s.openAuthPrompt);
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followerCount, setFollowerCount] = useState<number>(initialFollowerCount);
  const [followLoading, setFollowLoading] = useState(false);

  const initials = profile.display_name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleFollow = useCallback(async () => {
    if (!user) {
      openAuthPrompt('follow');
      return;
    }

    setFollowLoading(true);
    // Optimistic
    const wasFollowing = isFollowing;
    setIsFollowing(!wasFollowing);
    setFollowerCount((c) => (wasFollowing ? c - 1 : c + 1));

    try {
      const res = await fetch(`/api/follows/${profile.username}`, {
        method: wasFollowing ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        const data = await res.json();
        setIsFollowing(data.following);
        toast(data.following ? `Following @${profile.username}` : `Unfollowed @${profile.username}`);
      } else {
        // Revert
        setIsFollowing(wasFollowing);
        setFollowerCount((c) => (wasFollowing ? c + 1 : c - 1));
        toast.error('Something went wrong. Please try again.');
      }
    } catch {
      setIsFollowing(wasFollowing);
      setFollowerCount((c) => (wasFollowing ? c + 1 : c - 1));
      toast.error('Something went wrong. Please try again.');
    } finally {
      setFollowLoading(false);
    }
  }, [user, isFollowing, profile.id, openAuthPrompt]);

  // Collect non-empty social links
  const socialEntries = Object.entries(profile.social_links ?? {}).filter(
    ([, value]) => !!value
  );

  return (
    <div className="flex flex-col items-center text-center gap-4 py-8 px-4">
      {/* Avatar */}
      <div className="w-20 h-20 rounded-full bg-fire/20 flex items-center justify-center text-fire font-bold text-2xl">
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.display_name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          initials
        )}
      </div>

      <div>
        <h1 className="text-xl font-display font-bold text-cream">
          {profile.display_name}
        </h1>
        <p className="text-muted-custom text-sm">@{profile.username}</p>
      </div>

      <TierBadge tier={profile.reward_tier} />

      {profile.bio && (
        <p className="text-text-2 text-sm max-w-md">{profile.bio}</p>
      )}

      {/* Social links */}
      {socialEntries.length > 0 && (
        <div className="flex gap-3">
          {socialEntries.map(([key, value]) => {
            const social = SOCIAL_ICONS[key];
            if (!social) return null;
            const href = value.startsWith('http') ? value : `${social.prefix}${value}`;
            return (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-custom hover:text-cream transition-colors text-sm"
                title={key}
              >
                {social.label}
              </a>
            );
          })}
        </div>
      )}

      {/* Stats */}
      <div className="flex gap-6 text-sm">
        <div>
          <span className="text-cream font-semibold">{followerCount}</span>{' '}
          <span className="text-muted-custom">followers</span>
        </div>
        <div>
          <span className="text-cream font-semibold">{followingCount}</span>{' '}
          <span className="text-muted-custom">following</span>
        </div>
        <div>
          <span className="text-cream font-semibold">{profile.total_votes}</span>{' '}
          <span className="text-muted-custom">votes</span>
        </div>
      </div>

      {/* Action buttons */}
      {isOwnProfile ? (
        <Link
          href={`/profile/${profile.username}/edit`}
          className="text-fire text-sm hover:text-fire/80 transition-colors"
        >
          ✏️ Edit Profile
        </Link>
      ) : (
        <Button
          onClick={handleFollow}
          disabled={followLoading}
          className={
            isFollowing
              ? 'rounded-full px-6 bg-bg-surface border border-border text-cream hover:bg-bg-muted'
              : 'rounded-full px-6 bg-linear-to-r from-fire to-ember text-white hover:opacity-90'
          }
        >
          {followLoading ? '…' : isFollowing ? 'Following' : 'Follow'}
        </Button>
      )}
    </div>
  );
}

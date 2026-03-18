import { notFound } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { CreatorAnalytics } from '@/components/profile/CreatorAnalytics';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import type { Profile, Recipe, RewardTier } from '@/types';

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const { username } = await params;
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, bio')
    .eq('username', username)
    .single();

  if (!profile) {
    return { title: 'Profile Not Found — ForkIt' };
  }

  return {
    title: `${profile.display_name} (@${username}) — ForkIt`,
    description: profile.bio || `Check out ${profile.display_name}'s recipes on ForkIt.`,
    openGraph: {
      title: `${profile.display_name} (@${username}) — ForkIt`,
      description: profile.bio || `Check out ${profile.display_name}'s recipes on ForkIt.`,
      images: [`/api/og/profile/${username}`],
    },
  };
}

async function getProfile(username: string) {
  const supabase = await createClient();

  // Fetch profile
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (error || !profile) return null;

  // Fetch recipes by this user
  const { data: recipes } = await supabase
    .from('recipes')
    .select('*')
    .eq('author_id', profile.id)
    .eq('published', true)
    .order('created_at', { ascending: false });

  // Fetch follower/following counts
  const { count: followerCount } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('following_id', profile.id);

  const { count: followingCount } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('follower_id', profile.id);

  // Check if current user follows this profile
  const { data: { user: authUser } } = await supabase.auth.getUser();
  let isFollowing = false;
  let isOwnProfile = false;

  if (authUser) {
    isOwnProfile = authUser.id === profile.id;
    if (!isOwnProfile) {
      const { data: followRow } = await supabase
        .from('follows')
        .select('follower_id')
        .eq('follower_id', authUser.id)
        .eq('following_id', profile.id)
        .maybeSingle();
      isFollowing = !!followRow;
    }
  }

  return {
    profile: profile as Profile,
    recipes: (recipes ?? []) as Recipe[],
    followerCount: followerCount ?? 0,
    followingCount: followingCount ?? 0,
    isFollowing,
    isOwnProfile,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const data = await getProfile(username);

  if (!data) notFound();

  const { profile, recipes, followerCount, followingCount, isFollowing, isOwnProfile } = data;

  return (
    <div className="min-h-screen bg-bg-base text-cream">
      {/* Profile header section */}
      <ProfileHeader
        profile={profile}
        isOwnProfile={isOwnProfile}
        isFollowing={isFollowing}
        followerCount={followerCount}
        followingCount={followingCount}
      />

      {/* Recipes grid */}
      <section className="px-4 pb-8">
        <h2 className="text-lg font-display font-bold text-cream mb-4">
          Recipes ({recipes.length})
        </h2>

        {recipes.length === 0 ? (
          <EmptyState
            emoji="✨"
            title={isOwnProfile ? 'No recipes yet' : 'No recipes published yet'}
            description={isOwnProfile ? 'Share your first dish with the ForkIt community!' : 'This creator hasn\'t published any recipes yet.'}
            actionLabel={isOwnProfile ? '🍴 Share your first recipe' : undefined}
            actionHref={isOwnProfile ? '/create' : undefined}
          />
        ) : (
          <ErrorBoundary>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {recipes.map((recipe) => (
              <a
                key={recipe.id}
                href={`/recipe/${recipe.id}`}
                className="group bg-bg-surface rounded-xl overflow-hidden border border-border hover:border-fire/30 transition-colors"
              >
                <div className="aspect-square bg-bg-muted flex items-center justify-center relative overflow-hidden">
                  {recipe.image_url ? (
                    <Image
                      src={recipe.image_url}
                      alt={recipe.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  ) : (
                    <span className="text-4xl">{recipe.emoji}</span>
                  )}
                </div>
                <div className="p-2">
                  <p className="text-cream text-sm font-medium truncate group-hover:text-fire transition-colors">
                    {recipe.country_flag} {recipe.title}
                  </p>
                  <p className="text-muted-custom text-xs">
                    ❤️ {recipe.total_votes}
                  </p>
                </div>
              </a>
            ))}
          </div>
          </ErrorBoundary>
        )}
      </section>

      {/* Creator Analytics — only for own profile, Hot Chef tier or above */}
      {isOwnProfile &&
        (['hot_chef', 'star_creator', 'legend'] as RewardTier[]).includes(
          profile.reward_tier
        ) &&
        recipes.length > 0 && (
          <section className="px-4 pb-24">
            <CreatorAnalytics recipes={recipes} />
          </section>
        )}

      {/* Spacer for profiles without analytics */}
      {!(
        isOwnProfile &&
        (['hot_chef', 'star_creator', 'legend'] as RewardTier[]).includes(
          profile.reward_tier
        ) &&
        recipes.length > 0
      ) && <div className="pb-16" />}
    </div>
  );
}

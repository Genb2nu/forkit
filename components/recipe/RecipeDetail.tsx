'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import type { Recipe, Ingredient, RecipeStep as RecipeStepType } from '@/types';
import { getCuisineGradient } from '@/lib/rewards';
import { useVote } from '@/hooks/useVote';
import { useSave } from '@/hooks/useSave';
import { useAuthStore } from '@/stores/authStore';
import { useAuthPromptStore } from '@/stores/authPromptStore';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { IngredientList } from './IngredientList';
import { StepsList } from './StepsList';
import { VideoEmbed } from './VideoEmbed';

interface RecipeDetailProps {
  recipe: Recipe;
  currentUserId?: string;
}

export function RecipeDetail({ recipe, currentUserId }: RecipeDetailProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const openAuthPrompt = useAuthPromptStore((s) => s.openAuthPrompt);
  const gradient = getCuisineGradient(recipe.country_code);

  const isOwner =
    recipe.source === 'community' && currentUserId === recipe.author_id;
  const isCurated = recipe.source === 'curated';

  // Hooks
  const { toggle: toggleVote, voted, voteCount, isLoading: voteLoading } = useVote(
    recipe.id,
    false,
    recipe.total_votes
  );
  const { toggle: toggleSave, saved, isLoading: saveLoading } = useSave(recipe.id, false);

  // Edit mode
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState(recipe.title);
  const [editDescription, setEditDescription] = useState(recipe.description);
  const [editVideoUrl, setEditVideoUrl] = useState(recipe.video_url ?? '');
  const [editIngredients, setEditIngredients] = useState<Ingredient[]>(recipe.ingredients ?? []);
  const [editSteps, setEditSteps] = useState<RecipeStepType[]>(recipe.steps ?? []);
  const [saving, setSaving] = useState(false);

  const handleSaveEdit = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/recipes/${recipe.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          video_url: editVideoUrl || null,
          ingredients: editIngredients.map((i, idx) => ({
            text: i.text,
            sort_order: idx + 1,
          })),
          steps: editSteps.map((s, idx) => ({
            step_number: idx + 1,
            title: s.title,
            body: s.body,
          })),
        }),
      });
      if (res.ok) {
        toast.success('💾 Changes saved');
        setEditMode(false);
        router.refresh();
      } else {
        toast.error('Failed to save changes');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSaving(false);
    }
  }, [recipe.id, editTitle, editDescription, editVideoUrl, editIngredients, editSteps, router]);

  const handleCancelEdit = () => {
    setEditTitle(recipe.title);
    setEditDescription(recipe.description);
    setEditVideoUrl(recipe.video_url ?? '');
    setEditIngredients(recipe.ingredients ?? []);
    setEditSteps(recipe.steps ?? []);
    setEditMode(false);
  };

  // Follow handler for community recipes
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const handleFollow = async () => {
    if (!user) {
      openAuthPrompt('follow');
      return;
    }
    setFollowLoading(true);
    const wasFollowing = isFollowing;
    setIsFollowing(!wasFollowing);
    try {
      const res = await fetch('/api/follows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followingId: recipe.author_id }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsFollowing(data.following);
        toast(data.following ? `Following @${recipe.author?.username}` : `Unfollowed @${recipe.author?.username}`);
      } else {
        setIsFollowing(wasFollowing);
        toast.error('Something went wrong. Please try again.');
      }
    } catch {
      setIsFollowing(wasFollowing);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setFollowLoading(false);
    }
  };

  const authorInitials = recipe.author
    ? recipe.author.display_name
        .split(' ')
        .map((w: string) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '';

  return (
    <div className="min-h-screen bg-bg-base">
      {/* HERO */}
      <div className="relative" style={{ background: gradient }}>
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/70" />

        <div className="relative z-10 px-4 pt-4 pb-8">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white"
              aria-label="Close"
            >
              ←
            </button>
            <div className="flex items-center gap-2">
              {isOwner && !editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  className="px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-sm text-white text-xs"
                >
                  ✏️ Edit
                </button>
              )}
              <button
                onClick={toggleSave}
                disabled={saveLoading}
                className={`w-9 h-9 rounded-full backdrop-blur-sm flex items-center justify-center text-lg ${
                  saved ? 'bg-fire/80 text-white' : 'bg-black/30 text-white'
                }`}
                aria-label="Save recipe"
              >
                🔖
              </button>
            </div>
          </div>

          {/* Emoji + vote */}
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[52px] drop-shadow-lg">{recipe.emoji}</span>
            </div>
            <button
              onClick={toggleVote}
              disabled={voteLoading}
              className="flex flex-col items-center gap-1"
              aria-label="Vote for this recipe"
            >
              <span
                className={`text-2xl transition-transform ${voted ? 'scale-110' : ''}`}
              >
                {voted ? '❤️' : '🤍'}
              </span>
              <span className="text-white text-xs font-medium">{voteCount}</span>
            </button>
          </div>

          {/* Title */}
          <div className="mt-4">
            {editMode ? (
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full bg-transparent border-b border-white/30 text-white font-display font-bold text-2xl focus:outline-none focus:border-fire pb-1"
              />
            ) : (
              <h1 className="font-display font-bold text-2xl text-white leading-tight">
                {recipe.title}
              </h1>
            )}
          </div>

          {/* Chips */}
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
              {recipe.country_flag} {recipe.country_name}
            </span>
            <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
              ⏱ {recipe.time_minutes}m
            </span>
            <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
              🍽️ {recipe.servings} servings
            </span>
            <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full capitalize">
              {recipe.difficulty}
            </span>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="px-4 py-6 space-y-6">
        {/* Edit mode controls */}
        {editMode && (
          <div className="flex gap-2">
            <button
              onClick={handleSaveEdit}
              disabled={saving}
              className="px-4 py-2 rounded-full bg-linear-to-r from-fire to-ember text-white text-sm font-medium hover:opacity-90 disabled:opacity-50"
            >
              {saving ? 'Saving…' : '💾 Save'}
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 rounded-full border border-border text-cream text-sm hover:bg-bg-surface"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Creator / Curator bar */}
        {isCurated ? (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-fire/5 border border-fire/10">
            <span className="text-fire text-sm">🍴</span>
            <span className="text-cream text-sm font-medium">ForkIt Curated</span>
            <span className="text-muted-custom text-xs">· Hand-picked by the ForkIt team</span>
          </div>
        ) : recipe.author ? (
          <div className="flex items-center justify-between p-3 rounded-xl bg-bg-surface border border-border">
            <Link
              href={`/profile/${recipe.author.username}`}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-fire/20 flex items-center justify-center text-fire text-xs font-bold">
                {recipe.author.avatar_url ? (
                  <img
                    src={recipe.author.avatar_url}
                    alt={recipe.author.display_name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  authorInitials
                )}
              </div>
              <div>
                <p className="text-cream text-sm font-medium">{recipe.author.display_name}</p>
                <p className="text-muted-custom text-xs">
                  @{recipe.author.username} · ❤️ {recipe.author.total_votes}
                </p>
              </div>
            </Link>
            {!isOwner && (
              <button
                onClick={handleFollow}
                disabled={followLoading}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  isFollowing
                    ? 'bg-bg-muted border border-border text-cream'
                    : 'bg-fire text-white hover:bg-fire/90'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </div>
        ) : null}

        {/* Description */}
        <div>
          {editMode ? (
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-xl bg-bg-muted border border-border text-cream text-sm resize-none focus:outline-none focus:ring-1 focus:ring-fire/50"
            />
          ) : (
            <p className="text-text-2 text-sm italic leading-relaxed">
              &ldquo;{recipe.description}&rdquo;
            </p>
          )}
        </div>

        {/* Tags */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {recipe.tags.map((tag) => (
              <span
                key={tag.id}
                className="bg-bg-surface border border-border text-cream text-xs px-3 py-1 rounded-full"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Video */}
        {editMode ? (
          <div>
            <label className="text-muted-custom text-xs mb-1 block">Video URL</label>
            <input
              value={editVideoUrl}
              onChange={(e) => setEditVideoUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full px-3 py-2 rounded-xl bg-bg-muted border border-border text-cream text-sm font-mono focus:outline-none focus:ring-1 focus:ring-fire/50"
            />
            {editVideoUrl && (
              <VideoEmbed videoUrl={editVideoUrl} />
            )}
          </div>
        ) : (
          <VideoEmbed
            videoUrl={recipe.video_url}
            videoNote={recipe.video_note}
            isOwner={isOwner}
            onRequestEdit={() => setEditMode(true)}
          />
        )}

        {/* Tabs: Ingredients | Steps */}
        <Tabs defaultValue="ingredients">
          <TabsList className="w-full bg-bg-surface border border-border rounded-xl">
            <TabsTrigger value="ingredients" className="flex-1 text-sm">
              🥘 Ingredients ({recipe.ingredients?.length ?? 0})
            </TabsTrigger>
            <TabsTrigger value="steps" className="flex-1 text-sm">
              📋 Steps ({recipe.steps?.length ?? 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ingredients" className="mt-4">
            <IngredientList
              ingredients={editMode ? editIngredients : (recipe.ingredients ?? [])}
              editable={editMode}
              onUpdate={setEditIngredients}
            />
          </TabsContent>

          <TabsContent value="steps" className="mt-4">
            <StepsList
              steps={editMode ? editSteps : (recipe.steps ?? [])}
              recipeName={recipe.title}
              editable={editMode}
              onUpdate={setEditSteps}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

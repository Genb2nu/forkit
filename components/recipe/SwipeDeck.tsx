'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { SwipeCard } from './SwipeCard';
import { useSwipeStore } from '@/stores/swipeStore';
import { useAuthStore } from '@/stores/authStore';
import { useAuthPromptStore } from '@/stores/authPromptStore';
import { getCuisineGradient } from '@/lib/rewards';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { startNavigationProgress } from '@/components/ui/NavigationProgress';
import type { Recipe } from '@/types';

export function SwipeDeck() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { seenIds, savedIds, addSeen, addSaved, reset } = useSwipeStore();
  const openAuthPrompt = useAuthPromptStore((s) => s.openAuthPrompt);

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [exhausted, setExhausted] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const fetchBatch = useCallback(
    async (excludeIds: Set<string>) => {
      const excludeParam =
        excludeIds.size > 0 ? `&exclude=${Array.from(excludeIds).join(',')}` : '';
      const res = await fetch(`/api/recipes/feed?limit=20${excludeParam}`);
      if (!res.ok) return { recipes: [], hasMore: false };
      return res.json() as Promise<{ recipes: Recipe[]; hasMore: boolean }>;
    },
    []
  );

  // Initial load
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      const data = await fetchBatch(seenIds);
      if (!cancelled) {
        if (data.recipes.length === 0) {
          setExhausted(true);
        } else {
          setRecipes(data.recipes);
          setCurrentIndex(0);
        }
        setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-fetch when running low
  useEffect(() => {
    if (recipes.length === 0) return;
    const remaining = recipes.length - currentIndex;
    if (remaining <= 5 && !exhausted) {
      (async () => {
        const data = await fetchBatch(seenIds);
        if (data.recipes.length === 0) {
          if (remaining <= 0) setExhausted(true);
        } else {
          setRecipes((prev) => [...prev, ...data.recipes]);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  const advance = useCallback(() => {
    setCurrentIndex((i) => {
      const next = i + 1;
      if (next >= recipes.length) {
        setExhausted(true);
      }
      return next;
    });
  }, [recipes.length]);

  const handleSwipeRight = useCallback(() => {
    const recipe = recipes[currentIndex];
    if (!recipe) return;
    addSeen(recipe.id);
    addSaved(recipe.id);

    // If authenticated, vote via API (fire-and-forget)
    if (user) {
      fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId: recipe.id }),
      }).catch(() => {});
    } else {
      // Optionally show auth prompt for guests (after advancing)
      setTimeout(() => openAuthPrompt('vote'), 300);
    }

    advance();
  }, [recipes, currentIndex, addSeen, addSaved, user, openAuthPrompt, advance]);

  const handleSwipeLeft = useCallback(() => {
    const recipe = recipes[currentIndex];
    if (!recipe) return;
    addSeen(recipe.id);
    advance();
  }, [recipes, currentIndex, addSeen, advance]);

  const handleViewDetail = useCallback(() => {
    const recipe = recipes[currentIndex];
    if (recipe) {
      setIsNavigating(true);
      startNavigationProgress();
      router.push(`/recipe/${recipe.id}`);
    }
  }, [recipes, currentIndex, router]);

  const handleRandom = useCallback(() => {
    const unseen = recipes
      .map((r, i) => ({ r, i }))
      .filter(({ r, i }) => i > currentIndex && !seenIds.has(r.id));
    if (unseen.length > 0) {
      const pick = unseen[Math.floor(Math.random() * unseen.length)];
      setCurrentIndex(pick.i);
    }
  }, [recipes, currentIndex, seenIds]);

  const handleReset = useCallback(() => {
    reset();
    setExhausted(false);
    setIsLoading(true);
    (async () => {
      const data = await fetchBatch(new Set<string>());
      setRecipes(data.recipes);
      setCurrentIndex(0);
      setIsLoading(false);
    })();
  }, [reset, fetchBatch]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handleSwipeLeft();
      else if (e.key === 'ArrowRight') handleSwipeRight();
      else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleViewDetail();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleSwipeLeft, handleSwipeRight, handleViewDetail]);

  // Loading skeleton
  if (isLoading) {
    return <SkeletonCard />;
  }

  // Exhausted state
  if (exhausted || currentIndex >= recipes.length) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <span className="text-5xl">🎉</span>
        <h3 className="font-display font-bold text-xl text-cream">You&apos;ve seen it all!</h3>
        <p className="text-text-2 text-sm max-w-xs">
          You&apos;ve swiped through every recipe. Start over or explore by country.
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="px-5 py-2.5 rounded-full bg-linear-to-r from-fire to-ember text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            🔄 Start Over
          </button>
          <button
            onClick={() => router.push('/explore')}
            className="px-5 py-2.5 rounded-full border border-border text-cream text-sm font-medium hover:bg-bg-surface transition-colors"
          >
            🌍 Explore by Country
          </button>
        </div>
      </div>
    );
  }

  const activeRecipe = recipes[currentIndex];

  // Saved recipes for strip
  const savedRecipes = recipes.filter((r) => savedIds.includes(r.id));

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Card stack */}
      <div className="relative w-full max-w-sm mx-auto aspect-3/4">
        {/* Shadow cards behind */}
        {[2, 1].map((offset) => {
          const idx = currentIndex + offset;
          const r = recipes[idx];
          if (!r) return null;
          return (
            <div
              key={r.id}
              className="absolute inset-0 rounded-3xl overflow-hidden"
              style={{
                background: getCuisineGradient(r.country_code),
                transform: `scale(${1 - offset * 0.04}) translateY(${offset * 8}px)`,
                zIndex: 3 - offset,
                opacity: 1 - offset * 0.2,
              }}
            >
              <div className="absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/60" />
            </div>
          );
        })}

        {/* Active card */}
        <AnimatePresence>
          <SwipeCard
            key={activeRecipe.id}
            recipe={activeRecipe}
            onSwipeRight={handleSwipeRight}
            onSwipeLeft={handleSwipeLeft}
            onViewDetail={handleViewDetail}
            isNavigating={isNavigating}
            style={{ zIndex: 3 }}
          />
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-6">
        <button
          onClick={handleSwipeLeft}
          className="w-14 h-14 rounded-full border-2 border-red-500/50 text-red-500 flex items-center justify-center text-xl hover:bg-red-500/10 transition-colors"
          aria-label="Skip this recipe"
        >
          ✕
        </button>
        <button
          onClick={handleViewDetail}
          className="w-12 h-12 rounded-full border-2 border-border text-muted-custom flex items-center justify-center text-lg hover:bg-bg-surface transition-colors"
          aria-label="View recipe details"
        >
          📖
        </button>
        <button
          onClick={handleSwipeRight}
          className="w-14 h-14 rounded-full border-2 border-green-500/50 text-green-500 flex items-center justify-center text-xl hover:bg-green-500/10 transition-colors"
          aria-label="Vote for this recipe"
        >
          ♥
        </button>
      </div>

      {/* Keyboard hint */}
      <p className="text-muted-custom text-[10px]">← → Arrow keys to swipe · Enter to view</p>

      {/* Saved recipes strip */}
      {savedRecipes.length > 0 && (
        <div className="w-full max-w-sm">
          <p className="text-muted-custom text-xs mb-2">Saved ({savedRecipes.length})</p>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {savedRecipes.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  startNavigationProgress();
                  router.push(`/recipe/${r.id}`);
                }}
                className="shrink-0 px-3 py-1.5 rounded-full text-white text-[10px] font-medium truncate max-w-28"
                style={{ background: getCuisineGradient(r.country_code) }}
              >
                {r.country_flag} {r.title}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

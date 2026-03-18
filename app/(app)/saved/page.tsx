'use client';

import { useEffect, useState } from 'react';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import type { Recipe } from '@/types';

export default function SavedRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/saves')
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data.recipes ?? []);
      })
      .catch(() => {
        setRecipes([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-bg-base text-cream">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold">
            Saved Recipes 🔖
          </h1>
          <p className="text-text-2 text-sm mt-1">
            Your personal recipe collection
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton
                key={i}
                className="rounded-2xl min-h-36"
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && recipes.length === 0 && (
          <EmptyState
            emoji="🔖"
            title="Nothing saved yet"
            description="Swipe right on recipes you love and they'll show up here. Start exploring!"
            actionLabel="🔥 Start Swiping"
            actionHref="/discover"
          />
        )}

        {/* Recipe grid */}
        {!loading && recipes.length > 0 && (
          <>
            <p className="text-xs text-text-2 mb-4">
              {recipes.length} saved recipe{recipes.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

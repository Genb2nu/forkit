'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { TIER_CONFIG } from '@/lib/rewards';

const RecipeForm = dynamic(
  () => import('@/components/recipe/RecipeForm').then((m) => m.RecipeForm),
  {
    loading: () => (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 bg-bg-surface rounded-lg" />
        <div className="h-10 bg-bg-surface rounded-lg" />
        <div className="h-24 bg-bg-surface rounded-lg" />
        <div className="h-10 bg-bg-surface rounded-lg" />
      </div>
    ),
  }
);

export default function CreateRecipePage() {
  const router = useRouter();
  const [showRewards, setShowRewards] = useState(false);

  return (
    <div className="min-h-screen bg-bg-base text-cream">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold">
            Submit a Recipe 🍴
          </h1>
          <p className="text-text-2 text-sm mt-1">
            Share your creation with the ForkIt community
          </p>
        </div>

        {/* Recipe Form */}
        <RecipeForm
          mode="create"
          onSuccess={(recipeId) => {
            router.push(`/recipe/${recipeId}`);
          }}
        />

        {/* Rewards Preview */}
        <div className="mt-6 mb-24">
          <button
            type="button"
            onClick={() => setShowRewards(!showRewards)}
            className="flex items-center gap-2 text-sm text-text-2 hover:text-cream transition-colors"
          >
            <svg
              className={`w-4 h-4 transition-transform ${showRewards ? 'rotate-90' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            What votes will unlock
          </button>

          {showRewards && (
            <div className="mt-3 rounded-2xl bg-white/3 border border-white/7 p-4 space-y-3">
              {(Object.keys(TIER_CONFIG) as Array<keyof typeof TIER_CONFIG>).map((tier) => {
                const config = TIER_CONFIG[tier];
                return (
                  <div key={tier} className="flex items-center gap-3">
                    <span className="text-xl">{config.emoji}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-cream">
                        {config.label}
                      </p>
                      <p className="text-xs text-text-2">
                        {config.minVotes.toLocaleString()}+ votes
                      </p>
                    </div>
                  </div>
                );
              })}
              <p className="text-xs text-text-2 pt-2 border-t border-white/7">
                Every vote on your recipes counts toward your creator tier. The
                more people love your food, the more perks you unlock.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

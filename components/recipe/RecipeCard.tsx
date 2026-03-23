'use client';

import Link from 'next/link';
import type { Recipe } from '@/types';
import { getCuisineGradient } from '@/lib/rewards';

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const gradient = getCuisineGradient(recipe.country_code);
  const isCurated = recipe.source === 'curated';

  return (
    <Link href={`/recipe/${recipe.id}`} className="block group">
      <div
        className="relative rounded-2xl overflow-hidden border border-white/7 hover:border-fire/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-fire/5 transition-all duration-200 cursor-pointer"
        style={{ background: gradient }}
      >
        {/* Recipe image */}
        {recipe.image_url && (
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        )}

        {/* Gradient overlay for text readability */}
        <div className={`absolute inset-0 ${recipe.image_url ? 'bg-linear-to-b from-black/40 via-black/20 to-black/80' : 'bg-linear-to-b from-black/20 via-transparent to-black/70'}`} />

        {/* Content */}
        <div className="relative p-4 min-h-36 flex flex-col justify-between">
          {/* Top: Emoji (only when no image) + Vote count */}
          <div className="flex items-start justify-between">
            {!recipe.image_url && (
              <span className="text-4xl drop-shadow-lg group-hover:scale-110 transition-transform">
                {recipe.emoji}
              </span>
            )}
            <span className="inline-flex items-center gap-1 bg-black/30 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs text-white/80">
              ♥ {recipe.total_votes}
            </span>
          </div>

          {/* Bottom: Title + Meta */}
          <div className="mt-auto">
            <h3 className="text-sm font-display font-bold text-white leading-tight line-clamp-2 drop-shadow-sm">
              {recipe.title}
            </h3>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs text-white/70">
                {recipe.country_flag} {recipe.country_name}
              </span>
              <span className="text-white/30">·</span>
              <span className="text-xs text-white/70">
                {recipe.time_minutes}min
              </span>
            </div>

            {/* Creator badge */}
            <div className="mt-2">
              {isCurated ? (
                <span className="inline-flex items-center gap-1 text-xs text-white/60 bg-white/10 rounded-full px-2 py-0.5">
                  🍴 Curated
                </span>
              ) : recipe.author ? (
                <span className="text-xs text-white/60">
                  by @{recipe.author.username}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

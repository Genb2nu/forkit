'use client';

import Link from 'next/link';
import type { Country, Recipe } from '@/types';
import { getCuisineGradient } from '@/lib/rewards';

interface CountryTileProps {
  country: Country;
  isSelected: boolean;
  topDish: Recipe | null;
  onSelect: (code: string) => void;
}

export function CountryTile({
  country,
  isSelected,
  topDish,
  onSelect,
}: CountryTileProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={isSelected}
      aria-label={`${country.name} — ${country.recipe_count} recipes`}
      className={`rounded-2xl bg-bg-surface p-4 text-cream transition-all cursor-pointer border ${
        isSelected
          ? 'border-fire/50 ring-1 ring-fire/30'
          : 'border-border hover:-translate-y-1'
      }`}
      onClick={() => onSelect(country.code)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(country.code); } }}
    >
      <div className="flex items-start justify-between">
        <p className="text-3xl">{country.flag}</p>
        <span className="text-xs text-muted-custom font-mono bg-bg-muted px-2 py-0.5 rounded-full">
          {country.recipe_count}
        </span>
      </div>
      <h3 className="text-sm font-semibold mt-2">{country.name}</h3>
      <p className="text-muted-custom text-xs">
        {country.recipe_count} recipe{country.recipe_count !== 1 ? 's' : ''}
      </p>

      {/* Expanded state */}
      {isSelected && (
        <div className="mt-3 pt-3 border-t border-border">
          {topDish ? (
            <div className="flex items-center gap-2 mb-3">
              {topDish.image_url ? (
                <img
                  src={topDish.image_url}
                  alt={topDish.title}
                  className="w-10 h-10 rounded-lg object-cover"
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                  style={{ background: getCuisineGradient(country.code) }}
                >
                  {topDish.emoji}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-cream text-xs font-medium truncate">
                  🏆 {topDish.title}
                </p>
                <p className="text-muted-custom text-xs">
                  ❤️ {topDish.total_votes} votes
                </p>
              </div>
            </div>
          ) : (
            <p className="text-muted-custom text-xs mb-3">
              Explore this cuisine!
            </p>
          )}
          <Link
            href={`/discover?country=${country.code}`}
            className="block text-center text-xs text-fire hover:text-fire/80 font-medium transition-colors"
          >
            Browse {country.name} recipes →
          </Link>
        </div>
      )}
    </div>
  );
}

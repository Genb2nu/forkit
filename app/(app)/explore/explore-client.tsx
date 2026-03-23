'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import type { Country, Recipe } from '@/types';
import { CountryGrid } from '@/components/explore/CountryGrid';
import { useDebounce } from '@/hooks/useDebounce';
import { getCuisineGradient } from '@/lib/rewards';

interface ExploreClientProps {
  countries: Country[];
  trending: Recipe[];
}

export function ExploreClient({ countries, trending }: ExploreClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipeSearch, setRecipeSearch] = useState('');
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const debouncedRecipeSearch = useDebounce(recipeSearch, 400);

  // Filter countries client-side
  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return countries;
    const q = searchQuery.toLowerCase();
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [countries, searchQuery]);

  // Debounced recipe search
  useEffect(() => {
    if (!debouncedRecipeSearch.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }
    let cancelled = false;
    setIsSearching(true);
    setHasSearched(true);

    fetch(`/api/recipes?search=${encodeURIComponent(debouncedRecipeSearch)}&limit=12`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setSearchResults(data.recipes ?? []);
        }
      })
      .catch(() => {
        if (!cancelled) setSearchResults([]);
      })
      .finally(() => {
        if (!cancelled) setIsSearching(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedRecipeSearch]);

  return (
    <>
      {/* Search Section */}
      <div className="px-4 mb-6 space-y-3">
        {/* Country filter */}
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-custom"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Filter countries..."
            aria-label="Filter countries"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg-surface border border-border text-cream text-sm placeholder:text-muted-custom focus:outline-none focus:border-fire/50 transition-colors"
          />
        </div>

        {/* Recipe search */}
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-custom"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search recipes..."
            aria-label="Search recipes"
            value={recipeSearch}
            onChange={(e) => setRecipeSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg-surface border border-border text-cream text-sm placeholder:text-muted-custom focus:outline-none focus:border-fire/50 transition-colors"
          />
        </div>
      </div>

      {/* Recipe Search Results */}
      {hasSearched && (
        <div className="px-4 mb-8">
          <h2 className="text-lg font-display font-bold text-cream mb-3">
            Search Results
          </h2>
          {isSearching ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-bg-surface rounded-xl border border-border animate-pulse"
                >
                  <div className="aspect-square bg-bg-muted rounded-t-xl" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-bg-muted rounded w-3/4" />
                    <div className="h-2 bg-bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : searchResults.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {searchResults.map((recipe) => (
                <Link
                  key={recipe.id}
                  href={`/recipe/${recipe.id}`}
                  className="group bg-bg-surface rounded-xl overflow-hidden border border-border hover:border-fire/30 transition-colors"
                >
                  <div className="aspect-square bg-bg-muted flex items-center justify-center">
                    {recipe.image_url ? (
                      <img
                        src={recipe.image_url}
                        alt={recipe.title}
                        className="w-full h-full object-cover"
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
                      ❤️ {recipe.total_votes} votes
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-3xl mb-2">🔍</p>
              <p className="text-text-2 text-sm">
                No recipes found for &apos;{recipeSearch}&apos;. Try something
                else.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Country Grid */}
      <div className="px-4 mb-8">
        <h2 className="text-lg font-display font-bold text-cream mb-4">
          🗺️ Countries ({filteredCountries.length})
        </h2>
        {filteredCountries.length > 0 ? (
          <CountryGrid countries={filteredCountries} />
        ) : (
          <div className="text-center py-8">
            <p className="text-3xl mb-2">🌍</p>
            <p className="text-text-2 text-sm">
              No countries match &apos;{searchQuery}&apos;
            </p>
          </div>
        )}
      </div>

      {/* Trending Section */}
      {trending.length > 0 && (
        <div className="px-4 mb-8">
          <h2 className="text-lg font-display font-bold text-cream mb-4">
            🔥 Trending Recipes
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {trending.map((recipe) => (
              <Link
                key={recipe.id}
                href={`/recipe/${recipe.id}`}
                className="shrink-0 w-44 bg-bg-surface rounded-xl border border-border overflow-hidden hover:border-fire/30 transition-colors group"
              >
                <div
                  className="h-28 flex items-center justify-center"
                  style={{
                    background: recipe.image_url
                      ? undefined
                      : getCuisineGradient(recipe.country_code),
                  }}
                >
                  {recipe.image_url ? (
                    <img
                      src={recipe.image_url}
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl">{recipe.emoji}</span>
                  )}
                </div>
                <div className="p-2.5">
                  <p className="text-cream text-xs font-medium truncate group-hover:text-fire transition-colors">
                    {recipe.country_flag} {recipe.title}
                  </p>
                  <p className="text-muted-custom text-xs mt-0.5">
                    ❤️ {recipe.total_votes} · ⏱ {recipe.time_minutes}m
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

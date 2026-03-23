'use client';

import { useState, useEffect } from 'react';
import type { Country, Recipe } from '@/types';
import { CountryTile } from './CountryTile';

interface CountryGridProps {
  countries: Country[];
}

export function CountryGrid({ countries }: CountryGridProps) {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [topDishes, setTopDishes] = useState<Record<string, Recipe | null>>({});

  const handleSelect = (code: string) => {
    if (selectedCountry === code) {
      setSelectedCountry(null);
      return;
    }
    setSelectedCountry(code);
  };

  // Fetch top dish for selected country
  useEffect(() => {
    if (!selectedCountry) return;

    // Check inside the callback using functional state to avoid topDishes dependency
    setTopDishes((prev) => {
      if (prev[selectedCountry] !== undefined) return prev;

      // Fire-and-forget fetch, then update state when done
      fetch(`/api/recipes?country=${selectedCountry}&sort=votes&limit=1`)
        .then((res) => res.json())
        .then((data) => {
          const topRecipe = data.recipes?.[0] ?? null;
          setTopDishes((p) => ({ ...p, [selectedCountry]: topRecipe }));
        })
        .catch(() => {
          setTopDishes((p) => ({ ...p, [selectedCountry]: null }));
        });

      // Return a sentinel to prevent duplicate fetches
      return { ...prev, [selectedCountry]: null };
    });
  }, [selectedCountry]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {countries.map((country) => (
        <CountryTile
          key={country.code}
          country={country}
          isSelected={selectedCountry === country.code}
          topDish={topDishes[country.code] ?? null}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
}

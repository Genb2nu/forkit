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
    if (topDishes[selectedCountry] !== undefined) return;

    async function fetchTopDish() {
      try {
        const res = await fetch(
          `/api/recipes?country=${selectedCountry}&sort=votes&limit=1`
        );
        const data = await res.json();
        const topRecipe = data.recipes?.[0] ?? null;
        setTopDishes((prev) => ({ ...prev, [selectedCountry!]: topRecipe }));
      } catch {
        setTopDishes((prev) => ({ ...prev, [selectedCountry!]: null }));
      }
    }
    fetchTopDish();
  }, [selectedCountry, topDishes]);

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

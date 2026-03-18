'use client';

import { useState } from 'react';
import type { Ingredient } from '@/types';

interface IngredientListProps {
  ingredients: Ingredient[];
  editable?: boolean;
  onUpdate?: (ingredients: Ingredient[]) => void;
}

export function IngredientList({ ingredients, editable, onUpdate }: IngredientListProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const checkedCount = checked.size;
  const total = ingredients.length;
  const progress = total > 0 ? (checkedCount / total) * 100 : 0;

  const toggleCheck = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Edit mode state
  const [editItems, setEditItems] = useState(ingredients.map((i) => i.text));

  if (editable) {
    return (
      <div className="space-y-3">
        {editItems.map((text, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              value={text}
              onChange={(e) => {
                const next = [...editItems];
                next[idx] = e.target.value;
                setEditItems(next);
                onUpdate?.(
                  next.map((t, i) => ({
                    ...ingredients[i],
                    id: ingredients[i]?.id ?? `new-${i}`,
                    recipe_id: ingredients[0]?.recipe_id ?? '',
                    text: t,
                    sort_order: i + 1,
                  }))
                );
              }}
              className="flex-1 px-3 py-2 rounded-lg bg-bg-muted border border-border text-cream text-sm focus:outline-none focus:ring-1 focus:ring-fire/50"
              placeholder={`Ingredient ${idx + 1}`}
            />
            <button
              onClick={() => {
                const next = editItems.filter((_, i) => i !== idx);
                setEditItems(next);
              }}
              className="text-red-400 text-sm px-2 hover:text-red-300"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          onClick={() => setEditItems([...editItems, ''])}
          className="text-fire text-sm hover:text-fire/80 transition-colors"
        >
          + Add Ingredient
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-muted-custom text-xs">
          {checkedCount}/{total} ready
        </span>
        <div className="flex-1 h-1.5 bg-bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-fire rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Ingredient rows */}
      {ingredients.map((ing) => {
        const isChecked = checked.has(ing.id);
        return (
          <button
            key={ing.id}
            onClick={() => toggleCheck(ing.id)}
            className={`w-full flex items-center gap-3 py-2 px-3 rounded-lg text-left transition-colors ${
              isChecked
                ? 'bg-fire/10 line-through text-muted-custom'
                : 'hover:bg-bg-muted text-cream'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] shrink-0 transition-colors ${
                isChecked ? 'border-fire bg-fire text-white' : 'border-border'
              }`}
            >
              {isChecked && '✓'}
            </span>
            <span className="text-sm">{ing.text}</span>
          </button>
        );
      })}
    </div>
  );
}

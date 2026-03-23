'use client';

import { useState, useMemo } from 'react';
import type { Ingredient } from '@/types';
import { parseIngredient } from '@/lib/ingredientEmoji';

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

  // Parse ingredients into structured data with emojis
  const parsed = useMemo(
    () => ingredients.map((ing) => ({ ...ing, parsed: parseIngredient(ing.text) })),
    [ingredients]
  );

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
    <div className="space-y-2">
      {/* Progress bar */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-muted-custom text-xs font-mono">
          {checkedCount}/{total} ready
        </span>
        <div className="flex-1 h-1.5 bg-bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-400 ease-out"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #f97316, #ef4444)',
            }}
          />
        </div>
      </div>

      {/* Visual ingredient cards */}
      {parsed.map((ing) => {
        const isChecked = checked.has(ing.id);
        return (
          <button
            key={ing.id}
            onClick={() => toggleCheck(ing.id)}
            className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-left transition-all duration-200 border ${
              isChecked
                ? 'bg-fire/5 border-fire/15'
                : 'border-transparent hover:bg-white/3 hover:border-border'
            }`}
          >
            {/* Emoji visual */}
            <span
              className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0 transition-transform duration-200 ${
                isChecked ? 'scale-90 opacity-50' : 'hover:scale-110 hover:-rotate-6'
              }`}
            >
              {ing.parsed.emoji}
            </span>

            {/* Name + prep subtitle */}
            <span className="flex-1 min-w-0">
              <span
                className={`block text-sm font-medium transition-colors ${
                  isChecked ? 'text-muted-custom line-through' : 'text-cream'
                }`}
              >
                {ing.parsed.name || ing.text}
              </span>
              {ing.parsed.prep && (
                <span
                  className={`block text-[11px] mt-0.5 font-mono transition-colors ${
                    isChecked ? 'text-muted-custom/50 line-through' : 'text-muted-custom'
                  }`}
                >
                  {ing.parsed.prep}
                </span>
              )}
            </span>

            {/* Quantity badge */}
            {ing.parsed.quantity && (
              <span
                className={`text-[11px] font-mono shrink-0 px-2 py-0.5 rounded-lg transition-colors ${
                  isChecked
                    ? 'text-muted-custom bg-bg-muted'
                    : 'text-fire bg-fire/10'
                }`}
              >
                {ing.parsed.quantity}
              </span>
            )}

            {/* Checkbox */}
            <span
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] shrink-0 transition-all duration-200 ${
                isChecked ? 'border-fire bg-fire text-white' : 'border-border'
              }`}
            >
              {isChecked && '✓'}
            </span>
          </button>
        );
      })}
    </div>
  );
}

'use client';

import { useState } from 'react';
import type { RecipeStep } from '@/types';

interface StepsListProps {
  steps: RecipeStep[];
  recipeName?: string;
  editable?: boolean;
  onUpdate?: (steps: RecipeStep[]) => void;
}

export function StepsList({ steps, recipeName, editable, onUpdate }: StepsListProps) {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const completedCount = completed.size;
  const total = steps.length;
  const progress = total > 0 ? (completedCount / total) * 100 : 0;
  const allDone = completedCount === total && total > 0;

  const toggleComplete = (id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Edit mode
  const [editSteps, setEditSteps] = useState(
    steps.map((s) => ({ title: s.title, body: s.body }))
  );

  if (editable) {
    return (
      <div className="space-y-4">
        {editSteps.map((step, idx) => (
          <div key={idx} className="bg-bg-muted rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-custom text-xs font-mono">Step {idx + 1}</span>
              <button
                onClick={() => {
                  const next = editSteps.filter((_, i) => i !== idx);
                  setEditSteps(next);
                }}
                className="text-red-400 text-xs hover:text-red-300"
              >
                ✕ Remove
              </button>
            </div>
            <input
              value={step.title}
              onChange={(e) => {
                const next = [...editSteps];
                next[idx] = { ...next[idx], title: e.target.value };
                setEditSteps(next);
                onUpdate?.(
                  next.map((s, i) => ({
                    ...steps[i],
                    id: steps[i]?.id ?? `new-${i}`,
                    recipe_id: steps[0]?.recipe_id ?? '',
                    step_number: i + 1,
                    title: s.title,
                    body: s.body,
                  }))
                );
              }}
              placeholder="Step title"
              className="w-full px-3 py-2 rounded-lg bg-bg-base border border-border text-cream text-sm focus:outline-none focus:ring-1 focus:ring-fire/50"
            />
            <textarea
              value={step.body}
              onChange={(e) => {
                const next = [...editSteps];
                next[idx] = { ...next[idx], body: e.target.value };
                setEditSteps(next);
                onUpdate?.(
                  next.map((s, i) => ({
                    ...steps[i],
                    id: steps[i]?.id ?? `new-${i}`,
                    recipe_id: steps[0]?.recipe_id ?? '',
                    step_number: i + 1,
                    title: s.title,
                    body: s.body,
                  }))
                );
              }}
              placeholder="Step instructions"
              rows={3}
              className="w-full px-3 py-2 rounded-lg bg-bg-base border border-border text-cream text-sm resize-none focus:outline-none focus:ring-1 focus:ring-fire/50"
            />
          </div>
        ))}
        <button
          onClick={() => setEditSteps([...editSteps, { title: '', body: '' }])}
          className="text-fire text-sm hover:text-fire/80 transition-colors"
        >
          + Add Step
        </button>
      </div>
    );
  }

  // Completion celebration
  if (allDone) {
    const shareText = `I just cooked ${recipeName ?? 'a delicious recipe'} with ForkIt! 🍴🔥`;
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <span className="text-5xl">🍽️</span>
        <h3 className="font-display font-bold text-xl text-cream">You cooked it!</h3>
        <p className="text-text-2 text-sm">
          Great job finishing all {total} steps. Share your achievement!
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => navigator.clipboard?.writeText(`${shareText} ${shareUrl}`)}
            className="px-4 py-2 rounded-full bg-bg-surface border border-border text-cream text-xs hover:bg-bg-muted transition-colors"
          >
            📋 Copy
          </button>
          <a
            href={`https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full bg-bg-surface border border-border text-cream text-xs hover:bg-bg-muted transition-colors"
          >
            𝕏 Share
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full bg-bg-surface border border-border text-cream text-xs hover:bg-bg-muted transition-colors"
          >
            💬 WhatsApp
          </a>
        </div>
        <button
          onClick={() => setCompleted(new Set())}
          className="text-fire text-xs hover:text-fire/80 transition-colors mt-2"
        >
          Reset progress
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-muted-custom text-xs">
          {completedCount}/{total} done
        </span>
        <div className="flex-1 h-1.5 bg-bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-forest rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step cards */}
      {steps.map((step) => {
        const isDone = completed.has(step.id);
        return (
          <button
            key={step.id}
            onClick={() => toggleComplete(step.id)}
            className={`w-full text-left rounded-xl p-4 transition-colors ${
              isDone ? 'bg-forest/10 border border-forest/20' : 'bg-bg-muted border border-border'
            }`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] shrink-0 mt-0.5 transition-colors ${
                  isDone
                    ? 'border-forest bg-forest text-white'
                    : 'border-border'
                }`}
              >
                {isDone ? '✓' : step.step_number}
              </span>
              <div className="flex-1 min-w-0">
                <h4
                  className={`font-semibold text-sm ${
                    isDone ? 'text-muted-custom line-through' : 'text-cream'
                  }`}
                >
                  {step.title}
                </h4>
                <p
                  className={`text-sm mt-1 ${
                    isDone ? 'text-muted-custom/60 line-through' : 'text-text-2'
                  }`}
                >
                  {step.body}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import type { RecipeStep } from '@/types';
import { detectStepAnimation } from '@/lib/stepAnimations';
import type { CookingAction } from '@/lib/stepAnimations';

interface StepsListProps {
  steps: RecipeStep[];
  recipeName?: string;
  editable?: boolean;
  onUpdate?: (steps: RecipeStep[]) => void;
}

/* ---- Micro-animation components per action type ---- */

function CutAnimation({ foods }: { foods: string[] }) {
  const items = foods.length > 0 ? foods : ['🥔', '🧅'];
  return (
    <div className="flex items-center justify-center gap-1">
      <span className="text-[26px] inline-block animate-knife-chop">🔪</span>
      {items.map((f, i) => (
        <span
          key={i}
          className={`text-lg inline-block animate-slice-appear ${
            i === 1 ? 'animate-slice-appear-d1' : i === 2 ? 'animate-slice-appear-d2' : ''
          }`}
        >
          {f}
        </span>
      ))}
    </div>
  );
}

function SauteAnimation({ foods }: { foods: string[] }) {
  return (
    <div className="flex items-center justify-center gap-1 relative">
      <span className="text-[28px] inline-block animate-sizzle-shake">🍳</span>
      {foods.slice(0, 2).map((f, i) => (
        <span key={i} className="text-lg">{f}</span>
      ))}
      <span className="text-sm absolute -top-1 left-[30%] animate-steam-rise">💨</span>
      <span className="text-sm absolute -top-2 left-[50%] animate-steam-rise animate-steam-rise-d1">💨</span>
      <span className="text-sm absolute top-0 left-[65%] animate-steam-rise animate-steam-rise-d2">💨</span>
    </div>
  );
}

function BoilAnimation() {
  return (
    <div className="flex items-center justify-center relative">
      <span className="text-[26px]">🫕</span>
      <span className="text-xs absolute top-0 left-[28%] animate-boil-bubble">💧</span>
      <span className="text-xs absolute top-1 left-[42%] animate-boil-bubble animate-boil-bubble-d1">💧</span>
      <span className="text-xs absolute -top-0.5 left-[56%] animate-boil-bubble animate-boil-bubble-d2">💧</span>
      <span className="text-xs absolute top-0.5 left-[68%] animate-boil-bubble animate-boil-bubble-d3">💧</span>
    </div>
  );
}

function StirAnimation() {
  return (
    <div className="flex items-center justify-center gap-1">
      <span className="text-[26px] inline-block animate-stir-rotate">🥄</span>
      <span className="text-[10px] animate-bubble-up">○</span>
      <span className="text-[10px] animate-bubble-up animate-bubble-up-d1">○</span>
      <span className="text-[10px] animate-bubble-up animate-bubble-up-d2">○</span>
    </div>
  );
}

function PlateAnimation() {
  return (
    <div className="flex items-center justify-center relative">
      <span className="text-[28px] inline-block animate-plate-spin">🍽️</span>
      <span className="text-xs absolute top-0 left-[22%] animate-sparkle">✨</span>
      <span className="text-xs absolute top-1 right-[22%] animate-sparkle animate-sparkle-d1">✨</span>
      <span className="text-xs absolute bottom-0 left-[35%] animate-sparkle animate-sparkle-d2">✨</span>
    </div>
  );
}

function PeelAnimation({ foods }: { foods: string[] }) {
  const item = foods[0] || '🥔';
  return (
    <div className="flex items-center justify-center gap-1">
      <span className="text-[24px] inline-block animate-peel-motion">{item}</span>
      <span className="text-[24px] inline-block animate-knife-chop">🔪</span>
    </div>
  );
}

function MarinateAnimation({ foods }: { foods: string[] }) {
  const item = foods[0] || '🍗';
  return (
    <div className="flex items-center justify-center relative">
      <span className="text-[26px]">{item}</span>
      <span className="text-sm absolute top-0 left-[35%] animate-marinate-drip">🫗</span>
      <span className="text-sm absolute top-1 left-[50%] animate-marinate-drip animate-marinate-drip-d1">🫗</span>
      <span className="text-sm absolute -top-0.5 left-[62%] animate-marinate-drip animate-marinate-drip-d2">🫗</span>
    </div>
  );
}

function BakeAnimation() {
  return (
    <div className="flex items-center justify-center gap-1">
      <span className="text-[26px] inline-block animate-oven-glow">♨️</span>
      <span className="text-lg animate-rest-pulse">🔥</span>
    </div>
  );
}

function GrillAnimation({ foods }: { foods: string[] }) {
  const item = foods[0] || '🥩';
  return (
    <div className="flex items-center justify-center gap-0.5">
      <span className="text-[22px] inline-block animate-flame-flicker">🔥</span>
      <span className="text-[24px]">{item}</span>
      <span className="text-[22px] inline-block animate-flame-flicker animate-flame-flicker-d1">🔥</span>
    </div>
  );
}

function BlendAnimation() {
  return (
    <div className="flex items-center justify-center gap-1">
      <span className="text-[26px]">🫙</span>
      <span className="text-lg inline-block animate-blend-spin">🌀</span>
    </div>
  );
}

function RestAnimation() {
  return (
    <div className="flex items-center justify-center gap-1">
      <span className="text-[26px] animate-rest-pulse">⏳</span>
      <span className="text-lg animate-rest-pulse" style={{ animationDelay: '0.5s' }}>💤</span>
    </div>
  );
}

function GenericAnimation({ tool, foods }: { tool: string; foods: string[] }) {
  return (
    <div className="flex items-center justify-center gap-1">
      <span className="text-[26px]">{tool}</span>
      {foods.map((f, i) => (
        <span key={i} className="text-lg">{f}</span>
      ))}
    </div>
  );
}

const ANIMATION_COMPONENTS: Record<
  CookingAction,
  React.FC<{ foods: string[]; tool: string }>
> = {
  cut: ({ foods }) => <CutAnimation foods={foods} />,
  peel: ({ foods }) => <PeelAnimation foods={foods} />,
  saute: ({ foods }) => <SauteAnimation foods={foods} />,
  boil: () => <BoilAnimation />,
  stir: () => <StirAnimation />,
  marinate: ({ foods }) => <MarinateAnimation foods={foods} />,
  bake: () => <BakeAnimation />,
  grill: ({ foods }) => <GrillAnimation foods={foods} />,
  blend: () => <BlendAnimation />,
  plate: () => <PlateAnimation />,
  rest: () => <RestAnimation />,
  generic: ({ tool, foods }) => <GenericAnimation tool={tool} foods={foods} />,
};

export function StepsList({ steps, recipeName, editable, onUpdate }: StepsListProps) {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const completedCount = completed.size;
  const total = steps.length;
  const progress = total > 0 ? (completedCount / total) * 100 : 0;
  const allDone = completedCount === total && total > 0;

  // Detect animation data for each step
  const animations = useMemo(
    () => steps.map((s) => detectStepAnimation(s.title, s.body)),
    [steps]
  );

  // Find first incomplete step for active highlight
  const activeStepId = useMemo(() => {
    for (const step of steps) {
      if (!completed.has(step.id)) return step.id;
    }
    return null;
  }, [steps, completed]);

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
        <span className="text-6xl animate-float-gentle">🍽️</span>
        <h3 className="font-display font-bold text-xl text-cream">You cooked it! 🔥</h3>
        <p className="text-text-2 text-sm">
          Great job finishing all {total} steps. Share your achievement!
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => navigator.clipboard?.writeText(`${shareText} ${shareUrl}`)}
            className="px-4 py-2 rounded-full bg-bg-surface border border-border text-cream text-xs hover:bg-bg-muted hover:border-fire/20 transition-all"
          >
            📋 Copy
          </button>
          <a
            href={`https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full bg-bg-surface border border-border text-cream text-xs hover:bg-bg-muted hover:border-fire/20 transition-all"
          >
            𝕏 Share
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full bg-bg-surface border border-border text-cream text-xs hover:bg-bg-muted hover:border-fire/20 transition-all"
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
      <div className="flex items-center gap-2 mb-3">
        <span className="text-muted-custom text-xs font-mono">
          {completedCount}/{total} done
        </span>
        <div className="flex-1 h-1.5 bg-bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-400 ease-out"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #22c55e, #16a34a)',
            }}
          />
        </div>
      </div>

      {/* Step cards */}
      {steps.map((step, idx) => {
        const isDone = completed.has(step.id);
        const isActive = step.id === activeStepId;
        const anim = animations[idx];
        const AnimComponent = ANIMATION_COMPONENTS[anim.action];

        return (
          <button
            key={step.id}
            onClick={() => toggleComplete(step.id)}
            className={`w-full text-left rounded-xl overflow-hidden transition-all duration-300 border ${
              isDone
                ? 'bg-forest/4 border-forest/20'
                : isActive
                ? 'bg-bg-surface border-fire/25 shadow-[0_0_0_1px_rgba(249,115,22,0.1),0_4px_24px_rgba(249,115,22,0.08)]'
                : 'bg-bg-surface border-border hover:border-white/10 hover:shadow-lg hover:-translate-y-0.5'
            }`}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 pt-3.5">
              <span
                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[11px] font-mono font-bold shrink-0 transition-all duration-300 ${
                  isDone
                    ? 'border-forest bg-forest text-white'
                    : isActive
                    ? 'border-fire text-fire shadow-[0_0_0_4px_rgba(249,115,22,0.1)]'
                    : 'border-border text-muted-custom'
                }`}
              >
                {isDone ? '✓' : step.step_number}
              </span>
              <h4
                className={`font-semibold text-sm transition-colors ${
                  isDone ? 'text-muted-custom line-through' : 'text-cream'
                }`}
              >
                {step.title}
              </h4>
            </div>

            {/* Body text */}
            <div className="px-4 pb-1">
              <p
                className={`text-[13px] leading-relaxed mt-1.5 ml-10 ${
                  isDone ? 'text-muted-custom/50 line-through' : 'text-text-2'
                }`}
              >
                {step.body}
              </p>
            </div>

            {/* Cooking animation (hidden when completed) */}
            {!isDone && (
              <div className="mx-4 ml-14 mb-2 h-14 rounded-xl bg-white/2 border border-dashed border-border flex items-center justify-center overflow-hidden">
                <AnimComponent foods={anim.foods} tool={anim.tool} />
              </div>
            )}

            {/* Timer badge */}
            {anim.timerMinutes && !isDone && (
              <div className="ml-14 mb-2 px-4">
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-fire bg-fire/8 px-2 py-0.5 rounded-lg">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {anim.timerMinutes}
                </span>
              </div>
            )}

            {/* Bottom padding */}
            <div className="h-2.5" />
          </button>
        );
      })}
    </div>
  );
}

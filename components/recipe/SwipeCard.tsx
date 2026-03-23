'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion';
import type { Recipe } from '@/types';
import { getCuisineGradient } from '@/lib/rewards';

// Max pointer movement (px) to still count as a tap/click, not a drag
const TAP_THRESHOLD = 10;
// Max time (ms) for a tap — longer = drag/hold
const TAP_MAX_DURATION = 300;

interface SwipeCardProps {
  recipe: Recipe;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
  onViewDetail: () => void;
  isNavigating?: boolean;
  style?: React.CSSProperties;
  animate?: { x: number; opacity: number };
}

export function SwipeCard({
  recipe,
  onSwipeRight,
  onSwipeLeft,
  onViewDetail,
  isNavigating,
  style,
  animate,
}: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-150, 0, 150], [-15, 0, 15]);
  const saveOpacity = useTransform(x, [0, 60, 150], [0, 0.6, 1]);
  const skipOpacity = useTransform(x, [-150, -60, 0], [1, 0.6, 0]);

  // Track pointer start to distinguish tap vs drag on desktop
  const pointerStart = useRef<{ x: number; y: number; time: number } | null>(null);
  const isDragging = useRef(false);

  const gradient = getCuisineGradient(recipe.country_code);

  const handleDragStart = () => {
    isDragging.current = true;
  };

  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info;

    // Reset drag flag after a tick so the click handler can read it
    setTimeout(() => { isDragging.current = false; }, 50);

    if (Math.abs(velocity.x) > 500 || Math.abs(offset.x) > 120) {
      if (offset.x > 0) {
        onSwipeRight();
      } else {
        onSwipeLeft();
      }
    }
  };

  const authorInitials = recipe.author
    ? recipe.author.display_name
        .split(' ')
        .map((w: string) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '';

  return (
    <motion.div
      className="absolute inset-0 touch-none cursor-grab active:cursor-grabbing"
      style={{ x, rotate, ...style }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      animate={animate}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div
        className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl select-none"
        style={{ background: gradient }}
      >
        {/* Recipe image background */}
        {recipe.image_url && (
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />
        )}

        {/* Dark overlay */}
        <div className={`absolute inset-0 ${recipe.image_url ? 'bg-linear-to-b from-black/40 via-black/10 to-black/80' : 'bg-linear-to-b from-black/10 via-transparent to-black/70'}`} />

        {/* SAVE overlay */}
        <motion.div
          className="absolute top-8 left-6 z-10 rounded-xl border-4 border-green-500 px-4 py-2 -rotate-12"
          style={{ opacity: saveOpacity }}
        >
          <span className="text-green-500 font-bold text-2xl tracking-wider">VOTE ❤️</span>
        </motion.div>

        {/* SKIP overlay */}
        <motion.div
          className="absolute top-8 right-6 z-10 rounded-xl border-4 border-red-500 px-4 py-2 rotate-12"
          style={{ opacity: skipOpacity }}
        >
          <span className="text-red-500 font-bold text-2xl tracking-wider">SKIP ✗</span>
        </motion.div>

        {/* Content */}
        <div className="relative z-2 flex flex-col h-full p-5">
          {/* Top row: country + time badges */}
          <div className="flex items-center justify-between">
            <span className="bg-black/30 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
              {recipe.country_flag} {recipe.country_name}
            </span>
            <span className="bg-black/30 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
              ⏱ {recipe.time_minutes}m
            </span>
          </div>

          {/* Tappable centre area — only navigates on true tap/click, not drag */}
          <div
            className="flex-1 flex items-center justify-center"
            onPointerDown={(e) => {
              pointerStart.current = { x: e.clientX, y: e.clientY, time: Date.now() };
            }}
            onPointerUp={(e) => {
              if (isDragging.current) return;
              const start = pointerStart.current;
              if (!start) return;
              const dx = Math.abs(e.clientX - start.x);
              const dy = Math.abs(e.clientY - start.y);
              const dt = Date.now() - start.time;
              // Only count as a tap if pointer barely moved and was quick
              if (dx < TAP_THRESHOLD && dy < TAP_THRESHOLD && dt < TAP_MAX_DURATION) {
                onViewDetail();
              }
              pointerStart.current = null;
            }}
            role="button"
            tabIndex={0}
            aria-label={`View ${recipe.title} details`}
          >
            {!recipe.image_url && (
              <span className="text-[68px] drop-shadow-lg">{recipe.emoji}</span>
            )}
          </div>

          {/* Bottom section */}
          <div className="space-y-3">
            <h2 className="font-display font-bold text-2xl text-white leading-tight">
              {recipe.title}
            </h2>

            <p className="text-white/80 text-sm leading-snug line-clamp-2">
              {recipe.description}
            </p>

            {recipe.tags && recipe.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {recipe.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag.id}
                    className="bg-white/20 text-white/90 text-[10px] px-2 py-0.5 rounded-full"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Creator row */}
            <div className="flex items-center justify-between pt-1">
              {recipe.source === 'curated' ? (
                <span className="bg-fire/20 text-fire text-xs font-medium px-3 py-1.5 rounded-full">
                  🍴 ForkIt Curated
                </span>
              ) : recipe.author ? (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-[10px] font-bold">
                    {recipe.author.avatar_url ? (
                      <img
                        src={recipe.author.avatar_url}
                        alt={recipe.author.display_name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      authorInitials
                    )}
                  </div>
                  <span className="text-white/80 text-xs">@{recipe.author.username}</span>
                  <span className="text-white/60 text-xs">❤️ {recipe.total_votes}</span>
                </div>
              ) : null}

              {isNavigating && (
                <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
                  <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Loading…
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

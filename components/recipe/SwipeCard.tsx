'use client';

import { motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion';
import type { Recipe } from '@/types';
import { getCuisineGradient } from '@/lib/rewards';

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

  const gradient = getCuisineGradient(recipe.country_code);

  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info;
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
      onDragEnd={handleDragEnd}
      animate={animate}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div
        className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl select-none"
        style={{ background: gradient }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/70" />

        {/* SAVE overlay */}
        <motion.div
          className="absolute top-8 left-6 z-10 rounded-xl border-4 border-green-500 px-4 py-2 -rotate-12"
          style={{ opacity: saveOpacity }}
        >
          <span className="text-green-500 font-bold text-2xl tracking-wider">SAVE 🔥</span>
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

          {/* Centre: emoji */}
          <div className="flex-1 flex items-center justify-center">
            <span className="text-[68px] drop-shadow-lg">{recipe.emoji}</span>
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

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetail();
                }}
                onPointerDown={(e) => e.stopPropagation()}
                disabled={isNavigating}
                className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full hover:bg-white/30 transition-colors disabled:opacity-70"
                aria-label="View recipe details"
              >
                {isNavigating ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Loading…
                  </span>
                ) : (
                  'View →'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

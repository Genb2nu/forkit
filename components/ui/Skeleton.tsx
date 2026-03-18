import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-bg-surface',
        className
      )}
    />
  );
}

/* ── Preset skeletons ── */

export function SkeletonCard() {
  return (
    <div className="w-full max-w-sm mx-auto aspect-3/4 rounded-3xl bg-bg-surface animate-pulse relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/30" />
      <div className="absolute bottom-6 left-6 right-6 space-y-3">
        <Skeleton className="h-6 w-3/4 rounded-md" />
        <Skeleton className="h-4 w-1/2 rounded-md" />
        <div className="flex gap-2 mt-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonRecipeDetail() {
  return (
    <div className="min-h-screen bg-bg-base animate-pulse">
      {/* Hero skeleton */}
      <div className="h-72 bg-bg-surface relative">
        <div className="absolute bottom-6 left-4 right-4 space-y-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-7 w-3/4 rounded-md" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
      </div>
      {/* Body skeleton */}
      <div className="px-4 py-6 space-y-4">
        <Skeleton className="h-14 w-full rounded-xl" />
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-5/6 rounded-md" />
        {/* Tab bar */}
        <Skeleton className="h-10 w-full rounded-xl mt-4" />
        {/* Ingredients */}
        <div className="space-y-2 mt-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonLeaderboardRow() {
  return (
    <div className="flex items-center gap-3 py-3 animate-pulse">
      <Skeleton className="w-8 h-4 rounded" />
      <Skeleton className="w-8 h-8 rounded-full" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3 w-1/3 rounded" />
        <Skeleton className="h-1.5 w-full rounded" />
      </div>
      <Skeleton className="h-3 w-10 rounded" />
    </div>
  );
}

export function SkeletonProfileHeader() {
  return (
    <div className="flex flex-col items-center gap-4 py-8 px-4 animate-pulse">
      <Skeleton className="w-20 h-20 rounded-full" />
      <Skeleton className="h-5 w-32 rounded" />
      <Skeleton className="h-4 w-24 rounded" />
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-3 w-48 rounded" />
      <div className="flex gap-6">
        <Skeleton className="h-4 w-16 rounded" />
        <Skeleton className="h-4 w-16 rounded" />
        <Skeleton className="h-4 w-16 rounded" />
      </div>
    </div>
  );
}

export function SkeletonRecipeGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl bg-bg-surface animate-pulse aspect-square"
        />
      ))}
    </div>
  );
}

export function SkeletonCountryGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 px-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl bg-bg-surface animate-pulse h-24"
        />
      ))}
    </div>
  );
}

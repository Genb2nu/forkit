'use client';

import { SwipeDeck } from '@/components/recipe/SwipeDeck';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

export default function DiscoverPage() {
  return (
    <div className="min-h-screen bg-bg-base text-cream px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 max-w-sm mx-auto">
        <div>
          <h1 className="font-display font-bold text-xl text-cream">
            Discover <span className="text-muted-custom">•</span> What&apos;s next?
          </h1>
        </div>
      </div>

      {/* Swipe deck */}
      <ErrorBoundary>
        <SwipeDeck />
      </ErrorBoundary>
    </div>
  );
}

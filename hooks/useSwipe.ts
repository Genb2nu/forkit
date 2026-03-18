'use client';

import { useCallback, useRef } from 'react';

interface UseSwipeOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
  velocityThreshold?: number;
}

export function useSwipe({
  onSwipeLeft,
  onSwipeRight,
  threshold = 120,
  velocityThreshold = 500,
}: UseSwipeOptions) {
  const startX = useRef(0);
  const startTime = useRef(0);

  const handleDragEnd = useCallback(
    (
      _event: MouseEvent | TouchEvent | PointerEvent,
      info: { offset: { x: number }; velocity: { x: number } }
    ) => {
      const { offset, velocity } = info;

      if (Math.abs(velocity.x) > velocityThreshold || Math.abs(offset.x) > threshold) {
        if (offset.x > 0) {
          onSwipeRight?.();
        } else {
          onSwipeLeft?.();
        }
      }
    },
    [onSwipeLeft, onSwipeRight, threshold, velocityThreshold]
  );

  return {
    startX,
    startTime,
    handleDragEnd,
  };
}

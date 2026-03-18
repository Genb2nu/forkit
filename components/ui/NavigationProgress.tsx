'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';

/**
 * A thin progress bar at the top of the page that animates
 * during client-side navigations (like NProgress but zero-dep).
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const prevPathname = useRef(pathname);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const start = useCallback(() => {
    // Clear any existing timers
    if (timerRef.current) clearInterval(timerRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setProgress(0);
    setVisible(true);

    // Quickly jump to ~30%, then slow trickle
    setTimeout(() => setProgress(30), 50);

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(timerRef.current);
          return prev;
        }
        // Slow down as we approach 90
        const increment = Math.max(1, (90 - prev) * 0.08);
        return Math.min(prev + increment, 90);
      });
    }, 200);
  }, []);

  const finish = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    setProgress(100);

    timeoutRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 300);
  }, []);

  useEffect(() => {
    if (pathname !== prevPathname.current) {
      finish();
      prevPathname.current = pathname;
    }
  }, [pathname, finish]);

  // Expose start/finish globally so components can trigger it
  useEffect(() => {
    (window as Window & { __navProgress?: { start: () => void; finish: () => void } }).__navProgress = { start, finish };
    return () => {
      delete (window as Window & { __navProgress?: { start: () => void; finish: () => void } }).__navProgress;
      if (timerRef.current) clearInterval(timerRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [start, finish]);

  if (!visible && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] h-[3px] pointer-events-none"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-gradient-to-r from-fire to-ember transition-all duration-200 ease-out"
        style={{
          width: `${progress}%`,
          opacity: visible ? 1 : 0,
          boxShadow: '0 0 8px rgba(249, 115, 22, 0.6)',
        }}
      />
    </div>
  );
}

/**
 * Helper to trigger the navigation progress bar from any component.
 * Call before router.push() to show immediate loading feedback.
 */
export function startNavigationProgress() {
  (window as Window & { __navProgress?: { start: () => void } }).__navProgress?.start();
}

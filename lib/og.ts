// ============================================================
// ForkIt — OG Image Utilities
// ============================================================

import { getCuisineGradient } from '@/lib/rewards';

export function getOgGradientStyle(countryCode: string) {
  const gradient = getCuisineGradient(countryCode);
  return { background: gradient };
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + '…';
}

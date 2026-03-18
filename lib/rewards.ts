// ============================================================
// ForkIt — Creator Rewards System
// ============================================================

import type { RewardTier } from '@/types';

export function calculateTier(totalVotes: number): RewardTier {
  if (totalVotes >= 25000) return 'legend';
  if (totalVotes >= 5000) return 'star_creator';
  if (totalVotes >= 500) return 'hot_chef';
  return 'starter';
}

export const TIER_CONFIG: Record<
  RewardTier,
  { label: string; emoji: string; minVotes: number; color: string }
> = {
  starter: {
    label: 'Starter',
    emoji: '🌱',
    minVotes: 0,
    color: '#6b6454',
  },
  hot_chef: {
    label: 'Hot Chef',
    emoji: '🔥',
    minVotes: 500,
    color: '#f97316',
  },
  star_creator: {
    label: 'Star Creator',
    emoji: '⭐',
    minVotes: 5000,
    color: '#f97316',
  },
  legend: {
    label: 'Legend',
    emoji: '🏆',
    minVotes: 25000,
    color: '#ef4444',
  },
};

export const CUISINE_GRADIENTS: Record<string, string> = {
  CN: 'linear-gradient(135deg,#c0392b,#e74c3c,#f39c12)',
  JP: 'linear-gradient(135deg,#16a085,#27ae60,#2ecc71)',
  IN: 'linear-gradient(135deg,#f39c12,#e67e22,#e74c3c)',
  TH: 'linear-gradient(135deg,#8e44ad,#c0392b,#f39c12)',
  ID: 'linear-gradient(135deg,#7d3c98,#c0392b,#d35400)',
  IT: 'linear-gradient(135deg,#27ae60,#2ecc71,#16a085)',
  MX: 'linear-gradient(135deg,#e67e22,#e74c3c,#c0392b)',
  MA: 'linear-gradient(135deg,#c0392b,#e74c3c,#8e44ad)',
  FR: 'linear-gradient(135deg,#2c3e50,#3498db,#2980b9)',
  GR: 'linear-gradient(135deg,#2980b9,#3498db,#1abc9c)',
  KR: 'linear-gradient(135deg,#c0392b,#e74c3c,#8e44ad)',
  VN: 'linear-gradient(135deg,#c0392b,#e74c3c,#f39c12)',
  TN: 'linear-gradient(135deg,#e67e22,#e74c3c,#c0392b)',
  US: 'linear-gradient(135deg,#2c3e50,#e74c3c,#3498db)',
  GB: 'linear-gradient(135deg,#2c3e50,#34495e,#7f8c8d)',
  CA: 'linear-gradient(135deg,#c0392b,#e74c3c,#ecf0f1)',
  HR: 'linear-gradient(135deg,#2980b9,#e74c3c,#2c3e50)',
  NL: 'linear-gradient(135deg,#e67e22,#ecf0f1,#2980b9)',
  EG: 'linear-gradient(135deg,#c0392b,#f39c12,#2c3e50)',
  IE: 'linear-gradient(135deg,#27ae60,#ecf0f1,#e67e22)',
  JM: 'linear-gradient(135deg,#27ae60,#f1c40f,#2c3e50)',
  KE: 'linear-gradient(135deg,#2c3e50,#c0392b,#27ae60)',
  MY: 'linear-gradient(135deg,#f1c40f,#2c3e50,#c0392b)',
  PL: 'linear-gradient(135deg,#ecf0f1,#c0392b,#e74c3c)',
  PT: 'linear-gradient(135deg,#27ae60,#c0392b,#f39c12)',
  RU: 'linear-gradient(135deg,#ecf0f1,#2980b9,#c0392b)',
  ES: 'linear-gradient(135deg,#c0392b,#f1c40f,#c0392b)',
  TR: 'linear-gradient(135deg,#c0392b,#ecf0f1,#c0392b)',
  DEFAULT: 'linear-gradient(135deg,#2c3e50,#8e44ad,#c0392b)',
};

export function getCuisineGradient(countryCode: string): string {
  return CUISINE_GRADIENTS[countryCode] ?? CUISINE_GRADIENTS.DEFAULT;
}

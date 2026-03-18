'use client';

import type { RewardTier } from '@/types';
import { TIER_CONFIG } from '@/lib/rewards';
import { Badge } from '@/components/ui/badge';

interface TierBadgeProps {
  tier: RewardTier;
}

export function TierBadge({ tier }: TierBadgeProps) {
  const config = TIER_CONFIG[tier];

  return (
    <Badge
      variant="outline"
      className="text-xs font-mono"
      style={{ borderColor: config.color, color: config.color }}
    >
      {config.emoji} {config.label}
    </Badge>
  );
}

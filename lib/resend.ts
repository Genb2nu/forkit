import { Resend } from 'resend';
import type { RewardTier } from '@/types';
import { TIER_CONFIG } from '@/lib/rewards';

// Lazy singleton — avoids "Missing API key" crash at build time
// when Vercel collects page data and RESEND_API_KEY isn't available yet.
let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

export async function sendTierUpgradeEmail(
  toEmail: string,
  newTier: RewardTier,
  displayName: string,
  recipeTitle: string
) {
  // Only send in production
  if (process.env.NODE_ENV !== 'production') {
    console.log(
      `[DEV] Tier upgrade email skipped: ${displayName} → ${newTier}`
    );
    return;
  }

  const tierInfo = TIER_CONFIG[newTier];

  const perks: Record<RewardTier, string[]> = {
    starter: ['Profile badge', 'Google-indexed recipe pages'],
    hot_chef: [
      'Homepage feature rotation',
      'Swipe deck priority',
      'Recipe analytics dashboard',
    ],
    star_creator: [
      'ForkIt social shoutout',
      'Verified badge on profile',
      'Homepage spotlight',
    ],
    legend: [
      'Brand intro referrals',
      'Press opportunities',
      'Dedicated creator page',
    ],
  };

  const perksList = perks[newTier]
    .map((p) => `<li style="margin-bottom: 6px;">${p}</li>`)
    .join('');

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0; padding:0; background-color:#0f0d0a; font-family:'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0d0a; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="500" cellpadding="0" cellspacing="0" style="background-color:#1a1710; border-radius:16px; padding:40px; border:1px solid rgba(255,255,255,0.07);">
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <span style="font-size:48px;">${tierInfo.emoji}</span>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:16px;">
              <h1 style="margin:0; color:#f5f0e8; font-size:24px; font-weight:700;">
                Congratulations, ${displayName}!
              </h1>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <p style="margin:0; color:rgba(245,240,232,0.65); font-size:16px; line-height:1.5;">
                Your recipe <strong style="color:#f97316;">"${recipeTitle}"</strong> just earned you a promotion!
                <br/>You've reached <strong style="color:${tierInfo.color};">${tierInfo.emoji} ${tierInfo.label}</strong> tier.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:24px;">
              <p style="margin:0 0 8px 0; color:#f5f0e8; font-size:14px; font-weight:600;">Your new perks:</p>
              <ul style="margin:0; padding-left:20px; color:rgba(245,240,232,0.65); font-size:14px; line-height:1.6;">
                ${perksList}
              </ul>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:16px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL ?? 'https://forkit.app'}/profile" 
                 style="display:inline-block; background:linear-gradient(135deg,#f97316,#ef4444); color:white; text-decoration:none; padding:12px 32px; border-radius:100px; font-size:14px; font-weight:600;">
                View Your Profile →
              </a>
            </td>
          </tr>
          <tr>
            <td align="center">
              <p style="margin:0; color:rgba(245,240,232,0.35); font-size:12px;">
                Fork<span style="color:#f97316;">It</span> — Cook. Swipe. Conquer.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    await getResend().emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'ForkIt <noreply@forkit.app>',
      to: toEmail,
      subject: `${tierInfo.emoji} You've reached ${tierInfo.label} on ForkIt!`,
      html,
    });
  } catch (error) {
    console.error('Failed to send tier upgrade email:', error);
  }
}

/**
 * ReferralBar Component
 *
 * Dynamic announcement bar that displays:
 * - Personalized referral message when customer arrives via SafeLink
 * - Default promo message when no referral is present
 */

'use client';

import { useReferral } from '@/context/ReferralContext';

export function ReferralBar() {
  const { hasReferral, referrerName, discountAmount, minimumOrder, discountCode } = useReferral();

  // Show referral message if there's a referral
  if (hasReferral && referrerName) {
    return (
      <div className="bg-meatzy-dill text-white text-center py-2.5 text-xs md:text-sm font-display font-bold uppercase tracking-widest relative z-[60] flex justify-center items-center gap-2">
        <span className="inline-flex items-center gap-2">
          <span className="text-base">🎁</span>
          <span>
            {referrerName} sent you ${discountAmount} off orders over ${minimumOrder}!
          </span>
          {discountCode && (
            <span className="hidden md:inline bg-white/20 px-2 py-1 rounded font-mono text-xs">
              Code: {discountCode}
            </span>
          )}
          <span className="hidden sm:inline">Applies automatically at checkout.</span>
        </span>
      </div>
    );
  }

  // Show default promo message when no referral
  return (
    <div className="bg-meatzy-welldone text-meatzy-tallow text-center py-2.5 text-xs md:text-sm font-display font-bold uppercase tracking-widest relative z-[60] flex justify-center items-center gap-2">
      <span>HUNGRY FOR MORE? GET FIRST DIBS ON DEALS AND DROPS.</span>
    </div>
  );
}

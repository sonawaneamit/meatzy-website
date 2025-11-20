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
      <>
        <div className="bg-meatzy-dill text-white text-center py-2.5 text-xs md:text-sm font-display font-bold uppercase tracking-widest flex justify-center items-center gap-2 animate-slideDown animate-gentleShake">
          <span className="inline-flex items-center gap-2">
            <span className="text-base animate-pulse">🎁</span>
            <span>
              You have ${discountAmount} off from {referrerName}!
            </span>
          </span>
        </div>

        <style jsx global>{`
          @keyframes slideDown {
            from {
              transform: translateY(-100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }

          @keyframes gentleShake {
            0%, 100% {
              transform: translateY(0);
            }
            10%, 30%, 50%, 70%, 90% {
              transform: translateY(-1px);
            }
            20%, 40%, 60%, 80% {
              transform: translateY(1px);
            }
          }

          .animate-slideDown {
            animation: slideDown 0.5s ease-out;
          }

          .animate-gentleShake {
            animation: gentleShake 0.8s ease-in-out 2s 3;
          }
        `}</style>
      </>
    );
  }

  // Show default promo message when no referral
  return (
    <div className="bg-meatzy-welldone text-meatzy-tallow text-center py-2.5 text-xs md:text-sm font-display font-bold uppercase tracking-widest flex justify-center items-center gap-2">
      <span>HUNGRY FOR MORE? GET FIRST DIBS ON DEALS AND DROPS.</span>
    </div>
  );
}

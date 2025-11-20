import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const REFERRAL_CODE_KEY = 'meatzy_referral_code';

/**
 * Hook to capture and store referral codes from URL
 * Usage: Call this in your root layout or main page component
 */
export function useReferralTracking() {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for ?ref=CODE in URL
    const refCode = searchParams?.get('ref');

    if (refCode) {
      // Check if we've already processed this code in this session
      const processedKey = 'meatzy_ref_processed';
      const lastProcessed = sessionStorage.getItem(processedKey);

      const upperCode = refCode.toUpperCase();

      // Skip if we just processed this same code
      if (lastProcessed === upperCode) {
        console.log('Referral code already processed:', upperCode);
        return;
      }

      // Store in localStorage for later use during checkout/signup
      localStorage.setItem(REFERRAL_CODE_KEY, upperCode);
      console.log('Referral code captured:', upperCode);

      // Mark as processed before the API call
      sessionStorage.setItem(processedKey, upperCode);

      // Also update the HTTPOnly cookie via API (overwrites existing referral)
      fetch('/api/referral/set-from-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referralCode: upperCode })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            console.log('Referral cookie updated for:', data.referrerName);

            // Remove ?ref= from URL and reload to update ReferralBar
            const url = new URL(window.location.href);
            url.searchParams.delete('ref');
            window.location.href = url.toString();
          }
        })
        .catch(err => {
          console.error('Failed to set referral cookie:', err);
          // Clear processed flag on error so it can retry
          sessionStorage.removeItem(processedKey);
        });
    }
  }, [searchParams]);
}

/**
 * Get the stored referral code
 */
export function getReferralCode(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFERRAL_CODE_KEY);
}

/**
 * Clear the referral code (after use)
 */
export function clearReferralCode(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(REFERRAL_CODE_KEY);
}

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
      // Store in localStorage for later use during checkout/signup
      localStorage.setItem(REFERRAL_CODE_KEY, refCode.toUpperCase());
      console.log('Referral code captured:', refCode);
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

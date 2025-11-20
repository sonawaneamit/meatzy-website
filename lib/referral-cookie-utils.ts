/**
 * Server-side utility for parsing referral cookies
 * Can be used in Server Components and API routes
 */

import type { ReferralContextType } from '@/context/ReferralContext';

/**
 * Helper function to parse referral cookie data
 * Used in layout.tsx to read cookie server-side
 */
export function parseReferralCookie(cookieValue: string | undefined): ReferralContextType {
  if (!cookieValue) {
    return {
      hasReferral: false,
      referrerName: null,
      affiliateId: null,
      slug: null,
      discountCode: null,
      discountAmount: 20,
      minimumOrder: 50
    };
  }

  try {
    const data = JSON.parse(cookieValue);

    return {
      hasReferral: true,
      referrerName: data.referrerName || null,
      affiliateId: data.affiliateId || null,
      slug: data.slug || null,
      discountCode: data.discountCode || null,
      discountAmount: 20,
      minimumOrder: 50
    };
  } catch (error) {
    console.error('Failed to parse referral cookie:', error);
    return {
      hasReferral: false,
      referrerName: null,
      affiliateId: null,
      slug: null,
      discountCode: null,
      discountAmount: 20,
      minimumOrder: 50
    };
  }
}

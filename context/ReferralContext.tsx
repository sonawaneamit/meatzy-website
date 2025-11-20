/**
 * ReferralContext Provider
 *
 * Provides referral state to all components via React Context
 * Data is read from the secure HTTPOnly cookie on the server-side
 * and passed to the client
 */

'use client';

import { createContext, useContext, ReactNode } from 'react';

export type ReferralContextType = {
  hasReferral: boolean;
  referrerName: string | null;
  affiliateId: string | null;
  slug: string | null;
  discountCode: string | null;
  discountAmount: number;
  minimumOrder: number;
};

const ReferralContext = createContext<ReferralContextType>({
  hasReferral: false,
  referrerName: null,
  affiliateId: null,
  slug: null,
  discountCode: null,
  discountAmount: 20,
  minimumOrder: 50
});

export function ReferralProvider({
  children,
  initialData
}: {
  children: ReactNode;
  initialData: ReferralContextType;
}) {
  return (
    <ReferralContext.Provider value={initialData}>
      {children}
    </ReferralContext.Provider>
  );
}

/**
 * Hook to access referral context
 * Usage:
 *   const { hasReferral, referrerName, discountAmount } = useReferral();
 */
export const useReferral = () => useContext(ReferralContext);

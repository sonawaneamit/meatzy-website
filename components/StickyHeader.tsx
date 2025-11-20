'use client';

import { useReferral } from '@/context/ReferralContext';
import { ReferralBar } from './ReferralBar';
import { Navbar } from './Navbar';

export function StickyHeader() {
  const { hasReferral } = useReferral();

  // If there's a referral, wrap both in sticky container
  if (hasReferral) {
    return (
      <div className="sticky top-0 z-[70]">
        <ReferralBar />
        <Navbar />
      </div>
    );
  }

  // Otherwise, render normally (promo bar scrolls away)
  return (
    <>
      <ReferralBar />
      <div className="sticky top-0 z-[70]">
        <Navbar />
      </div>
    </>
  );
}

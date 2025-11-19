'use client';

import React, { Suspense } from 'react';
import { CartProvider } from '../context/CartContext';
import { ReferralTracker } from '../components/ReferralTracker';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Suspense fallback={null}>
        <ReferralTracker />
      </Suspense>
      {children}
    </CartProvider>
  );
}
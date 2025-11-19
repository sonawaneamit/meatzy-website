'use client';

import React from 'react';
import { CartProvider } from '../context/CartContext';
import { ReferralTracker } from '../components/ReferralTracker';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <ReferralTracker />
      {children}
    </CartProvider>
  );
}
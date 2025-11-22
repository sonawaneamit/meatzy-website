import React from 'react';
import type { Metadata } from 'next';
import { Inter, Oswald, Merriweather, Permanent_Marker } from 'next/font/google';
import { cookies } from 'next/headers';
import { Footer } from '../components/Footer';
import { StickyHeader } from '../components/StickyHeader';
import { Providers } from './providers';
import { ReferralProvider } from '../context/ReferralContext';
import { CartDrawerProvider } from '../context/CartDrawerContext';
import { CalculatorProvider } from '../context/CalculatorContext';
import { EarningsCalculator } from '../components/EarningsCalculator';
import { parseReferralCookie } from '../lib/referral-cookie-utils';
import { ReferralWelcomePopup } from '../components/ReferralWelcomePopup';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald' });
const merriweather = Merriweather({ weight: ['300', '400', '700', '900'], subsets: ['latin'], variable: '--font-merriweather' });
const permanentMarker = Permanent_Marker({ weight: '400', subsets: ['latin'], variable: '--font-marker' });

export const metadata: Metadata = {
  title: 'Meatzy | Luxury Resort Quality Meat, Delivered.',
  description: 'Premium meat subscription boxes sourcing the same cuts as luxury resorts.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Read referral cookie server-side
  const cookieStore = await cookies();
  const referralCookie = cookieStore.get('meatzy_ref');

  // Debug: Log cookie value on server
  console.log('[Layout] Raw referral cookie:', referralCookie?.value ? 'Present' : 'Not found');
  if (referralCookie?.value) {
    try {
      const parsed = JSON.parse(referralCookie.value);
      console.log('[Layout] Parsed cookie data:', {
        referrerName: parsed.referrerName,
        slug: parsed.slug,
        hasAffiliateId: !!parsed.affiliateId
      });
    } catch (e) {
      console.log('[Layout] Failed to parse cookie:', e);
    }
  }

  const referralData = parseReferralCookie(referralCookie?.value);
  console.log('[Layout] Final referralData:', { hasReferral: referralData.hasReferral, referrerName: referralData.referrerName });

  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${oswald.variable} ${merriweather.variable} ${permanentMarker.variable} bg-meatzy-tallow text-meatzy-olive antialiased font-sans`}
        suppressHydrationWarning
      >
        <ReferralProvider initialData={referralData}>
          <Providers>
            <CartDrawerProvider>
              <CalculatorProvider>
                <ReferralWelcomePopup />
                <StickyHeader />
                <main className="pt-20">
                  {children}
                </main>
                <Footer />
                <EarningsCalculator />
              </CalculatorProvider>
            </CartDrawerProvider>
          </Providers>
        </ReferralProvider>
      </body>
    </html>
  );
}
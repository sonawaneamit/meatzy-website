import React from 'react';
import type { Metadata } from 'next';
import { Inter, Oswald, Merriweather, Permanent_Marker } from 'next/font/google';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald' });
const merriweather = Merriweather({ weight: ['300', '400', '700', '900'], subsets: ['latin'], variable: '--font-merriweather' });
const permanentMarker = Permanent_Marker({ weight: '400', subsets: ['latin'], variable: '--font-marker' });

export const metadata: Metadata = {
  title: 'Meatzy | Luxury Resort Quality Meat, Delivered.',
  description: 'Premium meat subscription boxes sourcing the same cuts as luxury resorts.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${oswald.variable} ${merriweather.variable} ${permanentMarker.variable} bg-meatzy-tallow text-meatzy-olive antialiased font-sans`}
        suppressHydrationWarning
      >
        <Providers>
          <Navbar />
          <main className="pt-[140px]">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
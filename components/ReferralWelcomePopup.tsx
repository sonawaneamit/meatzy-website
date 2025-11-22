/**
 * ReferralWelcomePopup Component
 *
 * Shows a celebratory popup with confetti when a visitor
 * arrives via a referral SafeLink for the first time.
 * Once dismissed, the sticky ReferralBar takes over.
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { useReferral } from '@/context/ReferralContext';
import confetti from 'canvas-confetti';
import { X, Gift } from 'lucide-react';

// Meatzy brand colors for confetti
const MEATZY_COLORS = [
  '#DE2626', // rare (Bright Red)
  '#C5A059', // gold
  '#847B56', // dill
  '#701919', // welldone (Dark Red)
  '#FFECDC', // tallow (Cream)
];

export function ReferralWelcomePopup() {
  const { hasReferral, referrerName, discountAmount, discountCode, slug } = useReferral();
  const [showPopup, setShowPopup] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    // Debug logging
    console.log('ReferralWelcomePopup - hasReferral:', hasReferral, 'referrerName:', referrerName, 'slug:', slug);

    // Wait for referral data to be available
    if (!hasReferral || !referrerName) {
      console.log('ReferralWelcomePopup - No referral data yet');
      return;
    }

    // Only trigger once - use ref to persist across re-renders
    if (hasTriggeredRef.current) {
      console.log('ReferralWelcomePopup - Already triggered, skipping');
      return;
    }
    hasTriggeredRef.current = true;

    // Check if we've already shown the popup for THIS specific referrer
    // This allows showing popup again if user visits via different SafeLink
    const shownForSlug = localStorage.getItem('meatzy_referral_popup_slug');
    const currentSlug = slug || referrerName; // Use slug or fallback to referrerName

    console.log('ReferralWelcomePopup - shownForSlug:', shownForSlug, 'currentSlug:', currentSlug);

    if (shownForSlug === currentSlug) {
      console.log('ReferralWelcomePopup - Already shown for this referrer');
      return;
    }

    // Mark as shown for this specific referrer
    localStorage.setItem('meatzy_referral_popup_slug', currentSlug);

    console.log('ReferralWelcomePopup - Will show popup in 500ms');

    // Small delay to let the page load, then show popup
    // Don't return cleanup - we want the timer to fire even if effect re-runs
    setTimeout(() => {
      console.log('ReferralWelcomePopup - Setting showPopup to true NOW');
      setShowPopup(true);
      // Fire confetti!
      fireConfetti();
    }, 500);
  }, [hasReferral, referrerName, slug]);

  const fireConfetti = () => {
    // Initial burst from both sides
    const duration = 3000;
    const end = Date.now() + duration;

    // Common options - z-index higher than popup (9999)
    const baseOptions = {
      colors: MEATZY_COLORS,
      zIndex: 10000,
    };

    // Left side burst
    confetti({
      ...baseOptions,
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
    });

    // Right side burst
    confetti({
      ...baseOptions,
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
    });

    // Continuous rain effect
    const interval = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(interval);
        return;
      }

      confetti({
        ...baseOptions,
        particleCount: 3,
        angle: 90,
        spread: 180,
        origin: { x: Math.random(), y: -0.1 },
        gravity: 0.8,
        scalar: 1.2,
      });
    }, 100);
  };

  const handleClose = () => {
    setIsClosing(true);
    // Wait for animation to complete
    setTimeout(() => {
      setShowPopup(false);
      setIsClosing(false);
    }, 300);
  };

  if (!showPopup) return null;

  console.log('ReferralWelcomePopup - RENDERING POPUP NOW, showPopup:', showPopup);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ zIndex: 9999 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-meatzy-olive/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Popup Card */}
      <div
        className={`relative bg-meatzy-tallow rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all duration-300 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
        style={{
          animation: isClosing ? 'none' : 'popIn 0.4s ease-out'
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-meatzy-olive/60 hover:text-meatzy-olive transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header Banner */}
        <div className="bg-gradient-to-r from-meatzy-welldone to-meatzy-rare text-white py-4 px-6 text-center">
          <div className="flex items-center justify-center gap-2">
            <Gift className="w-6 h-6 animate-bounce" />
            <span className="font-display font-bold uppercase tracking-widest text-sm">
              Special Gift For You
            </span>
            <Gift className="w-6 h-6 animate-bounce" />
          </div>
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Referrer Name */}
          <p className="text-meatzy-rare text-sm font-bold uppercase tracking-wider mb-2">
            {referrerName} sent you
          </p>

          {/* Main Message */}
          <h2 className="text-4xl md:text-5xl font-black font-slab text-meatzy-rare uppercase mb-4">
            ${discountAmount} OFF
          </h2>

          {/* Sub Message */}
          <p className="text-meatzy-olive mb-6">
            Premium grass-fed American meat, delivered to your door.
          </p>

          {/* Discount Code Display */}
          {discountCode && (
            <div className="bg-meatzy-marbling/30 border-2 border-dashed border-meatzy-rare/40 rounded-lg p-4 mb-6">
              <p className="text-xs text-meatzy-olive uppercase tracking-wider mb-1">
                Your exclusive code
              </p>
              <p className="font-mono font-bold text-lg text-meatzy-welldone">
                {discountCode}
              </p>
              <p className="text-xs text-meatzy-rosemary mt-1">
                Applied automatically at checkout
              </p>
            </div>
          )}

          {/* CTA Button */}
          <button
            onClick={handleClose}
            className="w-full bg-meatzy-rare hover:bg-meatzy-welldone text-white py-4 px-8 font-display font-bold uppercase tracking-widest text-lg rounded-lg transition-colors shadow-lg hover:shadow-xl"
          >
            Start Shopping
          </button>

          {/* Fine Print */}
          <p className="text-xs text-meatzy-mint mt-4">
            $50 minimum order required
          </p>
        </div>
      </div>
    </div>
  );
}

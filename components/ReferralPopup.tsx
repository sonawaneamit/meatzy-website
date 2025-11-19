'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface ReferralPopupProps {
  referrerName?: string;
  referralCode?: string;
}

/**
 * Referral Popup Component
 *
 * Shows a popup when someone arrives via a referral link
 * Similar to Social Snowball's "Noah Tucker sent you 10% off!" popup
 *
 * Usage: Add to your layout or homepage
 */
export default function ReferralPopup({ referrerName, referralCode }: ReferralPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [referrer, setReferrer] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    // Check if there's a referral code in URL or props
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get('ref') || referralCode;

    if (refCode) {
      setCode(refCode);

      // Fetch referrer information
      if (referrerName) {
        setReferrer(referrerName);
        setIsVisible(true);
      } else {
        // Try to fetch referrer name from API
        fetchReferrerInfo(refCode);
      }

      // Store in session storage to show even after page refresh
      sessionStorage.setItem('meatzy_referral_code', refCode);
      if (referrerName) {
        sessionStorage.setItem('meatzy_referrer_name', referrerName);
      }
    } else {
      // Check session storage
      const storedCode = sessionStorage.getItem('meatzy_referral_code');
      const storedName = sessionStorage.getItem('meatzy_referrer_name');

      if (storedCode && storedName) {
        setCode(storedCode);
        setReferrer(storedName);
        setIsVisible(true);
      }
    }
  }, [referralCode, referrerName]);

  async function fetchReferrerInfo(code: string) {
    try {
      const response = await fetch(`/api/get-referrer-info?code=${code}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setReferrer(data.fullName || 'A friend');
          setIsVisible(true);
          sessionStorage.setItem('meatzy_referrer_name', data.fullName);
        }
      }
    } catch (error) {
      console.error('Error fetching referrer info:', error);
      // Show popup anyway with generic message
      setReferrer('A friend');
      setIsVisible(true);
    }
  }

  function handleClose() {
    setIsVisible(false);
  }

  if (!isVisible || !code) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 relative animate-slideUp">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Icon */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-meatzy-rare to-meatzy-welldone rounded-full mb-4">
            <span className="text-4xl">🥩</span>
          </div>

          {/* Message */}
          <h2 className="text-3xl font-black font-slab text-meatzy-olive uppercase mb-2">
            {referrer} Sent You
          </h2>
          <p className="text-xl font-bold text-meatzy-rare mb-4">
            Premium American Meat!
          </p>

          <p className="text-gray-600 mb-6">
            Use code <span className="font-black text-meatzy-olive">{code}</span> at checkout
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => {
              // Scroll to products or navigate to shop
              handleClose();
              document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full bg-meatzy-rare text-white py-4 px-6 rounded-lg font-display font-bold uppercase tracking-widest hover:bg-meatzy-welldone transition-colors"
          >
            Shop Now
          </button>

          <button
            onClick={handleClose}
            className="w-full text-gray-600 py-2 text-sm hover:text-gray-800 transition-colors"
          >
            I'll browse first
          </button>
        </div>

        {/* Info */}
        <p className="text-xs text-center text-gray-500 mt-6">
          When you order, you'll get your own referral code too!
        </p>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}

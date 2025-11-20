'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, DollarSign, Users, ShoppingCart, TrendingUp, Calendar } from 'lucide-react';
import { useCalculator } from '@/context/CalculatorContext';
import { useAuth } from '@/hooks/useAuth';
import { Slider } from '@/components/ui/Slider';

export function EarningsCalculator() {
  const {
    isExpanded,
    setIsExpanded,
    referrals,
    setReferrals,
    avgOrderValue,
    setAvgOrderValue,
    growthRate,
    setGrowthRate,
    timePeriod,
    setTimePeriod,
    earnings,
  } = useCalculator();

  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [showAnimation, setShowAnimation] = useState(false);

  // Show calculator with animation after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Hide from logged-in users
  if (loading || isLoggedIn) {
    return null;
  }

  // Don't show until animation timer fires
  if (!showAnimation) {
    return null;
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Store email in localStorage
    localStorage.setItem('meatzy_signup_email', email);

    // Redirect to signup with email param
    router.push(`/signup?email=${encodeURIComponent(email)}`);
  };

  const formatMoney = (value: number) => `$${Math.round(value).toLocaleString()}`;
  const formatGrowth = (value: number) => `${value}x`;

  return (
    <>
      {/* Backdrop */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[89] animate-fadeIn"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Desktop: Floating Widget */}
      <div className="hidden md:block">
        {!isExpanded ? (
          // Collapsed State
          <button
            onClick={() => setIsExpanded(true)}
            className="fixed bottom-6 right-6 z-[90] bg-gradient-to-r from-meatzy-rare to-meatzy-welldone text-white px-6 py-4 rounded-full shadow-2xl font-display font-bold uppercase tracking-wide hover:scale-105 transition-transform flex items-center gap-2 animate-slideInUp animate-pulse"
          >
            <DollarSign className="w-5 h-5" />
            <span className="whitespace-nowrap">Calculate Your Earnings</span>
          </button>
        ) : (
          // Expanded State
          <div className="fixed bottom-6 right-6 z-[90] w-[440px] bg-white rounded-2xl shadow-2xl border-2 border-meatzy-mint animate-slideUp max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-meatzy-olive to-meatzy-rosemary text-white p-6 rounded-t-2xl relative">
              <h3 className="text-xl font-black font-slab pr-8">
                Your Affiliate Earnings Potential
              </h3>
              <p className="text-sm text-white/80 mt-1">
                See how much you can earn with Meatzy
              </p>
              <button
                onClick={() => setIsExpanded(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Calculator Inputs */}
            <div className="p-6 space-y-6">
              <Slider
                label="Referrals"
                value={referrals}
                min={1}
                max={50}
                step={1}
                onChange={setReferrals}
                icon={<Users className="w-4 h-4" />}
              />

              <Slider
                label="Avg Order"
                value={avgOrderValue}
                min={50}
                max={300}
                step={10}
                onChange={setAvgOrderValue}
                formatValue={(v) => `$${v}`}
                icon={<ShoppingCart className="w-4 h-4" />}
              />

              <Slider
                label="Growth Rate"
                value={growthRate}
                min={0}
                max={5}
                step={0.5}
                onChange={setGrowthRate}
                formatValue={formatGrowth}
                icon={<TrendingUp className="w-4 h-4" />}
              />

              {/* Time Period Toggle */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-meatzy-rare" />
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                    Time Period
                  </label>
                </div>
                <div className="flex gap-2">
                  {(['weekly', 'monthly', 'yearly'] as const).map((period) => (
                    <button
                      key={period}
                      onClick={() => setTimePeriod(period)}
                      className={`flex-1 py-2 px-4 rounded-lg font-bold uppercase text-xs transition-colors ${
                        timePeriod === period
                          ? 'bg-meatzy-rare text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Earnings Breakdown */}
            <div className="bg-meatzy-tallow p-6 space-y-3">
              <h4 className="text-sm font-black text-gray-600 uppercase tracking-wider mb-4">
                Potential Earnings
              </h4>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    <span className="font-bold text-meatzy-olive">Tier 1</span> (Direct · 13%)
                  </span>
                  <span className="text-lg font-black text-meatzy-olive">
                    {formatMoney(earnings.tier1)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    <span className="font-bold text-meatzy-olive">Tier 2</span> (2nd Level · 2%)
                  </span>
                  <span className="text-lg font-black text-meatzy-olive">
                    {formatMoney(earnings.tier2)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    <span className="font-bold text-meatzy-olive">Tier 3</span> (3rd Level · 1%)
                  </span>
                  <span className="text-lg font-black text-meatzy-olive">
                    {formatMoney(earnings.tier3)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    <span className="font-bold text-meatzy-olive">Tier 4</span> (4th Level · 1%)
                  </span>
                  <span className="text-lg font-black text-meatzy-olive">
                    {formatMoney(earnings.tier4)}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-300 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-base font-black text-gray-700 uppercase">
                    Total {timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)}
                  </span>
                  <span className="text-3xl font-black text-meatzy-rare">
                    {formatMoney(earnings.total)}
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-500 italic mt-4">
                * Based on 4-tier commission structure. Assumes first-time customer purchases only.
                Actual earnings may vary.
              </p>
            </div>

            {/* Email Capture Form */}
            <form onSubmit={handleEmailSubmit} className="p-6 border-t border-meatzy-mint">
              <h4 className="text-base font-black text-meatzy-olive mb-3 uppercase">
                Ready to Start Earning?
              </h4>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-meatzy-rare focus:outline-none text-gray-800 mb-3"
              />
              <button
                type="submit"
                className="w-full bg-meatzy-rare text-white py-4 rounded-lg font-display font-bold uppercase tracking-wider hover:bg-meatzy-welldone transition-colors flex items-center justify-center gap-2"
              >
                Start Earning Now
                <span>→</span>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile: Bottom Drawer */}
      <div className="md:hidden">
        {!isExpanded ? (
          // Collapsed State (Mobile)
          <button
            onClick={() => setIsExpanded(true)}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[90] bg-gradient-to-r from-meatzy-rare to-meatzy-welldone text-white px-6 py-3 rounded-full shadow-2xl font-display font-bold uppercase tracking-wide text-sm flex items-center gap-2 animate-slideInUp animate-pulse"
          >
            <DollarSign className="w-4 h-4" />
            <span>Calculate Earnings</span>
          </button>
        ) : (
          // Expanded State (Mobile Drawer)
          <div className="fixed inset-x-0 bottom-0 z-[90] bg-white rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto animate-slideUpMobile">
            {/* Drag Handle */}
            <div className="pt-3 pb-2 flex justify-center">
              <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
            </div>

            {/* Header */}
            <div className="bg-gradient-to-r from-meatzy-olive to-meatzy-rosemary text-white p-5 relative">
              <h3 className="text-lg font-black font-slab pr-8">
                Your Earnings Potential
              </h3>
              <p className="text-xs text-white/80 mt-1">
                See how much you can earn
              </p>
              <button
                onClick={() => setIsExpanded(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Calculator Inputs */}
            <div className="p-5 space-y-5">
              <Slider
                label="Referrals"
                value={referrals}
                min={1}
                max={50}
                step={1}
                onChange={setReferrals}
                icon={<Users className="w-4 h-4" />}
              />

              <Slider
                label="Avg Order"
                value={avgOrderValue}
                min={50}
                max={300}
                step={10}
                onChange={setAvgOrderValue}
                formatValue={(v) => `$${v}`}
                icon={<ShoppingCart className="w-4 h-4" />}
              />

              <Slider
                label="Growth Rate"
                value={growthRate}
                min={0}
                max={5}
                step={0.5}
                onChange={setGrowthRate}
                formatValue={formatGrowth}
                icon={<TrendingUp className="w-4 h-4" />}
              />

              {/* Time Period Toggle */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-meatzy-rare" />
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                    Period
                  </label>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['weekly', 'monthly', 'yearly'] as const).map((period) => (
                    <button
                      key={period}
                      onClick={() => setTimePeriod(period)}
                      className={`py-2 px-3 rounded-lg font-bold uppercase text-xs transition-colors ${
                        timePeriod === period
                          ? 'bg-meatzy-rare text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Earnings Breakdown */}
            <div className="bg-meatzy-tallow p-5 space-y-3">
              <h4 className="text-xs font-black text-gray-600 uppercase tracking-wider mb-3">
                Potential Earnings
              </h4>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">
                    <span className="font-bold text-meatzy-olive">Tier 1</span> (13%)
                  </span>
                  <span className="text-base font-black text-meatzy-olive">
                    {formatMoney(earnings.tier1)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">
                    <span className="font-bold text-meatzy-olive">Tier 2</span> (2%)
                  </span>
                  <span className="text-base font-black text-meatzy-olive">
                    {formatMoney(earnings.tier2)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">
                    <span className="font-bold text-meatzy-olive">Tier 3</span> (1%)
                  </span>
                  <span className="text-base font-black text-meatzy-olive">
                    {formatMoney(earnings.tier3)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">
                    <span className="font-bold text-meatzy-olive">Tier 4</span> (1%)
                  </span>
                  <span className="text-base font-black text-meatzy-olive">
                    {formatMoney(earnings.tier4)}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-300 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-black text-gray-700 uppercase">
                    Total {timePeriod}
                  </span>
                  <span className="text-2xl font-black text-meatzy-rare">
                    {formatMoney(earnings.total)}
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-500 italic mt-3">
                * Based on 4-tier structure. Actual earnings may vary.
              </p>
            </div>

            {/* Email Capture Form */}
            <form onSubmit={handleEmailSubmit} className="p-5 border-t border-meatzy-mint">
              <h4 className="text-sm font-black text-meatzy-olive mb-2 uppercase">
                Start Earning Now
              </h4>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-meatzy-rare focus:outline-none text-gray-800 mb-3 text-base"
              />
              <button
                type="submit"
                className="w-full bg-meatzy-rare text-white py-4 rounded-lg font-display font-bold uppercase tracking-wider hover:bg-meatzy-welldone transition-colors flex items-center justify-center gap-2"
              >
                Get Started
                <span>→</span>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slideUpMobile {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideInUp {
          animation: slideInUp 0.5s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        .animate-slideUpMobile {
          animation: slideUpMobile 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

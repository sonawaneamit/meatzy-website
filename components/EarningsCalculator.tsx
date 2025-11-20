'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Calculator, Users, ShoppingCart, TrendingUp, Calendar, HelpCircle } from 'lucide-react';
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
  const [showCalculator, setShowCalculator] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Show calculator after user scrolls 25% down the page
  useEffect(() => {
    const handleScroll = () => {
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

      // Show after 25% scroll
      if (scrollPercentage >= 25 && !showCalculator) {
        setShowCalculator(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showCalculator]);

  // Hide from logged-in users or before scroll threshold
  if (loading || isLoggedIn || !showCalculator) {
    return null;
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Store email in localStorage
    localStorage.setItem('meatzy_signup_email', email);

    // Close calculator
    setIsExpanded(false);

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
          // Collapsed State - White icon on red background, flips on hover
          <button
            onClick={() => setIsExpanded(true)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`fixed bottom-6 right-6 z-[90] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-slideInUp border ${
              isHovered
                ? 'bg-white text-meatzy-rare border-meatzy-rare'
                : 'bg-meatzy-rare text-white border-meatzy-rare'
            }`}
            style={{
              width: isHovered ? 'auto' : '56px',
              paddingLeft: isHovered ? '20px' : '16px',
              paddingRight: isHovered ? '20px' : '16px',
              paddingTop: '16px',
              paddingBottom: '16px',
            }}
          >
            <div className="flex items-center gap-2 whitespace-nowrap">
              <Calculator className="w-5 h-5 flex-shrink-0" />
              <span
                className="font-display font-bold uppercase tracking-wide text-sm overflow-hidden transition-all duration-300"
                style={{
                  width: isHovered ? 'auto' : '0',
                  opacity: isHovered ? 1 : 0,
                }}
              >
                Calculate Earnings
              </span>
            </div>
          </button>
        ) : (
          // Expanded State - Sleeker Design
          <div className="fixed bottom-6 right-6 z-[90] w-[400px] bg-white rounded-xl shadow-xl border border-gray-200 animate-slideUp max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-meatzy-olive to-meatzy-rosemary text-white px-5 py-4 rounded-t-xl relative">
              <h3 className="text-lg font-black font-slab pr-8">
                Earnings Calculator
              </h3>
              <p className="text-xs text-white/80 mt-0.5">
                See your earning potential
              </p>
              <button
                onClick={() => setIsExpanded(false)}
                className="absolute top-3 right-3 p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
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
                helpText="The number of people you directly invite to join Meatzy. You earn 13% commission on all their purchases."
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
                helpText="The typical value of each customer order. Our average order is $189, including meat boxes and add-ons."
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
                helpText="How many people each of your referrals brings in on average. This creates a multiplying network effect across 4 tiers."
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
            <div className="bg-meatzy-tallow/30 p-4 space-y-2.5">
              <h4 className="text-xs font-black text-gray-600 uppercase tracking-wider mb-3">
                Potential Earnings
              </h4>

              <div className="space-y-1.5">
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

              <div className="border-t border-gray-300 pt-2.5 mt-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-black text-gray-700 uppercase">
                    Total {timePeriod}
                  </span>
                  <span className="text-2xl font-black text-meatzy-rare">
                    {formatMoney(earnings.total)}
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-500 italic mt-3 leading-relaxed">
                * Based on 4-tier structure. Actual earnings may vary.
              </p>
            </div>

            {/* Email Capture Form */}
            <form onSubmit={handleEmailSubmit} className="p-5 border-t border-gray-200">
              <h4 className="text-sm font-black text-meatzy-olive mb-2 uppercase tracking-wide">
                Start Earning
              </h4>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-meatzy-rare focus:ring-1 focus:ring-meatzy-rare focus:outline-none text-sm mb-3"
              />
              <button
                type="submit"
                className="w-full bg-meatzy-rare text-white py-3 rounded-lg font-display font-bold uppercase tracking-wider text-sm hover:bg-meatzy-welldone transition-colors flex items-center justify-center gap-2"
              >
                Get Started
                <span>→</span>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile: Bottom Drawer */}
      <div className="md:hidden">
        {!isExpanded ? (
          // Collapsed State (Mobile) - White icon on red background
          <button
            onClick={() => setIsExpanded(true)}
            className="fixed bottom-4 right-4 z-[90] bg-meatzy-rare text-white p-4 rounded-full shadow-lg border border-meatzy-rare animate-slideInUp"
          >
            <Calculator className="w-5 h-5" />
          </button>
        ) : (
          // Expanded State (Mobile Drawer) - Sleeker
          <div className="fixed inset-x-0 bottom-0 z-[90] bg-white rounded-t-2xl shadow-xl border-t border-gray-200 max-h-[85vh] overflow-y-auto animate-slideUpMobile">
            {/* Drag Handle */}
            <div className="pt-2 pb-1 flex justify-center">
              <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
            </div>

            {/* Header */}
            <div className="bg-gradient-to-r from-meatzy-olive to-meatzy-rosemary text-white px-4 py-3 relative">
              <h3 className="text-base font-black font-slab pr-8">
                Earnings Calculator
              </h3>
              <p className="text-xs text-white/80 mt-0.5">
                See your potential
              </p>
              <button
                onClick={() => setIsExpanded(false)}
                className="absolute top-2 right-2 p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
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
                helpText="The number of people you directly invite to join Meatzy. You earn 13% commission on all their purchases."
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
                helpText="The typical value of each customer order. Our average order is $189, including meat boxes and add-ons."
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
                helpText="How many people each of your referrals brings in on average. This creates a multiplying network effect across 4 tiers."
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
            <div className="bg-meatzy-tallow/30 p-5 space-y-3">
              <h4 className="text-xs font-black text-gray-600 uppercase tracking-wider mb-3">
                Potential Earnings
              </h4>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">
                    <span className="font-bold text-meatzy-olive">Tier 1</span> (13%)
                  </span>
                  <span className="text-sm font-black text-meatzy-olive">
                    {formatMoney(earnings.tier1)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">
                    <span className="font-bold text-meatzy-olive">Tier 2</span> (2%)
                  </span>
                  <span className="text-sm font-black text-meatzy-olive">
                    {formatMoney(earnings.tier2)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">
                    <span className="font-bold text-meatzy-olive">Tier 3</span> (1%)
                  </span>
                  <span className="text-sm font-black text-meatzy-olive">
                    {formatMoney(earnings.tier3)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">
                    <span className="font-bold text-meatzy-olive">Tier 4</span> (1%)
                  </span>
                  <span className="text-sm font-black text-meatzy-olive">
                    {formatMoney(earnings.tier4)}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-300 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-gray-700 uppercase">
                    Total {timePeriod}
                  </span>
                  <span className="text-xl font-black text-meatzy-rare">
                    {formatMoney(earnings.total)}
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-500 italic mt-3 leading-relaxed">
                * Based on 4-tier structure. Actual may vary.
              </p>
            </div>

            {/* Email Capture Form */}
            <form onSubmit={handleEmailSubmit} className="p-5 border-t border-gray-200">
              <h4 className="text-sm font-black text-meatzy-olive mb-2 uppercase tracking-wide">
                Start Earning
              </h4>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-meatzy-rare focus:ring-1 focus:ring-meatzy-rare focus:outline-none text-sm mb-3"
              />
              <button
                type="submit"
                className="w-full bg-meatzy-rare text-white py-3 rounded-lg font-display font-bold uppercase tracking-wider text-sm hover:bg-meatzy-welldone transition-colors flex items-center justify-center gap-2"
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

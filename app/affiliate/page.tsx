import React from 'react';
import Link from 'next/link';
import { ArrowRight, Check, DollarSign, Users, TrendingUp, Share2 } from 'lucide-react';

export default function AffiliatePage() {
  return (
    <div className="min-h-screen bg-meatzy-tallow -mt-[140px]">

      {/* Hero Section */}
      <div className="relative bg-meatzy-olive text-white pt-56 pb-32 overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=2070&auto=format&fit=crop")',
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-black font-slab uppercase mb-6 leading-tight drop-shadow-lg">
              Earn Cash For Sharing
            </h1>
            <p className="text-2xl md:text-3xl mb-10 font-light drop-shadow-md">
              Turn Your Love for Great Food into Real Income
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-3 bg-meatzy-rare text-white px-8 py-4 font-display font-bold uppercase tracking-widest hover:bg-white hover:text-meatzy-rare transition-all shadow-xl text-lg"
            >
              Sign Up Today
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <span className="text-meatzy-rare font-marker text-3xl transform -rotate-2 mb-3 block">How It Works</span>
          <h2 className="text-4xl md:text-5xl font-black font-slab text-meatzy-olive uppercase mb-4">
            3 Easy Steps to Start Earning
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            At MEATZY, anyone can become an affiliate - no experience or following required.
            We built MEATZY to flip the system and pay real people, not algorithms. Every time you share MEATZY and someone orders, you get paid.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-meatzy-mint/30 relative">
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-meatzy-rare text-white rounded-full flex items-center justify-center text-2xl font-black font-slab">
              01
            </div>
            <h3 className="text-2xl font-black font-slab text-meatzy-olive uppercase mb-4 mt-4">
              Sign Up
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Once you join MEATZY, you'll receive your own <strong>referral link, QR code</strong>, and <strong>promo code</strong> to start sharing immediately.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-meatzy-mint/30 relative">
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-meatzy-rare text-white rounded-full flex items-center justify-center text-2xl font-black font-slab">
              02
            </div>
            <h3 className="text-2xl font-black font-slab text-meatzy-olive uppercase mb-4 mt-4">
              Share Everywhere
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Post your link on social media, send it to friends, or display your QR code on your menu, business card, or packaging - anywhere and everywhere!
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-meatzy-mint/30 relative">
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-meatzy-rare text-white rounded-full flex items-center justify-center text-2xl font-black font-slab">
              03
            </div>
            <h3 className="text-2xl font-black font-slab text-meatzy-olive uppercase mb-4 mt-4">
              Earn on Every Order
            </h3>
            <p className="text-gray-600 leading-relaxed">
              You'll earn cash every time someone you refer places an order - and even more when they refer others. The more you share, the more you earn.
            </p>
          </div>
        </div>
      </div>

      {/* 4-Tier System Section */}
      <div className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            {/* Left Side - Explanation */}
            <div>
              <h2 className="text-4xl md:text-5xl font-black font-slab text-meatzy-olive uppercase mb-6">
                The 4-Tier Referral System
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                MEATZY's affiliate program rewards you not only for <strong>your direct referrals</strong>, but also for the community you help build - up to <strong>four levels deep</strong>.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="bg-meatzy-rare/10 text-meatzy-rare rounded-full p-2 flex-shrink-0">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-meatzy-olive">Tier 1: 13% commission</div>
                    <div className="text-gray-600 text-sm">on your direct referrals</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-meatzy-rare/10 text-meatzy-rare rounded-full p-2 flex-shrink-0">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-meatzy-olive">Tier 2: 3% commission</div>
                    <div className="text-gray-600 text-sm">on their referrals</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-meatzy-rare/10 text-meatzy-rare rounded-full p-2 flex-shrink-0">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-meatzy-olive">Tier 3: 1% commission</div>
                    <div className="text-gray-600 text-sm">on the next level</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-meatzy-rare/10 text-meatzy-rare rounded-full p-2 flex-shrink-0">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-meatzy-olive">Tier 4: 1% commission</div>
                    <div className="text-gray-600 text-sm">on the deepest level</div>
                  </div>
                </div>
              </div>

              <div className="bg-meatzy-rare/5 border-l-4 border-meatzy-rare p-6 rounded">
                <p className="font-bold text-meatzy-olive mb-2">There's no cap on how much you can earn</p>
                <p className="text-gray-600 text-sm">
                  Your network can keep growing indefinitely. The bigger your network, the more passive income you generate every month.
                </p>
              </div>
            </div>

            {/* Right Side - Example Diagram */}
            <div className="bg-gradient-to-br from-meatzy-tallow to-white rounded-2xl p-8 border border-meatzy-mint/30">
              <h3 className="text-2xl font-black font-slab text-meatzy-olive uppercase mb-6 text-center">
                Here's An Example
              </h3>

              <div className="space-y-4">
                {/* Tier 1 */}
                <div className="flex items-center justify-between bg-white p-4 rounded-xl border-2 border-meatzy-rare">
                  <div className="flex items-center gap-3">
                    <div className="bg-meatzy-rare text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <div>
                      <div className="font-bold text-sm">You refer Sarah</div>
                      <div className="text-xs text-gray-500">(13%)</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-meatzy-rare font-black text-xl">$24.57</div>
                    <div className="text-xs text-gray-500">you earn</div>
                  </div>
                </div>

                {/* Tier 2 */}
                <div className="flex items-center justify-between bg-white p-4 rounded-xl border-2 border-meatzy-welldone ml-8">
                  <div className="flex items-center gap-3">
                    <div className="bg-meatzy-welldone text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <div>
                      <div className="font-bold text-sm">Sarah refers Marcus</div>
                      <div className="text-xs text-gray-500">(2%)</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-meatzy-welldone font-black text-xl">$3.78</div>
                    <div className="text-xs text-gray-500">you earn</div>
                  </div>
                </div>

                {/* Tier 2 Again */}
                <div className="flex items-center justify-between bg-white p-4 rounded-xl border-2 border-meatzy-welldone ml-16">
                  <div className="flex items-center gap-3">
                    <div className="bg-meatzy-welldone text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <div>
                      <div className="font-bold text-sm">Marcus refers Jennifer</div>
                      <div className="text-xs text-gray-500">(1%)</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-meatzy-welldone font-black text-xl">$1.89</div>
                    <div className="text-xs text-gray-500">you earn</div>
                  </div>
                </div>

                {/* Tier 2 Again */}
                <div className="flex items-center justify-between bg-white p-4 rounded-xl border-2 border-meatzy-olive ml-24">
                  <div className="flex items-center gap-3">
                    <div className="bg-meatzy-olive text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <div>
                      <div className="font-bold text-sm">Jennifer refers David</div>
                      <div className="text-xs text-gray-500">(1%)</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-meatzy-olive font-black text-xl">$1.89</div>
                    <div className="text-xs text-gray-500">you earn</div>
                  </div>
                </div>
              </div>

              {/* Total Earnings */}
              <div className="mt-6 bg-meatzy-olive text-white p-6 rounded-xl text-center">
                <div className="text-sm uppercase tracking-wider mb-2">What You Earn From This Chain Alone:</div>
                <div className="text-4xl font-black font-slab">$32.13</div>
                <div className="text-sm mt-1">per Month</div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 italic">
                  That's 17% of each $189 box, earned monthly from just one network 4 levels deep
                </p>
              </div>

              <div className="mt-6 text-center">
                <Link
                  href="/referral-policy"
                  className="inline-block text-meatzy-rare font-bold text-lg uppercase tracking-wide hover:underline border-b-2 border-meatzy-rare pb-1"
                >
                  Referral Program Guidelines
                </Link>
              </div>

              <div className="mt-6 bg-meatzy-rare/10 p-4 rounded-lg">
                <p className="text-sm font-bold text-meatzy-olive mb-2">What Others in This Chain Also Earn:</p>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>• Sarah earns</span>
                    <span className="font-bold">$30.24</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Marcus earns</span>
                    <span className="font-bold">$28.35</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Jennifer earns</span>
                    <span className="font-bold">$24.57</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3 italic">Everyone wins when the network grows</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Get Paid Section */}
      <div className="bg-meatzy-tallow py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black font-slab text-meatzy-olive uppercase mb-6">
            Get Paid Your Way
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            All payouts are made securely through <strong>PayPal</strong>, with no limits and no waiting for thresholds.
          </p>
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-meatzy-mint/30 max-w-2xl mx-auto">
            <p className="text-lg text-gray-700 leading-relaxed">
              Use your earnings to <strong>cover your next MEATZY box</strong>, or let it grow into a <strong>steady side hustle</strong> that pays you every month.
            </p>
          </div>
        </div>
      </div>

      {/* Why It Works Section */}
      <div className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-black font-slab text-meatzy-olive uppercase mb-12 text-center">
            Why It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-meatzy-rare/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-10 h-10 text-meatzy-rare" />
              </div>
              <h3 className="text-xl font-black font-slab text-meatzy-olive uppercase mb-3">
                Recurring Revenue
              </h3>
              <p className="text-gray-600">
                Earn every time your referrals order - not just once. Monthly subscriptions mean monthly income for you.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-meatzy-rare/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-meatzy-rare" />
              </div>
              <h3 className="text-xl font-black font-slab text-meatzy-olive uppercase mb-3">
                Build a Community
              </h3>
              <p className="text-gray-600">
                The 4-tier system rewards you for helping others succeed. Everyone wins when the network grows.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-meatzy-rare/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-10 h-10 text-meatzy-rare" />
              </div>
              <h3 className="text-xl font-black font-slab text-meatzy-olive uppercase mb-3">
                No Cap on Earnings
              </h3>
              <p className="text-gray-600">
                Your network can keep growing indefinitely. The more you share, the more passive income you generate.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-meatzy-rare to-meatzy-welldone text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black font-slab uppercase mb-6">
            Eat Well. Earn Well. Live Well.
          </h2>
          <p className="text-2xl mb-8 font-light">
            Join the movement. Share great food. Get paid.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-3 bg-white text-meatzy-rare px-8 py-4 font-display font-bold uppercase tracking-widest hover:bg-meatzy-tallow transition-colors text-lg"
          >
            Start Earning Today
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </div>

    </div>
  );
}

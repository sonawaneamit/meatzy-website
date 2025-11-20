'use client';

import React from 'react';
import { Check } from 'lucide-react';

export const ReferralProgram: React.FC = () => {
  return (
    <section id="referral" className="bg-meatzy-tallow py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <div>
            <span className="text-meatzy-rare font-marker text-2xl md:text-3xl mb-4 block transform -rotate-1">
              Love Great Meat?
            </span>
            <h2 className="text-4xl md:text-5xl font-black font-slab text-meatzy-olive mb-6 leading-tight uppercase">
              You Can Earn Real Cash Just By Sharing It
            </h2>
            <p className="text-lg text-meatzy-olive/80 mb-6 leading-relaxed">
              With our 4-tier referral tree, you get a commission not just from your referrals, but also from their networks - up to four levels deep.
            </p>
            
            <p className="text-meatzy-olive/80 mb-8 leading-relaxed">
              No matter who you are—a foodie, a fitness fanatic, a chef, or a parent trying to put top quality food on your family's plate—this is your chance to turn dinner into CASH.
            </p>

            <div className="space-y-3 mb-10">
                <div className="flex items-center gap-3">
                    <div className="bg-meatzy-rosemary rounded-full p-1"><Check className="w-4 h-4 text-white" /></div>
                    <span className="font-bold font-display text-meatzy-olive uppercase">No inventory</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-meatzy-rosemary rounded-full p-1"><Check className="w-4 h-4 text-white" /></div>
                    <span className="font-bold font-display text-meatzy-olive uppercase">Just great meat and real money</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-meatzy-rosemary rounded-full p-1"><Check className="w-4 h-4 text-white" /></div>
                    <span className="font-bold font-display text-meatzy-olive uppercase">No hidden fees</span>
                </div>
                 <div className="flex items-center gap-3">
                    <div className="bg-meatzy-rosemary rounded-full p-1"><Check className="w-4 h-4 text-white" /></div>
                    <span className="font-bold font-display text-meatzy-olive uppercase">No buy-ins</span>
                </div>
            </div>

            <button className="bg-meatzy-rare text-white px-10 py-4 font-display font-bold uppercase tracking-widest hover:bg-meatzy-welldone transition-colors shadow-lg w-full sm:w-auto">
              Sign Up Now
            </button>
            
            <p className="mt-4 text-xs text-gray-500 max-w-md leading-tight">
              Actual earnings may vary. Results depend on individual effort, referrals, and program participation. See our Referral Program Guidelines for full details.
            </p>
          </div>

          {/* Referral Flow Visualization */}
          <div className="bg-white rounded-none p-8 shadow-xl border-t-4 border-meatzy-rare">
            <div className="mb-6 border-b border-gray-100 pb-4">
                <h3 className="text-lg font-display font-bold text-meatzy-olive uppercase mb-1">Here's a real example:</h3>
                <p className="text-sm text-gray-500">Monthly passive income from just one active chain.</p>
            </div>

            {/* Referral Chain */}
            <div className="space-y-4 mb-6">
                {/* Tier 1 */}
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-meatzy-rare flex items-center justify-center text-white font-bold">
                                Y
                            </div>
                            <span className="text-gray-400">→</span>
                            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                                S
                            </div>
                        </div>
                        <span className="text-meatzy-olive font-medium">You refer Sarah</span>
                    </div>
                    <div className="text-meatzy-rare font-black text-xl">$24.57</div>
                </div>

                {/* Tier 2 */}
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                                S
                            </div>
                            <span className="text-gray-400">→</span>
                            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                                M
                            </div>
                        </div>
                        <span className="text-meatzy-olive font-medium">Sarah refers Marcus</span>
                    </div>
                    <div className="text-meatzy-rare font-black text-xl">$3.78</div>
                </div>

                {/* Tier 3 */}
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                                M
                            </div>
                            <span className="text-gray-400">→</span>
                            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                                J
                            </div>
                        </div>
                        <span className="text-meatzy-olive font-medium">Marcus refers Jennifer</span>
                    </div>
                    <div className="text-meatzy-rare font-black text-xl">$1.89</div>
                </div>

                {/* Tier 4 */}
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                                J
                            </div>
                            <span className="text-gray-400">→</span>
                            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold">
                                D
                            </div>
                        </div>
                        <span className="text-meatzy-olive font-medium">Jennifer refers David</span>
                    </div>
                    <div className="text-meatzy-rare font-black text-xl">$1.89</div>
                </div>
            </div>

            {/* Total Earnings */}
            <div className="bg-meatzy-rare p-6 rounded-lg text-white">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                        <p className="text-sm font-bold uppercase mb-1">What YOU earn from this chain:</p>
                        <p className="text-xs opacity-90">That's 17% of each $189 box, earned monthly from your network 4 levels deep.</p>
                    </div>
                    <div className="text-center sm:text-right">
                        <div className="text-5xl font-black font-slab">$32.13</div>
                        <span className="text-sm uppercase tracking-widest">per month</span>
                    </div>
                </div>
            </div>

            {/* Others Earn Too */}
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-bold text-meatzy-olive mb-3">What others in this chain also earn:</p>
                <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">S</div>
                            <span className="text-gray-600">Sarah earns</span>
                        </div>
                        <span className="font-bold text-gray-700">$30.24</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">M</div>
                            <span className="text-gray-600">Marcus earns</span>
                        </div>
                        <span className="font-bold text-gray-700">$28.35</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold">J</div>
                            <span className="text-gray-600">Jennifer earns</span>
                        </div>
                        <span className="font-bold text-gray-700">$24.57</span>
                    </div>
                </div>
                <p className="text-xs text-gray-500 italic text-center mt-3">Everyone wins when the network grows</p>
            </div>

            <div className="mt-6 text-center">
                <a href="/referral-policy" className="text-xs font-bold text-meatzy-rare uppercase underline decoration-2 underline-offset-4 hover:text-meatzy-welldone">Referral Program Guidelines</a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Check, Wallet, Share2, Users } from 'lucide-react';

const data = [
  { name: 'Tier 1', amount: 24.57, desc: 'You refer Sarah' },
  { name: 'Tier 2', amount: 3.78, desc: 'Sarah refers Marcus' },
  { name: 'Tier 3', amount: 1.89, desc: 'Marcus refers Jennifer' },
  { name: 'Tier 4', amount: 1.89, desc: 'Jennifer refers David' },
];

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

          {/* Chart Visualization */}
          <div className="bg-white rounded-none p-8 shadow-xl border-t-4 border-meatzy-rare">
            <div className="mb-6 border-b border-gray-100 pb-4">
                <h3 className="text-lg font-display font-bold text-meatzy-olive uppercase mb-1">Here's An Example</h3>
                <p className="text-sm text-gray-500">Monthly passive income from just one active chain.</p>
            </div>
            
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={60} 
                    tick={{fontSize: 14, fontWeight: 700, fontFamily: 'Oswald', fill: '#2D2B25'}} 
                  />
                  <Tooltip 
                    cursor={{fill: '#FDFBF7'}}
                    contentStyle={{ borderRadius: '0px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Bar dataKey="amount" barSize={40}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#DE2626' : '#FFECDC'} stroke={index !== 0 ? '#DE2626' : 'none'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-meatzy-tallow p-6 mt-2 flex flex-col sm:flex-row justify-between items-center gap-4 border border-meatzy-mint">
                <div>
                    <p className="text-xs text-meatzy-dill font-bold uppercase mb-1">What you earn from this chain alone:</p>
                    <p className="text-xs text-gray-500 leading-tight max-w-[200px]">That's 17% of each $189 box, earned monthly from your network 4 levels deep.</p>
                </div>
                <div className="text-center sm:text-right">
                    <div className="text-4xl font-black text-meatzy-rare font-slab">$32.13</div>
                    <span className="text-xs text-gray-400 font-medium uppercase tracking-widest">per Month</span>
                </div>
            </div>
            
            <div className="mt-6 text-center">
                <a href="#" className="text-xs font-bold text-meatzy-rare uppercase underline decoration-2 underline-offset-4 hover:text-meatzy-welldone">Referral Program Guidelines</a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
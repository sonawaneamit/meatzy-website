import React from 'react';
import { Package, Truck, DollarSign } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-20 max-w-2xl mx-auto">
                <span className="text-meatzy-rare font-marker text-2xl md:text-3xl transform -rotate-2 inline-block mb-4">Simple & Rewarding</span>
                <h2 className="text-4xl md:text-6xl font-black font-slab text-meatzy-olive leading-tight mb-6">
                    How It Works
                </h2>
                <p className="text-lg text-meatzy-olive/70">From selection to your doorstep—and beyond.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
                {/* Step 1 */}
                <div className="flex flex-col items-center text-center relative z-10 bg-white/40 p-8 rounded-2xl shadow-md">
                    <div className="w-20 h-20 bg-white rounded-full border-4 border-meatzy-dill/40 flex items-center justify-center mb-6 shadow-sm">
                        <Package className="w-9 h-9 text-meatzy-dill" />
                    </div>
                    <span className="text-sm font-bold text-meatzy-rare uppercase tracking-wider mb-2">Step One</span>
                    <h3 className="text-2xl font-bold font-slab text-meatzy-olive mb-4">Choose Your Box</h3>
                    <p className="text-base text-meatzy-olive/70 leading-relaxed">
                        Select from our curated boxes of premium grass-fed beef, heritage pork, and sustainable seafood.
                    </p>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center text-center relative z-10 bg-white/40 p-8 rounded-2xl shadow-md">
                    <div className="w-20 h-20 bg-white rounded-full border-4 border-meatzy-dill/40 flex items-center justify-center mb-6 shadow-sm">
                        <Truck className="w-9 h-9 text-meatzy-dill" />
                    </div>
                    <span className="text-sm font-bold text-meatzy-rare uppercase tracking-wider mb-2">Step Two</span>
                    <h3 className="text-2xl font-bold font-slab text-meatzy-olive mb-4">We Ship for Free</h3>
                    <p className="text-base text-meatzy-olive/70 leading-relaxed">
                        Your meat is flash-frozen at the peak of freshness and shipped to your door in eco-friendly packaging.
                    </p>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center text-center relative z-10 bg-white/40 p-8 rounded-2xl shadow-md">
                    <div className="w-20 h-20 bg-white rounded-full border-4 border-meatzy-dill/40 flex items-center justify-center mb-6 shadow-sm">
                        <DollarSign className="w-9 h-9 text-meatzy-dill" />
                    </div>
                    <span className="text-sm font-bold text-meatzy-rare uppercase tracking-wider mb-2">Step Three</span>
                    <h3 className="text-2xl font-bold font-slab text-meatzy-olive mb-4">Eat Well & Earn</h3>
                    <p className="text-base text-meatzy-olive/70 leading-relaxed">
                        Enjoy restaurant-quality meals at home. Share your referral link and earn cash when friends subscribe.
                    </p>
                </div>
            </div>
        </div>
    </section>
  );
};
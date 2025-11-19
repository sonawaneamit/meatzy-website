import React from 'react';
import { Package, Truck, DollarSign } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 bg-meatzy-tallow">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
                <span className="text-meatzy-rare font-marker text-2xl transform -rotate-2 inline-block mb-4">Simple & Rewarding</span>
                <h2 className="text-4xl md:text-5xl font-black font-slab text-meatzy-olive uppercase leading-none">
                    How It Works
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                {/* Connector Line for Desktop */}
                <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-1 bg-meatzy-mint/50 z-0 w-2/3 mx-auto"></div>

                {/* Step 1 */}
                <div className="flex flex-col items-center text-center relative z-10">
                    <div className="w-24 h-24 bg-white rounded-full border-4 border-meatzy-welldone flex items-center justify-center mb-6 shadow-lg">
                        <Package className="w-10 h-10 text-meatzy-welldone" />
                    </div>
                    <h3 className="text-2xl font-bold font-slab text-meatzy-olive mb-4">1. Choose Your Box</h3>
                    <p className="text-meatzy-olive/70 leading-relaxed max-w-xs">
                        Select from our curated boxes of premium grass-fed beef, heritage pork, and sustainable seafood.
                    </p>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center text-center relative z-10">
                    <div className="w-24 h-24 bg-white rounded-full border-4 border-meatzy-welldone flex items-center justify-center mb-6 shadow-lg">
                        <Truck className="w-10 h-10 text-meatzy-welldone" />
                    </div>
                    <h3 className="text-2xl font-bold font-slab text-meatzy-olive mb-4">2. We Ship for Free</h3>
                    <p className="text-meatzy-olive/70 leading-relaxed max-w-xs">
                        Your meat is flash-frozen at the peak of freshness and shipped to your door in eco-friendly packaging.
                    </p>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center text-center relative z-10">
                    <div className="w-24 h-24 bg-white rounded-full border-4 border-meatzy-welldone flex items-center justify-center mb-6 shadow-lg">
                        <DollarSign className="w-10 h-10 text-meatzy-welldone" />
                    </div>
                    <h3 className="text-2xl font-bold font-slab text-meatzy-olive mb-4">3. Eat Well & Earn</h3>
                    <p className="text-meatzy-olive/70 leading-relaxed max-w-xs">
                        Enjoy restaurant-quality meals at home. Share your referral link and earn cash when friends subscribe.
                    </p>
                </div>
            </div>
            
            <div className="mt-16 text-center">
                 <button className="bg-meatzy-olive text-white px-10 py-4 font-display font-bold uppercase tracking-widest hover:bg-meatzy-rare transition-colors">
                    Start Your Subscription
                 </button>
            </div>
        </div>
    </section>
  );
};
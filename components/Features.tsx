import React from 'react';
import { ShieldCheck, Award, Zap, Globe, MapPin, ChefHat, Leaf, Shield, FileCheck } from 'lucide-react';

export const Features: React.FC = () => {
  return (
    <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
            {/* Main Content */}
            <div className="text-center max-w-5xl mx-auto mb-16">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-slab text-meatzy-olive uppercase mb-8 leading-tight">
                    The Terroir of Protein, Honestly Sourced
                </h2>

                <div className="space-y-6 text-left text-gray-700 text-base md:text-lg leading-relaxed">
                    <p>
                        We follow the same philosophy top chefs use: choose each protein from the region where it reaches its peak. Patagonian grasslands, Midwest family farms, Australia's pasture raised herds. Every place has its own terroir, and we select only producers who meet or exceed our internal standards and the USDA's, always hormone and antibiotic free.
                    </p>

                    <p>
                        Some brands claim everything is "100 percent American," but the reality is more complicated. Many rely on labeling rules that allow imported meat to be repackaged and sold as "Product of USA." We never do. If a cut comes from abroad, we say so. If it is raised domestically, we say that too. No vague claims, no relabeling, just transparency backed by chef tested quality.
                    </p>
                </div>
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12 max-w-6xl mx-auto">
                {/* Badge 1 - Origin Verified */}
                <div className="flex flex-col items-center text-center group">
                    <div className="relative w-24 h-24 md:w-28 md:h-28 mb-4">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-meatzy-gold via-amber-500 to-amber-700 shadow-xl group-hover:shadow-2xl transition-all"></div>
                        <div className="absolute inset-[6px] md:inset-[8px] rounded-full bg-white flex items-center justify-center shadow-inner">
                            <MapPin className="w-8 h-8 md:w-10 md:h-10 text-meatzy-gold" strokeWidth={3} />
                        </div>
                    </div>
                    <h3 className="font-black font-display text-meatzy-rare uppercase text-sm md:text-base tracking-wide">
                        Origin Verified
                    </h3>
                </div>

                {/* Badge 2 - Chef Tested */}
                <div className="flex flex-col items-center text-center group">
                    <div className="relative w-24 h-24 md:w-28 md:h-28 mb-4">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-meatzy-rare via-red-600 to-red-800 shadow-xl group-hover:shadow-2xl transition-all"></div>
                        <div className="absolute inset-[6px] md:inset-[8px] rounded-full bg-white flex items-center justify-center shadow-inner">
                            <ChefHat className="w-8 h-8 md:w-10 md:h-10 text-meatzy-rare" strokeWidth={3} />
                        </div>
                    </div>
                    <h3 className="font-black font-display text-meatzy-rare uppercase text-sm md:text-base tracking-wide">
                        Chef Tested
                    </h3>
                </div>

                {/* Badge 3 - Sustainably Raised */}
                <div className="flex flex-col items-center text-center group">
                    <div className="relative w-24 h-24 md:w-28 md:h-28 mb-4">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-meatzy-dill via-green-600 to-green-800 shadow-xl group-hover:shadow-2xl transition-all"></div>
                        <div className="absolute inset-[6px] md:inset-[8px] rounded-full bg-white flex items-center justify-center shadow-inner">
                            <Leaf className="w-8 h-8 md:w-10 md:h-10 text-meatzy-dill" strokeWidth={3} />
                        </div>
                    </div>
                    <h3 className="font-black font-display text-meatzy-rare uppercase text-sm md:text-base tracking-wide">
                        Sustainably Raised
                    </h3>
                </div>

                {/* Badge 4 - Hormone and Antibiotic Free */}
                <div className="flex flex-col items-center text-center group">
                    <div className="relative w-24 h-24 md:w-28 md:h-28 mb-4">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-meatzy-olive via-gray-700 to-gray-900 shadow-xl group-hover:shadow-2xl transition-all"></div>
                        <div className="absolute inset-[6px] md:inset-[8px] rounded-full bg-white flex items-center justify-center shadow-inner">
                            <Shield className="w-8 h-8 md:w-10 md:h-10 text-meatzy-olive" strokeWidth={3} />
                        </div>
                    </div>
                    <h3 className="font-black font-display text-meatzy-rare uppercase text-sm md:text-base tracking-wide leading-tight">
                        Hormone &<br/>Antibiotic Free
                    </h3>
                </div>

                {/* Badge 5 - Transparent Sourcing */}
                <div className="flex flex-col items-center text-center col-span-2 md:col-span-3 lg:col-span-1 group">
                    <div className="relative w-24 h-24 md:w-28 md:h-28 mb-4">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 via-meatzy-gold to-amber-700 shadow-xl group-hover:shadow-2xl transition-all"></div>
                        <div className="absolute inset-[6px] md:inset-[8px] rounded-full bg-white flex items-center justify-center shadow-inner">
                            <FileCheck className="w-8 h-8 md:w-10 md:h-10 text-amber-600" strokeWidth={3} />
                        </div>
                    </div>
                    <h3 className="font-black font-display text-meatzy-rare uppercase text-sm md:text-base tracking-wide leading-tight">
                        Transparent<br/>Sourcing
                    </h3>
                </div>
            </div>

            {/* Sustainability Section */}
            <div className="mt-32 flex flex-col md:flex-row gap-16 items-center bg-meatzy-tallow p-8 md:p-16 rounded-3xl border border-meatzy-mint">
                 <div className="w-full md:w-1/2">
                     <div className="relative">
                        <div className="absolute -top-4 -left-4 w-full h-full border-4 border-meatzy-dill rounded-lg"></div>
                        <img
                            src="/meatzy-cares.png"
                            alt="Meatzy Cares"
                            className="rounded-lg shadow-2xl relative z-10"
                        />
                     </div>
                 </div>
                 <div className="w-full md:w-1/2">
                    <span className="text-meatzy-rare font-marker text-2xl md:text-3xl mb-2 block transform -rotate-1">Meatzy Cares</span>
                    <h2 className="text-3xl md:text-4xl font-black font-slab text-meatzy-olive uppercase mb-6 leading-none">
                        Excellence Without<br/>Borders
                    </h2>
                    <p className="text-meatzy-olive/80 mb-6 leading-relaxed text-lg">
                        We don't just limit ourselves to one region. We scour the globe—from American family farms to sustainable fisheries worldwide—to find the absolute best tasting proteins. 
                    </p>
                    <p className="text-meatzy-olive/80 mb-8 leading-relaxed text-lg">
                        Whether it's pasture-raised beef or sustainably caught seafood, if it's on a Meatzy menu, it's passed our rigorous quality tests. We bring the same ingredients used by 5-star resorts directly to your kitchen.
                    </p>
                    <div className="flex gap-6 opacity-80 hover:opacity-100 transition-all duration-500">
                        <div className="flex flex-col items-center gap-2">
                            <ShieldCheck className="w-10 h-10 text-meatzy-dill" />
                            <span className="text-xs font-bold uppercase text-meatzy-dill">Chef Verified</span>
                        </div>
                         <div className="flex flex-col items-center gap-2">
                            <Award className="w-10 h-10 text-meatzy-gold" />
                            <span className="text-xs font-bold uppercase text-meatzy-gold">Resort Quality</span>
                        </div>
                    </div>
                 </div>
            </div>
        </div>
    </section>
  );
};
import React from 'react';
import { ShieldCheck, Award, Zap, Globe } from 'lucide-react';

export const Features: React.FC = () => {
  return (
    <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="mb-12 text-center">
                <span className="text-meatzy-rare font-marker text-2xl md:text-3xl mb-2 block transform -rotate-1">The Meatzy Standard</span>
                <h2 className="text-4xl md:text-5xl font-black font-slab text-meatzy-olive uppercase max-w-3xl mx-auto leading-none">
                    Not Your Average Meat Subscription Box
                </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Feature 1 - Sourced for Flavor */}
                <div className="relative h-80 group overflow-hidden shadow-xl cursor-pointer rounded-lg border-b-4 border-meatzy-gold">
                    <img
                        src="https://images.unsplash.com/photo-1588168333986-5078d3ae3976?q=80&w=800&auto=format&fit=crop"
                        alt="Grass-fed cattle on pasture"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 brightness-[0.5] group-hover:brightness-[0.4]"
                    />
                    <div className="absolute inset-0 p-8 flex flex-col justify-center text-center items-center border-2 border-white/10 m-2 rounded-md">
                        <Globe className="w-12 h-12 text-meatzy-gold mb-4 opacity-80 group-hover:opacity-100 transition-opacity" />
                        <h3 className="text-white font-black font-slab text-2xl uppercase leading-tight drop-shadow-md">
                            Sourced For<br/>Flavor,<br/>Not Just Origin
                        </h3>
                    </div>
                </div>

                 {/* Feature 2 - Better Value */}
                 <div className="relative h-80 group overflow-hidden shadow-xl cursor-pointer rounded-lg border-b-4 border-meatzy-gold">
                    <img
                        src="https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=800&auto=format&fit=crop"
                        alt="Premium beef cuts"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 brightness-[0.5] group-hover:brightness-[0.4]"
                    />
                    <div className="absolute inset-0 p-8 flex flex-col justify-center text-center items-center border-2 border-white/10 m-2 rounded-md">
                        <Zap className="w-12 h-12 text-meatzy-gold mb-4 opacity-80 group-hover:opacity-100 transition-opacity" />
                        <h3 className="text-white font-black font-slab text-2xl uppercase leading-tight drop-shadow-md">
                            Better Value<br/>Than The<br/>Stores
                        </h3>
                    </div>
                </div>

                 {/* Feature 3 - Customize Your Box */}
                 <div className="relative h-80 group overflow-hidden shadow-xl cursor-pointer rounded-lg border-b-4 border-meatzy-gold">
                    <img
                        src="https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?q=80&w=800&auto=format&fit=crop"
                        alt="Variety of premium meats"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 brightness-[0.5] group-hover:brightness-[0.4]"
                    />
                    <div className="absolute inset-0 p-8 flex flex-col justify-center text-center items-center border-2 border-white/10 m-2 rounded-md">
                        <Award className="w-12 h-12 text-meatzy-gold mb-4 opacity-80 group-hover:opacity-100 transition-opacity" />
                        <h3 className="text-white font-black font-slab text-2xl uppercase leading-tight drop-shadow-md">
                            Customize<br/>Your Box, Your<br/>Way
                        </h3>
                    </div>
                </div>

                 {/* Feature 4 - Earn With Us */}
                 <div className="relative h-80 group overflow-hidden shadow-xl cursor-pointer rounded-lg border-b-4 border-meatzy-gold">
                    <img
                        src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop"
                        alt="Prepared steak dinner"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 brightness-[0.5] group-hover:brightness-[0.4]"
                    />
                    <div className="absolute inset-0 p-8 flex flex-col justify-center text-center items-center border-2 border-white/10 m-2 rounded-md">
                         <div className="w-12 h-12 rounded-full border-2 border-meatzy-gold flex items-center justify-center text-meatzy-gold font-black text-xl mb-4">$</div>
                        <h3 className="text-white font-black font-slab text-2xl uppercase leading-tight drop-shadow-md">
                            Earn With Us<br/>Real Cash, Not<br/>Just Points
                        </h3>
                    </div>
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
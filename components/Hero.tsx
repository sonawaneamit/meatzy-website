import React from 'react';
import { ArrowRight, ShieldCheck, Award, Truck, CheckCircle2, Star, ChefHat, Utensils } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="flex flex-col">
        <section className="relative min-h-[85vh] w-full flex items-center bg-meatzy-tallow overflow-hidden pt-32 lg:pt-28">
            
            <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    
                    {/* Left Content */}
                    <div className="relative z-10 order-2 lg:order-1 text-center lg:text-left py-10 lg:py-0">
                        <div className="inline-flex items-center gap-2 bg-white border border-meatzy-mint rounded-full px-4 py-1.5 mb-8 shadow-sm mx-auto lg:mx-0 animate-fade-in-up">
                            <div className="flex text-meatzy-gold">
                                <Star className="w-3 h-3 fill-current" />
                                <Star className="w-3 h-3 fill-current" />
                                <Star className="w-3 h-3 fill-current" />
                                <Star className="w-3 h-3 fill-current" />
                                <Star className="w-3 h-3 fill-current" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider text-meatzy-olive">Trusted by Top Chefs</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl xl:text-7xl font-black text-meatzy-olive leading-[0.9] mb-6 font-slab capitalize tracking-tight">
                        The Only Box<br/>
                        That Feeds You <br/>
                        <span className="text-meatzy-rare">And Pays You.</span>
                        </h1>
                        
                        <p className="text-lg text-meatzy-olive/70 mb-10 max-w-xl font-medium leading-relaxed mx-auto lg:mx-0">
                        We supply luxury resorts, but we partner with families. We're flipping the food system by paying <span className="font-bold text-meatzy-olive">you</span> instead of ad agencies to spread the word. Experience culinary-grade meat at home and earn cash for sharing the movement.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center lg:justify-start">
                        <a href="/build-box" className="bg-meatzy-rare text-white px-10 py-4 text-lg font-display font-bold uppercase tracking-widest hover:bg-meatzy-welldone transition-all shadow-xl flex items-center justify-center gap-3">
                            Build Your Box <ArrowRight className="w-5 h-5" />
                        </a>
                        <a href="#how-it-works" className="bg-transparent text-meatzy-olive border-2 border-meatzy-olive px-10 py-4 text-lg font-display font-bold uppercase tracking-widest hover:bg-meatzy-olive hover:text-white transition-all flex items-center justify-center">
                            How It Works
                        </a>
                        </div>

                        <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-xs font-bold uppercase tracking-wide text-meatzy-olive/60">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-meatzy-dill" /> No Antibiotics
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-meatzy-dill" /> Pasture Raised
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-meatzy-dill" /> Sustainably Sourced
                            </div>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="relative z-10 order-1 lg:order-2 h-full min-h-[400px] lg:min-h-[600px] flex items-center justify-center">
                        {/* Blob/Shape Background */}
                        <div className="absolute inset-0 bg-meatzy-marbling/30 rounded-[3rem] transform rotate-3 scale-90 z-0"></div>
                        
                        <img 
                            src="https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=1200&auto=format&fit=crop" 
                            alt="Premium Meat Box" 
                            className="relative z-10 w-full h-auto object-cover rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-700"
                        />
                        
                        {/* Floating Badge */}
                        <div className="absolute bottom-10 -left-6 z-20 bg-white p-4 rounded-lg shadow-xl border-l-4 border-meatzy-gold max-w-[220px] hidden md:block animate-bounce-slow">
                            <p className="font-display font-bold text-meatzy-olive uppercase text-sm mb-1">Chef-Grade Quality</p>
                            <p className="text-xs text-gray-500">The same cuts served at luxury resorts & hotels.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Trust Strip */}
        <div className="bg-meatzy-olive text-white border-t border-meatzy-olive relative z-20">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/10">
                    <div className="flex items-center justify-center gap-3">
                        <div className="p-2 bg-white/10 rounded-full">
                            <ChefHat className="w-6 h-6 text-meatzy-gold" />
                        </div>
                        <span className="font-display font-bold uppercase tracking-wider text-xs">Luxury Resort Supplier</span>
                    </div>
                    
                    <div className="flex items-center justify-center gap-3">
                        <div className="p-2 bg-white/10 rounded-full">
                            <ShieldCheck className="w-6 h-6 text-meatzy-gold" />
                        </div>
                        <span className="font-display font-bold uppercase tracking-wider text-xs">Sourced for Flavor</span>
                    </div>
                    
                    <div className="flex items-center justify-center gap-3">
                        <div className="p-2 bg-white/10 rounded-full">
                            <Utensils className="w-6 h-6 text-meatzy-gold" />
                        </div>
                        <span className="font-display font-bold uppercase tracking-wider text-xs">Restaurant Grade</span>
                    </div>
                    
                    <div className="flex items-center justify-center gap-3">
                        <div className="p-2 bg-white/10 rounded-full">
                            <Truck className="w-6 h-6 text-meatzy-gold" />
                        </div>
                        <span className="font-display font-bold uppercase tracking-wider text-xs">Free Shipping</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
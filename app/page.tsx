import React from 'react';
import { Hero } from '../components/Hero';
import { ProductGrid } from '../components/ProductGrid';
import { ReferralProgram } from '../components/ReferralProgram';
import { HowItWorks } from '../components/HowItWorks';
import { Features } from '../components/Features';
import { AiChef } from '../components/AiChef';
import { Testimonials } from '../components/Testimonials';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col w-full overflow-x-hidden bg-meatzy-tallow font-sans selection:bg-meatzy-rare selection:text-white">
      <Hero />
      
      <HowItWorks />

      <section id="shop" className="py-24 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <ProductGrid />
      </section>
      
      <Features />

      <ReferralProgram />

      {/* Business Section - Meatzy Gourmet */}
      <section className="bg-meatzy-olive py-24 text-white relative overflow-hidden">
           {/* Background Pattern */}
           <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
           
           <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center gap-16 relative z-10">
              <div className="w-full md:w-1/2 order-2 md:order-1">
                   <span className="text-meatzy-rare font-display font-bold uppercase tracking-widest text-sm mb-2 block">Meatzy For Business</span>
                   <h2 className="text-4xl md:text-5xl font-black font-slab uppercase mb-6 leading-tight">Meatzy Gourmet</h2>
                   <p className="text-gray-300 mb-8 leading-relaxed text-lg">
                      At MEATZY, we make it easy for restaurants, hotels, and other businesses to access premium proteins at competitive wholesale prices. Request custom quotes and lock in protein prices for 6 months at a time.
                   </p>
                   <div className="flex flex-col sm:flex-row gap-4 items-start">
                       <p className="text-white font-bold uppercase tracking-wide py-3">
                          Let's grow together, reach out to a rep today.
                       </p>
                       <button className="bg-meatzy-rare text-white px-8 py-3 font-display font-bold uppercase tracking-widest hover:bg-white hover:text-meatzy-olive transition-colors shadow-lg">
                          Get In Touch
                       </button>
                   </div>
              </div>
              <div className="w-full md:w-1/2 order-1 md:order-2">
                   <img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1000&auto=format&fit=crop" alt="Chef plating food" className="rounded-lg shadow-2xl border-4 border-meatzy-dill/20" />
              </div>
           </div>
      </section>

      <AiChef />

      <Testimonials />
    </main>
  );
}
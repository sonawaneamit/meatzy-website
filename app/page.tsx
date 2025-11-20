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
    <main className="min-h-screen flex flex-col w-full overflow-x-hidden bg-meatzy-tallow font-sans selection:bg-meatzy-rare selection:text-white -mt-[140px]">
      <Hero />
      
      <HowItWorks />

      <section id="shop" className="py-32 px-4 md:px-8 max-w-7xl mx-auto w-full bg-meatzy-tallow">
        <ProductGrid />
      </section>

      <Features />

      <ReferralProgram />

      {/* Business Section - Meatzy Gourmet */}
      <section className="bg-meatzy-olive py-32 text-white relative overflow-hidden">
           {/* Background Pattern */}
           <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

           <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center gap-20 relative z-10">
              <div className="w-full md:w-1/2 order-2 md:order-1">
                   <span className="text-meatzy-gold font-display font-semibold uppercase tracking-wider text-sm mb-4 block">Meatzy For Business</span>
                   <h2 className="text-4xl md:text-5xl font-black font-slab mb-8 leading-tight">Meatzy Gourmet</h2>
                   <p className="text-white/80 mb-10 leading-relaxed text-xl">
                      At MEATZY, we make it easy for restaurants, hotels, and other businesses to access premium proteins at competitive wholesale prices. Request custom quotes and lock in protein prices for 6 months at a time.
                   </p>
                   <div className="flex flex-col gap-6">
                       <p className="text-white text-lg font-medium">
                          Let's grow together, reach out to a rep today.
                       </p>
                       <button className="bg-white text-meatzy-olive px-10 py-4 font-display font-bold uppercase tracking-wide hover:bg-meatzy-rare hover:text-white transition-colors shadow-xl w-fit">
                          Get In Touch
                       </button>
                   </div>
              </div>
              <div className="w-full md:w-1/2 order-1 md:order-2">
                   <img src="/gourmet.png" alt="Meatzy Gourmet" className="rounded-2xl shadow-2xl border-4 border-white/10" />
              </div>
           </div>
      </section>

      <AiChef />

      <Testimonials />
    </main>
  );
}
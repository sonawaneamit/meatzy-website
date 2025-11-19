'use client';

import React from 'react';
import { ArrowRight, CheckCircle2, Star, Users, Target, Lightbulb } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col w-full overflow-x-hidden bg-meatzy-tallow font-sans -mt-[140px]">

      {/* Hero Section - Matching homepage style */}
      <section className="relative min-h-[85vh] w-full flex items-center bg-meatzy-tallow overflow-hidden pt-32 lg:pt-28">
        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Content */}
            <div className="relative z-10 order-2 lg:order-1 text-center lg:text-left py-10 lg:py-0">
              <div className="inline-flex items-center gap-2 bg-white border border-meatzy-mint rounded-full px-4 py-1.5 mb-8 shadow-sm mx-auto lg:mx-0">
                <Users className="w-4 h-4 text-meatzy-gold" />
                <span className="text-xs font-bold uppercase tracking-wider text-meatzy-olive">Our Story</span>
              </div>

              <h1 className="text-5xl md:text-6xl xl:text-7xl font-black text-meatzy-olive leading-[0.9] mb-6 font-slab capitalize tracking-tight">
                About<br/>
                <span className="text-meatzy-rare">Meatzy</span>
              </h1>

              <p className="text-lg text-meatzy-olive/70 mb-10 max-w-xl font-medium leading-relaxed mx-auto lg:mx-0">
                <span className="font-bold text-meatzy-olive">Eat Well. Earn Well. Live Well.</span> We're flipping the food system by bringing restaurant-quality meats to your table while paying you to share the movement.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center lg:justify-start">
                <a href="/build-box" className="bg-meatzy-rare text-white px-10 py-4 text-lg font-display font-bold uppercase tracking-widest hover:bg-meatzy-welldone transition-all shadow-xl flex items-center justify-center gap-3">
                  Build Your Box <ArrowRight className="w-5 h-5" />
                </a>
                <a href="/#shop" className="bg-transparent text-meatzy-olive border-2 border-meatzy-olive px-10 py-4 text-lg font-display font-bold uppercase tracking-widest hover:bg-meatzy-olive hover:text-white transition-all flex items-center justify-center">
                  Shop Boxes
                </a>
              </div>

              <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-xs font-bold uppercase tracking-wide text-meatzy-olive/60">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-meatzy-dill" /> Chef-Grade
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-meatzy-dill" /> Earn Cash
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-meatzy-dill" /> Family First
                </div>
              </div>
            </div>

            {/* Right Image - Founders Photo */}
            <div className="relative z-10 order-1 lg:order-2 h-full min-h-[400px] lg:min-h-[600px] flex items-center justify-center">
              <div className="absolute inset-0 bg-meatzy-marbling/30 rounded-[3rem] transform rotate-3 scale-90 z-0"></div>

              <img
                src="/founders.png"
                alt="Jorge Arevalo and Alena Pisani - Meatzy Founders"
                className="relative z-10 w-full h-auto object-cover rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1200&auto=format&fit=crop';
                }}
              />

              {/* Floating Badge */}
              <div className="absolute bottom-10 -left-6 z-20 bg-white p-4 rounded-lg shadow-xl border-l-4 border-meatzy-gold max-w-[220px] hidden md:block">
                <p className="font-display font-bold text-meatzy-olive uppercase text-sm mb-1">Meet The Founders</p>
                <p className="text-xs text-gray-500">Jorge Arevalo & Alena Pisani</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Story Behind The Box */}
      <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <span className="text-meatzy-rare font-marker text-2xl md:text-3xl transform -rotate-2 mb-2 block">The Story Behind The Box</span>
          <h2 className="text-4xl md:text-5xl font-black font-slab text-meatzy-olive uppercase mb-6">
            Meatzy Was Born From A Simple Truth
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              For years, we supplied proteins to some of the most exclusive hotels and restaurants - the kind of culinary-grade meats that chefs and insiders quietly reserved for their own kitchens. But somewhere along the way, Jorge asked a simple question:
            </p>

            <div className="bg-meatzy-mint/20 border-l-4 border-meatzy-rare p-6 rounded-r-lg">
              <p className="text-xl font-bold text-meatzy-olive italic">
                "Why should access to great food be limited to a few?"
              </p>
            </div>

            <p className="text-lg text-gray-700 leading-relaxed">
              That question sparked MEATZY - a brand built to bring restaurant-quality meats straight to everyone's table. But we didn't create MEATZY just to sell premium proteins. We built it to flip the system.
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-meatzy-rare/10 rounded-2xl transform -rotate-3"></div>
            <img
              src="https://images.unsplash.com/photo-1588168333986-5078d3ae3976?q=80&w=800&auto=format&fit=crop"
              alt="Premium meats"
              className="relative rounded-2xl shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Mission Section - Dark background like homepage Business section */}
      <section className="bg-meatzy-olive py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="text-meatzy-gold font-display font-bold uppercase tracking-widest text-sm mb-2 block">Goal</span>
            <h2 className="text-4xl md:text-5xl font-black font-slab uppercase mb-6 leading-tight">Our Mission</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur p-8 rounded-xl border border-white/20 hover:bg-white/20 transition-all">
              <div className="p-3 bg-meatzy-rare rounded-full w-fit mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-black font-slab uppercase mb-3">Give It Back</h3>
              <p className="text-gray-300 leading-relaxed">
                In a world where algorithms and ad platforms take the biggest slice, MEATZY is designed to give it back. Instead of paying middlemen, we pay real people.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur p-8 rounded-xl border border-white/20 hover:bg-white/20 transition-all">
              <div className="p-3 bg-meatzy-rare rounded-full w-fit mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-black font-slab uppercase mb-3">Real Income</h3>
              <p className="text-gray-300 leading-relaxed">
                Every time someone you share MEATZY with orders, you earn real income - because great food is meant to be shared.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur p-8 rounded-xl border border-white/20 hover:bg-white/20 transition-all">
              <div className="p-3 bg-meatzy-rare rounded-full w-fit mb-4">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-black font-slab uppercase mb-3">Built Different</h3>
              <p className="text-gray-300 leading-relaxed">
                We didn't create MEATZY just to sell premium proteins. We built it to flip the system and empower real people.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <span className="text-meatzy-rare font-marker text-2xl md:text-3xl transform -rotate-2 mb-2 block">We Believe</span>
          <h2 className="text-4xl md:text-5xl font-black font-slab text-meatzy-olive uppercase mb-6">Our Philosophy</h2>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white border border-meatzy-mint/30 rounded-xl p-8 shadow-lg">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Food isn't just fuel. It's connection. It's how we celebrate, how we care, and how we bring people together. At MEATZY, we believe that sharing good food should do more than feed your body - it should feed your future.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              So we made our affiliate system open to everyone - not just influencers or marketers. Whether you're a home chef, a foodie, or simply someone who loves to share a good meal, you can be part of the world's first protein-powered economy.
            </p>
          </div>

          <div className="text-center py-12 bg-gradient-to-br from-meatzy-olive to-meatzy-rare rounded-2xl">
            <h3 className="text-3xl md:text-4xl font-black font-slab text-white uppercase tracking-wide">
              Eat Well. Earn Well. Live Well.
            </h3>
          </div>
        </div>
      </section>

      {/* Meet The Founders Section */}
      <section className="py-24 px-4 md:px-8 bg-meatzy-tallow">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-meatzy-rare font-marker text-2xl md:text-3xl transform -rotate-2 mb-2 block">Meet The Team</span>
            <h2 className="text-4xl md:text-5xl font-black font-slab text-meatzy-olive uppercase">The Founders</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Jorge Arevalo */}
            <div className="bg-white rounded-xl overflow-hidden shadow-xl border border-meatzy-mint/30 hover:shadow-2xl transition-all group">
              <div className="relative h-80 overflow-hidden">
                <img
                  src="/jorge.png"
                  alt="Jorge Arevalo - CEO & Co-Founder"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.classList.add('bg-gradient-to-br', 'from-meatzy-olive', 'to-meatzy-rare');
                    const fallback = document.createElement('div');
                    fallback.className = 'absolute inset-0 flex items-center justify-center';
                    fallback.innerHTML = '<div class="w-40 h-40 rounded-full bg-white flex items-center justify-center border-4 border-meatzy-gold"><span class="text-5xl font-black text-meatzy-olive">JA</span></div>';
                    e.currentTarget.parentElement!.appendChild(fallback);
                  }}
                />
              </div>
              <div className="p-8 text-center">
                <h3 className="text-2xl font-black font-slab text-meatzy-olive uppercase mb-2">
                  Jorge Arevalo
                </h3>
                <p className="text-meatzy-rare font-bold uppercase text-sm tracking-wider mb-4">
                  CEO & Co-Founder
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Visionary leader bringing restaurant-quality proteins to everyone's table while building the world's first protein-powered economy. Former supplier to luxury resorts now empowering families.
                </p>
              </div>
            </div>

            {/* Alena Pisani */}
            <div className="bg-white rounded-xl overflow-hidden shadow-xl border border-meatzy-mint/30 hover:shadow-2xl transition-all group">
              <div className="relative h-80 overflow-hidden">
                <img
                  src="/alena.png"
                  alt="Alena Pisani - COO & Co-Founder"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.classList.add('bg-gradient-to-br', 'from-meatzy-rare', 'to-meatzy-welldone');
                    const fallback = document.createElement('div');
                    fallback.className = 'absolute inset-0 flex items-center justify-center';
                    fallback.innerHTML = '<div class="w-40 h-40 rounded-full bg-white flex items-center justify-center border-4 border-meatzy-gold"><span class="text-5xl font-black text-meatzy-olive">AP</span></div>';
                    e.currentTarget.parentElement!.appendChild(fallback);
                  }}
                />
              </div>
              <div className="p-8 text-center">
                <h3 className="text-2xl font-black font-slab text-meatzy-olive uppercase mb-2">
                  Alena Pisani
                </h3>
                <p className="text-meatzy-rare font-bold uppercase text-sm tracking-wider mb-4">
                  COO & Co-Founder
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Operations expert ensuring every box delivers premium quality and exceptional value to customers nationwide. Dedicated to building systems that work for real people.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Matching homepage style */}
      <section className="bg-meatzy-olive py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black font-slab uppercase mb-6 leading-tight">
            Ready To Join The Movement?
          </h2>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed">
            Experience premium proteins and start earning with every share.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/build-box"
              className="inline-flex items-center justify-center gap-3 bg-meatzy-rare text-white px-10 py-4 text-lg font-display font-bold uppercase tracking-widest hover:bg-white hover:text-meatzy-olive transition-all shadow-xl"
            >
              Build Your Box <ArrowRight className="w-5 h-5" />
            </a>

            <a
              href="/#shop"
              className="inline-flex items-center justify-center gap-3 bg-white text-meatzy-olive px-10 py-4 text-lg font-display font-bold uppercase tracking-widest hover:bg-meatzy-mint transition-all shadow-xl"
            >
              Shop Boxes
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

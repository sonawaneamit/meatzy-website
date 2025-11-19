import React from 'react';
import { Heart, Users, TrendingUp, Globe, Calendar, MapPin } from 'lucide-react';
import Image from 'next/image';

export default function MeatzyImpact() {
  return (
    <main className="min-h-screen flex flex-col w-full overflow-x-hidden bg-meatzy-tallow font-sans -mt-[140px]">

      {/* Hero Section */}
      <section className="relative bg-meatzy-olive text-white pt-56 pb-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2070&auto=format&fit=crop")',
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <span className="text-meatzy-rare font-marker text-3xl md:text-4xl mb-4 block transform -rotate-1">Making a Difference</span>
          <h1 className="text-5xl md:text-7xl font-black font-slab uppercase mb-6 leading-none">
            Meatzy Impact
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl font-light leading-relaxed">
            Turning Meals Into Meaning
          </p>
        </div>
      </section>

      {/* Little Lighthouse Foundation Event Banner */}
      <section className="bg-white py-8 border-t-4 border-b-4 border-meatzy-rare shadow-lg">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-8">
              <div className="bg-white p-4 rounded-xl shadow-xl border-4 border-meatzy-rare">
                <Image
                  src="/llf-logo.png"
                  alt="Little Lighthouse Foundation"
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </div>
              <div>
                <div className="text-xs font-display font-bold uppercase tracking-widest text-meatzy-rare mb-2">Upcoming Event</div>
                <h3 className="text-2xl md:text-4xl font-black font-slab text-meatzy-olive uppercase leading-tight mb-1">
                  Little Lighthouse Foundation
                </h3>
                <h3 className="text-xl md:text-3xl font-black font-slab text-meatzy-welldone uppercase leading-tight">
                  Charity Burger Drive
                </h3>
              </div>
            </div>
            <div className="flex flex-col gap-3 bg-meatzy-tallow p-6 rounded-lg border-2 border-meatzy-rare/20">
              <div className="flex items-center gap-2 text-meatzy-olive">
                <Calendar className="w-5 h-5 text-meatzy-rare" />
                <span className="font-display font-bold uppercase tracking-wide text-sm">December 13, 2025</span>
              </div>
              <div className="flex items-center gap-2 text-meatzy-olive">
                <MapPin className="w-5 h-5 text-meatzy-rare" />
                <span className="font-display font-bold uppercase tracking-wide text-sm">Miami, FL</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Purpose Meets Prosperity */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-black font-slab text-meatzy-olive uppercase mb-8 leading-none">
              Purpose Meets Prosperity
            </h2>
            <p className="text-meatzy-olive/80 text-lg leading-relaxed mb-6">
              MEATZY Impact transforms the way communities give—not by asking for donations, but by creating a continuous income stream for those who need it most.
            </p>
            <p className="text-meatzy-olive/80 text-lg leading-relaxed mb-6">
              With MEATZY Impact nonprofits, churches, schools, charities, and community movements can share their own referral code. Every time someone orders a MEATZY box, the organization earns—not just once, but again and again as their community keeps thriving.
            </p>
            <p className="text-meatzy-olive text-xl font-bold leading-relaxed">
              It's not fundraising; it's purposeful living—where every meal fuels a mission.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-meatzy-tallow">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-4xl md:text-5xl font-black font-slab text-meatzy-olive uppercase mb-16 leading-none text-center">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* They Eat Well */}
            <div className="bg-white p-8 rounded-xl border border-meatzy-mint/50 shadow-lg">
              <div className="w-16 h-16 bg-meatzy-rare rounded-full flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-black font-slab text-meatzy-olive uppercase mb-4">They Eat Well</h3>
              <p className="text-meatzy-olive/80 leading-relaxed">
                Supporters enjoy the same premium, restaurant-grade proteins served in five-star hotels and steakhouses—no bypasses, no substitutes, no compromises.
              </p>
            </div>

            {/* They Earn Well */}
            <div className="bg-white p-8 rounded-xl border border-meatzy-mint/50 shadow-lg">
              <div className="w-16 h-16 bg-meatzy-welldone rounded-full flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-black font-slab text-meatzy-olive uppercase mb-4">They Earn Well</h3>
              <p className="text-meatzy-olive/80 leading-relaxed">
                Every time they share MEATZY, they earn real cash—creating a sustainable income stream that rewards loyalty and love for good food.
              </p>
            </div>

            {/* They Give Well */}
            <div className="bg-white p-8 rounded-xl border border-meatzy-mint/50 shadow-lg">
              <div className="w-16 h-16 bg-meatzy-dill rounded-full flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-black font-slab text-meatzy-olive uppercase mb-4">They Give Well</h3>
              <p className="text-meatzy-olive/80 leading-relaxed">
                A portion of every box supports the organization's mission, month after month. The more the community grows, the more the cause advances.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <a
              href="/affiliate"
              className="inline-block bg-meatzy-rare text-white px-10 py-4 font-display font-bold uppercase tracking-widest hover:bg-meatzy-welldone transition-colors shadow-lg"
            >
              Fuel Your Mission
            </a>
          </div>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="w-full md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop"
                alt="Happy children smiling"
                className="rounded-xl shadow-2xl"
              />
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-4xl md:text-5xl font-black font-slab text-meatzy-olive uppercase mb-8 leading-none">
                Why It Matters
              </h2>
              <p className="text-meatzy-olive/80 text-lg leading-relaxed mb-8">
                Traditional fundraising asks for money. MEATZY Impact builds wealth and nourishment together—feeding families, funding missions, and fueling long-term change.
              </p>
              <p className="text-meatzy-olive text-xl font-bold mb-6">
                It's a model where everyone wins:
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3 text-meatzy-olive/80 text-lg">
                  <span className="text-meatzy-dill text-2xl">•</span>
                  <span>Families eat better.</span>
                </li>
                <li className="flex items-start gap-3 text-meatzy-olive/80 text-lg">
                  <span className="text-meatzy-dill text-2xl">•</span>
                  <span>Communities earn together.</span>
                </li>
                <li className="flex items-start gap-3 text-meatzy-olive/80 text-lg">
                  <span className="text-meatzy-dill text-2xl">•</span>
                  <span>Causes grow stronger.</span>
                </li>
              </ul>
              <p className="text-meatzy-olive font-bold text-xl italic">
                That's how MEATZY turns dinner into impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Movement */}
      <section className="py-24 bg-meatzy-olive text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-meatzy-rare rounded-full flex items-center justify-center mx-auto mb-8">
              <Globe className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black font-slab uppercase mb-8 leading-none">
              The Movement
            </h2>
            <p className="text-gray-200 text-lg leading-relaxed mb-6">
              From local schools and youth sports teams to churches, animal rescues, and global nonprofits, MEATZY Impact turns everyday purchases into powerful change.
            </p>
            <p className="text-gray-200 text-lg leading-relaxed mb-6">
              Each box purchased strengthens both a family's table and a community's mission.
            </p>
            <p className="text-white text-xl font-bold leading-relaxed">
              Because when people share MEATZY, they're not just sharing food—they're sharing hope, opportunity, and purpose.
            </p>
          </div>
        </div>
      </section>

      {/* Join Meatzy Impact CTA */}
      <section className="relative py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop")',
          }}
        >
          <div className="absolute inset-0 bg-meatzy-olive/80"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black font-slab text-white uppercase mb-6 leading-none">
            Join Meatzy Impact
          </h2>
          <p className="text-white text-xl md:text-2xl mb-10 leading-relaxed">
            Empower your cause with every meal.
          </p>
          <a
            href="/signup"
            className="inline-block bg-meatzy-rare text-white px-12 py-5 font-display font-bold uppercase tracking-widest hover:bg-white hover:text-meatzy-olive transition-colors shadow-2xl text-lg"
          >
            Create My Account
          </a>
        </div>
      </section>

    </main>
  );
}

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, Check, ChevronDown, ChevronUp, ShoppingCart, Truck, Shield, Award } from 'lucide-react';

interface ProteinItem {
  name: string;
  weight: string;
  description: string;
  features: string[];
  image?: string;
}

const proteins: ProteinItem[] = [
  {
    name: "Ribeye Steak, USDA Choice, Grass-Fed",
    weight: "1.5 lbs",
    description: "Premium grass-fed ribeye with exceptional marbling and rich, buttery flavor. Our grass-fed ribeyes are sourced from cattle raised on open pastures.",
    features: [
      "USDA Choice Grade",
      "100% Grass-Fed & Grass-Finished",
      "No hormones or antibiotics",
      "Rich marbling for maximum flavor",
      "Perfect for grilling or pan-searing"
    ]
  },
  {
    name: "Ground Beef 80/20",
    weight: "2 lbs",
    description: "The perfect blend of lean meat and fat for juicy burgers, meatballs, and tacos. Versatile and flavorful.",
    features: [
      "80% lean, 20% fat ratio",
      "Grass-fed beef",
      "No fillers or additives",
      "Perfect for burgers and meatballs",
      "Freezes exceptionally well"
    ]
  },
  {
    name: "Flat Iron Steak, USDA Choice, Grass-Fed",
    weight: "1.5 lbs",
    description: "An underrated cut with incredible tenderness and beefy flavor. One of the most flavorful steaks, perfect for quick weeknight dinners.",
    features: [
      "USDA Choice Grade",
      "Grass-fed and pasture-raised",
      "Extremely tender cut",
      "Great for marinating",
      "Quick-cooking steak"
    ]
  },
  {
    name: "Muscular Chicken, Pasturally Farmed",
    weight: "4 lbs",
    description: "Free-range chicken raised on open pastures with access to bugs, grass, and sunshine. The way chicken should taste.",
    features: [
      "100% pasture-raised",
      "No antibiotics or hormones",
      "Firm, flavorful meat",
      "Higher in Omega-3s",
      "Humanely raised"
    ]
  },
  {
    name: "Organic Boneless, Skinless Chicken Thighs",
    weight: "3 lbs",
    description: "Juicy, flavorful chicken thighs that stay moist and tender. Perfect for meal prep, grilling, or slow cooking.",
    features: [
      "USDA Organic certified",
      "Boneless & skinless convenience",
      "More flavorful than breasts",
      "Stays moist when cooked",
      "Great for keto meal prep"
    ]
  },
  {
    name: "Ground Pork",
    weight: "2 lbs",
    description: "Premium ground pork with perfect fat content for sausages, meatballs, or Asian-inspired dishes.",
    features: [
      "Pasture-raised pork",
      "No antibiotics or hormones",
      "Versatile for any cuisine",
      "Perfect fat-to-meat ratio",
      "Great for sausage making"
    ]
  }
];

const addOns = [
  { name: "Atlantic Salmon, Wild-Caught", price: 12.99, image: "/salmon.jpg" },
  { name: "Ribeye Steak, USDA Choice, Grass-Fed", price: 28.99, image: "/ribeye.jpg" },
  { name: "Ground Beef 93/7", price: 8.29, image: "/ground-beef.jpg" },
  { name: "Bacon, Uncured", price: 9.99, image: "/bacon.jpg" },
  { name: "Chicken Breast, Organic", price: 11.99, image: "/chicken-breast.jpg" },
  { name: "Pork Chops, Bone-In", price: 13.99, image: "/pork-chops.jpg" },
];

const faqs = [
  {
    question: "What makes the Keto Box perfect for a ketogenic diet?",
    answer: "The Keto Box is specifically curated with high-quality proteins and healthy fats perfect for keto. All items are zero-carb, hormone-free, and include a variety of beef, chicken, and pork to keep your meals interesting while staying in ketosis."
  },
  {
    question: "How is the meat packaged and shipped?",
    answer: "All meat is vacuum-sealed individually and shipped in an insulated box with dry ice to ensure it arrives fresh and frozen. The packaging is designed to keep your meat frozen for up to 48 hours in transit."
  },
  {
    question: "Is the meat really grass-fed and pasture-raised?",
    answer: "Yes! Our beef is 100% grass-fed and grass-finished from cattle raised on open pastures. Our chicken is pasture-raised with access to bugs, grass, and sunshine. We work directly with farms that prioritize animal welfare and sustainable practices."
  },
  {
    question: "How long will the Keto Box last?",
    answer: "The Keto Box contains approximately 14 lbs of protein, which typically lasts 2-4 weeks for most individuals following a keto diet. All meat can be frozen for up to 6-12 months when properly stored."
  },
  {
    question: "Can I customize what's in my box?",
    answer: "The Keto Box comes with our curated selection of proteins perfect for keto. However, you can add additional items from our add-ons section below or build a custom box using our Build Your Box feature."
  },
  {
    question: "What's your return policy?",
    answer: "We stand behind our quality 100%. If you're not satisfied with any product, contact us within 7 days of delivery and we'll make it right with a refund or replacement."
  }
];

export default function KetoBoxPage() {
  const [quantity, setQuantity] = useState(1);
  const [selectedProtein, setSelectedProtein] = useState<number | null>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<Set<number>>(new Set());

  const basePrice = 169.00;
  const totalPrice = basePrice * quantity + Array.from(selectedAddOns).reduce((sum, idx) => sum + addOns[idx].price, 0);

  const toggleAddOn = (index: number) => {
    const newSet = new Set(selectedAddOns);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setSelectedAddOns(newSet);
  };

  return (
    <div className="min-h-screen bg-meatzy-tallow pt-32 pb-20">

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gradient-to-br from-meatzy-rare to-meatzy-welldone rounded-2xl shadow-2xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10 text-center text-white p-8">
                <div className="w-32 h-32 mx-auto mb-6">
                  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="20" y="30" width="60" height="45" rx="4" />
                    <path d="M 30 30 Q 50 15 70 30" fill="none" strokeLinecap="round" />
                    <circle cx="40" cy="50" r="3" fill="currentColor" />
                    <circle cx="60" cy="50" r="3" fill="currentColor" />
                    <path d="M 35 60 Q 50 68 65 60" fill="none" strokeLinecap="round" strokeWidth="3" />
                  </svg>
                </div>
                <h2 className="text-5xl font-black font-slab uppercase">Keto Box</h2>
                <p className="text-xl mt-2 opacity-90">14 lbs of Premium Protein</p>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 text-center border border-meatzy-mint/30">
                <Truck className="w-8 h-8 mx-auto mb-2 text-meatzy-rare" />
                <p className="text-xs font-bold text-meatzy-olive">Free Shipping</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center border border-meatzy-mint/30">
                <Shield className="w-8 h-8 mx-auto mb-2 text-meatzy-rare" />
                <p className="text-xs font-bold text-meatzy-olive">100% Grass-Fed</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center border border-meatzy-mint/30">
                <Award className="w-8 h-8 mx-auto mb-2 text-meatzy-rare" />
                <p className="text-xs font-bold text-meatzy-olive">Premium Quality</p>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white border border-meatzy-mint rounded-full px-4 py-2 mb-4">
              <Star className="w-4 h-4 text-meatzy-gold fill-meatzy-gold" />
              <span className="text-sm font-bold text-meatzy-olive">KETO FRIENDLY</span>
            </div>

            <h1 className="text-5xl font-black font-slab text-meatzy-olive uppercase mb-4">
              Keto Box
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 text-meatzy-gold fill-meatzy-gold" />
                ))}
              </div>
              <span className="text-sm text-gray-600">(127 reviews)</span>
            </div>

            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Fuel your ketogenic lifestyle with our premium Keto Box. Packed with 14 lbs of the highest quality,
              grass-fed beef, pasture-raised chicken, and heritage pork—all carefully selected to keep you in ketosis
              while delivering maximum flavor and nutrition.
            </p>

            <div className="bg-white rounded-xl border border-meatzy-mint/30 p-6 mb-6">
              <h3 className="font-black text-meatzy-olive uppercase mb-3 flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                What's Inside (14 lbs total)
              </h3>
              <ul className="space-y-2">
                {proteins.map((protein, idx) => (
                  <li key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-700">{protein.name}</span>
                    <span className="font-bold text-meatzy-olive">{protein.weight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price and Add to Cart */}
            <div className="bg-gradient-to-r from-meatzy-rare/10 to-meatzy-welldone/10 rounded-xl p-6 border-2 border-meatzy-rare/20 mb-6">
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Price</p>
                  <p className="text-4xl font-black text-meatzy-olive">
                    ${totalPrice.toFixed(2)}
                  </p>
                  {selectedAddOns.size > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      Includes {selectedAddOns.size} add-on{selectedAddOns.size > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Quantity</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg bg-white border border-gray-300 font-bold hover:bg-gray-50"
                    >
                      −
                    </button>
                    <span className="w-12 text-center font-bold text-xl">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-lg bg-white border border-gray-300 font-bold hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <button className="w-full bg-meatzy-rare text-white py-4 font-display font-bold uppercase tracking-widest hover:bg-meatzy-welldone transition-colors rounded-lg flex items-center justify-center gap-3">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
            </div>

            <div className="text-sm text-gray-600 space-y-2">
              <p className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                Ships frozen with dry ice
              </p>
              <p className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                Free shipping on all orders
              </p>
              <p className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                100% satisfaction guarantee
              </p>
            </div>
          </div>
        </div>

        {/* What's Inside - Interactive Cards */}
        <div className="mb-16">
          <h2 className="text-4xl font-black font-slab text-meatzy-olive uppercase text-center mb-4">
            What's Inside Your Keto Box
          </h2>
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            Hover or tap each protein to learn more about what makes it special
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proteins.map((protein, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border-2 border-meatzy-mint/30 overflow-hidden hover:border-meatzy-rare transition-all cursor-pointer group"
                onMouseEnter={() => setSelectedProtein(idx)}
                onMouseLeave={() => setSelectedProtein(null)}
                onClick={() => setSelectedProtein(selectedProtein === idx ? null : idx)}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-black text-meatzy-olive uppercase text-sm leading-tight pr-2">
                      {protein.name}
                    </h3>
                    <span className="text-meatzy-rare font-bold text-lg whitespace-nowrap">
                      {protein.weight}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    {protein.description}
                  </p>

                  {/* Expandable Features */}
                  <div className={`transition-all duration-300 ${selectedProtein === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <p className="text-xs font-bold text-meatzy-olive uppercase mb-2">Key Features:</p>
                      <ul className="space-y-1">
                        {protein.features.map((feature, fIdx) => (
                          <li key={fIdx} className="text-xs text-gray-600 flex items-start gap-2">
                            <Check className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="text-xs text-meatzy-rare font-bold uppercase mt-3 flex items-center gap-1 group-hover:gap-2 transition-all">
                    {selectedProtein === idx ? 'Hide' : 'Learn More'}
                    <ChevronDown className={`w-4 h-4 transition-transform ${selectedProtein === idx ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add-Ons Section - Upsell */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-meatzy-rare to-meatzy-welldone rounded-2xl p-8 text-white mb-8">
            <h2 className="text-4xl font-black font-slab uppercase text-center mb-2">
              🔥 Boost Your Box
            </h2>
            <p className="text-center text-lg opacity-90">
              Add premium proteins to your order and save on shipping
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {addOns.map((addon, idx) => (
              <div
                key={idx}
                className={`bg-white rounded-xl border-2 p-4 cursor-pointer transition-all ${
                  selectedAddOns.has(idx)
                    ? 'border-meatzy-rare shadow-lg scale-105'
                    : 'border-meatzy-mint/30 hover:border-meatzy-mint'
                }`}
                onClick={() => toggleAddOn(idx)}
              >
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                  <ShoppingCart className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-bold text-meatzy-olive text-sm mb-1 leading-tight">
                  {addon.name}
                </h3>
                <p className="text-lg font-black text-meatzy-rare">
                  ${addon.price.toFixed(2)}
                </p>
                {selectedAddOns.has(idx) && (
                  <div className="mt-2 bg-green-100 text-green-700 text-xs font-bold py-1 px-2 rounded-full text-center">
                    ✓ Added
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-16">
          <h2 className="text-4xl font-black font-slab text-meatzy-olive uppercase text-center mb-8">
            Frequently Asked Questions
          </h2>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-meatzy-mint/30 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-bold text-meatzy-olive pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-meatzy-rare flex-shrink-0 transition-transform ${
                      expandedFAQ === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`transition-all duration-300 ${
                    expandedFAQ === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  } overflow-hidden`}
                >
                  <div className="px-6 pb-4 text-gray-700">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Placeholder */}
        <div className="bg-white rounded-2xl border border-meatzy-mint/30 p-12 text-center">
          <Star className="w-16 h-16 mx-auto mb-4 text-meatzy-gold" />
          <h2 className="text-3xl font-black font-slab text-meatzy-olive uppercase mb-2">
            Customer Reviews
          </h2>
          <p className="text-gray-600 mb-6">
            Reviews from Yotpo will appear here
          </p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-8 h-8 text-meatzy-gold fill-meatzy-gold" />
            ))}
          </div>
          <p className="text-2xl font-bold text-meatzy-olive mt-4">4.7 out of 5</p>
          <p className="text-gray-600">Based on 127 reviews</p>
        </div>
      </div>
    </div>
  );
}

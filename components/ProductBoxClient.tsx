'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Star, Check, ChevronDown, ShoppingCart, Truck, Shield, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { createCart, addToCart as addToShopifyCart, getCartId, saveCartId, saveCheckoutUrl, getCheckoutUrl } from '@/lib/shopify';

interface ProductImage {
  url: string;
  altText: string;
}

interface AddOn {
  name: string;
  price: number;
  image: string;
  handle: string;
  variantId?: string;
}

interface BoxItem {
  name: string;
  description: string;
  image: string;
  handle: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface ProductBoxClientProps {
  productTitle: string;
  productHandle: string;
  productDescription: string;
  productBadge: string;
  productImages: ProductImage[];
  addOns: AddOn[];
  basePrice: number;
  productItems: string[];
  boxItems: BoxItem[];
  faqs: FAQ[];
  variantId: string;
}


export default function ProductBoxClient({ productTitle, productHandle, productDescription, productBadge, productImages, addOns, basePrice, productItems, boxItems, faqs, variantId }: ProductBoxClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<Set<number>>(new Set());
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllAddOns, setShowAllAddOns] = useState(false);
  const [expandedBoxItem, setExpandedBoxItem] = useState<number | null>(null);
  const [subscriptionFrequency, setSubscriptionFrequency] = useState<'weekly' | 'biweekly' | 'monthly' | '6weeks' | 'bimonthly'>('monthly');
  const [addingToCart, setAddingToCart] = useState(false);

  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const totalPrice = basePrice * quantity + Array.from(selectedAddOns).reduce((sum, idx) => sum + addOns[idx].price, 0);

  const handleAddToCart = async () => {
    setAddingToCart(true);

    try {
      let cartId = getCartId();

      if (!cartId) {
        // Create new cart with main product
        const cart = await createCart(variantId, quantity);
        if (cart) {
          saveCartId(cart.id);
          saveCheckoutUrl(cart.checkoutUrl);
          cartId = cart.id;
        } else {
          alert('Failed to create cart. Please try again.');
          setAddingToCart(false);
          return;
        }
      } else {
        // Add main product to existing cart
        const cart = await addToShopifyCart(cartId, [{
          merchandiseId: variantId,
          quantity,
          attributes: [
            { key: 'Subscription Frequency', value: subscriptionFrequency }
          ]
        }]);
        if (cart) {
          saveCheckoutUrl(cart.checkoutUrl);
        }
      }

      // Add selected add-ons if any
      if (selectedAddOns.size > 0) {
        const addOnItems = Array.from(selectedAddOns)
          .map(idx => ({
            merchandiseId: addOns[idx].variantId || '',
            quantity: 1
          }))
          .filter(item => item.merchandiseId);

        if (addOnItems.length > 0) {
          await addToShopifyCart(cartId, addOnItems);
        }
      }

      // Redirect to checkout
      const checkoutUrl = getCheckoutUrl();
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  // Image navigation functions
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  // Swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      // Swiped left
      nextImage();
    } else if (touchEndX.current - touchStartX.current > 50) {
      // Swiped right
      prevImage();
    }
  };

  // Show first 6 add-ons initially, then all when expanded
  const displayedAddOns = showAllAddOns ? addOns : addOns.slice(0, 6);

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
    <div className="min-h-screen bg-meatzy-tallow -mt-[140px] pt-32 pb-20">

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Product Image */}
            <div
              className="aspect-square bg-white rounded-2xl shadow-2xl relative overflow-hidden border border-meatzy-mint/30 group cursor-pointer"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onClick={nextImage}
            >
              {productImages.length > 0 ? (
                <>
                  <Image
                    src={productImages[currentImageIndex].url}
                    alt={productImages[currentImageIndex].altText || productTitle}
                    fill
                    className="object-cover"
                    priority
                  />

                  {/* Navigation Arrows - Desktop */}
                  {productImages.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          prevImage();
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-meatzy-olive rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          nextImage();
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-meatzy-olive rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  {productImages.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {currentImageIndex + 1} / {productImages.length}
                    </div>
                  )}
                </>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-meatzy-rare to-meatzy-welldone flex items-center justify-center">
                  <div className="text-center text-white p-8">
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
              )}
            </div>

            {/* Image Thumbnails */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {productImages.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === idx
                        ? 'border-meatzy-rare shadow-lg'
                        : 'border-meatzy-mint/30 hover:border-meatzy-mint'
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.altText || `${productTitle} ${idx + 1}`}
                      width={100}
                      height={100}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 text-center border border-meatzy-mint/30">
                <Truck className="w-8 h-8 mx-auto mb-2 text-meatzy-rare" />
                <p className="text-xs font-bold text-meatzy-olive">Ships Frozen with Dry Ice</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center border border-meatzy-mint/30">
                <Shield className="w-8 h-8 mx-auto mb-2 text-meatzy-rare" />
                <p className="text-xs font-bold text-meatzy-olive">100% Satisfaction Guarantee</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center border border-meatzy-mint/30">
                <Award className="w-8 h-8 mx-auto mb-2 text-meatzy-rare" />
                <p className="text-xs font-bold text-meatzy-olive">Free Shipping</p>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white border border-meatzy-mint rounded-full px-4 py-2 mb-4">
              <Star className="w-4 h-4 text-meatzy-gold fill-meatzy-gold" />
              <span className="text-sm font-bold text-meatzy-olive">{productBadge}</span>
            </div>

            <h1 className="text-5xl font-black font-slab text-meatzy-olive uppercase mb-4">
              {productTitle}
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
              {productDescription}
            </p>

            <div className="bg-white rounded-xl border border-meatzy-mint/30 p-6 mb-6">
              <h3 className="font-black text-meatzy-olive uppercase mb-3 flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                What's Inside
              </h3>
              <ul className="space-y-2">
                {productItems.map((item, idx) => (
                  <li key={idx} className="flex text-sm">
                    <Check className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Subscription Selector */}
            <div className="mb-6 bg-gradient-to-br from-white to-meatzy-mint/5 rounded-2xl border-2 border-meatzy-mint/40 p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-meatzy-rare rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-black text-meatzy-olive uppercase">Subscription Frequency</h3>
              </div>

              {/* Subscription Frequency Options as Compact Cards */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                {[
                  { value: 'weekly', label: 'Weekly' },
                  { value: 'biweekly', label: 'Bi-Weekly' },
                  { value: 'monthly', label: 'Monthly' },
                  { value: '6weeks', label: '6 Week' },
                  { value: 'bimonthly', label: 'Bi-Monthly' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSubscriptionFrequency(option.value as any)}
                    className={`relative px-3 py-2.5 rounded-lg border-2 transition-all text-left group hover:border-meatzy-rare hover:shadow ${
                      subscriptionFrequency === option.value
                        ? 'border-meatzy-rare bg-meatzy-rare/5 shadow'
                        : 'border-meatzy-mint/30 bg-white'
                    } ${option.value === 'bimonthly' ? 'col-span-2' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-meatzy-olive uppercase text-xs">
                        {option.label}
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ml-2 ${
                        subscriptionFrequency === option.value
                          ? 'border-meatzy-rare bg-meatzy-rare'
                          : 'border-gray-300 group-hover:border-meatzy-rare'
                      }`}>
                        {subscriptionFrequency === option.value && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-600 bg-white/60 rounded-lg p-2.5 border border-meatzy-mint/30">
                <div>
                  <span className="font-bold text-meatzy-olive">Flexible:</span> Skip or cancel anytime
                </div>
              </div>
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

              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="w-full bg-meatzy-rare text-white py-4 font-display font-bold uppercase tracking-widest hover:bg-meatzy-welldone transition-colors rounded-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>

        {/* Add-Ons Section - Prominently Placed */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-meatzy-rare/90 to-meatzy-welldone/90 rounded-xl p-5 text-white mb-6">
            <h3 className="text-2xl font-black font-slab uppercase text-center mb-1">
              Boost Your Box
            </h3>
            <p className="text-center text-sm opacity-90">
              Add premium proteins and save on shipping
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {displayedAddOns.map((addon, idx) => (
              <div
                key={idx}
                className={`bg-white rounded-xl border-2 p-4 cursor-pointer transition-all ${
                  selectedAddOns.has(idx)
                    ? 'border-meatzy-rare shadow-lg scale-105'
                    : 'border-meatzy-mint/30 hover:border-meatzy-mint'
                }`}
                onClick={() => toggleAddOn(idx)}
              >
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 relative overflow-hidden">
                  {addon.image ? (
                    <Image
                      src={addon.image}
                      alt={addon.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ShoppingCart className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-meatzy-olive text-sm mb-1 leading-tight">
                  {addon.name}
                </h3>
                <p className="text-lg font-black text-meatzy-rare">
                  ${addon.price.toFixed(2)}
                </p>
                {selectedAddOns.has(idx) && (
                  <div className="mt-2 bg-green-100 text-green-700 text-xs font-bold py-1 px-2 rounded-full text-center flex items-center justify-center gap-1">
                    <Check className="w-3 h-3" /> Added
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Show More/Less Button */}
          {addOns.length > 6 && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowAllAddOns(!showAllAddOns)}
                className="bg-white border-2 border-meatzy-rare text-meatzy-rare px-8 py-3 rounded-lg font-bold uppercase tracking-wide hover:bg-meatzy-rare hover:text-white transition-all"
              >
                {showAllAddOns ? (
                  <>Show Less</>
                ) : (
                  <>Show {addOns.length - 6} More Add-Ons</>
                )}
              </button>
            </div>
          )}
        </div>

        {/* What's Inside - Interactive Cards */}
        {boxItems && boxItems.length > 0 && (
          <div className="mb-16">
            <h2 className="text-4xl font-black font-slab text-meatzy-olive uppercase text-center mb-4">
              What's Inside Your {productTitle}
            </h2>
            <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
              Tap each item to learn more about what makes it special
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {boxItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border-2 border-meatzy-mint/30 overflow-hidden hover:border-meatzy-rare transition-all cursor-pointer group"
                onClick={() => setExpandedBoxItem(expandedBoxItem === idx ? null : idx)}
              >
                {/* Product Image */}
                {item.image && (
                  <div className="aspect-video relative overflow-hidden bg-gray-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="p-6">
                  <h3 className="font-black text-meatzy-olive uppercase text-sm leading-tight mb-3">
                    {item.name}
                  </h3>

                  {/* Expandable Description */}
                  <div className={`transition-all duration-300 ${expandedBoxItem === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                    <div className="border-t border-gray-200 pt-3 mb-3">
                      <p className="text-sm text-gray-600">
                        {item.description || `Premium quality product, carefully selected for your ${productTitle}.`}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-meatzy-rare font-bold uppercase mt-3 flex items-center gap-1 group-hover:gap-2 transition-all">
                    {expandedBoxItem === idx ? 'Hide Details' : 'Learn More'}
                    <ChevronDown className={`w-4 h-4 transition-transform ${expandedBoxItem === idx ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </div>
              ))}
            </div>
          </div>
        )}

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

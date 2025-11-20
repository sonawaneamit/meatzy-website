'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Plus, Minus, ShoppingCart } from 'lucide-react';
import type { ShopifyProduct } from '../../../lib/shopify/types';

interface StepTwoSelectAddOnsProps {
  addOnProducts: ShopifyProduct[];
  selectedAddOns: Array<{ variantId: string; quantity: number }>;
  onAddOnsChange: (addOns: Array<{ variantId: string; quantity: number }>) => void;
  onContinue: () => void;
  onBack: () => void;
}

export default function StepTwoSelectAddOns({
  addOnProducts,
  selectedAddOns,
  onAddOnsChange,
  onContinue,
  onBack,
}: StepTwoSelectAddOnsProps) {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Extract unique categories from tags
  const categories = useMemo(() => {
    const allTags = addOnProducts.flatMap(p => p.tags || []);
    const uniqueTags = Array.from(new Set(allTags));
    return ['all', ...uniqueTags];
  }, [addOnProducts]);

  // Filter products by category
  const filteredProducts = useMemo(() => {
    if (categoryFilter === 'all') return addOnProducts;
    return addOnProducts.filter(p => p.tags?.includes(categoryFilter));
  }, [addOnProducts, categoryFilter]);

  // Calculate total add-ons cost
  const addOnsTotal = useMemo(() => {
    return selectedAddOns.reduce((total, addOn) => {
      const product = addOnProducts.find(p =>
        p.variants.some(v => v.id === addOn.variantId)
      );
      const variant = product?.variants.find(v => v.id === addOn.variantId);
      if (variant) {
        return total + parseFloat(variant.price.amount) * addOn.quantity;
      }
      return total;
    }, 0);
  }, [selectedAddOns, addOnProducts]);

  const handleAddToCart = (product: ShopifyProduct) => {
    const variant = product.variants[0]; // Use first variant for now
    if (!variant) return;

    const existing = selectedAddOns.find(a => a.variantId === variant.id);
    if (existing) {
      // Increment quantity
      onAddOnsChange(
        selectedAddOns.map(a =>
          a.variantId === variant.id
            ? { ...a, quantity: a.quantity + 1 }
            : a
        )
      );
    } else {
      // Add new
      onAddOnsChange([...selectedAddOns, { variantId: variant.id, quantity: 1 }]);
    }
  };

  const handleQuantityChange = (variantId: string, delta: number) => {
    const existing = selectedAddOns.find(a => a.variantId === variantId);
    if (!existing) return;

    const newQuantity = existing.quantity + delta;
    if (newQuantity <= 0) {
      // Remove from cart
      onAddOnsChange(selectedAddOns.filter(a => a.variantId !== variantId));
    } else {
      // Update quantity
      onAddOnsChange(
        selectedAddOns.map(a =>
          a.variantId === variantId
            ? { ...a, quantity: newQuantity }
            : a
        )
      );
    }
  };

  const getProductQuantity = (product: ShopifyProduct): number => {
    const variant = product.variants[0];
    const addOn = selectedAddOns.find(a => a.variantId === variant?.id);
    return addOn?.quantity || 0;
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Headline */}
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-black font-slab text-meatzy-olive uppercase mb-4">
          Select Add-ons
        </h1>
        <p className="text-xl text-gray-600">
          Enhance your box with premium cuts (optional)
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-8 flex flex-wrap gap-3 justify-center">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setCategoryFilter(category)}
            className={`
              px-6 py-3 rounded-full font-bold uppercase text-sm tracking-wider
              transition-all duration-300
              ${
                categoryFilter === category
                  ? 'bg-meatzy-olive text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-meatzy-dill'
              }
            `}
          >
            {category === 'all' ? 'All Products' : category}
          </button>
        ))}
      </div>

      {/* Add-ons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filteredProducts.map((product) => {
          const variant = product.variants[0];
          const quantity = getProductQuantity(product);
          const isInCart = quantity > 0;

          return (
            <div
              key={product.id}
              className={`
                bg-white rounded-xl border-2 overflow-hidden shadow-lg
                transition-all duration-300
                ${isInCart ? 'border-meatzy-olive' : 'border-gray-200'}
              `}
            >
              {/* Product Image */}
              <div className="relative aspect-square bg-gray-100">
                {product.featuredImage ? (
                  <Image
                    src={product.featuredImage.url}
                    alt={product.featuredImage.altText || product.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}

                {/* In Cart Badge */}
                {isInCart && (
                  <div className="absolute top-4 right-4 bg-meatzy-olive text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <ShoppingCart className="w-4 h-4" />
                    {quantity}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="p-4 space-y-3">
                <h3 className="text-lg font-bold font-slab text-meatzy-olive uppercase line-clamp-2">
                  {product.title}
                </h3>

                {/* Price */}
                {variant && (
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black font-slab text-meatzy-olive">
                      ${parseFloat(variant.price.amount).toFixed(2)}
                    </span>
                    {variant.compareAtPrice && parseFloat(variant.compareAtPrice.amount) > parseFloat(variant.price.amount) && (
                      <span className="text-sm text-gray-500 line-through">
                        ${parseFloat(variant.compareAtPrice.amount).toFixed(2)}
                      </span>
                    )}
                  </div>
                )}

                {/* Add to Cart / Quantity Controls */}
                {!isInCart ? (
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={!variant?.availableForSale}
                    className="
                      w-full py-3 px-4
                      bg-meatzy-dill hover:bg-meatzy-olive
                      text-white font-bold uppercase text-sm
                      rounded-lg
                      transition-all duration-300
                      disabled:opacity-50 disabled:cursor-not-allowed
                      flex items-center justify-center gap-2
                    "
                  >
                    <Plus className="w-4 h-4" />
                    Add to Box
                  </button>
                ) : (
                  <div className="flex items-center justify-between bg-meatzy-tallow rounded-lg p-2">
                    <button
                      onClick={() => handleQuantityChange(variant!.id, -1)}
                      className="w-10 h-10 bg-white hover:bg-meatzy-dill hover:text-white rounded-lg flex items-center justify-center transition-all"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="text-xl font-black font-slab text-meatzy-olive">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(variant!.id, 1)}
                      className="w-10 h-10 bg-white hover:bg-meatzy-olive hover:text-white rounded-lg flex items-center justify-center transition-all"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Bar */}
      <div className="sticky bottom-0 bg-white border-t-4 border-meatzy-olive shadow-2xl p-6 rounded-t-2xl">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-gray-600 uppercase tracking-wider font-semibold">
                Add-ons Total:
              </div>
              <div className="text-3xl font-black font-slab text-meatzy-olive">
                ${addOnsTotal.toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">
                {selectedAddOns.reduce((sum, a) => sum + a.quantity, 0)} item(s) selected
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={onBack}
              className="
                py-4 px-6
                bg-gray-200 hover:bg-gray-300
                text-gray-800 font-bold font-slab uppercase
                rounded-xl
                transition-all duration-300
                flex items-center justify-center gap-2
              "
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>
            <button
              onClick={onContinue}
              className="
                py-4 px-6
                bg-meatzy-olive hover:bg-meatzy-dill
                text-white font-bold font-slab uppercase
                rounded-xl shadow-lg
                transition-all duration-300
                flex items-center justify-center gap-2
              "
            >
              Continue to Checkout
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

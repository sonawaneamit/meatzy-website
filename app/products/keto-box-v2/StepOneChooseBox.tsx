'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import type { ShopifyProduct } from '../../../lib/shopify/types';

interface StepOneChooseBoxProps {
  product: ShopifyProduct;
  onSelect: (variantId: string) => void;
}

export default function StepOneChooseBox({
  product,
  onSelect,
}: StepOneChooseBoxProps) {
  // Ensure variants is an array
  const variants = Array.isArray(product.variants) ? product.variants : [];

  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    variants[0]?.id || ''
  );

  const selectedVariant = variants.find(v => v.id === selectedVariantId);

  const handleContinue = () => {
    if (selectedVariantId) {
      onSelect(selectedVariantId);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Headline */}
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-black font-slab text-meatzy-olive uppercase mb-4">
          Choose Your Box
        </h1>
        <p className="text-xl text-gray-600">
          Select the size that works best for you
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Product Image */}
        <div className="relative">
          <div className="aspect-square relative rounded-2xl overflow-hidden bg-white shadow-xl">
            {product.featuredImage ? (
              <Image
                src={product.featuredImage.url}
                alt={product.featuredImage.altText || product.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <span className="text-gray-400">No image</span>
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-8">
          {/* Product Title */}
          <div>
            <h2 className="text-4xl font-black font-slab text-meatzy-olive uppercase mb-4">
              {product.title}
            </h2>
            {product.description && (
              <div
                className="text-gray-700 leading-relaxed prose prose-lg"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            )}
          </div>

          {/* Variant Selection */}
          {variants.length > 1 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold font-slab text-meatzy-olive uppercase">
                Select Size:
              </h3>
              <div className="grid gap-3">
                {variants.map((variant) => {
                  const isSelected = variant.id === selectedVariantId;
                  const isAvailable = variant.availableForSale;

                  return (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariantId(variant.id)}
                      disabled={!isAvailable}
                      className={`
                        relative p-6 rounded-xl border-2 text-left transition-all
                        ${
                          isSelected
                            ? 'border-meatzy-olive bg-meatzy-tallow shadow-lg'
                            : isAvailable
                            ? 'border-gray-300 bg-white hover:border-meatzy-dill hover:shadow-md'
                            : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-lg font-bold text-meatzy-olive">
                            {variant.title}
                          </div>
                          {!isAvailable && (
                            <span className="text-sm text-red-600 font-semibold">
                              Out of Stock
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black font-slab text-meatzy-olive">
                            ${parseFloat(variant.price.amount).toFixed(2)}
                          </div>
                          {variant.compareAtPrice && parseFloat(variant.compareAtPrice.amount) > parseFloat(variant.price.amount) && (
                            <div className="text-sm text-gray-500 line-through">
                              ${parseFloat(variant.compareAtPrice.amount).toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Selection Indicator */}
                      {isSelected && (
                        <div className="absolute top-4 right-4 w-6 h-6 bg-meatzy-olive rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Price Display (if single variant) */}
          {variants.length === 1 && selectedVariant && (
            <div className="bg-meatzy-tallow p-6 rounded-xl border-2 border-meatzy-olive">
              <div className="text-4xl font-black font-slab text-meatzy-olive">
                ${parseFloat(selectedVariant.price.amount).toFixed(2)}
              </div>
              {selectedVariant.compareAtPrice && parseFloat(selectedVariant.compareAtPrice.amount) > parseFloat(selectedVariant.price.amount) && (
                <div className="text-xl text-gray-500 line-through">
                  ${parseFloat(selectedVariant.compareAtPrice.amount).toFixed(2)}
                </div>
              )}
            </div>
          )}

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={!selectedVariantId || !selectedVariant?.availableForSale}
            className="
              w-full py-5 px-8
              bg-meatzy-olive hover:bg-meatzy-dill
              text-white font-black font-slab text-xl uppercase
              rounded-xl shadow-lg
              transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-3
            "
          >
            Continue to Add-ons
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Additional Product Info */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

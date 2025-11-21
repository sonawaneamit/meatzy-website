'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product } from '../lib/shopify/types';
import { getCollectionByHandle, createCart, addToCart as addToShopifyCart, getCartId, saveCartId, saveCheckoutUrl, getCheckoutUrl } from '../lib/shopify';
import { AddonsModal } from './AddonsModal';
import { ArrowRight, Check, Star } from 'lucide-react';

export const ProductGrid: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddonsModal, setShowAddonsModal] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  // Map product handles to local images
  const getLocalImage = (handle: string) => {
    const imageMap: { [key: string]: string } = {
      'family-faves-box': '/family-faves-box.jpeg',
      'family-favorites': '/family-faves-box.jpeg',
      'family-favorites-box': '/family-faves-box.jpeg',
      'holiday-box': '/holiday-box.jpeg',
      'keto-box': '/keto-box.jpeg',
      'lean-machine-box': '/lean-machine-box.jpeg',
      'lean-machine': '/lean-machine-box.jpeg',
    };

    // Debug: log the handle
    console.log('Product handle:', handle, 'Mapped image:', imageMap[handle]);

    return imageMap[handle] || null;
  };

  // Map product handles to custom descriptions (same as product pages)
  const getCustomDescription = (handle: string) => {
    const descriptionMap: { [key: string]: string } = {
      'keto-box': 'Power your keto diet with premium grass-fed beef, pasture-raised chicken, and heritage pork. Our Keto Box delivers high-protein, zero-carb cuts perfect for low-carb meal prep.',
      'lean-machine': 'Build muscle and burn fat with our Lean Machine Box—packed with premium lean proteins including 93/7 ground beef, skinless chicken breast, and tenderloin cuts.',
      'family-favorites': 'Simplify dinner time with family-friendly favorites the whole household will love. Versatile cuts perfect for busy weeknight meals and weekend BBQs.',
      'holiday-box': 'Make every holiday meal unforgettable with premium grass-fed beef and specialty cuts. Show-stopping short ribs, tri-tip steaks, and entertaining essentials.',
    };

    return descriptionMap[handle] || null;
  };

  useEffect(() => {
    getCollectionByHandle('homepage-boxes').then(collection => {
      if (collection) {
        setProducts(collection.products.edges.map(edge => edge.node));
      }
      setLoading(false);
    });
  }, []);

  const handleAddToCart = async (product: Product) => {
    setAddingToCart(true);

    try {
      console.log('=== ADDING PRODUCT TO CART ===');
      console.log('Product:', product);
      console.log('Product title:', product.title);
      console.log('Product ID:', product.id);
      console.log('Variants:', product.variants);

      // Check if this is the Custom Box - redirect to builder instead
      if (product.title.toLowerCase().includes('custom box') || product.handle === 'custom-box') {
        console.log('Custom Box detected - redirecting to builder');
        window.location.href = '/build-box';
        return;
      }

      // Get the first variant ID
      const variantId = product.variants.edges[0]?.node.id;
      const variant = product.variants.edges[0]?.node;
      console.log('Selected variant ID:', variantId);
      console.log('Variant details:', variant);
      console.log('Product availableForSale:', product.availableForSale);
      console.log('Variant availableForSale:', variant?.availableForSale);

      if (!variantId) {
        alert('Product variant not available');
        return;
      }

      if (!product.availableForSale || !variant?.availableForSale) {
        console.error('Product or variant not available for sale!');
        alert('This product is currently not available for purchase.');
        return;
      }

      // Check if we have an existing cart
      let cartId = getCartId();

      if (!cartId) {
        // Create new cart
        const cart = await createCart(variantId, 1);
        if (cart) {
          console.log('Cart created:', cart.id, 'Checkout URL:', cart.checkoutUrl);
          saveCartId(cart.id);
          await saveCheckoutUrl(cart.checkoutUrl);
        } else {
          alert('Failed to create cart. Please ensure the product allows one-time purchases.');
          return;
        }
      } else {
        // Add to existing cart
        const cart = await addToShopifyCart(cartId, [{ merchandiseId: variantId, quantity: 1 }]);
        if (cart) {
          console.log('Added to cart, Checkout URL:', cart.checkoutUrl);
          await saveCheckoutUrl(cart.checkoutUrl);
        } else {
          alert('Failed to add to cart. Please try again.');
          return;
        }
      }

      // Show add-ons modal after successfully adding to cart
      setShowAddonsModal(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddAddons = async (selectedAddons: { product: Product; quantity: number }[]) => {
    const cartId = getCartId();
    if (!cartId) {
      console.error('No cart ID found when adding add-ons');
      return;
    }

    const lines = selectedAddons.map(({ product, quantity }) => ({
      merchandiseId: product.variants.edges[0]?.node.id || '',
      quantity,
    }));

    console.log('Adding add-ons to cart:', lines);
    const cart = await addToShopifyCart(cartId, lines);
    if (cart) {
      console.log('Add-ons added, updated checkout URL:', cart.checkoutUrl);
      await saveCheckoutUrl(cart.checkoutUrl);
    } else {
      console.error('Failed to add add-ons to cart');
    }
  };

  const handleContinueToCart = () => {
    setShowAddonsModal(false);
    // Redirect to Shopify checkout using the stored checkout URL
    const checkoutUrl = getCheckoutUrl();
    console.log('Checkout URL:', checkoutUrl); // Debug log
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    } else {
      console.error('No checkout URL found in localStorage');
      alert('Cart not found. Please try adding items again.');
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20 text-meatzy-welldone font-display font-bold tracking-widest uppercase text-xl">Loading premium cuts...</div>;
  }

  return (
    <>
    <div className="text-center mb-20 max-w-2xl mx-auto">
        <span className="text-meatzy-rare font-marker text-2xl md:text-3xl transform -rotate-2 mb-4 block">Best Sellers</span>
        <h2 className="text-4xl md:text-6xl font-black font-slab text-meatzy-olive leading-tight mb-6">Shop Our Boxes</h2>
        <p className="text-lg text-meatzy-olive/70">Curated collections of premium, sustainably-raised protein.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      {products.map((product, index) => (
        <div key={product.id} className="flex flex-col bg-white rounded-xl overflow-hidden border border-meatzy-mint/50 shadow-lg hover:shadow-2xl transition-all duration-300 group relative">

          {/* Best Seller Tag */}
          {index === 0 && (
              <div className="absolute top-4 left-4 z-20 bg-meatzy-rare text-white text-xs font-bold uppercase px-3 py-1 tracking-wider shadow-md">
                  Best Seller
              </div>
          )}

          <div className="relative aspect-[5/4] overflow-hidden bg-gray-100">
            {/* Check if this is Custom Box - if so, show simple image without hover effect */}
            {product.title.toLowerCase().includes('custom box') || product.handle === 'custom-box' ? (
              <img
                src={product.featuredImage.url}
                alt={product.featuredImage.altText}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <>
                {/* First Image (Featured) - Use local image if available */}
                <img
                  src={getLocalImage(product.handle) || product.featuredImage.url}
                  alt={product.featuredImage.altText}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-all duration-700"
                />
              </>
            )}
          </div>

          <div className="p-6 flex flex-col flex-grow text-center md:text-left">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-black font-slab text-meatzy-olive uppercase leading-tight">{product.title}</h3>
                <div className="flex text-meatzy-rare">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                </div>
            </div>

            <p className="text-gray-500 text-sm mb-6 leading-relaxed flex-grow line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
              {getCustomDescription(product.handle) || product.description}
            </p>

            <div className="space-y-2 mb-6">
                {product.tags.includes('Beef') && (
                    <div className="flex items-center gap-2 text-xs text-meatzy-olive font-bold uppercase">
                        <Check className="w-4 h-4 text-meatzy-dill" /> Chef-Selected Cuts
                    </div>
                )}
                <div className="flex items-center gap-2 text-xs text-meatzy-olive font-bold uppercase">
                    <Check className="w-4 h-4 text-meatzy-dill" /> Free Shipping
                </div>
            </div>

            <div className="mt-auto pt-4 border-t border-gray-100">
                <div className="flex justify-between items-end mb-4">
                    <div className="text-left">
                        <span className="block text-xs text-gray-400 line-through font-medium">
                            ${(parseFloat(product.priceRange.minVariantPrice.amount) * 1.2).toFixed(2)}
                        </span>
                        <span className="text-2xl font-black text-meatzy-welldone">
                            ${product.priceRange.minVariantPrice.amount}
                        </span>
                    </div>
                    <span className="text-xs font-bold text-meatzy-olive uppercase tracking-wide mb-1">
                        Per Box
                    </span>
                </div>

                {/* Different CTA based on product type */}
                {product.title.toLowerCase().includes('custom box') || product.handle === 'custom-box' ? (
                  <Link
                    href="/build-box"
                    className="w-full bg-meatzy-olive text-white py-3 font-display font-bold uppercase tracking-widest hover:bg-meatzy-rare transition-colors flex items-center justify-center gap-2"
                  >
                    Build Your Box
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                ) : (
                  <Link
                    href={`/products/${product.handle}`}
                    className="w-full bg-meatzy-olive text-white py-3 font-display font-bold uppercase tracking-widest hover:bg-meatzy-rare transition-colors flex items-center justify-center gap-2"
                  >
                    View Details
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                )}
            </div>
          </div>
        </div>
      ))}

      {/* Quiz Card */}
      <div className="flex flex-col bg-gradient-to-br from-meatzy-rare to-meatzy-welldone rounded-xl overflow-hidden border border-meatzy-rare shadow-lg hover:shadow-2xl transition-all duration-300 group relative">

        <div className="relative aspect-[5/4] overflow-hidden bg-meatzy-olive/20 flex items-center justify-center">
          <div className="text-white text-center p-8">
            <svg className="w-24 h-24 mx-auto mb-4 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <div className="text-4xl font-black font-slab uppercase">?</div>
          </div>
        </div>

        <div className="p-6 flex flex-col flex-grow text-center md:text-left bg-white">
          <div className="mb-2">
            <h3 className="text-2xl font-black font-slab text-meatzy-olive uppercase leading-tight">Not Sure Which Box?</h3>
          </div>

          <p className="text-gray-500 text-sm mb-6 leading-relaxed flex-grow">
            Take our quick 60-second quiz and we'll recommend the perfect box for your lifestyle, dietary goals, and taste preferences.
          </p>

          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2 text-xs text-meatzy-olive font-bold uppercase">
              <Check className="w-4 h-4 text-meatzy-dill" /> 60 Seconds
            </div>
            <div className="flex items-center gap-2 text-xs text-meatzy-olive font-bold uppercase">
              <Check className="w-4 h-4 text-meatzy-dill" /> Personalized Results
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-gray-100">
            <div className="mb-4 text-center">
              <span className="text-sm text-gray-600 font-medium">
                Find Your Perfect Match
              </span>
            </div>

            <Link
              href="/quiz"
              className="w-full bg-meatzy-rare text-white py-3 font-display font-bold uppercase tracking-widest hover:bg-meatzy-welldone transition-colors flex items-center justify-center gap-2"
            >
              Take the Quiz
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>

    {/* Add-ons Modal */}
    <AddonsModal
      isOpen={showAddonsModal}
      onClose={() => setShowAddonsModal(false)}
      onAddAddons={handleAddAddons}
      onContinue={handleContinueToCart}
    />
    </>
  );
};
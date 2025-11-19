'use client';

import React, { useEffect, useState } from 'react';
import { Product } from '../lib/shopify/types';
import { getCollectionByHandle, createCart, addToCart as addToShopifyCart, getCartId, saveCartId, saveCheckoutUrl, getCheckoutUrl } from '../lib/shopify';
import { AddonsModal } from './AddonsModal';
import { ArrowRight, Check, Star } from 'lucide-react';

export const ProductGrid: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubscribe, setIsSubscribe] = useState(true); // Toggle for Subscribe vs One-time
  const [showAddonsModal, setShowAddonsModal] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

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
          saveCheckoutUrl(cart.checkoutUrl);
        }
      } else {
        // Add to existing cart
        const cart = await addToShopifyCart(cartId, [{ merchandiseId: variantId, quantity: 1 }]);
        if (cart) {
          console.log('Added to cart, Checkout URL:', cart.checkoutUrl);
          saveCheckoutUrl(cart.checkoutUrl);
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
      saveCheckoutUrl(cart.checkoutUrl);
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
    <div className="text-center mb-12">
        <span className="text-meatzy-rare font-marker text-2xl md:text-3xl transform -rotate-2 mb-2 block">Best Sellers</span>
        <h2 className="text-4xl md:text-5xl font-black font-slab text-meatzy-olive uppercase mb-6">Shop Our Boxes</h2>
        
        {/* Subscribe vs One-Time Toggle */}
        <div className="inline-flex bg-white border border-meatzy-mint rounded-full p-1 relative shadow-inner mb-8">
            <button 
                onClick={() => setIsSubscribe(true)}
                className={`px-8 py-3 rounded-full text-sm font-bold uppercase tracking-wide transition-all ${isSubscribe ? 'bg-meatzy-welldone text-white shadow-md' : 'text-meatzy-olive hover:bg-gray-50'}`}
            >
                Subscribe & Save 20%
            </button>
            <button 
                 onClick={() => setIsSubscribe(false)}
                className={`px-8 py-3 rounded-full text-sm font-bold uppercase tracking-wide transition-all ${!isSubscribe ? 'bg-meatzy-welldone text-white shadow-md' : 'text-meatzy-olive hover:bg-gray-50'}`}
            >
                One-Time Purchase
            </button>
        </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {products.map((product, index) => (
        <div key={product.id} className="flex flex-col bg-white rounded-xl overflow-hidden border border-meatzy-mint/50 shadow-lg hover:shadow-2xl transition-all duration-300 group relative">
          
          {/* Best Seller Tag */}
          {index === 0 && (
              <div className="absolute top-4 left-4 z-20 bg-meatzy-rare text-white text-xs font-bold uppercase px-3 py-1 tracking-wider shadow-md">
                  Best Seller
              </div>
          )}

          <div className="relative aspect-[5/4] overflow-hidden bg-gray-100">
            <img 
              src={product.featuredImage.url} 
              alt={product.featuredImage.altText} 
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            {isSubscribe && (
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-meatzy-welldone px-3 py-1 text-xs font-bold border border-meatzy-welldone rounded-sm">
                    Save $20 with Sub
                </div>
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
            
            <p className="text-gray-500 text-sm mb-6 leading-relaxed flex-grow line-clamp-3">
              {product.description}
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
                        {isSubscribe ? 'Per Box' : 'One Time'}
                    </span>
                </div>
                
                <button
                    onClick={() => handleAddToCart(product)}
                    disabled={addingToCart}
                    className="w-full bg-meatzy-olive text-white py-3 font-display font-bold uppercase tracking-widest hover:bg-meatzy-rare transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {addingToCart ? 'Adding...' : 'Add To Cart'}
                </button>
            </div>
          </div>
        </div>
      ))}
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
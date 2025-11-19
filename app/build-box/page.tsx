'use client';

import React, { useEffect, useState } from 'react';
import { Product } from '@/lib/shopify/types';
import { getCollectionByHandle, createCart, addToCart as addToShopifyCart, getCartId, saveCartId, saveCheckoutUrl, getCheckoutUrl } from '@/lib/shopify';
import { Check, X, ShoppingCart, ChefHat } from 'lucide-react';

export default function BuildBoxPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Map<string, number>>(new Map());
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  const MAX_PRODUCTS = 6;
  const MAX_PER_PRODUCT = 2;

  useEffect(() => {
    getCollectionByHandle('custom-box').then(collection => {
      if (collection) {
        setProducts(collection.products.edges.map(edge => edge.node));
      }
      setLoading(false);
    });
  }, []);

  const totalSelected = Array.from(selectedProducts.values()).reduce((sum, qty) => sum + qty, 0);

  const handleToggleProduct = (productId: string) => {
    const newSelected = new Map(selectedProducts);

    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else if (totalSelected < MAX_PRODUCTS) {
      newSelected.set(productId, 1);
    }

    setSelectedProducts(newSelected);
  };

  const handleQuantityChange = (productId: string, delta: number) => {
    const newSelected = new Map(selectedProducts);
    const current = newSelected.get(productId) || 0;
    const newQty = current + delta;

    if (newQty <= 0) {
      newSelected.delete(productId);
    } else if (newQty <= MAX_PER_PRODUCT && totalSelected + delta <= MAX_PRODUCTS) {
      newSelected.set(productId, newQty);
    }

    setSelectedProducts(newSelected);
  };

  const handleAddToCart = async () => {
    if (totalSelected !== MAX_PRODUCTS) {
      alert(`Please select exactly ${MAX_PRODUCTS} products to build your box.`);
      return;
    }

    setAddingToCart(true);

    try {
      // Build a description of selected items
      const selectedItemsList = Array.from(selectedProducts.entries()).map(([productId, quantity]) => {
        const product = products.find(p => p.id === productId)!;
        return `${product.title} (${quantity}x)`;
      }).join(', ');

      console.log('Custom box items:', selectedItemsList);

      // Get the Custom Box product variant ID from homepage-boxes collection
      // We need to fetch this product first
      const customBoxCollection = await getCollectionByHandle('homepage-boxes');
      const customBoxProduct = customBoxCollection?.products.edges.find(
        edge => edge.node.title.toLowerCase().includes('custom box') || edge.node.handle === 'custom-box'
      );

      if (!customBoxProduct) {
        alert('Custom Box product not found. Please contact support.');
        return;
      }

      const customBoxVariantId = customBoxProduct.node.variants.edges[0]?.node.id;
      console.log('Adding Custom Box to cart:', customBoxVariantId);
      console.log('With items:', selectedItemsList);

      let cartId = getCartId();

      if (!cartId) {
        // Create cart with Custom Box product
        const cart = await createCart(customBoxVariantId, 1);
        if (cart) {
          saveCartId(cart.id);
          saveCheckoutUrl(cart.checkoutUrl);
        } else {
          alert('Failed to create cart. Please ensure Custom Box product allows one-time purchases.');
          return;
        }
      } else {
        // Add Custom Box to existing cart
        const cart = await addToShopifyCart(cartId, [{ merchandiseId: customBoxVariantId, quantity: 1 }]);
        if (cart) {
          saveCheckoutUrl(cart.checkoutUrl);
        } else {
          alert('Failed to add to cart. Please try again.');
          return;
        }
      }

      // Redirect to checkout
      const checkoutUrl = getCheckoutUrl();
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        alert('Cart not found. Please try adding items again.');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-meatzy-tallow">
        <div className="text-meatzy-olive font-display font-bold uppercase tracking-widest text-xl">
          Loading custom box builder...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-meatzy-tallow pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white border border-meatzy-gold/30 rounded-full px-4 py-2 mb-6">
            <ChefHat className="w-5 h-5 text-meatzy-gold" />
            <span className="text-sm font-bold uppercase tracking-wider text-meatzy-olive">Build Your Perfect Box</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black font-slab text-meatzy-olive uppercase mb-6">
            Custom Box Builder
          </h1>

          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Select exactly <span className="font-bold text-meatzy-rare">{MAX_PRODUCTS} proteins</span> to build your custom box.
            You can choose up to <span className="font-bold">{MAX_PER_PRODUCT} of each item</span>.
          </p>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-meatzy-olive">
                {totalSelected} / {MAX_PRODUCTS} selected
              </span>
              <span className={`text-sm font-bold ${totalSelected === MAX_PRODUCTS ? 'text-meatzy-dill' : 'text-gray-400'}`}>
                {totalSelected === MAX_PRODUCTS ? '✓ Ready' : `${MAX_PRODUCTS - totalSelected} more needed`}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  totalSelected === MAX_PRODUCTS ? 'bg-meatzy-dill' : 'bg-meatzy-rare'
                }`}
                style={{ width: `${(totalSelected / MAX_PRODUCTS) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          {products.map((product) => {
            const isSelected = selectedProducts.has(product.id);
            const quantity = selectedProducts.get(product.id) || 0;
            const price = parseFloat(product.priceRange.minVariantPrice.amount);
            const canAdd = totalSelected < MAX_PRODUCTS && quantity < MAX_PER_PRODUCT;

            return (
              <div
                key={product.id}
                className={`relative bg-white border-2 rounded-xl overflow-hidden transition-all duration-300 ${
                  isSelected
                    ? 'border-meatzy-rare shadow-xl scale-105'
                    : 'border-meatzy-mint hover:border-meatzy-dill hover:shadow-lg'
                }`}
              >
                {/* Selected Badge */}
                {isSelected && (
                  <div className="absolute top-3 right-3 z-10 bg-meatzy-rare text-white rounded-full px-3 py-1 text-xs font-bold shadow-lg flex items-center gap-1">
                    <Check className="w-3 h-3" /> {quantity}x
                  </div>
                )}

                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={product.featuredImage.url}
                    alt={product.featuredImage.altText || product.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="p-3 md:p-4">
                  <h3 className="font-slab font-bold text-meatzy-olive text-sm md:text-base mb-2 line-clamp-2 min-h-[40px] md:min-h-[48px]">
                    {product.title}
                  </h3>

                  {isSelected && price > 0 && (
                    <div className="mb-2 md:mb-3">
                      <span className="text-xs md:text-sm font-medium text-gray-500">
                        ${price.toFixed(2)} each
                      </span>
                    </div>
                  )}

                  {isSelected ? (
                    <div className="flex items-center gap-1 md:gap-2">
                      <button
                        onClick={() => handleQuantityChange(product.id, -1)}
                        className="flex-1 bg-meatzy-mint text-meatzy-olive px-2 md:px-3 py-1.5 md:py-2 rounded-lg font-bold hover:bg-meatzy-dill transition-colors text-sm md:text-base"
                      >
                        -
                      </button>
                      <span className="px-2 md:px-4 font-black text-meatzy-olive text-base md:text-lg">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(product.id, 1)}
                        disabled={!canAdd}
                        className="flex-1 bg-meatzy-mint text-meatzy-olive px-2 md:px-3 py-1.5 md:py-2 rounded-lg font-bold hover:bg-meatzy-dill transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleToggleProduct(product.id)}
                      disabled={totalSelected >= MAX_PRODUCTS}
                      className="w-full bg-meatzy-olive text-white py-2 md:py-2.5 rounded-lg font-display font-bold uppercase text-[10px] md:text-xs tracking-wider hover:bg-meatzy-rare transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {totalSelected >= MAX_PRODUCTS ? 'Box Full' : 'Add to Box'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add to Cart Button */}
        <div className="sticky bottom-0 bg-white border-t-4 border-meatzy-gold shadow-2xl p-6 rounded-t-2xl">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-sm text-gray-500 mb-1">Custom Box</p>
              <p className="text-3xl font-black text-meatzy-olive">
                {totalSelected} / {MAX_PRODUCTS} proteins selected
              </p>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={totalSelected !== MAX_PRODUCTS || addingToCart}
              className="w-full sm:w-auto px-12 py-4 bg-meatzy-rare text-white font-display font-bold uppercase tracking-widest hover:bg-meatzy-welldone transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-lg flex items-center justify-center gap-3"
            >
              <ShoppingCart className="w-5 h-5" />
              {addingToCart ? 'Adding...' : totalSelected === MAX_PRODUCTS ? 'Add to Cart' : `Select ${MAX_PRODUCTS - totalSelected} More`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

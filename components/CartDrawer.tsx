'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ShoppingBag, Loader2 } from 'lucide-react';
import { getCart, updateCartLine, removeFromCart, getCartId, getCheckoutUrl } from '@/lib/shopify';
import type { Cart } from '@/lib/shopify/types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [updatingLineId, setUpdatingLineId] = useState<string | null>(null);

  // Fetch cart when drawer opens
  useEffect(() => {
    if (isOpen) {
      fetchCart();
    }
  }, [isOpen]);

  const fetchCart = async () => {
    setLoading(true);
    const cartId = getCartId();
    if (cartId) {
      const cartData = await getCart(cartId);
      setCart(cartData);
    }
    setLoading(false);
  };

  const handleUpdateQuantity = async (lineId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const cartId = getCartId();
    if (!cartId) return;

    setUpdatingLineId(lineId);
    const updatedCart = await updateCartLine(cartId, lineId, newQuantity);
    if (updatedCart) {
      setCart(updatedCart);
    }
    setUpdatingLineId(null);
  };

  const handleRemoveItem = async (lineId: string) => {
    const cartId = getCartId();
    if (!cartId) return;

    setUpdatingLineId(lineId);
    const updatedCart = await removeFromCart(cartId, lineId);
    if (updatedCart) {
      setCart(updatedCart);
      // Close drawer if cart is empty
      if (updatedCart.lines.edges.length === 0) {
        onClose();
      }
    }
    setUpdatingLineId(null);
  };

  const handleCheckout = () => {
    const checkoutUrl = getCheckoutUrl();
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  };

  const cartLines = cart?.lines.edges || [];
  const subtotal = cart?.cost?.subtotalAmount?.amount
    ? parseFloat(cart.cost.subtotalAmount.amount)
    : 0;
  const itemCount = cart?.totalQuantity || 0;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[60] transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[480px] bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-meatzy-rare" />
              <h2 className="text-2xl font-black font-slab text-meatzy-olive uppercase">
                Your Cart
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-meatzy-rare animate-spin" />
            </div>
          )}

          {/* Empty Cart */}
          {!loading && cartLines.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-600 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-6">Add some delicious items to get started!</p>
              <button
                onClick={onClose}
                className="bg-meatzy-rare text-white px-6 py-3 rounded-lg font-bold uppercase hover:bg-meatzy-welldone transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          )}

          {/* Cart Items */}
          {!loading && cartLines.length > 0 && (
            <>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cartLines.map(({ node: line }) => {
                  const merchandise = line.merchandise as any;
                  const product = merchandise.product;
                  const isUpdating = updatingLineId === line.id;

                  return (
                    <div
                      key={line.id}
                      className={`flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 ${
                        isUpdating ? 'opacity-50' : ''
                      }`}
                    >
                      {/* Product Image */}
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-white flex-shrink-0 border border-gray-200">
                        {product.featuredImage?.url ? (
                          <Image
                            src={product.featuredImage.url}
                            alt={product.featuredImage.altText || product.title}
                            width={96}
                            height={96}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <ShoppingBag className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-meatzy-olive text-sm mb-1 line-clamp-2">
                          {product.title}
                        </h3>
                        {merchandise.title !== 'Default Title' && (
                          <p className="text-xs text-gray-600 mb-2">{merchandise.title}</p>
                        )}
                        <p className="text-lg font-black text-meatzy-rare">
                          ${parseFloat(line.cost.totalAmount.amount).toFixed(2)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={() => handleUpdateQuantity(line.id, line.quantity - 1)}
                            disabled={isUpdating || line.quantity <= 1}
                            className="w-8 h-8 rounded-lg bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-bold">{line.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(line.id, line.quantity + 1)}
                            disabled={isUpdating}
                            className="w-8 h-8 rounded-lg bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRemoveItem(line.id)}
                            disabled={isUpdating}
                            className="ml-auto p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-6 space-y-4 bg-gray-50">
                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Subtotal ({itemCount} items)</p>
                    <p className="text-xs text-gray-500 mt-1">Shipping calculated at checkout</p>
                  </div>
                  <p className="text-2xl font-black text-meatzy-olive">
                    ${subtotal.toFixed(2)}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-meatzy-rare text-white py-4 rounded-lg font-bold uppercase hover:bg-meatzy-welldone transition-colors flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-bold uppercase hover:bg-gray-50 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

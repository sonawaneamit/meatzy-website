'use client';

import React, { useEffect, useState } from 'react';
import { X, Plus, Check } from 'lucide-react';
import { Product } from '../lib/shopify/types';
import { getCollectionByHandle } from '../lib/shopify';

interface AddonsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAddons: (selectedAddons: { product: Product; quantity: number }[]) => void;
  onContinue: () => void;
}

export const AddonsModal: React.FC<AddonsModalProps> = ({ isOpen, onClose, onAddAddons, onContinue }) => {
  const [addons, setAddons] = useState<Product[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<Map<string, number>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      getCollectionByHandle('addons').then(collection => {
        if (collection) {
          setAddons(collection.products.edges.map(edge => edge.node));
        }
        setLoading(false);
      });
    }
  }, [isOpen]);

  const handleToggleAddon = (productId: string) => {
    const newSelected = new Map(selectedAddons);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.set(productId, 1);
    }
    setSelectedAddons(newSelected);
  };

  const handleQuantityChange = (productId: string, delta: number) => {
    const newSelected = new Map(selectedAddons);
    const current = newSelected.get(productId) || 0;
    const newQty = Math.max(1, current + delta);
    newSelected.set(productId, newQty);
    setSelectedAddons(newSelected);
  };

  const handleAddToCart = () => {
    const addonsToAdd = Array.from(selectedAddons.entries()).map(([productId, quantity]) => {
      const product = addons.find(a => a.id === productId)!;
      return { product, quantity };
    });
    onAddAddons(addonsToAdd);
    onContinue();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="bg-meatzy-olive text-white p-6 border-b border-meatzy-olive">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-black font-slab uppercase mb-2">Complete Your Order</h2>
              <p className="text-gray-300 text-sm">Add premium cuts to maximize your value</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-meatzy-gold transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="text-meatzy-olive font-display font-bold uppercase tracking-widest">Loading add-ons...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {addons.map((addon) => {
                const isSelected = selectedAddons.has(addon.id);
                const quantity = selectedAddons.get(addon.id) || 1;
                const price = parseFloat(addon.priceRange.minVariantPrice.amount);

                return (
                  <div
                    key={addon.id}
                    className={`relative bg-white border-2 rounded-xl overflow-hidden transition-all duration-300 ${
                      isSelected
                        ? 'border-meatzy-rare shadow-lg scale-105'
                        : 'border-meatzy-mint hover:border-meatzy-dill'
                    }`}
                  >
                    {/* Selected Badge */}
                    {isSelected && (
                      <div className="absolute top-3 right-3 z-10 bg-meatzy-rare text-white rounded-full p-2">
                        <Check className="w-4 h-4" />
                      </div>
                    )}

                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={addon.featuredImage.url}
                        alt={addon.featuredImage.altText || addon.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="font-slab font-bold text-meatzy-olive text-lg mb-2 line-clamp-2">{addon.title}</h3>
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2">{addon.description}</p>

                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-black text-meatzy-welldone">${price.toFixed(2)}</span>
                      </div>

                      {isSelected ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(addon.id, -1)}
                            className="bg-meatzy-mint text-meatzy-olive px-3 py-2 rounded-lg font-bold hover:bg-meatzy-dill transition-colors"
                          >
                            -
                          </button>
                          <span className="flex-1 text-center font-bold text-meatzy-olive">{quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(addon.id, 1)}
                            className="bg-meatzy-mint text-meatzy-olive px-3 py-2 rounded-lg font-bold hover:bg-meatzy-dill transition-colors"
                          >
                            +
                          </button>
                          <button
                            onClick={() => handleToggleAddon(addon.id)}
                            className="bg-meatzy-rare text-white px-4 py-2 rounded-lg font-bold hover:bg-meatzy-welldone transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleToggleAddon(addon.id)}
                          className="w-full bg-meatzy-olive text-white py-3 rounded-lg font-display font-bold uppercase tracking-wider hover:bg-meatzy-rare transition-colors flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" /> Add
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="text-center sm:text-left">
              <p className="text-sm text-gray-500 mb-1">
                {selectedAddons.size} add-on{selectedAddons.size !== 1 ? 's' : ''} selected
              </p>
              <p className="text-2xl font-black text-meatzy-olive">
                +${Array.from(selectedAddons.entries()).reduce((total, [id, qty]) => {
                  const addon = addons.find(a => a.id === id);
                  if (!addon) return total;
                  return total + (parseFloat(addon.priceRange.minVariantPrice.amount) * qty);
                }, 0).toFixed(2)}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onContinue}
                className="px-6 py-3 border-2 border-meatzy-olive text-meatzy-olive font-display font-bold uppercase tracking-wider hover:bg-meatzy-olive hover:text-white transition-colors rounded-lg"
              >
                No Thanks
              </button>
              <button
                onClick={handleAddToCart}
                disabled={selectedAddons.size === 0}
                className="px-8 py-3 bg-meatzy-rare text-white font-display font-bold uppercase tracking-wider hover:bg-meatzy-welldone transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-lg"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

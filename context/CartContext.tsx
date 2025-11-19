'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, Product } from '../types';

interface CartContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  items: CartItem[];
  addToCart: (product: Product) => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, {
        id: `line_${Date.now()}`,
        quantity: 1,
        product,
        merchandise: {
          id: 'var_1', // Mock variant
          title: 'Default',
          price: product.priceRange.minVariantPrice,
          availableForSale: true
        }
      }];
    });
    setIsOpen(true);
  };

  const total = items.reduce((acc, item) => {
    return acc + (parseFloat(item.merchandise.price.amount) * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{ isOpen, setIsOpen, items, addToCart, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
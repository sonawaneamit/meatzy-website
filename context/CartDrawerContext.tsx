'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import CartDrawer from '../components/CartDrawer';

interface CartDrawerContextType {
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartDrawerContext = createContext<CartDrawerContextType | undefined>(undefined);

export const CartDrawerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openDrawer = () => setIsOpen(true);
  const closeDrawer = () => setIsOpen(false);

  return (
    <CartDrawerContext.Provider value={{ openDrawer, closeDrawer }}>
      {children}
      <CartDrawer isOpen={isOpen} onClose={closeDrawer} />
    </CartDrawerContext.Provider>
  );
};

export const useCartDrawer = () => {
  const context = useContext(CartDrawerContext);
  if (!context) throw new Error('useCartDrawer must be used within a CartDrawerProvider');
  return context;
};

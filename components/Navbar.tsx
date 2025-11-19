'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, User, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { items, setIsOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navClasses = `fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
    isScrolled 
      ? 'bg-meatzy-tallow text-meatzy-olive shadow-sm border-gray-200 py-2 top-0' 
      : 'bg-transparent text-meatzy-olive border-transparent py-4 top-10' 
  }`;

  // Handle mobile menu close
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
    {/* Promo Bar - Always fixed at top */}
    <div className="bg-meatzy-welldone text-meatzy-tallow text-center py-2.5 text-xs md:text-sm font-display font-bold uppercase tracking-widest relative z-[60] flex justify-center items-center gap-2">
        <span>HUNGRY FOR MORE? GET FIRST DIBS ON DEALS AND DROPS.</span>
    </div>
    
    <nav className={`${navClasses} ${isScrolled ? 'top-0' : 'top-[40px]'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
        
        <div className="flex items-center gap-4 md:hidden">
             <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="focus:outline-none">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
        </div>

        {/* Logo */}
        <div className={`text-3xl md:text-4xl font-black tracking-tighter font-slab flex-1 md:flex-none text-center md:text-left ${isScrolled ? 'text-meatzy-welldone' : 'text-meatzy-welldone'}`}>
          MEATZY
        </div>

        {/* Desktop Links */}
        <div className={`hidden md:flex gap-8 items-center mx-auto text-meatzy-olive`}>
          <a href="#shop" className="text-sm font-display font-bold uppercase tracking-widest hover:text-meatzy-rare transition-colors">Shop All</a>
          <a href="#how-it-works" className="text-sm font-display font-bold uppercase tracking-widest hover:text-meatzy-rare transition-colors">How It Works</a>
          <a href="#referral" className="text-sm font-display font-bold uppercase tracking-widest hover:text-meatzy-rare transition-colors">Earn Cash</a>
          <a href="#about" className="text-sm font-display font-bold uppercase tracking-widest hover:text-meatzy-rare transition-colors">About Us</a>
        </div>

        {/* Actions */}
        <div className={`flex gap-6 items-center justify-end text-meatzy-olive`}>
            <a href="/build-box" className={`hidden md:block px-6 py-2.5 font-display font-bold uppercase text-xs tracking-widest transition-all ${isScrolled ? 'bg-meatzy-olive text-white hover:bg-meatzy-rare' : 'bg-meatzy-olive text-white hover:bg-meatzy-rare'}`}>
                Build Your Box
            </a>
            <User className="w-6 h-6 cursor-pointer hover:text-meatzy-rare transition-colors" />
            <div className="relative cursor-pointer" onClick={() => setIsOpen(true)}>
                <ShoppingBag className="w-6 h-6 hover:text-meatzy-rare transition-colors" />
                {items.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-meatzy-rare text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold border-2 border-white">
                        {items.length}
                    </span>
                )}
            </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white text-meatzy-olive shadow-xl border-t border-gray-100 py-8 px-6 flex flex-col gap-6 md:hidden min-h-screen">
            <a href="#shop" onClick={closeMobileMenu} className="font-slab font-bold text-2xl border-b border-gray-100 pb-4">Shop All</a>
            <a href="#how-it-works" onClick={closeMobileMenu} className="font-slab font-bold text-2xl border-b border-gray-100 pb-4">How It Works</a>
            <a href="#referral" onClick={closeMobileMenu} className="font-slab font-bold text-2xl border-b border-gray-100 pb-4 text-meatzy-welldone">Earn Cash For Sharing</a>
            <a href="#about" onClick={closeMobileMenu} className="font-slab font-bold text-2xl border-b border-gray-100 pb-4">About Us</a>
            <a href="/build-box" className="w-full bg-meatzy-welldone text-white py-4 font-display font-bold uppercase tracking-widest mt-4 text-center block">Build Your Box</a>
        </div>
      )}
    </nav>
    </>
  );
};
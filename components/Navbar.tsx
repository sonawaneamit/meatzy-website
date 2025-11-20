'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ShoppingBag, Menu, User, X, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const { items, setIsOpen } = useCart();
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      : 'bg-meatzy-tallow text-meatzy-olive border-gray-200 py-4 top-10'
  }`;

  // Handle mobile menu close
  const closeMobileMenu = () => setMobileMenuOpen(false);

  // Handle dropdown with delay
  const handleDropdownEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setAboutDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    // Add a 300ms delay before closing
    dropdownTimeoutRef.current = setTimeout(() => {
      setAboutDropdownOpen(false);
    }, 300);
  };

  return (
    <>
    <nav className={`${navClasses} ${isScrolled ? 'top-0' : 'top-[40px]'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
        
        <div className="flex items-center gap-4 md:hidden">
             <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="focus:outline-none">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
        </div>

        {/* Logo */}
        <a href="/" className="flex-1 md:flex-none flex justify-center md:justify-start">
          <Image
            src="/meatzy-logo.png"
            alt="Meatzy"
            width={180}
            height={54}
            className={`transition-all duration-300 ${isScrolled ? 'h-12' : 'h-14'}`}
            priority
          />
        </a>

        {/* Desktop Links */}
        <div className={`hidden md:flex gap-8 items-center mx-auto text-meatzy-olive`}>
          <a href="/" className="text-sm font-display font-bold uppercase tracking-widest hover:text-meatzy-rare transition-colors">Home</a>
          <a href="/recipes" className="text-sm font-display font-bold uppercase tracking-widest hover:text-meatzy-rare transition-colors">Recipes</a>
          <a href="/affiliate" className="text-sm font-display font-bold uppercase tracking-widest hover:text-meatzy-rare transition-colors">Earn Cash</a>

          {/* About Us Dropdown */}
          <div
            className="relative"
            onMouseEnter={handleDropdownEnter}
            onMouseLeave={handleDropdownLeave}
          >
            <button className="text-sm font-display font-bold uppercase tracking-widest hover:text-meatzy-rare transition-colors flex items-center gap-1">
              About Us
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${aboutDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu with padding bridge to prevent gap issues */}
            {aboutDropdownOpen && (
              <div
                className="absolute top-full left-0 pt-2 w-56 z-50"
                onMouseEnter={handleDropdownEnter}
                onMouseLeave={handleDropdownLeave}
              >
                <div className="bg-white shadow-xl border border-gray-100 rounded-lg overflow-hidden">
                  <a
                    href="/about"
                    className="block px-6 py-3 text-sm font-display font-bold uppercase tracking-widest text-meatzy-olive hover:bg-meatzy-tallow hover:text-meatzy-rare transition-colors"
                  >
                    Who Are We?
                  </a>
                  <a
                    href="/meatzy-impact"
                    className="block px-6 py-3 text-sm font-display font-bold uppercase tracking-widest text-meatzy-olive hover:bg-meatzy-tallow hover:text-meatzy-rare transition-colors border-t border-gray-100"
                  >
                    Meatzy Impact
                  </a>
                </div>
              </div>
            )}
          </div>

          <a href="/contact" className="text-sm font-display font-bold uppercase tracking-widest hover:text-meatzy-rare transition-colors">Contact Us</a>
        </div>

        {/* Actions */}
        <div className={`flex gap-6 items-center justify-end text-meatzy-olive`}>
            <a href="/build-box" className={`hidden md:block px-6 py-2.5 font-display font-bold uppercase text-xs tracking-widest transition-all ${isScrolled ? 'bg-meatzy-olive text-white hover:bg-meatzy-rare' : 'bg-meatzy-olive text-white hover:bg-meatzy-rare'}`}>
                Build Your Box
            </a>
            <div className="hidden md:flex gap-4 items-center">
              <a href="/signup" className="text-sm font-display font-bold uppercase tracking-widest hover:text-meatzy-rare transition-colors">
                Sign Up
              </a>
              <span className="text-gray-300">|</span>
              <a href="/login" className="text-sm font-display font-bold uppercase tracking-widest hover:text-meatzy-rare transition-colors">
                Login
              </a>
            </div>
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
            <a href="/" onClick={closeMobileMenu} className="font-slab font-bold text-2xl border-b border-gray-100 pb-4">Home</a>
            <a href="/recipes" onClick={closeMobileMenu} className="font-slab font-bold text-2xl border-b border-gray-100 pb-4">Recipes</a>
            <a href="/affiliate" onClick={closeMobileMenu} className="font-slab font-bold text-2xl border-b border-gray-100 pb-4 text-meatzy-welldone">Earn Cash For Sharing</a>

            {/* About Us Section */}
            <div className="border-b border-gray-100 pb-4">
              <div className="font-slab font-bold text-2xl mb-4 text-meatzy-olive">About Us</div>
              <a href="/about" onClick={closeMobileMenu} className="block font-slab font-bold text-lg text-meatzy-olive/70 hover:text-meatzy-rare pl-4 py-2">Who Are We?</a>
              <a href="/meatzy-impact" onClick={closeMobileMenu} className="block font-slab font-bold text-lg text-meatzy-olive/70 hover:text-meatzy-rare pl-4 py-2">Meatzy Impact</a>
            </div>

            <a href="/contact" onClick={closeMobileMenu} className="font-slab font-bold text-2xl border-b border-gray-100 pb-4">Contact Us</a>

            <div className="flex gap-4 border-b border-gray-100 pb-4">
              <a href="/signup" onClick={closeMobileMenu} className="flex-1 text-center bg-meatzy-olive text-white py-3 font-display font-bold uppercase tracking-widest">Sign Up</a>
              <a href="/login" onClick={closeMobileMenu} className="flex-1 text-center border-2 border-meatzy-olive text-meatzy-olive py-3 font-display font-bold uppercase tracking-widest">Login</a>
            </div>
            <a href="/build-box" className="w-full bg-meatzy-welldone text-white py-4 font-display font-bold uppercase tracking-widest text-center block">Build Your Box</a>
        </div>
      )}
    </nav>
    </>
  );
};
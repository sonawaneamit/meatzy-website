import React from 'react';
import { Instagram, Facebook, Twitter, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white pt-24 pb-10">
      {/* Newsletter */}
      <div className="max-w-4xl mx-auto text-center px-4 mb-24 relative">
         {/* Background faint text */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[100px] md:text-[140px] font-black text-gray-50 uppercase whitespace-nowrap -z-10 pointer-events-none">
            THE MEATZY BOX
        </div>

        <span className="text-meatzy-rare font-marker text-2xl md:text-3xl mb-2 block transform -rotate-2">Subscribe</span>
        <h2 className="text-3xl md:text-5xl font-black font-slab text-meatzy-olive mb-8 uppercase leading-none">
          Hungry For More? Get First Dibs On Meatzy Deals And Drops.
        </h2>
        <div className="flex flex-col sm:flex-row gap-0 justify-center max-w-lg mx-auto">
          <input 
            type="email" 
            placeholder="Your best email goes here..." 
            className="bg-gray-100 px-6 py-4 w-full focus:outline-none focus:ring-2 focus:ring-meatzy-olive text-meatzy-olive placeholder-gray-400"
          />
          <button className="bg-meatzy-rare text-white font-display font-bold uppercase px-8 py-4 hover:bg-meatzy-welldone transition-colors whitespace-nowrap">
            Count Me In
          </button>
        </div>
        <p className="mt-4 text-xs text-gray-500">
            By subscribing, you consent to our <a href="#" className="underline text-meatzy-rare">Privacy Policy & updates.</a>
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-12 mb-16 pt-16 border-t border-gray-100">
        <div>
          <h4 className="font-display font-bold text-meatzy-olive uppercase tracking-widest text-sm mb-6">Meatzy</h4>
          <ul className="space-y-3 text-sm text-gray-600">
            <li><a href="#" className="hover:text-meatzy-rare font-medium">About Us</a></li>
            <li><a href="#" className="hover:text-meatzy-rare font-medium">Contact Us</a></li>
            <li><a href="#" className="hover:text-meatzy-rare font-medium">Affiliate Program</a></li>
            <li><a href="#" className="hover:text-meatzy-rare font-medium">Recipes</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-bold text-meatzy-olive uppercase tracking-widest text-sm mb-6">Boxes</h4>
          <ul className="space-y-3 text-sm text-gray-600">
            <li><a href="#" className="hover:text-meatzy-rare font-medium">Shop All</a></li>
            <li><a href="#" className="hover:text-meatzy-rare font-medium">Build Your Box</a></li>
            <li><a href="#" className="hover:text-meatzy-rare font-medium">Gift Cards</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-bold text-meatzy-olive uppercase tracking-widest text-sm mb-6">Legal</h4>
          <ul className="space-y-3 text-sm text-gray-600">
            <li><a href="#" className="hover:text-meatzy-rare font-medium">Terms & Conditions</a></li>
            <li><a href="#" className="hover:text-meatzy-rare font-medium">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-meatzy-rare font-medium">Returns and Refunds Policy</a></li>
            <li><a href="#" className="hover:text-meatzy-rare font-medium">Meatzy Referral Program Agreement</a></li>
          </ul>
        </div>
        <div>
           <h4 className="font-display font-bold text-meatzy-olive uppercase tracking-widest text-sm mb-6">Follow Us</h4>
           <div className="flex gap-4 text-meatzy-olive">
             <Instagram className="w-6 h-6 hover:text-meatzy-rare cursor-pointer transition-colors" />
             <Facebook className="w-6 h-6 hover:text-meatzy-rare cursor-pointer transition-colors" />
             <Twitter className="w-6 h-6 hover:text-meatzy-rare cursor-pointer transition-colors" />
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 text-center md:text-left text-xs text-gray-400 border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center">
        <div>&copy; {new Date().getFullYear()} MEATZY LLC. All Rights Reserved</div>
        <div className="mt-2 md:mt-0">Eat Well. Earn Well. Live Well.</div>
      </div>
    </footer>
  );
};
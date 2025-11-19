'use client';

import React, { useState } from 'react';
import { getRecipeSuggestion } from '../services/geminiService';
import { ChefHat, Sparkles, Send, Utensils } from 'lucide-react';

export const AiChef: React.FC = () => {
  const [input, setInput] = useState('');
  const [recipe, setRecipe] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAskChef = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setRecipe('');
    const result = await getRecipeSuggestion(input);
    setRecipe(result);
    setLoading(false);
  };

  return (
    <section id="recipes" className="py-24 bg-meatzy-rosemary relative overflow-hidden">
      {/* Background texture/pattern overlay */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] mix-blend-overlay"></div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          
          {/* Left: Text Content */}
          <div className="w-full lg:w-1/2 text-white">
             <div className="inline-flex items-center gap-2 bg-meatzy-gold/20 border border-meatzy-gold/30 rounded-full px-4 py-1 mb-6 backdrop-blur-sm">
                <ChefHat className="w-4 h-4 text-meatzy-gold" />
                <span className="text-meatzy-gold font-bold tracking-widest uppercase text-xs">Powered by Gemini AI</span>
             </div>
             
             <h2 className="text-4xl md:text-5xl font-black font-slab mb-6 leading-tight">
               Your Personal<br/>
               <span className="text-meatzy-gold italic font-serif">Sous Chef</span>
             </h2>
             
             <p className="text-gray-200 text-lg mb-8 leading-relaxed max-w-xl">
               Don't let premium cuts sit in the freezer. Enter the ingredients you have, and our AI Chef will generate a culinary-grade recipe in seconds.
             </p>

             <div className="bg-meatzy-olive/50 p-6 rounded-xl border border-white/10 backdrop-blur-md">
                <div className="flex items-start gap-4">
                    <div className="bg-meatzy-gold rounded-full p-2 mt-1">
                        <Utensils className="w-5 h-5 text-meatzy-olive" />
                    </div>
                    <div>
                        <h4 className="font-bold text-meatzy-gold uppercase tracking-wide text-sm mb-1">Chef's Tip</h4>
                        <p className="text-sm text-gray-300">Try asking for specific cuisines like "Italian style ribeye" or "Keto friendly chicken recipes".</p>
                    </div>
                </div>
             </div>
          </div>

          {/* Right: Interactive Card */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-meatzy-gold/20">
                <div className="bg-meatzy-olive p-6 border-b border-gray-800">
                    <h3 className="text-white font-display font-bold uppercase tracking-widest flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-meatzy-gold" />
                        Recipe Generator
                    </h3>
                </div>
                
                <div className="p-8 bg-meatzy-tallow">
                    <form onSubmit={handleAskChef} className="mb-6">
                        <label className="block text-xs font-bold text-meatzy-olive uppercase tracking-wide mb-2">What's in your kitchen?</label>
                        <div className="relative">
                        <input 
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="e.g., 2 Ribeye steaks, thyme, garlic..."
                            className="w-full bg-white border border-meatzy-mint text-meatzy-olive placeholder-gray-400 rounded-lg pl-4 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-meatzy-gold shadow-inner"
                        />
                        <button 
                            type="submit"
                            disabled={loading}
                            className="absolute right-2 top-2 bottom-2 bg-meatzy-olive text-white rounded-md px-4 hover:bg-meatzy-rare transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? <Sparkles className="w-5 h-5 animate-spin text-meatzy-gold" /> : <Send className="w-5 h-5" />}
                        </button>
                        </div>
                    </form>

                    <div className="min-h-[250px] bg-white rounded-lg border border-meatzy-mint p-6 shadow-sm relative">
                        {recipe ? (
                        <div className="prose prose-sm max-w-none prose-headings:font-slab prose-headings:text-meatzy-olive prose-strong:text-meatzy-rare">
                            <pre className="whitespace-pre-wrap font-sans text-meatzy-olive/80 leading-relaxed">{recipe}</pre>
                        </div>
                        ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 text-center p-8">
                            <div className="w-16 h-16 bg-meatzy-tallow rounded-full flex items-center justify-center mb-4">
                                <Utensils className="w-8 h-8 text-meatzy-dill/50" />
                            </div>
                            <p className="font-slab font-bold text-meatzy-olive/50 text-lg mb-2">"I have a ribeye and potatoes..."</p>
                            <p className="text-sm text-gray-400">Ask the chef for inspiration!</p>
                        </div>
                        )}
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getBlogArticles } from '../../lib/shopify/blog';
import { getRecipeSuggestion } from '../../services/geminiService';
import { ChefHat, Sparkles, X, Send, Utensils } from 'lucide-react';
import type { Article } from '../../lib/shopify/types';

export default function Recipes() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiRecipe, setAiRecipe] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    getBlogArticles().then((data) => {
      setArticles(data);
      setFilteredArticles(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (selectedFilter === 'all') {
      setFilteredArticles(articles);
    } else {
      const filtered = articles.filter((article) =>
        article.tags.some((tag) => tag.toLowerCase() === selectedFilter.toLowerCase())
      );
      setFilteredArticles(filtered);
    }
  }, [selectedFilter, articles]);

  const filters = [
    { id: 'all', label: 'All Recipes' },
    { id: 'chicken', label: 'Chicken' },
    { id: 'beef', label: 'Beef' },
    { id: 'pork', label: 'Pork' },
    { id: 'seafood', label: 'Seafood' },
  ];

  const handleAskChef = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    setAiLoading(true);
    setAiRecipe('');
    const result = await getRecipeSuggestion(aiInput);
    setAiRecipe(result);
    setAiLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col w-full overflow-x-hidden bg-meatzy-tallow font-sans -mt-[140px]">

      {/* Hero Section */}
      <section className="relative bg-meatzy-olive text-white pt-56 pb-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=2070&auto=format&fit=crop")',
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <ChefHat className="w-12 h-12 text-meatzy-rare" />
            <span className="text-meatzy-rare font-marker text-3xl md:text-4xl transform -rotate-1">From Our Kitchen</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black font-slab uppercase mb-6 leading-none">
            Meatzy Recipes
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl font-light leading-relaxed">
            Discover delicious recipes crafted for our premium cuts
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`px-6 py-3 font-display font-bold uppercase tracking-widest text-sm transition-all rounded-full ${
                    selectedFilter === filter.id
                      ? 'bg-meatzy-rare text-white shadow-lg'
                      : 'bg-meatzy-tallow text-meatzy-olive hover:bg-meatzy-mint border border-meatzy-mint'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Chef Meatsy Button */}
            <button
              onClick={() => setShowAIModal(true)}
              className="px-6 py-3 bg-meatzy-olive text-meatzy-gold font-display font-bold uppercase tracking-widest text-sm rounded-full shadow-lg hover:bg-meatzy-rosemary hover:shadow-xl transition-all flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Chef Meatsy
            </button>
          </div>
        </div>
      </section>

      {/* Recipes Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {loading ? (
            <div className="text-center py-20">
              <p className="text-2xl text-meatzy-olive font-slab">Loading recipes...</p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-meatzy-olive font-slab">No recipes found. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/recipes/${article.handle}`}
                  className="group bg-white rounded-xl overflow-hidden border border-meatzy-mint/50 shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  {/* Recipe Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    {article.image ? (
                      <img
                        src={article.image.url}
                        alt={article.image.altText || article.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-meatzy-rare to-meatzy-welldone flex items-center justify-center">
                        <ChefHat className="w-20 h-20 text-white opacity-50" />
                      </div>
                    )}
                  </div>

                  {/* Recipe Info */}
                  <div className="p-6">
                    <h2 className="text-2xl font-black font-slab text-meatzy-olive uppercase mb-3 leading-tight group-hover:text-meatzy-rare transition-colors">
                      {article.title}
                    </h2>

                    {article.excerpt && (
                      <p className="text-meatzy-olive/70 leading-relaxed mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                    )}

                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {article.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs font-bold uppercase px-3 py-1 bg-meatzy-tallow text-meatzy-olive rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Chef Meatsy AI Modal */}
      {showAIModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowAIModal(false)}>
          <div className="bg-meatzy-rosemary rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative" onClick={(e) => e.stopPropagation()}>

            {/* Close button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAIModal(false);
              }}
              className="absolute top-4 right-4 z-10 hover:bg-white/10 rounded-full p-2 transition-colors text-white"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Background texture */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] mix-blend-overlay rounded-2xl"></div>

            <div className="relative z-10 p-8 md:p-12 flex flex-col lg:flex-row gap-12 items-start">

              {/* Left: Text Content */}
              <div className="w-full lg:w-1/2 text-white">
                <div className="inline-flex items-center gap-2 bg-meatzy-gold/20 border border-meatzy-gold/30 rounded-full px-4 py-1 mb-6 backdrop-blur-sm">
                  <ChefHat className="w-4 h-4 text-meatzy-gold" />
                  <span className="text-meatzy-gold font-bold tracking-widest uppercase text-xs">Powered by Gemini AI</span>
                </div>

                <h2 className="text-4xl md:text-5xl font-black font-slab mb-6 leading-tight">
                  <span className="text-meatzy-gold italic font-serif">Chef Meatsy</span><br/>
                  Your Personal Sous Chef
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
                      <h3 className="text-white font-bold text-base mb-2">CHEF'S TIP</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Try asking for specific cuisines like "Italian style ribeye" or "Keto friendly chicken recipes".
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Recipe Generator */}
              <div className="w-full lg:w-1/2">
                <div className="bg-meatzy-tallow rounded-xl border-4 border-meatzy-olive/20 p-6 md:p-8 shadow-2xl">

                  {/* Header */}
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b-2 border-meatzy-olive/10">
                    <Sparkles className="w-6 h-6 text-meatzy-olive" />
                    <h3 className="text-xl font-black font-slab uppercase text-meatzy-olive">Recipe Generator</h3>
                  </div>

                  {/* Input Form */}
                  <form onSubmit={handleAskChef} className="mb-6">
                    <label htmlFor="ai-input" className="block text-sm font-bold uppercase tracking-wider text-meatzy-olive mb-3">
                      What's in your kitchen?
                    </label>
                    <div className="relative">
                      <textarea
                        id="ai-input"
                        value={aiInput}
                        onChange={(e) => setAiInput(e.target.value)}
                        placeholder="e.g., 2 Ribeye steaks, thyme, garlic..."
                        className="w-full px-4 py-4 bg-white border-2 border-meatzy-olive/20 rounded-lg focus:border-meatzy-olive focus:outline-none transition-colors min-h-[120px] resize-none text-meatzy-olive placeholder:text-meatzy-olive/40"
                        disabled={aiLoading}
                      />
                      <button
                        type="submit"
                        disabled={aiLoading || !aiInput.trim()}
                        className="absolute bottom-4 right-4 bg-meatzy-olive text-white p-3 rounded-lg hover:bg-meatzy-rosemary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {aiLoading ? (
                          <Sparkles className="w-5 h-5 animate-spin" />
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Recipe Output */}
                  {aiRecipe ? (
                    <div className="bg-white rounded-lg p-6 border-2 border-meatzy-olive/10">
                      <div className="prose prose-sm max-w-none prose-headings:font-slab prose-headings:font-black prose-headings:text-meatzy-olive prose-p:text-meatzy-olive/80 prose-p:text-sm prose-strong:text-meatzy-olive prose-ul:text-meatzy-olive/80 prose-ol:text-meatzy-olive/80 prose-li:text-sm">
                        {aiRecipe.split('\n').map((line, index) => (
                          <p key={index} className="mb-2">{line}</p>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg p-8 text-center border-2 border-dashed border-meatzy-olive/20">
                      <Utensils className="w-12 h-12 text-meatzy-olive/30 mx-auto mb-3" />
                      <p className="text-meatzy-olive/50 text-sm italic">"I have a ribeye and potatoes..."</p>
                      <p className="text-meatzy-olive/40 text-xs mt-2">Ask the chef for inspiration!</p>
                    </div>
                  )}

                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </main>
  );
}

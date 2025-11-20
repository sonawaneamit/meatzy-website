import React from 'react';
import { ShieldCheck, Award, Zap, Globe, MapPin, ChefHat, Leaf, Shield, FileCheck, Check } from 'lucide-react';

export const Features: React.FC = () => {
  return (
    <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
            {/* Main Content */}
            <div className="text-center max-w-5xl mx-auto mb-16">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-slab text-meatzy-olive uppercase mb-8 leading-tight">
                    The Terroir of Protein, Honestly Sourced
                </h2>

                {/* Hero Image */}
                <div className="mb-12 max-w-4xl mx-auto">
                    <img
                        src="/meatzy-cares.png"
                        alt="Premium meats and proteins"
                        className="rounded-lg shadow-2xl w-full"
                    />
                </div>

                <div className="space-y-6 text-left text-gray-700 text-base md:text-lg leading-relaxed">
                    <p>
                        We follow the same philosophy top chefs use: choose each protein from the region where it reaches its peak. Patagonian grasslands, Midwest family farms, Australia's pasture raised herds. Every place has its own terroir, and we select only producers who meet or exceed our internal standards and the USDA's, always hormone and antibiotic free.
                    </p>

                    <p>
                        Some brands claim everything is "100 percent American," but the reality is more complicated. Many rely on labeling rules that allow imported meat to be repackaged and sold as "Product of USA." We never do. If a cut comes from abroad, we say so. If it is raised domestically, we say that too. No vague claims, no relabeling, just transparency backed by chef tested quality.
                    </p>
                </div>
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12 max-w-6xl mx-auto">
                {/* Badge 1 - Origin Verified */}
                <div className="flex flex-col items-center text-center gap-4">
                    <MapPin className="w-16 h-16 md:w-20 md:h-20 text-meatzy-dill" strokeWidth={2} />
                    <h3 className="font-black font-display text-meatzy-rare uppercase text-sm md:text-base tracking-wide">
                        Origin<br/>Verified
                    </h3>
                </div>

                {/* Badge 2 - Chef Tested */}
                <div className="flex flex-col items-center text-center gap-4">
                    <ChefHat className="w-16 h-16 md:w-20 md:h-20 text-meatzy-rare" strokeWidth={2} />
                    <h3 className="font-black font-display text-meatzy-dill uppercase text-sm md:text-base tracking-wide">
                        Chef<br/>Tested
                    </h3>
                </div>

                {/* Badge 3 - Sustainably Raised */}
                <div className="flex flex-col items-center text-center gap-4">
                    <Leaf className="w-16 h-16 md:w-20 md:h-20 text-meatzy-dill" strokeWidth={2} />
                    <h3 className="font-black font-display text-meatzy-rare uppercase text-sm md:text-base tracking-wide">
                        Sustainably<br/>Raised
                    </h3>
                </div>

                {/* Badge 4 - Hormone and Antibiotic Free */}
                <div className="flex flex-col items-center text-center gap-4">
                    <Shield className="w-16 h-16 md:w-20 md:h-20 text-meatzy-rare" strokeWidth={2} />
                    <h3 className="font-black font-display text-meatzy-dill uppercase text-sm md:text-base tracking-wide leading-tight">
                        Hormone &<br/>Antibiotic Free
                    </h3>
                </div>

                {/* Badge 5 - Transparent Sourcing */}
                <div className="flex flex-col items-center text-center col-span-2 md:col-span-3 lg:col-span-1 gap-4">
                    <FileCheck className="w-16 h-16 md:w-20 md:h-20 text-meatzy-dill" strokeWidth={2} />
                    <h3 className="font-black font-display text-meatzy-rare uppercase text-sm md:text-base tracking-wide leading-tight">
                        Transparent<br/>Sourcing
                    </h3>
                </div>
            </div>

            {/* Us vs Them Comparison Section */}
            <div className="mt-32">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-black font-slab text-meatzy-olive uppercase mb-4">
                        Us vs. Them
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Not all meat subscriptions are created equal. Here's how we stack up against other boxes and premium grocery stores.
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse bg-white shadow-xl rounded-lg overflow-hidden">
                        <thead>
                            <tr className="border-b-2 border-gray-200">
                                <th className="p-4 text-left font-black font-display text-meatzy-olive uppercase text-sm md:text-base"></th>
                                <th className="p-4 bg-meatzy-rare text-white font-black font-display uppercase text-sm md:text-lg">
                                    <div className="flex flex-col items-center gap-2">
                                        <span>Meatzy</span>
                                    </div>
                                </th>
                                <th className="p-4 text-center font-bold text-gray-600 text-sm md:text-base">Other Meat Boxes</th>
                                <th className="p-4 text-center font-bold text-gray-600 text-sm md:text-base">Premium Grocers</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Row 1 - Price per Pound */}
                            <tr className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="p-4 font-bold text-meatzy-olive">Price per Pound</td>
                                <td className="p-4 bg-meatzy-rare/5 text-center">
                                    <div className="font-black text-meatzy-rare text-xl">$12-15</div>
                                    <div className="text-xs text-gray-500">Premium quality</div>
                                </td>
                                <td className="p-4 text-center">
                                    <div className="font-bold text-gray-600 text-xl">$18-25</div>
                                    <div className="text-xs text-gray-500">Often higher</div>
                                </td>
                                <td className="p-4 text-center">
                                    <div className="font-bold text-gray-600 text-xl">$15-30</div>
                                    <div className="text-xs text-gray-500">Variable quality</div>
                                </td>
                            </tr>

                            {/* Row 2 - Origin Transparency */}
                            <tr className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="p-4 font-bold text-meatzy-olive">Origin Transparency</td>
                                <td className="p-4 bg-meatzy-rare/5 text-center">
                                    <Check className="w-8 h-8 text-meatzy-dill mx-auto" strokeWidth={3} />
                                    <div className="text-xs text-gray-600 mt-1">Always disclosed</div>
                                </td>
                                <td className="p-4 text-center">
                                    <Zap className="w-8 h-8 text-gray-400 mx-auto" />
                                    <div className="text-xs text-gray-600 mt-1">Sometimes vague</div>
                                </td>
                                <td className="p-4 text-center">
                                    <Globe className="w-8 h-8 text-gray-400 mx-auto" />
                                    <div className="text-xs text-gray-600 mt-1">Often unclear</div>
                                </td>
                            </tr>

                            {/* Row 3 - Customization */}
                            <tr className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="p-4 font-bold text-meatzy-olive">Full Box Customization</td>
                                <td className="p-4 bg-meatzy-rare/5 text-center">
                                    <Check className="w-8 h-8 text-meatzy-dill mx-auto" strokeWidth={3} />
                                    <div className="text-xs text-gray-600 mt-1">Build your own</div>
                                </td>
                                <td className="p-4 text-center">
                                    <Award className="w-8 h-8 text-gray-400 mx-auto" />
                                    <div className="text-xs text-gray-600 mt-1">Limited options</div>
                                </td>
                                <td className="p-4 text-center">
                                    <Check className="w-8 h-8 text-meatzy-dill mx-auto" strokeWidth={3} />
                                    <div className="text-xs text-gray-600 mt-1">Buy individual</div>
                                </td>
                            </tr>

                            {/* Row 4 - Earn While You Shop */}
                            <tr className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="p-4 font-bold text-meatzy-olive">Earn Cash Referrals</td>
                                <td className="p-4 bg-meatzy-rare/5 text-center">
                                    <Check className="w-8 h-8 text-meatzy-dill mx-auto" strokeWidth={3} />
                                    <div className="text-xs text-gray-600 mt-1">Up to 17% per box</div>
                                </td>
                                <td className="p-4 text-center">
                                    <div className="text-2xl text-gray-400 mx-auto">✕</div>
                                    <div className="text-xs text-gray-600 mt-1">No program</div>
                                </td>
                                <td className="p-4 text-center">
                                    <div className="text-2xl text-gray-400 mx-auto">✕</div>
                                    <div className="text-xs text-gray-600 mt-1">No program</div>
                                </td>
                            </tr>

                            {/* Row 5 - Hormone & Antibiotic Free */}
                            <tr className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="p-4 font-bold text-meatzy-olive">Hormone & Antibiotic Free</td>
                                <td className="p-4 bg-meatzy-rare/5 text-center">
                                    <Check className="w-8 h-8 text-meatzy-dill mx-auto" strokeWidth={3} />
                                    <div className="text-xs text-gray-600 mt-1">100% guaranteed</div>
                                </td>
                                <td className="p-4 text-center">
                                    <Check className="w-8 h-8 text-meatzy-dill mx-auto" strokeWidth={3} />
                                    <div className="text-xs text-gray-600 mt-1">Usually yes</div>
                                </td>
                                <td className="p-4 text-center">
                                    <Zap className="w-8 h-8 text-gray-400 mx-auto" />
                                    <div className="text-xs text-gray-600 mt-1">Depends on brand</div>
                                </td>
                            </tr>

                            {/* Row 6 - Flexible Subscriptions */}
                            <tr className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="p-4 font-bold text-meatzy-olive">Flexible Delivery Schedule</td>
                                <td className="p-4 bg-meatzy-rare/5 text-center">
                                    <Check className="w-8 h-8 text-meatzy-dill mx-auto" strokeWidth={3} />
                                    <div className="text-xs text-gray-600 mt-1">4, 6, or 8 weeks</div>
                                </td>
                                <td className="p-4 text-center">
                                    <Zap className="w-8 h-8 text-gray-400 mx-auto" />
                                    <div className="text-xs text-gray-600 mt-1">Limited options</div>
                                </td>
                                <td className="p-4 text-center">
                                    <div className="text-2xl text-gray-400 mx-auto">✕</div>
                                    <div className="text-xs text-gray-600 mt-1">No subscription</div>
                                </td>
                            </tr>

                            {/* Row 7 - Chef Tested */}
                            <tr className="hover:bg-gray-50">
                                <td className="p-4 font-bold text-meatzy-olive">Chef Tested Quality</td>
                                <td className="p-4 bg-meatzy-rare/5 text-center">
                                    <Check className="w-8 h-8 text-meatzy-dill mx-auto" strokeWidth={3} />
                                    <div className="text-xs text-gray-600 mt-1">Resort-grade</div>
                                </td>
                                <td className="p-4 text-center">
                                    <Zap className="w-8 h-8 text-gray-400 mx-auto" />
                                    <div className="text-xs text-gray-600 mt-1">Variable</div>
                                </td>
                                <td className="p-4 text-center">
                                    <Zap className="w-8 h-8 text-gray-400 mx-auto" />
                                    <div className="text-xs text-gray-600 mt-1">Depends on brand</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="mt-12 text-center">
                    <a
                        href="/build-box"
                        className="inline-block bg-meatzy-rare text-white px-10 py-4 text-lg font-display font-bold uppercase tracking-widest hover:bg-meatzy-welldone transition-colors shadow-xl"
                    >
                        Build Your Box
                    </a>
                </div>
            </div>
        </div>
    </section>
  );
};
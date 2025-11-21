'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../lib/supabase/client';
import { Mail, User, ShoppingBag, DollarSign, TrendingUp, Users, ExternalLink, Copy, Check, Info, Share2 } from 'lucide-react';

interface ShopifyOrder {
  id: string;
  name: string;
  created_at: string;
  total_price: string;
  financial_status: string;
  fulfillment_status: string | null;
  line_items: Array<{
    title: string;
    quantity: number;
    price: string;
  }>;
}

interface UserData {
  id: string;
  email: string;
  full_name: string;
  referral_code: string;
  has_purchased: boolean;
  shopify_customer_id?: string;
}

interface WalletData {
  balance: number;
  pending_balance: number;
  lifetime_earnings: number;
}

export default function AccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [lookupEmail, setLookupEmail] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);

  const [userData, setUserData] = useState<UserData | null>(null);
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [orders, setOrders] = useState<ShopifyOrder[]>([]);
  const [isAffiliate, setIsAffiliate] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // User is logged in - load their data
        await loadUserData(user.email!);
      } else {
        // Not logged in - show email lookup
        setLoading(false);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setLoading(false);
    }
  };

  const loadUserData = async (email: string) => {
    try {
      setLoading(true);
      const supabase = createClient();

      // Check if user exists in our system
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (user) {
        setUserData(user);
        setIsAffiliate(true);

        // Load wallet data
        const { data: walletData } = await supabase
          .from('wallet')
          .select('*')
          .eq('user_id', user.id)
          .single();

        setWallet(walletData);

        // Load Shopify orders - try by customer ID first, then by email
        if (user.shopify_customer_id) {
          await loadShopifyOrders(user.shopify_customer_id);
        } else {
          // No customer ID set, try loading by email
          await loadShopifyOrdersByEmail(email);
        }
      } else {
        // Not in our system - check Shopify for orders
        await loadShopifyOrdersByEmail(email);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadShopifyOrders = async (customerId: string) => {
    try {
      const response = await fetch(`/api/shopify/customer/${customerId}/orders`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error loading Shopify orders:', error);
    }
  };

  const loadShopifyOrdersByEmail = async (email: string) => {
    try {
      const response = await fetch(`/api/shopify/orders-by-email?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error loading orders by email:', error);
    }
  };

  const handleEmailLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupEmail) return;

    setLookupLoading(true);
    await loadUserData(lookupEmail);
    setLookupLoading(false);
  };

  const calculateMissedEarnings = () => {
    if (!orders.length) return 0;

    // Calculate what they could have earned with 13% commission
    const totalSpent = orders.reduce((sum, order) => sum + parseFloat(order.total_price), 0);
    return totalSpent * 0.13;
  };

  // EMAIL LOOKUP VIEW (Not logged in)
  if (!loading && !userData && orders.length === 0) {
    return (
      <div className="min-h-screen bg-meatzy-tallow pt-32 pb-20">
        <div className="max-w-md mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white border border-meatzy-mint rounded-full px-4 py-2 mb-6">
              <User className="w-5 h-5 text-meatzy-gold" />
              <span className="text-sm font-bold uppercase tracking-wider text-meatzy-olive">My Account</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black font-slab text-meatzy-olive uppercase mb-4">
              Welcome Back
            </h1>

            <p className="text-gray-600">
              Enter your email to check your orders and referral earnings
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-xl border border-meatzy-mint/30 p-8">
            <form onSubmit={handleEmailLookup} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-meatzy-olive mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={lookupEmail}
                    onChange={(e) => setLookupEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-meatzy-rare focus:border-transparent"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={lookupLoading}
                className="w-full bg-meatzy-rare text-white py-4 font-display font-bold uppercase tracking-widest hover:bg-meatzy-welldone transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
              >
                {lookupLoading ? 'Looking up...' : 'Check My Account'}
              </button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <a href="/signup" className="text-meatzy-rare font-bold hover:underline">
                  Join as Affiliate
                </a>
              </p>
              <p className="text-sm text-gray-600">
                Already an affiliate?{' '}
                <a href="/login" className="text-meatzy-rare font-bold hover:underline">
                  Log in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // CUSTOMER VIEW (Has orders, not an affiliate)
  if (!loading && !isAffiliate && !userData && orders.length > 0) {
    const missedEarnings = calculateMissedEarnings();
    const totalSpent = orders.reduce((sum, order) => sum + parseFloat(order.total_price), 0);

    return (
      <div className="min-h-screen bg-meatzy-tallow pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4">

          {/* Missed Earnings Banner */}
          <div className="bg-gradient-to-r from-meatzy-rare to-meatzy-welldone rounded-xl shadow-xl p-8 mb-8 text-white">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-3xl font-black font-slab uppercase mb-3">
                  💰 You Could Have Earned ${missedEarnings.toFixed(2)}!
                </h2>
                <p className="text-white/90 mb-4">
                  You've spent <span className="font-bold">${totalSpent.toFixed(2)}</span> with us.
                  If you were an affiliate, you could have earned <span className="font-bold">13% commission</span> on
                  every referral, PLUS commissions on 4 levels of their referrals!
                </p>
                <div className="space-y-2 text-sm text-white/80 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Earn 13% on direct referrals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Earn 2% on level 2 referrals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Earn 1% on levels 3 & 4 referrals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Get paid to your wallet instantly</span>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/signup')}
                  className="bg-white text-meatzy-rare px-8 py-3 font-bold uppercase tracking-wider rounded-lg hover:bg-meatzy-tallow transition-colors"
                >
                  Become An Affiliate - It's Free!
                </button>
              </div>
              <DollarSign className="w-24 h-24 text-white/20 hidden md:block" />
            </div>
          </div>

          {/* Orders Section */}
          <div className="bg-white rounded-xl shadow-xl border border-meatzy-mint/30 p-8">
            <h2 className="text-2xl font-black font-slab text-meatzy-olive uppercase mb-6 flex items-center gap-2">
              <ShoppingBag className="w-6 h-6" />
              Your Orders
            </h2>

            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:border-meatzy-mint transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-bold text-meatzy-olive">{order.name}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-meatzy-olive">
                        ${parseFloat(order.total_price).toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">{order.financial_status}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {order.line_items.map((item, idx) => (
                      <div key={idx} className="text-sm text-gray-600 flex justify-between">
                        <span>{item.quantity}x {item.title}</span>
                        <span>${parseFloat(item.price).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {order.fulfillment_status && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        {order.fulfillment_status}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setUserData(null);
                setOrders([]);
                setLookupEmail('');
              }}
              className="text-sm text-gray-600 hover:text-meatzy-olive"
            >
              Check a different email
            </button>
          </div>
        </div>
      </div>
    );
  }

  // AFFILIATE VIEW (Has affiliate account)
  if (!loading && isAffiliate && userData) {
    return (
      <div className="min-h-screen bg-meatzy-tallow pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-4">

          <div className="text-center mb-8">
            <h1 className="text-4xl font-black font-slab text-meatzy-olive uppercase mb-2">
              Welcome Back, {userData.full_name || 'Affiliate'}!
            </h1>
            <p className="text-gray-600 mb-3">Your Referral Code: <span className="font-mono font-bold text-meatzy-rare">{userData.referral_code}</span></p>
            {/* Referral SafeLink */}
            <div className="inline-flex flex-col sm:flex-row items-center gap-2 bg-gradient-to-r from-meatzy-olive to-meatzy-rare rounded-xl px-4 py-3">
              <div className="flex items-center gap-2 text-white">
                <Share2 className="w-4 h-4" />
                <span className="text-sm font-bold">Your Referral SafeLink:</span>
                <div className="relative group">
                  <Info className="w-3.5 h-3.5 opacity-70 cursor-help" />
                  <div className="absolute right-0 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-white text-meatzy-olive text-[10px] rounded-lg shadow-xl z-50">
                    <p className="font-bold mb-0.5">What's a SafeLink?</p>
                    <p>Your unique URL that tracks referrals and prevents code leaks. Always share your SafeLink!</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <code className="bg-white/20 px-3 py-1.5 rounded text-white font-mono text-sm">
                  meatzy.com/?ref={userData.referral_code}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`https://meatzy.com/?ref=${userData.referral_code}`);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm font-bold transition-all ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-white text-meatzy-olive hover:bg-meatzy-mint'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Wallet Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-lg border border-meatzy-mint/30 p-6">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-black text-meatzy-olive">
                ${wallet?.balance?.toFixed(2) ?? '0.00'}
              </div>
              <div className="text-sm text-gray-500">Available Balance</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-meatzy-mint/30 p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="text-3xl font-black text-meatzy-olive">
                ${wallet?.pending_balance?.toFixed(2) ?? '0.00'}
              </div>
              <div className="text-sm text-gray-500">Pending</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-meatzy-mint/30 p-6">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-8 h-8 text-meatzy-gold" />
              </div>
              <div className="text-3xl font-black text-meatzy-olive">
                ${wallet?.lifetime_earnings?.toFixed(2) ?? '0.00'}
              </div>
              <div className="text-sm text-gray-500">Lifetime Earnings</div>
            </div>
          </div>

          {/* CTA to Full Dashboard */}
          <div className="bg-white rounded-xl shadow-lg border border-meatzy-mint/30 p-8 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black font-slab text-meatzy-olive uppercase mb-2">
                  View Your Full Dashboard
                </h2>
                <p className="text-gray-600">
                  See your complete referral tree, commission history, and more
                </p>
              </div>
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-meatzy-rare text-white px-6 py-3 font-bold uppercase tracking-wider rounded-lg hover:bg-meatzy-welldone transition-colors flex items-center gap-2"
              >
                Go to Dashboard
                <ExternalLink className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Orders Section (if they have orders) */}
          {orders.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg border border-meatzy-mint/30 p-8">
              <h2 className="text-2xl font-black font-slab text-meatzy-olive uppercase mb-6 flex items-center gap-2">
                <ShoppingBag className="w-6 h-6" />
                Your Orders
              </h2>

              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:border-meatzy-mint transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-bold text-meatzy-olive">{order.name}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-meatzy-olive">
                          ${parseFloat(order.total_price).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">{order.financial_status}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {order.line_items.map((item, idx) => (
                        <div key={idx} className="text-sm text-gray-600 flex justify-between">
                          <span>{item.quantity}x {item.title}</span>
                          <span>${parseFloat(item.price).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {order.fulfillment_status && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          {order.fulfillment_status}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // LOADING STATE
  return (
    <div className="min-h-screen bg-meatzy-tallow flex items-center justify-center">
      <div className="text-meatzy-olive text-xl">Loading your account...</div>
    </div>
  );
}

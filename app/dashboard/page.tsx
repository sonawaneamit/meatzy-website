'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../lib/supabase/client';
import {
  getWalletBalance,
  getCommissionHistory,
  getDirectReferrals,
  getUserByEmail
} from '../../lib/supabase/referral';
import {
  Copy,
  DollarSign,
  Users,
  TrendingUp,
  Share2,
  Check,
  LogOut,
  AlertCircle
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const supabase = createClient();

      // Get authenticated user
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser) {
        router.push('/login');
        return;
      }

      // Get user data from our system
      const userData = await getUserByEmail(authUser.email!);
      if (!userData) {
        console.error('User not found in referral system');
        return;
      }

      setUser(userData);

      // Load wallet, commissions, and referrals
      const [walletData, commissionsData, referralsData] = await Promise.all([
        getWalletBalance(userData.id),
        getCommissionHistory(userData.id),
        getDirectReferrals(userData.id),
      ]);

      setWallet(walletData);
      setCommissions(commissionsData);
      setReferrals(referralsData);

    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}?ref=${user.referral_code}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-meatzy-tallow pt-32">
        <div className="text-meatzy-olive font-display font-bold uppercase tracking-widest text-xl">
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const referralLink = `${typeof window !== 'undefined' ? window.location.origin : ''}?ref=${user.referral_code}`;

  return (
    <div className="min-h-screen bg-meatzy-tallow pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black font-slab text-meatzy-olive uppercase mb-2">
              Your Dashboard
            </h1>
            <p className="text-gray-600">Welcome back, {user.full_name || user.email}!</p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-meatzy-olive hover:text-meatzy-rare transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-bold">Logout</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Available Balance */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-meatzy-mint/30">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-meatzy-dill/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-meatzy-dill" />
              </div>
              <span className="text-sm font-bold text-gray-600 uppercase">Available</span>
            </div>
            <div className="text-3xl font-black text-meatzy-olive">
              ${wallet?.available_balance?.toFixed(2) || '0.00'}
            </div>
          </div>

          {/* Pending Balance */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-meatzy-mint/30">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-meatzy-gold/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-meatzy-gold" />
              </div>
              <span className="text-sm font-bold text-gray-600 uppercase">Pending</span>
            </div>
            <div className="text-3xl font-black text-meatzy-olive">
              ${wallet?.pending_balance?.toFixed(2) || '0.00'}
            </div>
          </div>

          {/* Total Earned */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-meatzy-mint/30">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-meatzy-rare/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-meatzy-rare" />
              </div>
              <span className="text-sm font-bold text-gray-600 uppercase">Total Earned</span>
            </div>
            <div className="text-3xl font-black text-meatzy-olive">
              ${wallet?.total_earned?.toFixed(2) || '0.00'}
            </div>
          </div>

          {/* Direct Referrals */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-meatzy-mint/30">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-meatzy-olive/20 rounded-lg">
                <Users className="w-6 h-6 text-meatzy-olive" />
              </div>
              <span className="text-sm font-bold text-gray-600 uppercase">Referrals</span>
            </div>
            <div className="text-3xl font-black text-meatzy-olive">
              {referrals.length}
            </div>
          </div>
        </div>

        {/* Referral Link */}
        <div className="bg-gradient-to-br from-meatzy-olive to-meatzy-rare rounded-xl p-8 mb-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Share2 className="w-6 h-6" />
            <h2 className="text-2xl font-black font-slab uppercase">Your Referral Link</h2>
          </div>

          <p className="text-meatzy-mint mb-4">
            Share this link to earn commissions on every purchase!
          </p>

          <div className="flex gap-3">
            <div className="flex-1 bg-white/10 backdrop-blur rounded-lg px-4 py-3 font-mono text-sm break-all">
              {referralLink}
            </div>
            <button
              onClick={copyReferralLink}
              className="px-6 py-3 bg-white text-meatzy-olive font-bold rounded-lg hover:bg-meatzy-mint transition-colors flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copy
                </>
              )}
            </button>
          </div>

          <div className="mt-4 text-sm text-meatzy-mint">
            Your referral code: <span className="font-black text-white text-lg">{user.referral_code}</span>
          </div>
        </div>

        {/* Withdrawal Section */}
        <div className="bg-white rounded-xl p-8 mb-8 shadow-lg border border-meatzy-mint/30">
          <h2 className="text-2xl font-black font-slab text-meatzy-olive uppercase mb-4">
            Request Withdrawal
          </h2>

          {wallet && wallet.available_balance >= 100 ? (
            <div>
              <p className="text-gray-600 mb-6">
                You have <span className="font-black text-meatzy-dill">${wallet.available_balance.toFixed(2)}</span> available for withdrawal.
              </p>

              <div className="bg-meatzy-mint/10 border border-meatzy-mint rounded-lg p-6 mb-6">
                <h3 className="font-bold text-meatzy-olive mb-3">How to Request Withdrawal:</h3>
                <ol className="space-y-2 text-sm text-gray-700">
                  <li className="flex gap-2">
                    <span className="font-bold">1.</span>
                    <span>Make sure you have at least $100 in available balance</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">2.</span>
                    <span>Fill out our withdrawal request form with your PayPal email</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">3.</span>
                    <span>We'll process your payment within 2-3 business days</span>
                  </li>
                </ol>
              </div>

              <a
                href="https://form.klaviyo.com/YOUR_FORM_ID"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 bg-meatzy-dill text-white font-display font-bold uppercase tracking-widest hover:bg-meatzy-olive transition-colors rounded-lg"
              >
                Request Withdrawal via Klaviyo Form
              </a>

              <p className="text-xs text-gray-500 mt-4">
                * Minimum withdrawal amount: $100
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                Minimum withdrawal amount is <span className="font-bold">$100</span>
              </p>
              <p className="text-sm text-gray-500">
                Current available balance: ${wallet?.available_balance?.toFixed(2) || '0.00'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Keep earning! You need ${(100 - (wallet?.available_balance || 0)).toFixed(2)} more.
              </p>
            </div>
          )}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Commission History */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-meatzy-mint/30">
            <h3 className="text-xl font-black font-slab text-meatzy-olive uppercase mb-4">
              Recent Commissions
            </h3>

            {commissions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No commissions yet. Start sharing your link!
              </p>
            ) : (
              <div className="space-y-3">
                {commissions.slice(0, 5).map((commission) => (
                  <div
                    key={commission.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <div className="font-bold text-meatzy-olive">
                        Tier {commission.tier_level}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(commission.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-meatzy-rare">
                        +${commission.commission_amount.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {commission.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Direct Referrals */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-meatzy-mint/30">
            <h3 className="text-xl font-black font-slab text-meatzy-olive uppercase mb-4">
              Your Referrals
            </h3>

            {referrals.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No referrals yet. Share your link to get started!
              </p>
            ) : (
              <div className="space-y-3">
                {referrals.map((referral: any) => {
                  const refUser = referral.users;
                  return (
                    <div
                      key={referral.user_id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <div className="font-bold text-meatzy-olive">
                          {refUser.full_name || refUser.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          Joined {new Date(refUser.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        {refUser.has_purchased ? (
                          <span className="px-3 py-1 bg-meatzy-dill/20 text-meatzy-dill text-xs font-bold rounded-full">
                            ACTIVE
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-bold rounded-full">
                            PENDING
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

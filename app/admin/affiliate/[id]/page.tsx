'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '../../../../lib/supabase/client';
import { getDisplayName } from '../../../../lib/privacy-utils';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Edit2,
  Save,
  X,
  Eye,
  EyeOff,
  Wallet,
  Lock,
  Filter,
  Copy,
  Check,
  Info,
} from 'lucide-react';

interface AffiliateUser {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  referral_code: string;
  has_purchased: boolean;
  commission_rate: number;
  commission_override?: number;
  created_at: string;
  referrer?: {
    full_name: string;
    email: string;
    referral_code: string;
  };
}

interface WalletData {
  balance: number;
  pending_balance: number;
  lifetime_earnings: number;
  total_withdrawn: number;
}

interface Commission {
  id: string;
  order_id: string;
  tier_level: number;
  base_percentage: number;
  applied_rate: number;
  order_total: number;
  commission_amount: number;
  status: string;
  created_at: string;
  referred_user: {
    email: string;
    full_name: string;
  };
}

interface TreeMember {
  user_id: string;
  level: number;
  users: {
    id: string;
    email: string;
    full_name: string;
    created_at: string;
    has_purchased: boolean;
  };
}

export default function AffiliateDetailPage() {
  const router = useRouter();
  const params = useParams();
  const affiliateId = params.id as string;

  const [affiliate, setAffiliate] = useState<AffiliateUser | null>(null);
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [tree, setTree] = useState<TreeMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewUserView, setPreviewUserView] = useState(false);
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // Default tier rates
  const DEFAULT_TIER_RATES = { tier1: 13, tier2: 2, tier3: 1, tier4: 1 };

  // Tier rate editing state
  const [tierRates, setTierRates] = useState(DEFAULT_TIER_RATES);
  const [editingTier, setEditingTier] = useState<number | null>(null);
  const [savingTier, setSavingTier] = useState<number | null>(null);

  useEffect(() => {
    loadAffiliateData();
  }, [affiliateId]);

  const loadAffiliateData = async () => {
    try {
      setLoading(true);
      const supabase = createClient();

      // Check admin access
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      if (authError || !authUser) {
        router.push('/login');
        return;
      }

      const { data: adminCheck } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', authUser.id)
        .single();

      if (!adminCheck?.is_admin) {
        router.push('/dashboard');
        return;
      }

      // Load affiliate data
      const { data: affiliateData, error: affiliateError } = await supabase
        .from('users')
        .select(`
          *,
          referrer:referrer_id (
            full_name,
            email,
            referral_code
          )
        `)
        .eq('id', affiliateId)
        .single();

      if (affiliateError) throw affiliateError;
      setAffiliate(affiliateData);

      // Load tier rates (stored as JSON in tier_rates column, or use defaults)
      if (affiliateData.tier_rates) {
        try {
          const rates = typeof affiliateData.tier_rates === 'string'
            ? JSON.parse(affiliateData.tier_rates)
            : affiliateData.tier_rates;
          setTierRates({ ...DEFAULT_TIER_RATES, ...rates });
        } catch {
          setTierRates(DEFAULT_TIER_RATES);
        }
      } else {
        setTierRates(DEFAULT_TIER_RATES);
      }

      // Load wallet
      const { data: walletData } = await supabase
        .from('wallet')
        .select('*')
        .eq('user_id', affiliateId)
        .single();

      setWallet(walletData);

      // Load commissions
      const { data: commissionsData } = await supabase
        .from('commissions')
        .select(`
          *,
          referred_user:referred_user_id (
            email,
            full_name
          )
        `)
        .eq('user_id', affiliateId)
        .order('created_at', { ascending: false });

      setCommissions(commissionsData || []);

      // Load referral tree
      const { data: treeData } = await supabase
        .from('user_tree')
        .select(`
          user_id,
          level,
          users:user_id (
            id,
            email,
            full_name,
            created_at,
            has_purchased
          )
        `)
        .eq('ancestor_id', affiliateId)
        .order('level')
        .order('created_at');

      setTree((treeData || []) as unknown as TreeMember[]);

    } catch (error) {
      console.error('Error loading affiliate data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveTierRate = async (tier: number, rate: number) => {
    try {
      setSavingTier(tier);
      const supabase = createClient();

      // Update the tier rates object
      const newRates = { ...tierRates, [`tier${tier}`]: rate };

      const { error } = await supabase
        .from('users')
        .update({ tier_rates: newRates })
        .eq('id', affiliateId);

      if (error) throw error;

      setTierRates(newRates);
      setEditingTier(null);

      // Signal admin dashboard to refresh data
      localStorage.setItem('admin_data_updated', Date.now().toString());
    } catch (error) {
      console.error('Error updating tier rate:', error);
      alert('Failed to update tier rate');
    } finally {
      setSavingTier(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-meatzy-tallow flex items-center justify-center">
        <div className="text-meatzy-olive text-xl">Loading affiliate details...</div>
      </div>
    );
  }

  if (!affiliate) {
    return (
      <div className="min-h-screen bg-meatzy-tallow flex items-center justify-center">
        <div className="text-red-600 text-xl">Affiliate not found</div>
      </div>
    );
  }

  const treeStats = {
    tier1: tree.filter(t => t.level === 1).length,
    tier2: tree.filter(t => t.level === 2).length,
    tier3: tree.filter(t => t.level === 3).length,
    tier4: tree.filter(t => t.level === 4).length,
    totalActive: tree.filter(t => t.users.has_purchased).length,
  };

  // Filter tree based on selected tier
  const filteredTree = selectedTier
    ? tree.filter(t => t.level === selectedTier)
    : tree;

  // Handle tier click
  const handleTierClick = (tier: number) => {
    setSelectedTier(selectedTier === tier ? null : tier);
  };

  const commissionStats = {
    total: commissions.reduce((sum, c) => sum + c.commission_amount, 0),
    pending: commissions.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.commission_amount, 0),
    approved: commissions.filter(c => c.status === 'approved').reduce((sum, c) => sum + c.commission_amount, 0),
    count: commissions.length,
  };

  
  return (
    <div className="min-h-screen bg-meatzy-tallow pt-0 pb-8">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.push('/admin')}
              className="flex items-center gap-2 text-meatzy-olive hover:text-meatzy-rare"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Admin Dashboard
            </button>

            {/* Preview Toggle */}
            <button
              onClick={() => setPreviewUserView(!previewUserView)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
                previewUserView
                  ? 'bg-meatzy-rare text-white hover:bg-meatzy-welldone'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {previewUserView ? (
                <>
                  <Eye className="w-4 h-4" />
                  Admin View
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4" />
                  Preview User View
                </>
              )}
            </button>
          </div>

          {/* Preview Mode Banner */}
          {previewUserView && (
            <div className="bg-meatzy-rare/10 border border-meatzy-rare rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 text-meatzy-rare">
                <EyeOff className="w-5 h-5" />
                <div>
                  <div className="font-bold text-sm">User Preview Mode Active</div>
                  <div className="text-xs">Showing how this user sees their referral tree (own info visible, downline names masked, emails hidden)</div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-lg border border-meatzy-mint/30 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-black font-slab text-meatzy-olive uppercase mb-2">
                  {affiliate.full_name || 'Unknown'}
                </h1>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {affiliate.email}
                  </div>
                  {affiliate.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {affiliate.phone}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Joined {new Date(affiliate.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-500 mb-1">Referral Code</div>
                <div className="text-2xl font-black font-mono text-meatzy-rare">
                  {affiliate.referral_code}
                </div>
                {/* Referral SafeLink Copy Section */}
                <div className="mt-3">
                  <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    Referral SafeLink
                    <div className="relative group">
                      <Info className="w-3 h-3 text-gray-400 cursor-help" />
                      <div className="absolute right-0 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-gray-800 text-white text-[10px] rounded-lg shadow-xl z-50 text-left">
                        Unique URL that tracks referrals and prevents code leaks. Always share the SafeLink!
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                    <div className="text-xs md:text-sm font-mono text-meatzy-olive bg-gray-100 px-2 py-1.5 rounded truncate max-w-[180px] sm:max-w-[250px]">
                      meatzy.com/?ref={affiliate.referral_code}
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`https://meatzy.com/?ref=${affiliate.referral_code}`);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-bold transition-all whitespace-nowrap ${
                        copied
                          ? 'bg-green-500 text-white'
                          : 'bg-meatzy-rare text-white hover:bg-meatzy-welldone'
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
                {affiliate.referrer && (
                  <div className="text-xs text-gray-500 mt-3">
                    Referred by: {previewUserView
                      ? getDisplayName(affiliate.referrer.full_name, affiliate.referrer.email, false)
                      : affiliate.referrer.full_name
                    }
                  </div>
                )}
              </div>
            </div>

            {/* Commission Rates by Tier - Admin Only (Hidden in Preview Mode) */}
            {!previewUserView && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 mb-3">Commission Rates by Tier</div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[1, 2, 3, 4].map((tier) => {
                        const tierKey = `tier${tier}` as keyof typeof tierRates;
                        const rate = tierRates[tierKey];
                        const isEditing = editingTier === tier;
                        const isSaving = savingTier === tier;
                        const isCustom = rate !== DEFAULT_TIER_RATES[tierKey];
                        const tierColors = {
                          1: 'border-blue-200 bg-blue-50',
                          2: 'border-green-200 bg-green-50',
                          3: 'border-yellow-200 bg-yellow-50',
                          4: 'border-purple-200 bg-purple-50',
                        };

                        return (
                          <div
                            key={tier}
                            className={`rounded-lg border-2 p-3 ${tierColors[tier as keyof typeof tierColors]} transition-all`}
                          >
                            <div className="text-xs text-gray-500 mb-1">Tier {tier}</div>
                            {isEditing ? (
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="1"
                                  defaultValue={rate}
                                  autoFocus
                                  className="w-14 px-2 py-1 text-lg font-bold border border-gray-300 rounded text-center"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      saveTierRate(tier, parseFloat((e.target as HTMLInputElement).value) || 0);
                                    } else if (e.key === 'Escape') {
                                      setEditingTier(null);
                                    }
                                  }}
                                  onBlur={(e) => {
                                    const newValue = parseFloat(e.target.value) || 0;
                                    if (newValue !== rate) {
                                      saveTierRate(tier, newValue);
                                    } else {
                                      setEditingTier(null);
                                    }
                                  }}
                                />
                                <span className="text-sm font-bold">%</span>
                              </div>
                            ) : (
                              <div
                                className="flex items-center gap-1 cursor-pointer group"
                                onClick={() => setEditingTier(tier)}
                              >
                                <span className="text-xl font-black text-meatzy-olive">
                                  {isSaving ? '...' : `${rate}%`}
                                </span>
                                {isCustom && (
                                  <span className="text-[10px] bg-meatzy-gold/30 text-meatzy-gold px-1 rounded">
                                    Custom
                                  </span>
                                )}
                                <Edit2 className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Click any tier to edit. Press Enter to save or Escape to cancel.</p>
                  </div>

                  <div className="flex gap-4 sm:flex-col sm:items-end">
                    <div className="text-center sm:text-right">
                      <div className="text-sm text-gray-500">Status</div>
                      <div className={`text-lg font-bold ${affiliate.has_purchased ? 'text-green-600' : 'text-yellow-600'}`}>
                        {affiliate.has_purchased ? 'Active' : 'Pending'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-meatzy-mint/30 p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-2xl font-black text-meatzy-olive">
              ${wallet?.balance?.toFixed(2) ?? '0.00'}
            </div>
            <div className="text-sm text-gray-500">Available Balance</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-meatzy-mint/30 p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="text-2xl font-black text-meatzy-olive">
              ${wallet?.pending_balance?.toFixed(2) ?? '0.00'}
            </div>
            <div className="text-sm text-gray-500">Pending</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-meatzy-mint/30 p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-meatzy-gold" />
            </div>
            <div className="text-2xl font-black text-meatzy-olive">
              ${wallet?.lifetime_earnings?.toFixed(2) ?? '0.00'}
            </div>
            <div className="text-sm text-gray-500">Lifetime Earnings</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-meatzy-mint/30 p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-meatzy-rare" />
            </div>
            <div className="text-2xl font-black text-meatzy-olive">
              {tree.length}
            </div>
            <div className="text-sm text-gray-500">Total Referrals</div>
          </div>
        </div>

        {/* Request Payment Section */}
        <div className="bg-white rounded-xl shadow-xl border-2 border-meatzy-mint/50 p-4 md:p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-4 md:gap-6">
            <div className="flex-1 w-full">
              <div className="flex items-center gap-3 mb-4">
                <Wallet className={`w-6 h-6 md:w-8 md:h-8 flex-shrink-0 ${(wallet?.balance || 0) >= 100 ? 'text-meatzy-dill' : 'text-gray-400'}`} />
                <div>
                  <h2 className="text-lg md:text-2xl font-black font-slab text-meatzy-olive uppercase">
                    Payment Status
                  </h2>
                  <p className="text-xs md:text-sm text-gray-600">
                    {(wallet?.balance || 0) >= 100
                      ? 'You can now request a payment!'
                      : 'Earn $100 to unlock payments'
                    }
                  </p>
                </div>
              </div>

              {/* Progress or Eligible Message */}
              {(wallet?.balance || 0) >= 100 ? (
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-bold text-sm md:text-base">
                    ${(wallet?.balance || 0).toFixed(2)} available for withdrawal
                  </span>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-700">
                      ${(wallet?.balance || 0).toFixed(2)} / $100.00
                    </span>
                    <span className="text-sm text-gray-500">
                      ${(100 - (wallet?.balance || 0)).toFixed(2)} to go
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-meatzy-rare to-meatzy-gold h-full transition-all duration-500"
                      style={{ width: `${Math.min(((wallet?.balance || 0) / 100) * 100, 100)}%` }}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Request Payment Button */}
            <button
              disabled={(wallet?.balance || 0) < 100}
              className={`w-full lg:w-auto px-6 md:px-8 py-3 md:py-4 rounded-lg font-display font-bold uppercase tracking-widest text-sm md:text-lg transition-all flex items-center justify-center gap-2 md:gap-3 whitespace-nowrap ${
                (wallet?.balance || 0) >= 100
                  ? 'bg-meatzy-dill text-white hover:bg-meatzy-olive shadow-lg hover:shadow-xl cursor-pointer'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {(wallet?.balance || 0) >= 100 ? (
                <>
                  <Wallet className="w-5 h-5 md:w-6 md:h-6" />
                  Request Payment
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5 md:w-6 md:h-6" />
                  Locked
                </>
              )}
            </button>
          </div>
        </div>

        {/* Referral Tree */}
        <div className="bg-white rounded-xl shadow-lg border border-meatzy-mint/30 p-6 mb-8">
          <h2 className="text-2xl font-black font-slab text-meatzy-olive uppercase mb-6">
            Referral Tree
          </h2>

          <div className="grid grid-cols-4 gap-2 md:gap-4 mb-6">
            <button
              onClick={() => handleTierClick(1)}
              className={`text-center p-2 md:p-4 rounded-lg transition-all cursor-pointer hover:shadow-lg ${
                selectedTier === 1
                  ? 'bg-blue-600 text-white ring-2 md:ring-4 ring-blue-300'
                  : 'bg-blue-50 hover:bg-blue-100'
              }`}
            >
              <div className={`text-xl md:text-3xl font-black ${selectedTier === 1 ? 'text-white' : 'text-blue-600'}`}>
                {treeStats.tier1}
              </div>
              <div className={`text-xs md:text-sm ${selectedTier === 1 ? 'text-blue-100' : 'text-gray-600'}`}>
                Tier 1 (13%)
              </div>
            </button>
            <button
              onClick={() => handleTierClick(2)}
              className={`text-center p-2 md:p-4 rounded-lg transition-all cursor-pointer hover:shadow-lg ${
                selectedTier === 2
                  ? 'bg-green-600 text-white ring-2 md:ring-4 ring-green-300'
                  : 'bg-green-50 hover:bg-green-100'
              }`}
            >
              <div className={`text-xl md:text-3xl font-black ${selectedTier === 2 ? 'text-white' : 'text-green-600'}`}>
                {treeStats.tier2}
              </div>
              <div className={`text-xs md:text-sm ${selectedTier === 2 ? 'text-green-100' : 'text-gray-600'}`}>
                Tier 2 (2%)
              </div>
            </button>
            <button
              onClick={() => handleTierClick(3)}
              className={`text-center p-2 md:p-4 rounded-lg transition-all cursor-pointer hover:shadow-lg ${
                selectedTier === 3
                  ? 'bg-yellow-600 text-white ring-2 md:ring-4 ring-yellow-300'
                  : 'bg-yellow-50 hover:bg-yellow-100'
              }`}
            >
              <div className={`text-xl md:text-3xl font-black ${selectedTier === 3 ? 'text-white' : 'text-yellow-600'}`}>
                {treeStats.tier3}
              </div>
              <div className={`text-xs md:text-sm ${selectedTier === 3 ? 'text-yellow-100' : 'text-gray-600'}`}>
                Tier 3 (1%)
              </div>
            </button>
            <button
              onClick={() => handleTierClick(4)}
              className={`text-center p-2 md:p-4 rounded-lg transition-all cursor-pointer hover:shadow-lg ${
                selectedTier === 4
                  ? 'bg-purple-600 text-white ring-2 md:ring-4 ring-purple-300'
                  : 'bg-purple-50 hover:bg-purple-100'
              }`}
            >
              <div className={`text-xl md:text-3xl font-black ${selectedTier === 4 ? 'text-white' : 'text-purple-600'}`}>
                {treeStats.tier4}
              </div>
              <div className={`text-xs md:text-sm ${selectedTier === 4 ? 'text-purple-100' : 'text-gray-600'}`}>
                Tier 4 (1%)
              </div>
            </button>
          </div>

          {selectedTier && (
            <div className="mb-4 flex items-center justify-between p-3 bg-meatzy-olive/10 border border-meatzy-olive/30 rounded-lg">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-meatzy-olive" />
                <span className="text-sm font-bold text-meatzy-olive">
                  Showing Tier {selectedTier} only ({filteredTree.length} {filteredTree.length === 1 ? 'referral' : 'referrals'})
                </span>
              </div>
              <button
                onClick={() => setSelectedTier(null)}
                className="text-xs text-meatzy-rare hover:text-meatzy-welldone font-bold uppercase"
              >
                Clear Filter
              </button>
            </div>
          )}

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredTree.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {selectedTier ? `No referrals in Tier ${selectedTier}` : 'No referrals yet'}
              </div>
            ) : (
              filteredTree.map((member) => {
                const displayName = previewUserView
                  ? getDisplayName(member.users.full_name, member.users.email, false)
                  : (member.users.full_name || 'Unknown');

                return (
                  <div
                    key={member.user_id}
                    className="flex items-center justify-between gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        member.level === 1 ? 'bg-blue-600' :
                        member.level === 2 ? 'bg-green-600' :
                        member.level === 3 ? 'bg-yellow-600' :
                        'bg-purple-600'
                      }`} />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-meatzy-olive truncate">
                          {displayName}
                        </div>
                        {!previewUserView && (
                          <div className="text-xs text-gray-500 truncate">{member.users.email}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                        member.users.has_purchased
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {member.users.has_purchased ? 'Active' : 'Pending'}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                        Tier {member.level}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Commission History */}
        <div className="bg-white rounded-xl shadow-lg border border-meatzy-mint/30 p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-black font-slab text-meatzy-olive uppercase mb-4 md:mb-6">
            Commission History
          </h2>

          <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6">
            <div className="text-center p-2 md:p-4 bg-gray-50 rounded-lg">
              <div className="text-lg md:text-2xl font-black text-meatzy-olive">{commissionStats.count}</div>
              <div className="text-[10px] md:text-sm text-gray-600">Total Commissions</div>
            </div>
            <div className="text-center p-2 md:p-4 bg-yellow-50 rounded-lg">
              <div className="text-base md:text-2xl font-black text-yellow-600">
                ${commissionStats.pending.toFixed(2)}
              </div>
              <div className="text-[10px] md:text-sm text-gray-600">Pending</div>
            </div>
            <div className="text-center p-2 md:p-4 bg-green-50 rounded-lg">
              <div className="text-base md:text-2xl font-black text-green-600">
                ${commissionStats.approved.toFixed(2)}
              </div>
              <div className="text-[10px] md:text-sm text-gray-600">Approved</div>
            </div>
          </div>

          {/* Mobile Card Layout */}
          <div className="md:hidden space-y-3">
            {commissions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No commissions yet
              </div>
            ) : (
              commissions.map((commission) => {
                const fromName = previewUserView
                  ? getDisplayName(commission.referred_user?.full_name, commission.referred_user?.email, false)
                  : (commission.referred_user?.full_name || 'Unknown');

                return (
                  <div key={commission.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-meatzy-olive truncate">{fromName}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(commission.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <div className="font-black text-meatzy-olive">${commission.commission_amount.toFixed(2)}</div>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          commission.status === 'approved' ? 'bg-green-100 text-green-700' :
                          commission.status === 'paid' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {commission.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className={`px-2 py-1 rounded ${
                        commission.tier_level === 1 ? 'bg-blue-100 text-blue-700' :
                        commission.tier_level === 2 ? 'bg-green-100 text-green-700' :
                        commission.tier_level === 3 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        Tier {commission.tier_level} ({commission.base_percentage}%)
                      </span>
                      <span className="text-gray-500">Order: ${commission.order_total.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-2 text-sm font-bold text-gray-600">Date</th>
                  <th className="text-left py-3 px-2 text-sm font-bold text-gray-600">From</th>
                  <th className="text-left py-3 px-2 text-sm font-bold text-gray-600">Tier</th>
                  <th className="text-left py-3 px-2 text-sm font-bold text-gray-600">Order</th>
                  <th className="text-right py-3 px-2 text-sm font-bold text-gray-600">Amount</th>
                  <th className="text-center py-3 px-2 text-sm font-bold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {commissions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      No commissions yet
                    </td>
                  </tr>
                ) : (
                  commissions.map((commission) => {
                    const fromName = previewUserView
                      ? getDisplayName(commission.referred_user?.full_name, commission.referred_user?.email, false)
                      : (commission.referred_user?.full_name || 'Unknown');

                    return (
                      <tr key={commission.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-2 text-sm">
                          {new Date(commission.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-2 text-sm">
                          {fromName}
                        </td>
                        <td className="py-3 px-2 text-sm">
                          <span className={`px-2 py-1 rounded text-xs ${
                            commission.tier_level === 1 ? 'bg-blue-100 text-blue-700' :
                            commission.tier_level === 2 ? 'bg-green-100 text-green-700' :
                            commission.tier_level === 3 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            Tier {commission.tier_level} ({commission.base_percentage}%)
                          </span>
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-500">
                          ${commission.order_total.toFixed(2)}
                        </td>
                        <td className="py-3 px-2 text-sm text-right font-bold text-meatzy-olive">
                          ${commission.commission_amount.toFixed(2)}
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span className={`text-xs px-2 py-1 rounded ${
                            commission.status === 'approved' ? 'bg-green-100 text-green-700' :
                            commission.status === 'paid' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {commission.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

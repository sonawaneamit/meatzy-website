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
  const [editing, setEditing] = useState(false);
  const [editRate, setEditRate] = useState<number>(1.0);
  const [previewUserView, setPreviewUserView] = useState(false);
  const [selectedTier, setSelectedTier] = useState<number | null>(null);

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
      setEditRate(affiliateData.commission_override || affiliateData.commission_rate);

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

  const handleSaveRate = async () => {
    try {
      const supabase = createClient();

      const { error } = await supabase
        .from('users')
        .update({ commission_override: editRate })
        .eq('id', affiliateId);

      if (error) throw error;

      setAffiliate(prev => prev ? { ...prev, commission_override: editRate } : null);
      setEditing(false);
      alert('Commission rate updated successfully');
    } catch (error) {
      console.error('Error updating rate:', error);
      alert('Failed to update commission rate');
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

  const effectiveRate = affiliate.commission_override || affiliate.commission_rate;

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
                {affiliate.referrer && (
                  <div className="text-xs text-gray-500 mt-2">
                    Referred by: {previewUserView
                      ? getDisplayName(affiliate.referrer.full_name, affiliate.referrer.email, false)
                      : affiliate.referrer.full_name
                    }
                  </div>
                )}
              </div>
            </div>

            {/* Commission Rate - Admin Only (Hidden in Preview Mode) */}
            {!previewUserView && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Commission Rate</div>
                    {editing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max="1"
                          step="0.1"
                          value={editRate}
                          onChange={(e) => setEditRate(parseFloat(e.target.value))}
                          className="w-24 px-3 py-1 border border-gray-300 rounded"
                        />
                        <span className="text-lg font-bold">× 100%</span>
                        <button
                          onClick={handleSaveRate}
                          className="ml-2 p-1 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditing(false);
                            setEditRate(effectiveRate);
                          }}
                          className="p-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-meatzy-olive">
                          {(effectiveRate * 100).toFixed(0)}%
                        </span>
                        {affiliate.commission_override && (
                          <span className="text-xs bg-meatzy-gold/20 text-meatzy-gold px-2 py-1 rounded">
                            Override
                          </span>
                        )}
                        <button
                          onClick={() => setEditing(true)}
                          className="ml-2 p-1 text-gray-400 hover:text-meatzy-olive"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <div className="text-center">
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
        <div className="bg-white rounded-xl shadow-xl border-2 border-meatzy-mint/50 p-8 mb-8">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Wallet className={`w-8 h-8 ${(wallet?.balance || 0) >= 100 ? 'text-meatzy-dill' : 'text-gray-400'}`} />
                <div>
                  <h2 className="text-2xl font-black font-slab text-meatzy-olive uppercase">
                    Payment Status
                  </h2>
                  <p className="text-sm text-gray-600">
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
                  <span className="font-bold">
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
              className={`px-8 py-4 rounded-lg font-display font-bold uppercase tracking-widest text-lg transition-all flex items-center gap-3 whitespace-nowrap ${
                (wallet?.balance || 0) >= 100
                  ? 'bg-meatzy-dill text-white hover:bg-meatzy-olive shadow-lg hover:shadow-xl cursor-pointer'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {(wallet?.balance || 0) >= 100 ? (
                <>
                  <Wallet className="w-6 h-6" />
                  Request Payment
                </>
              ) : (
                <>
                  <Lock className="w-6 h-6" />
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

          <div className="grid grid-cols-4 gap-4 mb-6">
            <button
              onClick={() => handleTierClick(1)}
              className={`text-center p-4 rounded-lg transition-all cursor-pointer hover:shadow-lg ${
                selectedTier === 1
                  ? 'bg-blue-600 text-white ring-4 ring-blue-300'
                  : 'bg-blue-50 hover:bg-blue-100'
              }`}
            >
              <div className={`text-3xl font-black ${selectedTier === 1 ? 'text-white' : 'text-blue-600'}`}>
                {treeStats.tier1}
              </div>
              <div className={`text-sm ${selectedTier === 1 ? 'text-blue-100' : 'text-gray-600'}`}>
                Tier 1 (13%)
              </div>
            </button>
            <button
              onClick={() => handleTierClick(2)}
              className={`text-center p-4 rounded-lg transition-all cursor-pointer hover:shadow-lg ${
                selectedTier === 2
                  ? 'bg-green-600 text-white ring-4 ring-green-300'
                  : 'bg-green-50 hover:bg-green-100'
              }`}
            >
              <div className={`text-3xl font-black ${selectedTier === 2 ? 'text-white' : 'text-green-600'}`}>
                {treeStats.tier2}
              </div>
              <div className={`text-sm ${selectedTier === 2 ? 'text-green-100' : 'text-gray-600'}`}>
                Tier 2 (2%)
              </div>
            </button>
            <button
              onClick={() => handleTierClick(3)}
              className={`text-center p-4 rounded-lg transition-all cursor-pointer hover:shadow-lg ${
                selectedTier === 3
                  ? 'bg-yellow-600 text-white ring-4 ring-yellow-300'
                  : 'bg-yellow-50 hover:bg-yellow-100'
              }`}
            >
              <div className={`text-3xl font-black ${selectedTier === 3 ? 'text-white' : 'text-yellow-600'}`}>
                {treeStats.tier3}
              </div>
              <div className={`text-sm ${selectedTier === 3 ? 'text-yellow-100' : 'text-gray-600'}`}>
                Tier 3 (1%)
              </div>
            </button>
            <button
              onClick={() => handleTierClick(4)}
              className={`text-center p-4 rounded-lg transition-all cursor-pointer hover:shadow-lg ${
                selectedTier === 4
                  ? 'bg-purple-600 text-white ring-4 ring-purple-300'
                  : 'bg-purple-50 hover:bg-purple-100'
              }`}
            >
              <div className={`text-3xl font-black ${selectedTier === 4 ? 'text-white' : 'text-purple-600'}`}>
                {treeStats.tier4}
              </div>
              <div className={`text-sm ${selectedTier === 4 ? 'text-purple-100' : 'text-gray-600'}`}>
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
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        member.level === 1 ? 'bg-blue-600' :
                        member.level === 2 ? 'bg-green-600' :
                        member.level === 3 ? 'bg-yellow-600' :
                        'bg-purple-600'
                      }`} />
                      <div>
                        <div className="font-bold text-meatzy-olive">
                          {displayName}
                        </div>
                        {!previewUserView && (
                          <div className="text-xs text-gray-500">{member.users.email}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded ${
                        member.users.has_purchased
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {member.users.has_purchased ? 'Active' : 'Pending'}
                      </span>
                      <span className="text-sm text-gray-500">
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
        <div className="bg-white rounded-xl shadow-lg border border-meatzy-mint/30 p-6">
          <h2 className="text-2xl font-black font-slab text-meatzy-olive uppercase mb-6">
            Commission History
          </h2>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-black text-meatzy-olive">{commissionStats.count}</div>
              <div className="text-sm text-gray-600">Total Commissions</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-black text-yellow-600">
                ${commissionStats.pending.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-black text-green-600">
                ${commissionStats.approved.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
          </div>

          <div className="overflow-x-auto">
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

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../lib/supabase/client';
import {
  Users,
  DollarSign,
  TrendingUp,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpRight,
  BarChart3,
  Copy,
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Stats
  const [stats, setStats] = useState({
    totalAffiliates: 0,
    activeAffiliates: 0,
    totalCommissions: 0,
    pendingCommissions: 0,
    totalPaid: 0,
    totalEarned: 0,
  });

  // Data lists
  const [affiliates, setAffiliates] = useState<any[]>([]);
  const [recentCommissions, setRecentCommissions] = useState<any[]>([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState<any[]>([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const supabase = createClient();

      // Check if user is authenticated and is admin
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

      if (authError || !authUser) {
        console.error('Auth error:', authError);
        router.push('/login');
        return;
      }

      // Check if user is admin
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('is_admin, email, full_name')
        .eq('id', authUser.id)
        .single();

      if (userError) {
        console.error('Error fetching user data:', userError);
        router.push('/dashboard');
        return;
      }

      if (!userData || !userData.is_admin) {
        console.error('Access denied: User is not an admin', userData);
        alert('Access denied: You must be an admin to view this page.');
        router.push('/dashboard');
        return;
      }

      console.log('Admin access granted:', userData);
      setCurrentUser(userData);

      // Load all stats
      await Promise.all([
        loadStats(),
        loadAffiliates(),
        loadRecentCommissions(),
        loadPendingWithdrawals(),
      ]);

    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    const supabase = createClient();

    // Total affiliates
    const { count: totalAffiliates } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Active affiliates (has_purchased = true)
    const { count: activeAffiliates } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('has_purchased', true);

    // Total commissions count
    const { count: totalCommissions } = await supabase
      .from('commissions')
      .select('*', { count: 'exact', head: true });

    // Pending commissions count
    const { count: pendingCommissions } = await supabase
      .from('commissions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Total earned (sum of all commissions)
    const { data: commissionsData } = await supabase
      .from('commissions')
      .select('commission_amount');

    const totalEarned = commissionsData?.reduce((sum, c) => sum + parseFloat(c.commission_amount), 0) || 0;

    // Total paid (sum of approved commissions)
    const { data: paidCommissions } = await supabase
      .from('commissions')
      .select('commission_amount')
      .eq('status', 'approved');

    const totalPaid = paidCommissions?.reduce((sum, c) => sum + parseFloat(c.commission_amount), 0) || 0;

    setStats({
      totalAffiliates: totalAffiliates || 0,
      activeAffiliates: activeAffiliates || 0,
      totalCommissions: totalCommissions || 0,
      pendingCommissions: pendingCommissions || 0,
      totalEarned,
      totalPaid,
    });
  };

  const loadAffiliates = async () => {
    const supabase = createClient();

    // Get auth token
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error('No session found');
      return;
    }

    // Call API route with service role permissions
    try {
      const response = await fetch('/api/admin/affiliates', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!response.ok) {
        console.error('Failed to load affiliates:', response.statusText);
        return;
      }

      const result = await response.json();
      if (result.success && result.affiliates) {
        console.log('Loaded affiliates:', result.affiliates.length);
        console.log('Sample affiliate (Lucas):', result.affiliates.find(a => a.full_name?.includes('Lucas')));
        setAffiliates(result.affiliates);
      }
    } catch (error) {
      console.error('Error loading affiliates:', error);
    }
  };

  const loadRecentCommissions = async () => {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('commissions')
      .select(`
        id,
        commission_amount,
        tier_level,
        status,
        created_at,
        user:user_id(email, full_name),
        buyer:referred_user_id(email, full_name)
      `)
      .order('created_at', { ascending: false })
      .limit(20);

    if (!error && data) {
      setRecentCommissions(data);
    }
  };

  const loadPendingWithdrawals = async () => {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('withdrawals')
      .select(`
        id,
        amount,
        paypal_email,
        status,
        created_at,
        user:user_id(email, full_name)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPendingWithdrawals(data);
    }
  };

  const viewAffiliateDetails = (affiliateId: string) => {
    router.push(`/admin/affiliate/${affiliateId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-meatzy-tallow pt-0">
        <div className="text-meatzy-olive font-display font-bold uppercase tracking-widest text-xl">
          Loading admin dashboard...
        </div>
      </div>
    );
  }

  const filteredAffiliates = affiliates.filter(affiliate => {
    const matchesSearch = !searchQuery ||
      affiliate.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      affiliate.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      affiliate.referral_code?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'active' && affiliate.has_purchased) ||
      (filterStatus === 'inactive' && !affiliate.has_purchased);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-meatzy-tallow pt-0 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black font-slab text-meatzy-olive uppercase mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage affiliates, commissions, and payouts</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {/* Total Affiliates */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-meatzy-mint/30">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-meatzy-olive" />
              <span className="text-xs font-bold text-gray-600 uppercase">Total</span>
            </div>
            <div className="text-2xl font-black text-meatzy-olive">{stats.totalAffiliates}</div>
            <div className="text-xs text-gray-500 mt-1">Affiliates</div>
          </div>

          {/* Active Affiliates */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-meatzy-mint/30">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-meatzy-dill" />
              <span className="text-xs font-bold text-gray-600 uppercase">Active</span>
            </div>
            <div className="text-2xl font-black text-meatzy-dill">{stats.activeAffiliates}</div>
            <div className="text-xs text-gray-500 mt-1">Purchased</div>
          </div>

          {/* Total Commissions */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-meatzy-mint/30">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-meatzy-gold" />
              <span className="text-xs font-bold text-gray-600 uppercase">Total</span>
            </div>
            <div className="text-2xl font-black text-meatzy-gold">{stats.totalCommissions}</div>
            <div className="text-xs text-gray-500 mt-1">Commissions</div>
          </div>

          {/* Pending Commissions */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-meatzy-mint/30">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-meatzy-rare" />
              <span className="text-xs font-bold text-gray-600 uppercase">Pending</span>
            </div>
            <div className="text-2xl font-black text-meatzy-rare">{stats.pendingCommissions}</div>
            <div className="text-xs text-gray-500 mt-1">To Review</div>
          </div>

          {/* Total Earned */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-meatzy-mint/30">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-meatzy-olive" />
              <span className="text-xs font-bold text-gray-600 uppercase">Earned</span>
            </div>
            <div className="text-2xl font-black text-meatzy-olive">${stats.totalEarned.toFixed(0)}</div>
            <div className="text-xs text-gray-500 mt-1">All Time</div>
          </div>

          {/* Total Paid */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-meatzy-mint/30">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-5 h-5 text-meatzy-dill" />
              <span className="text-xs font-bold text-gray-600 uppercase">Paid</span>
            </div>
            <div className="text-2xl font-black text-meatzy-dill">${stats.totalPaid.toFixed(0)}</div>
            <div className="text-xs text-gray-500 mt-1">Approved</div>
          </div>
        </div>

        {/* Pending Withdrawals Alert */}
        {pendingWithdrawals.length > 0 && (
          <div className="bg-meatzy-rare/10 border border-meatzy-rare/30 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-meatzy-rare" />
              <h3 className="text-xl font-black font-slab text-meatzy-rare uppercase">
                {pendingWithdrawals.length} Pending Withdrawal{pendingWithdrawals.length !== 1 ? 's' : ''}
              </h3>
            </div>
            <div className="space-y-3">
              {pendingWithdrawals.map((withdrawal) => {
                const user = withdrawal.user;
                return (
                  <div key={withdrawal.id} className="bg-white rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-meatzy-olive">{user?.full_name || user?.email}</div>
                      <div className="text-sm text-gray-600">PayPal: {withdrawal.paypal_email}</div>
                      <div className="text-xs text-gray-500">Requested: {new Date(withdrawal.created_at).toLocaleDateString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-meatzy-rare">${withdrawal.amount}</div>
                      <button className="mt-2 px-4 py-2 bg-meatzy-dill text-white text-sm font-bold rounded-lg hover:bg-meatzy-olive transition-colors">
                        Process Payout
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Affiliates List */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-meatzy-mint/30 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-black font-slab text-meatzy-olive uppercase">
              Affiliates
            </h3>
            <div className="flex gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search affiliates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-meatzy-rare focus:border-transparent"
                />
              </div>
              {/* Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-meatzy-rare focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-bold text-gray-700 uppercase text-xs">Affiliate</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-700 uppercase text-xs">Code</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-700 uppercase text-xs">SafeLink</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-700 uppercase text-xs">Status</th>
                  <th className="text-right py-3 px-4 font-bold text-gray-700 uppercase text-xs">Pending</th>
                  <th className="text-right py-3 px-4 font-bold text-gray-700 uppercase text-xs">Lifetime</th>
                  <th className="text-right py-3 px-4 font-bold text-gray-700 uppercase text-xs">Available</th>
                  <th className="text-center py-3 px-4 font-bold text-gray-700 uppercase text-xs">Rate</th>
                  <th className="text-center py-3 px-4 font-bold text-gray-700 uppercase text-xs">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAffiliates.map((affiliate) => {
                  const wallet = Array.isArray(affiliate.wallet) ? affiliate.wallet[0] : affiliate.wallet;
                  return (
                    <tr key={affiliate.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <button
                          onClick={() => viewAffiliateDetails(affiliate.id)}
                          className="text-left hover:underline"
                        >
                          <div className="font-bold text-meatzy-olive">{affiliate.full_name || 'No name'}</div>
                          <div className="text-sm text-gray-600">{affiliate.email}</div>
                          <div className="text-xs text-gray-400">Joined {new Date(affiliate.created_at).toLocaleDateString()}</div>
                        </button>
                      </td>
                      <td className="py-4 px-4">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{affiliate.referral_code}</code>
                      </td>
                      <td className="py-4 px-4">
                        {affiliate.safe_link ? (
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(affiliate.safe_link);
                              alert('SafeLink copied!');
                            }}
                            className="flex items-center gap-2 text-sm text-meatzy-olive hover:text-meatzy-rare transition-colors"
                            title="Click to copy SafeLink"
                          >
                            <Copy className="w-4 h-4" />
                            <span className="font-mono text-xs truncate max-w-[150px]">
                              /go/{affiliate.slug}
                            </span>
                          </button>
                        ) : (
                          <span className="text-gray-400 text-xs">No link</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {affiliate.has_purchased ? (
                          <span className="px-3 py-1 bg-meatzy-dill/20 text-meatzy-dill text-xs font-bold rounded-full">
                            ACTIVE
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-bold rounded-full">
                            INACTIVE
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-meatzy-rare">
                        ${wallet?.pending_balance?.toFixed(2) || '0.00'}
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-meatzy-olive">
                        ${wallet?.lifetime_earnings?.toFixed(2) || '0.00'}
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-meatzy-dill">
                        ${wallet?.available_balance?.toFixed(2) || '0.00'}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-sm font-bold">{(affiliate.commission_rate * 100).toFixed(0)}%</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => viewAffiliateDetails(affiliate.id)}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-meatzy-olive text-white text-sm font-bold rounded-lg hover:bg-meatzy-rare transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredAffiliates.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No affiliates found matching your filters
              </div>
            )}
          </div>
        </div>

        {/* Recent Commissions */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-meatzy-mint/30">
          <h3 className="text-2xl font-black font-slab text-meatzy-olive uppercase mb-6">
            Recent Commissions
          </h3>

          <div className="space-y-3">
            {recentCommissions.map((commission) => {
              const earner = commission.user;
              const buyer = commission.buyer;
              return (
                <div key={commission.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-bold text-meatzy-olive">
                      {earner?.full_name || earner?.email}
                    </div>
                    <div className="text-sm text-gray-600">
                      Tier {commission.tier_level} from {buyer?.full_name || buyer?.email}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(commission.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black text-meatzy-rare">
                      +${commission.commission_amount.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {commission.status}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {recentCommissions.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No commissions yet
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

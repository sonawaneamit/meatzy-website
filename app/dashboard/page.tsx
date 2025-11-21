'use client';

import React, { useEffect, useState, useRef } from 'react';
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
  AlertCircle,
  Download,
  QrCode,
  Facebook,
  Twitter,
  MessageCircle,
  Mail,
  Wallet,
  Lock,
  ShoppingBag,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import QRCodeLib from 'qrcode';
import { generateReferralLink, generateSocialLinks, copyToClipboard, downloadQRCode } from '../../lib/referral-utils';
import { getDisplayName } from '../../lib/privacy-utils';

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

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [wallet, setWallet] = useState<any>(null);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [orders, setOrders] = useState<ShopifyOrder[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [copied, setCopied] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [showQRModal, setShowQRModal] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Password change modal state
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const supabase = createClient();

      console.log('[Dashboard] Loading dashboard...');

      // Get authenticated user
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

      console.log('[Dashboard] Auth check:', {
        hasUser: !!authUser,
        email: authUser?.email,
        error: authError?.message
      });

      if (!authUser) {
        console.log('[Dashboard] No authenticated user, redirecting to login');
        router.push('/login');
        return;
      }

      console.log('[Dashboard] ✓ User authenticated:', authUser.email);

      // Check if user has a users record first
      let userData = await getUserByEmail(authUser.email!);

      // If no users record, check for pending setup
      if (!userData) {
        console.log('No users record found - checking for pending setup data...');
        await completePendingSetup(authUser.email!, authUser.id);

        // Try getting user data again after setup
        userData = await getUserByEmail(authUser.email!);

        if (!userData) {
          console.error('User still not found after pending setup');
          return;
        }

        console.log('✓ User record created successfully from pending setup!');
      }

      // Check if this is a new user from magic link and remove the param
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('new_user') === 'true') {
        window.history.replaceState({}, '', '/dashboard');
      }

      setUser(userData);

      // Check if user is admin
      setIsAdmin(userData.is_admin || false);

      // Check if user needs to change password (first login with temporary password)
      if (userData.requires_password_change) {
        setShowPasswordChangeModal(true);
      }

      // Load wallet, commissions, and referrals
      const [walletData, commissionsData, referralsData] = await Promise.all([
        getWalletBalance(userData.id),
        getCommissionHistory(userData.id),
        getDirectReferrals(userData.id),
      ]);

      setWallet(walletData);
      setCommissions(commissionsData);
      setReferrals(referralsData);

      // Load Shopify orders if user has shopify_customer_id
      if (userData.shopify_customer_id) {
        await loadShopifyOrders(userData.shopify_customer_id);
      } else {
        // Try loading by email as fallback
        await loadShopifyOrdersByEmail(authUser.email!);
      }

    } catch (error) {
      console.error('Error loading dashboard:', error);
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

  /**
   * Complete pending setup for new users who authenticated via magic link
   * This creates the users record with webhook data (no trigger needed!)
   */
  const completePendingSetup = async (email: string, userId: string) => {
    try {
      const supabase = createClient();

      // Fetch pending setup data
      const { data: pendingData, error: fetchError } = await supabase
        .from('pending_user_setup')
        .select('*')
        .eq('email', email.toLowerCase())
        .single();

      if (fetchError || !pendingData) {
        console.log('No pending setup data found for:', email);
        return;
      }

      console.log('Found pending setup data:', pendingData);

      // Create users record with webhook data (no trigger, we do it manually)
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: userId, // Use auth user ID
          email: email.toLowerCase(),
          full_name: pendingData.full_name,
          referral_code: pendingData.referral_code,
          referred_by_code: pendingData.referred_by_code,
          shopify_customer_id: pendingData.shopify_customer_id,
          has_purchased: true,
          commission_rate: 1.0, // New customers get 100% commission
        });

      if (insertError) {
        console.error('Error creating user with pending data:', insertError);
        return;
      }

      console.log('✓ User record created with webhook data');

      // Calculate commissions for the order if we have order data
      if (pendingData.shopify_order_id && pendingData.order_total) {
        console.log('Calculating commissions for order:', pendingData.shopify_order_id);

        const response = await fetch('/api/calculate-commission', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: userId,
            orderId: pendingData.shopify_order_id,
            orderTotal: pendingData.order_total,
          }),
        });

        if (response.ok) {
          console.log('✓ Commissions calculated');
        } else {
          console.error('Failed to calculate commissions');
        }
      }

      // Delete pending setup data
      await supabase
        .from('pending_user_setup')
        .delete()
        .eq('email', email.toLowerCase());

      console.log('✓ Pending setup completed and cleaned up');

    } catch (error) {
      console.error('Error completing pending setup:', error);
    }
  };

  // Generate QR code when user is loaded
  useEffect(() => {
    if (user?.referral_code) {
      generateQRCode();
    }
  }, [user]);

  const generateQRCode = async () => {
    if (!user?.referral_code) return;

    const referralLink = generateReferralLink(user.referral_code, { includeUTM: true });

    try {
      const dataUrl = await QRCodeLib.toDataURL(referralLink, {
        width: 300,
        margin: 2,
        color: {
          dark: '#2D2B25', // meatzy-olive
          light: '#FFFFFF',
        },
      });
      setQrCodeDataUrl(dataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const copyReferralLink = async () => {
    const link = generateReferralLink(user.referral_code, { includeUTM: true });
    const success = await copyToClipboard(link);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadQR = () => {
    if (qrCodeDataUrl) {
      downloadQRCode(qrCodeDataUrl, `meatzy-referral-${user.referral_code}.png`);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeError('');

    // Validation
    if (newPassword.length < 8) {
      setPasswordChangeError('Password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordChangeError('Passwords do not match');
      return;
    }

    setChangingPassword(true);

    try {
      const supabase = createClient();

      // Update password in Supabase Auth
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        throw updateError;
      }

      // Clear temporary password and flag in users table
      const { error: dbError } = await supabase
        .from('users')
        .update({
          temporary_password: null,
          requires_password_change: false
        })
        .eq('id', user.id);

      if (dbError) {
        console.error('Error updating user record:', dbError);
        // Don't throw - password was changed successfully
      }

      // Update local user state
      setUser({ ...user, requires_password_change: false, temporary_password: null });

      // Close modal
      setShowPasswordChangeModal(false);
      setNewPassword('');
      setConfirmNewPassword('');

      alert('Password changed successfully!');

    } catch (error: any) {
      console.error('Password change error:', error);
      setPasswordChangeError(error.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-meatzy-tallow pt-0">
        <div className="text-meatzy-olive font-display font-bold uppercase tracking-widest text-xl">
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // User type detection
  const isAffiliate = true; // Always true if they're in the users table
  const isCustomer = user.shopify_customer_id || orders.length > 0;

  // Pagination logic for orders
  const ordersPerPage = 10;
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const displayedOrders = orders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const referralLink = generateReferralLink(user.referral_code, { includeUTM: true });
  const socialLinks = generateSocialLinks(user.referral_code, referralLink);

  return (
    <div className="min-h-screen bg-meatzy-tallow pt-0 pb-20">
      {/* Password Change Modal */}
      {showPasswordChangeModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <Lock className="w-12 h-12 text-meatzy-olive mx-auto mb-3" />
              <h2 className="text-2xl font-black font-slab text-meatzy-olive uppercase mb-2">
                Change Your Password
              </h2>
              <p className="text-sm text-gray-600">
                For security, please set a new password for your account.
              </p>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-meatzy-olive mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-meatzy-rare focus:border-transparent"
                  placeholder="Enter new password"
                  required
                  minLength={8}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-meatzy-olive mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-meatzy-rare focus:border-transparent"
                  placeholder="Confirm new password"
                  required
                  minLength={8}
                />
              </div>

              {passwordChangeError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {passwordChangeError}
                </div>
              )}

              <button
                type="submit"
                disabled={changingPassword}
                className="w-full bg-meatzy-rare text-white py-4 font-display font-bold uppercase tracking-widest hover:bg-meatzy-welldone transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
              >
                {changingPassword ? 'Updating...' : 'Update Password'}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Password must be at least 8 characters long
              </p>
            </form>
          </div>
        </div>
      )}

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

        {/* Request Payment Section */}
        <div className="bg-white rounded-xl shadow-xl border-2 border-meatzy-mint/50 p-4 md:p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-4 md:gap-6">
            <div className="flex-1 w-full">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 md:p-3 rounded-full flex-shrink-0 ${
                  (wallet?.available_balance || 0) >= 100
                    ? 'bg-meatzy-dill/20'
                    : 'bg-gray-100'
                }`}>
                  <Wallet className={`w-5 h-5 md:w-6 md:h-6 ${
                    (wallet?.available_balance || 0) >= 100
                      ? 'text-meatzy-dill'
                      : 'text-gray-400'
                  }`} />
                </div>
                <div>
                  <h3 className="text-lg md:text-2xl font-black font-slab text-meatzy-olive uppercase">
                    Request Payment
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600">
                    Minimum payout: $100
                  </p>
                </div>
              </div>

              {(wallet?.available_balance || 0) >= 100 ? (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Check className="w-5 h-5 text-meatzy-dill" />
                    <p className="text-meatzy-dill font-bold text-sm md:text-base">
                      You're eligible for payment!
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    You have <span className="font-black text-meatzy-dill">${wallet?.available_balance?.toFixed(2)}</span> ready to withdraw.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress to $100</span>
                      <span className="font-bold text-meatzy-olive">
                        ${wallet?.available_balance?.toFixed(2) || '0.00'} / $100
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-meatzy-rare to-meatzy-gold h-full transition-all duration-500"
                        style={{ width: `${Math.min(((wallet?.available_balance || 0) / 100) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Earn <span className="font-black text-meatzy-rare">${(100 - (wallet?.available_balance || 0)).toFixed(2)}</span> more to request payment
                  </p>
                </div>
              )}
            </div>

            <button
              disabled={(wallet?.available_balance || 0) < 100}
              className={`w-full lg:w-auto px-6 md:px-8 py-3 md:py-4 rounded-lg font-display font-bold uppercase tracking-widest text-sm md:text-lg transition-all flex items-center justify-center gap-2 md:gap-3 ${
                (wallet?.available_balance || 0) >= 100
                  ? 'bg-meatzy-dill text-white hover:bg-meatzy-olive shadow-lg hover:shadow-xl cursor-pointer'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {(wallet?.available_balance || 0) >= 100 ? (
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

        {/* Order History Section - Only shown if user has orders */}
        {isCustomer && (
          <div className="bg-white rounded-xl shadow-lg border border-meatzy-mint/30 p-4 md:p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-meatzy-olive/20 rounded-lg">
                  <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-meatzy-olive" />
                </div>
                <h2 className="text-xl md:text-2xl font-black font-slab text-meatzy-olive uppercase">
                  Your Orders
                </h2>
              </div>

              {/* Manage Subscriptions Placeholder Button */}
              <button
                disabled
                className="w-full md:w-auto px-4 md:px-6 py-2 md:py-3 bg-gray-200 text-gray-400 rounded-lg font-bold uppercase tracking-wide cursor-not-allowed flex items-center justify-center gap-2 text-xs md:text-sm whitespace-nowrap"
                title="Coming soon - Subscription management will be available after integration"
              >
                <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
                Manage Subscriptions
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No orders found</p>
                <p className="text-gray-400 text-sm mt-2">
                  Start shopping to see your order history here
                </p>
              </div>
            ) : (
              <>
                {/* Orders List */}
                <div className="space-y-4 mb-6">
                  {displayedOrders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-200 rounded-lg p-5 hover:border-meatzy-mint transition-colors"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-black text-lg text-meatzy-olive">
                            Order {order.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {new Date(order.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black text-meatzy-olive">
                            ${parseFloat(order.total_price).toFixed(2)}
                          </div>
                          <div className="flex gap-2 mt-2">
                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                              order.financial_status === 'paid'
                                ? 'bg-meatzy-dill/20 text-meatzy-dill'
                                : order.financial_status === 'pending'
                                ? 'bg-meatzy-gold/20 text-meatzy-gold'
                                : 'bg-gray-200 text-gray-600'
                            }`}>
                              {order.financial_status?.toUpperCase()}
                            </span>
                            {order.fulfillment_status && (
                              <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                                order.fulfillment_status === 'fulfilled'
                                  ? 'bg-meatzy-dill/20 text-meatzy-dill'
                                  : 'bg-meatzy-gold/20 text-meatzy-gold'
                              }`}>
                                {order.fulfillment_status?.toUpperCase()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="border-t border-gray-200 pt-3">
                        <div className="space-y-2">
                          {order.line_items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between items-center text-sm"
                            >
                              <div className="flex-1">
                                <span className="text-meatzy-olive font-bold">
                                  {item.title}
                                </span>
                                <span className="text-gray-500 ml-2">
                                  × {item.quantity}
                                </span>
                              </div>
                              <div className="font-bold text-gray-700">
                                ${parseFloat(item.price).toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-lg transition-colors ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-meatzy-olive text-white hover:bg-meatzy-rare'
                      }`}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <span className="text-sm font-bold text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-lg transition-colors ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-meatzy-olive text-white hover:bg-meatzy-rare'
                      }`}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Referral Link & QR Code Section */}
        <div className="bg-gradient-to-br from-meatzy-olive to-meatzy-rare rounded-xl p-8 mb-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Share2 className="w-6 h-6" />
            <h2 className="text-2xl font-black font-slab uppercase">Share & Earn</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Referral Link */}
            <div className="lg:col-span-2">
              <p className="text-meatzy-mint mb-4">
                Share this link to earn commissions on every purchase!
              </p>

              <div className="flex gap-3 mb-4">
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

              <div className="mb-4 text-sm text-meatzy-mint">
                Your referral code: <span className="font-black text-white text-lg">{user.referral_code}</span>
              </div>

              {/* Social Sharing */}
              <div className="flex flex-wrap gap-3">
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-2 text-sm font-bold"
                >
                  <Facebook className="w-4 h-4" />
                  Facebook
                </a>
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-2 text-sm font-bold"
                >
                  <Twitter className="w-4 h-4" />
                  Twitter
                </a>
                <a
                  href={socialLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-2 text-sm font-bold"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
                <a
                  href={socialLinks.email}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-2 text-sm font-bold"
                >
                  <Mail className="w-4 h-4" />
                  Email
                </a>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center justify-center bg-white rounded-xl p-6">
              {qrCodeDataUrl ? (
                <>
                  <img
                    src={qrCodeDataUrl}
                    alt="Referral QR Code"
                    className="w-48 h-48 mb-4"
                  />
                  <button
                    onClick={handleDownloadQR}
                    className="px-4 py-2 bg-meatzy-olive text-white rounded-lg hover:bg-meatzy-rare transition-colors flex items-center gap-2 text-sm font-bold"
                  >
                    <Download className="w-4 h-4" />
                    Download QR
                  </button>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Print or share this QR code
                  </p>
                </>
              ) : (
                <div className="w-48 h-48 flex items-center justify-center bg-gray-100 rounded-lg">
                  <QrCode className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
          </div>
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
                  const displayName = getDisplayName(refUser.full_name, refUser.email, isAdmin);
                  return (
                    <div
                      key={referral.user_id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <div className="font-bold text-meatzy-olive">
                          {displayName}
                        </div>
                        {isAdmin && (
                          <div className="text-xs text-gray-400">
                            {refUser.email}
                          </div>
                        )}
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

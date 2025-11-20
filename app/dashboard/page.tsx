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
  Lock
} from 'lucide-react';
import QRCodeLib from 'qrcode';
import { generateReferralLink, generateSocialLinks, copyToClipboard, downloadQRCode } from '../../lib/referral-utils';
import { getDisplayName } from '../../lib/privacy-utils';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [wallet, setWallet] = useState<any>(null);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [showQRModal, setShowQRModal] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

      // Check if user is admin
      setIsAdmin(userData.is_admin || false);

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

  const referralLink = generateReferralLink(user.referral_code, { includeUTM: true });
  const socialLinks = generateSocialLinks(user.referral_code, referralLink);

  return (
    <div className="min-h-screen bg-meatzy-tallow pt-0 pb-20">
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
        <div className="bg-white rounded-xl shadow-xl border-2 border-meatzy-mint/50 p-8 mb-8">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-3 rounded-full ${
                  (wallet?.available_balance || 0) >= 100
                    ? 'bg-meatzy-dill/20'
                    : 'bg-gray-100'
                }`}>
                  <Wallet className={`w-6 h-6 ${
                    (wallet?.available_balance || 0) >= 100
                      ? 'text-meatzy-dill'
                      : 'text-gray-400'
                  }`} />
                </div>
                <div>
                  <h3 className="text-2xl font-black font-slab text-meatzy-olive uppercase">
                    Request Payment
                  </h3>
                  <p className="text-sm text-gray-600">
                    Minimum payout: $100
                  </p>
                </div>
              </div>

              {(wallet?.available_balance || 0) >= 100 ? (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Check className="w-5 h-5 text-meatzy-dill" />
                    <p className="text-meatzy-dill font-bold">
                      You're eligible for payment! 🎉
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
              className={`px-8 py-4 rounded-lg font-display font-bold uppercase tracking-widest text-lg transition-all flex items-center gap-3 ${
                (wallet?.available_balance || 0) >= 100
                  ? 'bg-meatzy-dill text-white hover:bg-meatzy-olive shadow-lg hover:shadow-xl cursor-pointer'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {(wallet?.available_balance || 0) >= 100 ? (
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

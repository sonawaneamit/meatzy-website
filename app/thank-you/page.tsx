'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import QRCodeLib from 'qrcode';
import { CheckCircle, Copy, Download, Share2, Mail, MessageCircle, Info } from 'lucide-react';
import { generateReferralLink, generateSocialLinks, copyToClipboard, downloadQRCode } from '@/lib/referral-utils';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function ThankYouContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [referralCode, setReferralCode] = useState<string>('');
  const [referralLink, setReferralLink] = useState<string>('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [socialLinks, setSocialLinks] = useState<any>(null);

  // Order details state
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loadingOrder, setLoadingOrder] = useState(false);

  // Password setup state
  const [showPasswordSetup, setShowPasswordSetup] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [settingPassword, setSettingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [temporaryPassword, setTemporaryPassword] = useState<string>('');
  const [tempPasswordCopied, setTempPasswordCopied] = useState(false);

  useEffect(() => {
    // Get order details from URL parameters
    // Shopify will pass: ?order_id=123&email=customer@email.com&name=John+Doe
    const orderId = searchParams.get('order_id');
    const email = searchParams.get('email');
    const name = searchParams.get('name');

    if (orderId) {
      setOrderNumber(orderId);
      fetchOrderDetails(orderId);
    }
    if (email) setCustomerEmail(email);
    if (name) setCustomerName(name);

    if (email) {
      fetchUserReferralData(email);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const fetchOrderDetails = async (orderId: string) => {
    setLoadingOrder(true);
    try {
      const response = await fetch(`/api/shopify/order?order_id=${orderId}`);

      if (response.ok) {
        const data = await response.json();
        setOrderDetails(data);
      } else {
        console.error('Failed to fetch order details:', response.status);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoadingOrder(false);
    }
  };

  const fetchUserReferralData = async (email: string) => {
    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      // Fetch user by email
      const { data: user, error } = await supabase
        .from('users')
        .select('referral_code, full_name, temporary_password, requires_password_change')
        .eq('email', email.toLowerCase())
        .single();

      if (error || !user || !user.referral_code) {
        console.log('User not found or no referral code yet');
        setLoading(false);
        return;
      }

      setReferralCode(user.referral_code);

      // Check if this user was created by webhook (has referral code but no auth account)
      // If so, show temporary password and login instructions
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        // User exists in database but no auth - created by webhook
        console.log('User created by webhook, showing temporary password');

        // Store temporary password if it exists
        if (user.temporary_password) {
          setTemporaryPassword(user.temporary_password);
        }

        setPasswordSuccess(true); // Show success state
        setShowPasswordSetup(false); // Don't show password form
      }

      // Generate simple referral link (no UTM for cleaner look)
      const link = generateReferralLink(user.referral_code);
      setReferralLink(link);

      // Store the referral link in Supabase for customer support
      await supabase
        .from('users')
        .update({ referral_link: link })
        .eq('email', email.toLowerCase());

      // Generate social links
      const social = generateSocialLinks(user.referral_code, link);
      setSocialLinks(social);

      // Generate QR code
      try {
        const qr = await QRCodeLib.toDataURL(link, {
          width: 400,
          margin: 2,
          color: {
            dark: '#2D2B25', // meatzy-olive
            light: '#FFFFFF',
          },
        });
        setQrCodeDataUrl(qr);
      } catch (qrError) {
        console.error('QR code generation failed:', qrError);
      }
    } catch (error) {
      console.error('Error fetching referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    const success = await copyToClipboard(referralLink);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadQR = () => {
    if (qrCodeDataUrl) {
      downloadQRCode(qrCodeDataUrl, `meatzy-referral-${referralCode}.png`);
    }
  };

  const handlePasswordSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    // Validation
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setSettingPassword(true);

    try {
      // Call smart backend API that handles both existing and new users
      const response = await fetch('/api/auth/setup-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: customerEmail,
          password: password,
          referralCode: referralCode,
          fullName: customerName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Password setup error:', data.error);
        setPasswordError(data.error || 'Failed to create account. Please try again.');
      } else {
        setPasswordSuccess(true);
        setShowPasswordSetup(false);

        if (data.useMagicLink) {
          // Magic link was sent - show email check message (no redirect)
          setPasswordError(''); // Clear any errors
        } else {
          // Password was set - store session and redirect
          if (data.session) {
            const supabase = createClient(supabaseUrl, supabaseAnonKey);
            await supabase.auth.setSession(data.session);
          }

          // Auto-redirect to dashboard after 2 seconds
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Password setup error:', error);
      setPasswordError('An unexpected error occurred. Please try again.');
    } finally {
      setSettingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-meatzy-tallow via-white to-meatzy-mint/20 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {/* Order Confirmation */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-meatzy-dill rounded-full mb-3">
            <CheckCircle className="w-7 h-7 text-white" />
          </div>

          <h1 className="text-2xl md:text-3xl font-black font-slab text-meatzy-olive uppercase mb-2">
            Order Confirmed!
          </h1>

          <p className="text-base text-gray-600 mb-0.5">
            Thank you{customerName ? `, ${customerName}` : ''}!
          </p>

          {orderNumber && (
            <p className="text-sm text-gray-500">
              Order #{orderNumber}
            </p>
          )}

          {customerEmail && (
            <p className="text-xs text-gray-400 mt-1">
              Confirmation sent to {customerEmail}
            </p>
          )}
        </div>

        {/* Two Column Layout for Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column: Order Details & What's Next */}
          <div className="space-y-8">
            {/* Order Summary */}
            {orderDetails && (
              <div className="bg-white rounded-2xl shadow-xl border-2 border-meatzy-mint/30 p-8">
                <h2 className="text-2xl font-black font-slab text-meatzy-olive uppercase mb-6">
                  Order Summary
                </h2>

                {/* Line Items */}
                <div className="space-y-4 mb-6">
                  {orderDetails.lineItems?.map((item: any) => (
                    <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-bold text-meatzy-olive">{item.title}</h3>
                        {item.variantTitle && item.variantTitle !== 'Default Title' && (
                          <p className="text-sm text-gray-600">{item.variantTitle}</p>
                        )}
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-meatzy-olive">
                          ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </p>
                        {parseFloat(item.totalDiscount) > 0 && (
                          <p className="text-sm text-green-600">
                            -${item.totalDiscount} discount
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Totals */}
                <div className="border-t-2 border-meatzy-olive/20 pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${parseFloat(orderDetails.subtotalPrice).toFixed(2)}</span>
                  </div>
                  {parseFloat(orderDetails.totalShippingPrice) > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span>${parseFloat(orderDetails.totalShippingPrice).toFixed(2)}</span>
                    </div>
                  )}
                  {parseFloat(orderDetails.totalTax) > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Tax</span>
                      <span>${parseFloat(orderDetails.totalTax).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-black text-meatzy-olive pt-2 border-t border-gray-300">
                    <span>Total</span>
                    <span>${parseFloat(orderDetails.totalPrice).toFixed(2)}</span>
                  </div>
                </div>

                {/* Shipping Address */}
                {orderDetails.shippingAddress && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="font-bold text-meatzy-olive mb-2">Shipping Address</h3>
                    <div className="text-sm text-gray-600">
                      <p>{orderDetails.shippingAddress.name}</p>
                      <p>{orderDetails.shippingAddress.address1}</p>
                      {orderDetails.shippingAddress.address2 && (
                        <p>{orderDetails.shippingAddress.address2}</p>
                      )}
                      <p>
                        {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.province} {orderDetails.shippingAddress.zip}
                      </p>
                      <p>{orderDetails.shippingAddress.country}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* What's Next */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-meatzy-mint/30 p-8">
              <h2 className="text-2xl font-black font-slab text-meatzy-olive uppercase mb-4">
                What's Next?
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-meatzy-rare text-white flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-bold text-meatzy-olive">Check Your Email</p>
                    <p className="text-gray-600 text-sm">
                      We've sent your order confirmation and shipping details
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-meatzy-rare text-white flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-bold text-meatzy-olive">Track Your Order</p>
                    <p className="text-gray-600 text-sm">
                      You'll receive tracking information once your order ships
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-meatzy-rare text-white flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-bold text-meatzy-olive">Enjoy Premium Meat</p>
                    <p className="text-gray-600 text-sm">
                      Grass-fed, pasture-raised quality delivered to your door
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Referral Widget */}
          <div>
            {!loading && referralCode && referralLink && (
              <div className="bg-gradient-to-br from-meatzy-rare to-meatzy-welldone rounded-2xl shadow-2xl p-6 text-white sticky top-8">
                {/* Header */}
                <div className="text-center mb-4">
                  <h2 className="text-xl font-black font-slab uppercase mb-2">
                    Start Earning Today! 💰
                  </h2>
                  <p className="text-xs opacity-90">
                    Share MEATZY with friends and earn{' '}
                    <span className="font-black text-meatzy-gold">13% commission</span> on every sale
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Your Referral SafeLink */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Share2 className="w-4 h-4" />
                    Your Referral SafeLink
                    <div className="relative group">
                      <Info className="w-3.5 h-3.5 opacity-70 cursor-help" />
                      <div className="absolute right-0 sm:left-0 sm:right-auto bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-white text-meatzy-olive text-[10px] rounded-lg shadow-xl z-50">
                        <p className="font-bold mb-0.5">What's a SafeLink?</p>
                        <p>Your unique URL that tracks referrals and prevents code leaks. Always share your SafeLink to ensure you get credit!</p>
                      </div>
                    </div>
                  </h3>

                    <div className="bg-white rounded-lg p-2 mb-2">
                      <p className="text-meatzy-olive font-mono text-xs break-all">
                        {referralLink}
                      </p>
                    </div>

                    <button
                      onClick={handleCopyLink}
                      className="w-full bg-meatzy-dill hover:bg-meatzy-dill/90 text-white font-bold uppercase tracking-wider py-1.5 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 text-xs"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copy SafeLink
                        </>
                      )}
                    </button>
                  </div>

                  {/* QR Code */}
                  {qrCodeDataUrl && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider mb-2 text-center">
                        Scan & Share
                      </h3>

                      <div className="bg-white rounded-xl p-2 mb-2 flex justify-center">
                        <img
                          src={qrCodeDataUrl}
                          alt="SafeLink QR Code"
                          className="w-32 h-32"
                        />
                      </div>

                      <button
                        onClick={handleDownloadQR}
                        className="w-full bg-meatzy-olive hover:bg-meatzy-rare text-white font-bold py-1.5 px-3 rounded-lg transition-colors text-xs flex items-center justify-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        Download
                      </button>
                    </div>
                  )}

                  {/* Social Sharing */}
                  {socialLinks && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider mb-2">
                      Share on Social
                    </h3>

                    <div className="flex items-center justify-center gap-2">
                      <a
                        href={`https://www.instagram.com/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white p-2.5 rounded-lg transition-colors flex items-center justify-center"
                        title="Share on Instagram"
                        onClick={(e) => {
                          e.preventDefault();
                          copyToClipboard(referralLink);
                          alert('Link copied! Now paste it in your Instagram bio or story.');
                        }}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                      </a>

                      <a
                        href={`https://www.tiktok.com/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-black hover:bg-gray-800 text-white p-2.5 rounded-lg transition-colors flex items-center justify-center"
                        title="Share on TikTok"
                        onClick={(e) => {
                          e.preventDefault();
                          copyToClipboard(referralLink);
                          alert('Link copied! Now paste it in your TikTok bio or video description.');
                        }}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                      </a>

                      <a
                        href={socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#1877F2] hover:bg-[#1877F2]/90 text-white p-2.5 rounded-lg transition-colors flex items-center justify-center"
                        title="Share on Facebook"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      </a>

                      <a
                        href={socialLinks.email}
                        className="bg-gray-700 hover:bg-gray-600 text-white p-2.5 rounded-lg transition-colors flex items-center justify-center"
                        title="Share via Email"
                      >
                        <Mail className="w-5 h-5" />
                      </a>
                    </div>
                    </div>
                  )}

                  {/* Commission Structure */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider mb-2">
                      How You Earn
                    </h3>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-meatzy-gold flex items-center justify-center font-black text-meatzy-olive text-xs flex-shrink-0">
                          13%
                        </div>
                        <p className="text-xs leading-tight">
                          <span className="font-bold">Direct Referrals</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-black text-xs flex-shrink-0">
                          2%
                        </div>
                        <p className="text-xs leading-tight">
                          <span className="font-bold">2nd Level</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-black text-xs flex-shrink-0">
                          1%
                        </div>
                        <p className="text-xs leading-tight">
                          <span className="font-bold">3rd & 4th Level</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Password Setup Section */}
                {!passwordSuccess && (
                  <div className="mt-6">
                {!showPasswordSetup ? (
                  <div className="text-center">
                    <button
                      onClick={() => setShowPasswordSetup(true)}
                      className="inline-block bg-white text-meatzy-olive font-display font-bold uppercase tracking-widest py-4 px-8 rounded-lg hover:bg-meatzy-mint transition-colors shadow-lg"
                    >
                      Create Account Password
                    </button>
                    <p className="text-sm mt-3 opacity-75">
                      Set a password to access your dashboard anytime
                    </p>
                  </div>
                ) : (
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <h3 className="text-xl font-bold uppercase tracking-wider mb-4 text-center">
                      Set Your Password
                    </h3>

                    <form onSubmit={handlePasswordSetup} className="max-w-md mx-auto space-y-4">
                      <div>
                        <label className="block text-sm font-bold mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={customerEmail}
                          disabled
                          className="w-full px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold mb-2">
                          Password (min 8 characters)
                        </label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg bg-white text-meatzy-olive border-2 border-white/30 focus:border-meatzy-gold focus:outline-none"
                          placeholder="Enter password"
                          required
                          minLength={8}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold mb-2">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg bg-white text-meatzy-olive border-2 border-white/30 focus:border-meatzy-gold focus:outline-none"
                          placeholder="Confirm password"
                          required
                          minLength={8}
                        />
                      </div>

                      {passwordError && (
                        <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 text-sm">
                          {passwordError}
                        </div>
                      )}

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setShowPasswordSetup(false);
                            setPassword('');
                            setConfirmPassword('');
                            setPasswordError('');
                          }}
                          className="flex-1 bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={settingPassword}
                          className="flex-1 bg-meatzy-dill hover:bg-meatzy-dill/90 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {settingPassword ? 'Creating...' : 'Create Account'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                  </div>
                )}

                {/* Success Message */}
                {passwordSuccess && (
                  <div className="mt-6 text-center">
                    <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 mb-4">
                      <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
                      {referralCode && !showPasswordSetup ? (
                        // Webhook user - show temporary password and login instructions
                        <>
                          <h3 className="text-lg font-bold mb-2">Your Affiliate Account Is Ready!</h3>
                          <p className="text-sm mb-4">
                            We've created your affiliate account with a temporary password.
                          </p>

                          {temporaryPassword && (
                            <div className="bg-white/10 border border-white/30 rounded-lg p-4 mb-4">
                              <p className="text-xs font-bold uppercase tracking-wider mb-2 opacity-75">
                                Temporary Password
                              </p>
                              <div className="flex items-center justify-center gap-3">
                                <code className="text-xl font-mono font-bold bg-white/20 px-4 py-2 rounded">
                                  {temporaryPassword}
                                </code>
                                <button
                                  onClick={async () => {
                                    const success = await copyToClipboard(temporaryPassword);
                                    if (success) {
                                      setTempPasswordCopied(true);
                                      setTimeout(() => setTempPasswordCopied(false), 2000);
                                    }
                                  }}
                                  className="bg-white/20 hover:bg-white/30 p-2 rounded transition-colors"
                                  title="Copy password"
                                >
                                  <Copy className="w-5 h-5" />
                                </button>
                              </div>
                              {tempPasswordCopied && (
                                <p className="text-xs text-green-300 mt-2">Copied!</p>
                              )}
                            </div>
                          )}

                          <p className="text-sm mb-3">
                            Use this password to log in to your dashboard. You'll be prompted to change it after your first login.
                          </p>

                          <a
                            href="/login"
                            className="inline-block bg-meatzy-olive text-white font-bold uppercase tracking-wider py-3 px-6 rounded-lg hover:bg-meatzy-rare transition-colors text-sm"
                          >
                            Go to Login Page
                          </a>

                          <p className="text-xs mt-3 opacity-75">
                            Email: {customerEmail}
                          </p>
                        </>
                      ) : (
                        // New signup - show redirect message
                        <>
                          <h3 className="text-lg font-bold mb-1">Account Created!</h3>
                          <p className="text-sm">Redirecting to dashboard...</p>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Dashboard CTA - Only show if not setting up password */}
                {!showPasswordSetup && !passwordSuccess && (
                  <div className="mt-6 text-center">
                    <p className="text-xs opacity-75 mb-3">
                      Already have an account?
                    </p>
                    <a
                      href="/dashboard"
                      className="inline-block bg-white/20 hover:bg-white/30 text-white font-bold uppercase tracking-wider py-2 px-4 rounded-lg transition-colors text-sm"
                    >
                      Sign In to Dashboard
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <a
            href="/"
            className="inline-block bg-meatzy-olive text-white font-display font-bold uppercase tracking-widest py-4 px-8 rounded-lg hover:bg-meatzy-rare transition-colors"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-meatzy-tallow">
        <div className="text-meatzy-olive font-display font-bold uppercase tracking-widest text-xl">
          Loading...
        </div>
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  );
}

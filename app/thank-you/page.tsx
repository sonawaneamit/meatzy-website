'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import QRCodeLib from 'qrcode';
import { CheckCircle, Copy, Download, Share2, Mail, MessageCircle } from 'lucide-react';
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
        .select('referral_code, full_name')
        .eq('email', email.toLowerCase())
        .single();

      if (error || !user || !user.referral_code) {
        console.log('User not found or no referral code yet');
        setLoading(false);
        return;
      }

      setReferralCode(user.referral_code);

      // Generate referral link with UTM
      const link = generateReferralLink(user.referral_code, { includeUTM: true });
      setReferralLink(link);

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
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      // Sign up the user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: customerEmail,
        password: password,
        options: {
          data: {
            referral_code: referralCode,
            full_name: customerName,
          },
        },
      });

      if (error) {
        console.error('Password setup error:', error);
        setPasswordError(error.message || 'Failed to create account. Please try again.');
      } else {
        setPasswordSuccess(true);
        setShowPasswordSetup(false);

        // Auto-redirect to dashboard after 2 seconds
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      }
    } catch (error) {
      console.error('Password setup error:', error);
      setPasswordError('An unexpected error occurred. Please try again.');
    } finally {
      setSettingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-meatzy-tallow via-white to-meatzy-mint/20 pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {/* Order Confirmation */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-meatzy-dill rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-5xl md:text-6xl font-black font-slab text-meatzy-olive uppercase mb-4">
            Order Confirmed!
          </h1>

          <p className="text-xl text-gray-600 mb-2">
            Thank you{customerName ? `, ${customerName}` : ''}!
          </p>

          {orderNumber && (
            <p className="text-lg text-gray-500">
              Order #{orderNumber}
            </p>
          )}

          {customerEmail && (
            <p className="text-sm text-gray-400 mt-2">
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
              <div className="bg-gradient-to-br from-meatzy-rare to-meatzy-welldone rounded-2xl shadow-2xl p-8 text-white sticky top-8">
                {/* Header */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-black font-slab uppercase mb-2">
                    Start Earning Today! 💰
                  </h2>
                  <p className="text-sm opacity-90">
                    Share MEATZY with friends and earn{' '}
                    <span className="font-black text-meatzy-gold">13% commission</span> on every sale
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Your Referral Link */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Share2 className="w-5 h-5" />
                    Your Referral Link
                  </h3>

                    <div className="bg-white rounded-lg p-3 mb-3">
                      <p className="text-meatzy-olive font-mono text-xs break-all">
                        {referralLink}
                      </p>
                    </div>

                    <button
                      onClick={handleCopyLink}
                      className="w-full bg-meatzy-dill hover:bg-meatzy-dill/90 text-white font-bold uppercase tracking-wider py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy Link
                        </>
                      )}
                    </button>
                  </div>

                  {/* QR Code */}
                  {qrCodeDataUrl && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <h3 className="text-sm font-bold uppercase tracking-wider mb-3 text-center">
                        Scan & Share
                      </h3>

                      <div className="bg-white rounded-xl p-4 mb-3">
                        <img
                          src={qrCodeDataUrl}
                          alt="Referral QR Code"
                          className="w-full h-auto"
                        />
                      </div>

                      <button
                        onClick={handleDownloadQR}
                        className="w-full bg-meatzy-olive hover:bg-meatzy-rare text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download QR
                      </button>
                    </div>
                  )}

                  {/* Social Sharing */}
                  {socialLinks && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <h3 className="text-sm font-bold uppercase tracking-wider mb-3">
                      Share on Social
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                      <a
                        href={socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#1877F2] hover:bg-[#1877F2]/90 text-white font-bold py-3 px-4 rounded-lg transition-colors text-center text-sm"
                      >
                        Facebook
                      </a>

                      <a
                        href={socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white font-bold py-3 px-4 rounded-lg transition-colors text-center text-sm"
                      >
                        Twitter
                      </a>

                      <a
                        href={socialLinks.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#25D366] hover:bg-[#25D366]/90 text-white font-bold py-3 px-4 rounded-lg transition-colors text-center text-sm flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp
                      </a>

                      <a
                        href={socialLinks.email}
                        className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors text-center text-sm flex items-center justify-center gap-2"
                      >
                        <Mail className="w-4 h-4" />
                        Email
                      </a>
                    </div>
                    </div>
                  )}

                  {/* Commission Structure */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-3">
                      How You Earn
                    </h3>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-meatzy-gold flex items-center justify-center font-black text-meatzy-olive text-sm flex-shrink-0">
                          13%
                        </div>
                        <p className="text-xs">
                          <span className="font-bold">Direct Referrals</span><br/>
                          People you refer directly
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center font-black text-sm flex-shrink-0">
                          2%
                        </div>
                        <p className="text-xs">
                          <span className="font-bold">2nd Level</span><br/>
                          People your referrals bring in
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center font-black text-sm flex-shrink-0">
                          1%
                        </div>
                        <p className="text-xs">
                          <span className="font-bold">3rd & 4th Level</span><br/>
                          Extended network earnings
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
                      <h3 className="text-lg font-bold mb-1">Account Created!</h3>
                      <p className="text-sm">Redirecting to dashboard...</p>
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

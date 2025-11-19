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

  useEffect(() => {
    // Get order details from URL parameters
    // Shopify will pass: ?order_id=123&email=customer@email.com&name=John+Doe
    const orderId = searchParams.get('order_id');
    const email = searchParams.get('email');
    const name = searchParams.get('name');

    if (orderId) setOrderNumber(orderId);
    if (email) setCustomerEmail(email);
    if (name) setCustomerName(name);

    if (email) {
      fetchUserReferralData(email);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

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

        {/* What's Next */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-meatzy-mint/30 p-8 mb-8">
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

        {/* Referral Widget - Only show if we have referral data */}
        {!loading && referralCode && referralLink && (
          <div className="bg-gradient-to-br from-meatzy-rare to-meatzy-welldone rounded-2xl shadow-2xl p-8 text-white">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-black font-slab uppercase mb-3">
                Start Earning Today! 💰
              </h2>
              <p className="text-lg md:text-xl opacity-90">
                Share MEATZY with friends and earn{' '}
                <span className="font-black text-meatzy-gold">13% commission</span> on every sale
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 columns: Referral Link & Social Sharing */}
              <div className="lg:col-span-2 space-y-6">
                {/* Your Referral Link */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-xl font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Share2 className="w-5 h-5" />
                    Your Referral Link
                  </h3>

                  <div className="bg-white rounded-lg p-4 mb-3">
                    <p className="text-meatzy-olive font-mono text-sm break-all">
                      {referralLink}
                    </p>
                  </div>

                  <button
                    onClick={handleCopyLink}
                    className="w-full bg-meatzy-dill hover:bg-meatzy-dill/90 text-white font-display font-bold uppercase tracking-wider py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        Copy Link
                      </>
                    )}
                  </button>
                </div>

                {/* Social Sharing */}
                {socialLinks && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <h3 className="text-xl font-bold uppercase tracking-wider mb-4">
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
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-xl font-bold uppercase tracking-wider mb-4">
                    How You Earn
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-meatzy-gold flex items-center justify-center font-black text-meatzy-olive text-lg flex-shrink-0">
                        13%
                      </div>
                      <p className="text-sm">
                        <span className="font-bold">Direct Referrals</span> - People you refer directly
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center font-black text-lg flex-shrink-0">
                        2%
                      </div>
                      <p className="text-sm">
                        <span className="font-bold">2nd Level</span> - People your referrals bring in
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center font-black text-lg flex-shrink-0">
                        1%
                      </div>
                      <p className="text-sm">
                        <span className="font-bold">3rd & 4th Level</span> - Extended network earnings
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right 1 column: QR Code */}
              {qrCodeDataUrl && (
                <div className="flex flex-col items-center justify-start">
                  <div className="bg-white rounded-2xl p-6 shadow-2xl w-full">
                    <h3 className="text-lg font-bold text-meatzy-olive uppercase tracking-wider mb-4 text-center">
                      Scan & Share
                    </h3>

                    <img
                      src={qrCodeDataUrl}
                      alt="Referral QR Code"
                      className="w-full h-auto mb-4"
                    />

                    <button
                      onClick={handleDownloadQR}
                      className="w-full bg-meatzy-olive hover:bg-meatzy-rare text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download QR
                    </button>
                  </div>

                  <p className="text-xs text-center mt-4 opacity-75">
                    Print or share this QR code for easy referrals
                  </p>
                </div>
              )}
            </div>

            {/* Dashboard CTA */}
            <div className="mt-8 text-center">
              <a
                href="/dashboard"
                className="inline-block bg-white text-meatzy-olive font-display font-bold uppercase tracking-widest py-4 px-8 rounded-lg hover:bg-meatzy-mint transition-colors"
              >
                View Your Dashboard
              </a>
              <p className="text-sm mt-3 opacity-75">
                Track your earnings, referrals, and network growth
              </p>
            </div>
          </div>
        )}

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

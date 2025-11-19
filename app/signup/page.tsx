'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../lib/supabase/client';
import { createUser } from '../../lib/supabase/referral';
import { Users, Mail, User as UserIcon, ArrowRight } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    referralCode: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = createClient();

      // 1. Create Supabase auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
        },
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('Failed to create account');
      }

      // 2. Create user in our referral system
      await createUser({
        email: formData.email,
        fullName: formData.fullName,
        phone: formData.phone,
        referralCode: formData.referralCode,
        hasPurchased: false, // They're signing up without purchase
      });

      // 3. Redirect to dashboard
      router.push('/dashboard');

    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-meatzy-tallow pt-32 pb-20">
      <div className="max-w-md mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white border border-meatzy-mint rounded-full px-4 py-2 mb-6">
            <Users className="w-5 h-5 text-meatzy-gold" />
            <span className="text-sm font-bold uppercase tracking-wider text-meatzy-olive">Join The Movement</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black font-slab text-meatzy-olive uppercase mb-4">
            Become An Affiliate
          </h1>

          <p className="text-gray-600">
            Sign up to get your referral link and start earning commissions
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-xl border border-meatzy-mint/30 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-sm font-bold text-meatzy-olive mb-2">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-meatzy-rare focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-meatzy-olive mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-meatzy-rare focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-meatzy-olive mb-2">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-meatzy-rare focus:border-transparent"
                placeholder="Min. 6 characters"
              />
            </div>

            {/* Phone (Optional) */}
            <div>
              <label className="block text-sm font-bold text-meatzy-olive mb-2">
                Phone (Optional)
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-meatzy-rare focus:border-transparent"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            {/* Referral Code (Optional) */}
            <div>
              <label className="block text-sm font-bold text-meatzy-olive mb-2">
                Referral Code (Optional)
              </label>
              <input
                type="text"
                value={formData.referralCode}
                onChange={(e) => setFormData({ ...formData, referralCode: e.target.value.toUpperCase() })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-meatzy-rare focus:border-transparent uppercase"
                placeholder="Enter code if you have one"
              />
              <p className="text-xs text-gray-500 mt-1">
                If someone referred you, enter their code here
              </p>
            </div>

            {/* Terms */}
            <div className="text-xs text-gray-500">
              By signing up, you agree to our Terms & Conditions, Privacy Policy, and Referral Program Agreement.
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-meatzy-rare text-white py-4 font-display font-bold uppercase tracking-widest hover:bg-meatzy-welldone transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 rounded-lg"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-meatzy-rare font-bold hover:underline">
                Log in
              </a>
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Want to shop first?{' '}
            <a href="/" className="text-meatzy-rare font-bold hover:underline">
              Browse Boxes
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

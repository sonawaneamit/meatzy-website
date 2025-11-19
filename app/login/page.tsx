'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../lib/supabase/client';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showMagicLink, setShowMagicLink] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = createClient();

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      // Redirect to dashboard
      router.push('/dashboard');

    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const supabase = createClient();

      const { error: magicError } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (magicError) throw magicError;

      setSuccess('Check your email for the login link!');

    } catch (err: any) {
      console.error('Magic link error:', err);
      setError(err.message || 'Failed to send magic link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-meatzy-tallow pt-32 pb-20">
      <div className="max-w-md mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black font-slab text-meatzy-olive uppercase mb-4">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Log in to access your affiliate dashboard
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-xl border border-meatzy-mint/30 p-8">
          <form onSubmit={showMagicLink ? handleMagicLink : handleSubmit} className="space-y-6">

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

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
            {!showMagicLink && (
              <div>
                <label className="block text-sm font-bold text-meatzy-olive mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-meatzy-rare focus:border-transparent"
                    placeholder="Your password"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-meatzy-rare text-white py-4 font-display font-bold uppercase tracking-widest hover:bg-meatzy-welldone transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 rounded-lg"
            >
              {loading ? (showMagicLink ? 'Sending...' : 'Logging in...') : (showMagicLink ? 'Send Magic Link' : 'Log In')}
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Toggle Magic Link */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setShowMagicLink(!showMagicLink);
                  setError('');
                  setSuccess('');
                }}
                className="text-sm text-meatzy-rare hover:underline font-medium"
              >
                {showMagicLink ? 'Use password instead' : 'Send me a magic link instead'}
              </button>
            </div>
          </form>

          {/* Signup Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="/signup" className="text-meatzy-rare font-bold hover:underline">
                Sign up
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

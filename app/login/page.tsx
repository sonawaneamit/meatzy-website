'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../lib/supabase/client';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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

      // First, try regular auth login
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (data.session) {
        // Login successful!
        router.push('/dashboard');
        return;
      }

      // Login failed - check if this is a temporary password
      if (authError) {
        // Check users table for temp password match
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('temporary_password, email')
          .eq('email', formData.email.toLowerCase())
          .single();

        if (!userError && userData && userData.temporary_password === formData.password) {
          // This is a valid temp password! Create auth account via our API
          const response = await fetch('/api/auth/login-with-temp-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
            }),
          });

          const result = await response.json();

          if (response.ok && result.success) {
            // Auth account created and logged in!
            router.push('/dashboard');
            return;
          } else {
            throw new Error(result.error || 'Failed to log in with temporary password');
          }
        }

        // Not a temp password either - show original error
        throw authError;
      }

    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-meatzy-tallow pb-20">
      <div className="max-w-5xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black font-slab text-meatzy-olive uppercase mb-4">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Log in to access your affiliate dashboard
          </p>
        </div>

        {/* Login Form */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-xl border border-meatzy-mint/30 p-8">
            <h2 className="text-2xl font-black font-slab text-meatzy-olive uppercase mb-2">
              Login with Password
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Enter your email and password
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-meatzy-rare text-white py-4 font-display font-bold uppercase tracking-widest hover:bg-meatzy-welldone transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 rounded-lg"
              >
                {loading ? 'Logging in...' : 'Log In'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Links */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/signup" className="text-meatzy-rare font-bold hover:underline">
              Sign up
            </a>
          </p>
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

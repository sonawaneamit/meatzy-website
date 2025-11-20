import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { email, password, referralCode, fullName } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Use service role client for admin operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Check if user already exists in users table (from webhook)
    const { data: existingUser, error: userCheckError } = await supabase
      .from('users')
      .select('id, email, referral_code')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      // User exists from webhook - send magic link instead
      console.log('User exists from webhook, sending magic link');

      const anonSupabase = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

      const { error: magicError } = await anonSupabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard`,
        },
      });

      if (magicError) {
        console.error('Error sending magic link:', magicError);
        return NextResponse.json(
          { error: 'Failed to send login link. Please try again.' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        useMagicLink: true,
        message: 'Check your email! We sent you a magic login link to access your dashboard.'
      });

    } else {
      // User doesn't exist - do full signup (create both auth and user record)
      console.log('New user, creating full account');

      const anonSupabase = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

      const { data, error } = await anonSupabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            referral_code: referralCode,
            full_name: fullName,
          },
        },
      });

      if (error) {
        console.error('Error signing up:', error);
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        session: data.session,
        message: 'Account created successfully! Redirecting to dashboard...'
      });
    }

  } catch (error: any) {
    console.error('Setup password error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

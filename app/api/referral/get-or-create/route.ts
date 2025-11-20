import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * API endpoint for Shopify extension to fetch or create referral data
 * GET /api/referral/get-or-create?email={email}
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Try to find existing user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, referral_code')
      .eq('email', email)
      .single();

    let referralCode = user?.referral_code;

    // If user doesn't exist, create them
    if (userError || !user) {
      // Generate referral code
      const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      referralCode = randomCode;

      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          email,
          referral_code: referralCode,
          has_purchased: true, // They just made a purchase
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select('id, email, referral_code')
        .single();

      if (createError) {
        console.error('Error creating user:', createError);
        return NextResponse.json(
          { error: 'Failed to create user' },
          { status: 500 }
        );
      }
    }

    // Get referral stats
    const userId = user?.id;

    if (userId) {
      const { data: referrals, error: referralsError } = await supabase
        .from('referrals')
        .select('id, commission_amount, status')
        .eq('referrer_id', userId);

      const successfulReferrals = referrals?.filter(r => r.status === 'paid' || r.status === 'pending').length || 0;
      const totalEarnings = referrals
        ?.filter(r => r.status === 'paid')
        .reduce((sum, r) => sum + (r.commission_amount || 0), 0) || 0;

      return NextResponse.json({
        referralCode,
        totalEarnings,
        successfulReferrals,
      });
    }

    // New user with no referrals yet
    return NextResponse.json({
      referralCode,
      totalEarnings: 0,
      successfulReferrals: 0,
    });

  } catch (error) {
    console.error('Error in get-or-create:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Enable CORS for Shopify
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import QRCodeLib from 'qrcode';
import { generateReferralLink } from '@/lib/referral-utils';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * API endpoint for Shopify checkout extension to fetch user's referral code
 * GET /api/get-user-referral?email=user@example.com
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    // Create Supabase client with service role key for admin access
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch user by email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, referral_code, full_name')
      .eq('email', email.toLowerCase())
      .single();

    if (userError || !user) {
      // User doesn't exist yet - this is their first purchase
      // We'll need to create them on the webhook side
      return NextResponse.json(
        {
          exists: false,
          message: 'User not found. They will be created on first purchase.'
        },
        { status: 404 }
      );
    }

    if (!user.referral_code) {
      return NextResponse.json(
        { error: 'User exists but has no referral code' },
        { status: 500 }
      );
    }

    // Generate referral link with UTM parameters
    const referralLink = generateReferralLink(user.referral_code, {
      includeUTM: true,
      baseUrl: 'https://getmeatzy.com'
    });

    // Generate QR code
    let qrCodeDataUrl = '';
    try {
      qrCodeDataUrl = await QRCodeLib.toDataURL(referralLink, {
        width: 400,
        margin: 2,
        color: {
          dark: '#2D2B25', // meatzy-olive
          light: '#FFFFFF',
        },
      });
    } catch (qrError) {
      console.error('Error generating QR code:', qrError);
      // Continue without QR code if generation fails
    }

    // Return user's referral data
    return NextResponse.json({
      exists: true,
      user: {
        email: user.email,
        fullName: user.full_name,
        referralCode: user.referral_code,
      },
      referralLink,
      qrCodeDataUrl,
    });

  } catch (error) {
    console.error('Error in get-user-referral API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

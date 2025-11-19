import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail } from '../../../lib/supabase/referral';

/**
 * API endpoint to get a customer's referral code by email
 * Called from Shopify thank you page to display instant affiliate code
 *
 * Usage: GET /api/get-referral-code?email=customer@example.com
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await getUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Return referral code and user info
    return NextResponse.json({
      success: true,
      referralCode: user.referral_code,
      fullName: user.full_name,
      hasPurchased: user.has_purchased,
      referralLink: `${process.env.NEXT_PUBLIC_SITE_URL}?ref=${user.referral_code}`,
    });

  } catch (error) {
    console.error('Error fetching referral code:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

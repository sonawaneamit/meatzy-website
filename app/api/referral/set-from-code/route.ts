import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';

/**
 * API Route: Set referral cookie from referral code (URL parameter)
 * This handles ?ref=CODE URLs by looking up the affiliate and setting the cookie
 */
export async function POST(request: NextRequest) {
  try {
    const { referralCode } = await request.json();

    if (!referralCode) {
      return NextResponse.json({ error: 'Referral code required' }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Look up affiliate by referral code
    const { data: affiliate, error } = await supabase
      .from('users')
      .select('id, email, full_name, referral_code, slug')
      .eq('referral_code', referralCode.toUpperCase())
      .single();

    if (error || !affiliate) {
      console.log(`Referral code not found: ${referralCode}`);
      return NextResponse.json({ error: 'Invalid referral code' }, { status: 404 });
    }

    console.log(`Setting cookie for referral code: ${referralCode} (${affiliate.full_name})`);

    // Prepare referral data for cookie (same format as SafeLink)
    const referralData = {
      affiliateId: affiliate.id,
      slug: affiliate.slug,
      referralCode: affiliate.referral_code,
      discountCode: null, // No auto-discount for URL params (only SafeLinks get discounts)
      referrerName: affiliate.full_name || affiliate.email.split('@')[0],
      timestamp: Date.now()
    };

    // Create response
    const response = NextResponse.json({
      success: true,
      referrerName: referralData.referrerName
    });

    // Set/update the HTTPOnly cookie (overwrites existing)
    response.cookies.set('meatzy_ref', JSON.stringify(referralData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Error setting referral cookie:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

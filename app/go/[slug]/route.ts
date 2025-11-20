/**
 * SafeLink Route: /go/[slug]
 *
 * Handles referral entry when customers click on SafeLinks like:
 * https://getmeatzy.com/go/natalia-8c4f
 *
 * Flow:
 * 1. Lookup affiliate by slug
 * 2. Create Shopify discount code if doesn't exist
 * 3. Set secure HTTPOnly cookie with referral data
 * 4. Redirect to homepage
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { createDiscountCode } from '@/lib/shopify/admin';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  console.log(`[SafeLink] Processing request for slug: ${slug}`);

  try {
    const supabase = createServiceClient();

    // 1. Look up affiliate by slug
    const { data: affiliate, error } = await supabase
      .from('users')
      .select('id, email, full_name, referral_code, shopify_discount_code, discount_created_at')
      .eq('slug', slug)
      .single();

    if (error || !affiliate) {
      console.log(`[SafeLink] Invalid slug: ${slug}`, error);
      // Invalid SafeLink → redirect to homepage without setting cookie
      return NextResponse.redirect(new URL('/', request.url));
    }

    console.log(`[SafeLink] Found affiliate: ${affiliate.email}`);

    // 2. Generate UNIQUE discount code for THIS customer (prevents code leakage)
    // Format: REF-{AffiliateCode}-{UniqueID}
    // Example: REF-20E3FG7J-A1B2C
    const uniqueSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const discountCode = `REF-${affiliate.referral_code}-${uniqueSuffix}`;

    console.log(`[SafeLink] Creating unique discount code: ${discountCode}`);

    // 3. Create discount code in Shopify
    const result = await createDiscountCode({
      code: discountCode,
      title: `Referral from ${affiliate.full_name || affiliate.email}`,
      amount: 20,        // $20 off
      minimumAmount: 50  // Minimum $50 order
    });

    if (!result.success) {
      console.error('[SafeLink] Failed to create discount code:', result.error);
      // Continue without discount - attribution still works via referral_code
    } else {
      console.log(`[SafeLink] Discount code created successfully: ${discountCode}`);
    }

    // 5. Prepare referral data for cookie
    const referralData = {
      affiliateId: affiliate.id,
      slug: slug,
      referralCode: affiliate.referral_code,
      discountCode: discountCode,
      referrerName: affiliate.full_name || affiliate.email.split('@')[0],
      timestamp: Date.now()
    };

    // 6. Create response with redirect
    const response = NextResponse.redirect(new URL('/', request.url));

    // 7. Set secure HTTPOnly cookie
    // This cookie is inaccessible to JavaScript, preventing code leaks
    response.cookies.set('meatzy_ref', JSON.stringify(referralData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/'
    });

    console.log(`[SafeLink] Cookie set successfully for ${referralData.referrerName}`);

    return response;
  } catch (error) {
    console.error('[SafeLink] Unexpected error:', error);
    // On error, redirect to homepage without setting cookie
    return NextResponse.redirect(new URL('/', request.url));
  }
}

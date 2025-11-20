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

    // 2. Check if discount code already exists
    let discountCode = affiliate.shopify_discount_code;

    if (!discountCode) {
      // 3. Create new discount code dynamically via Shopify Admin API
      const newCode = `REF-${affiliate.referral_code}`;

      console.log(`[SafeLink] Creating discount code: ${newCode}`);

      const result = await createDiscountCode({
        code: newCode,
        title: `Referral discount for ${affiliate.full_name || affiliate.email}`,
        amount: 20,        // $20 off
        minimumAmount: 50  // Minimum $50 order
      });

      if (result.success) {
        discountCode = newCode;

        console.log(`[SafeLink] Discount code created successfully: ${discountCode}`);

        // 4. Store in Supabase
        const { error: updateError } = await supabase
          .from('users')
          .update({
            shopify_discount_code: discountCode,
            discount_created_at: new Date().toISOString()
          })
          .eq('id', affiliate.id);

        if (updateError) {
          console.error('[SafeLink] Error updating user with discount code:', updateError);
        }
      } else {
        console.error('[SafeLink] Failed to create discount code:', result.error);
        // Fall back to generic code or skip discount
        discountCode = 'REFERRAL20'; // Fallback generic code
      }
    } else {
      console.log(`[SafeLink] Using existing discount code: ${discountCode}`);
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

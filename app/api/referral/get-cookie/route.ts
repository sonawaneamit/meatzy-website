/**
 * API Route: GET /api/referral/get-cookie
 *
 * Returns the referral data from the secure HTTPOnly cookie
 * This allows client-side code (like cart creation) to access the referral data
 * without exposing the cookie directly to JavaScript
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const referralCookie = cookieStore.get('meatzy_ref');

    if (!referralCookie) {
      return NextResponse.json({
        hasReferral: false,
        referralCode: null,
        discountCode: null,
        affiliateId: null
      });
    }

    const data = JSON.parse(referralCookie.value);

    return NextResponse.json({
      hasReferral: true,
      referralCode: data.referralCode || null,
      discountCode: data.discountCode || null,
      affiliateId: data.affiliateId || null,
      slug: data.slug || null
    });
  } catch (error) {
    console.error('Error reading referral cookie:', error);
    return NextResponse.json({
      hasReferral: false,
      referralCode: null,
      discountCode: null,
      affiliateId: null
    });
  }
}

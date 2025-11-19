import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * API endpoint to get referrer information by referral code
 * Used by the referral popup to show who sent the visitor
 *
 * Usage: GET /api/get-referrer-info?code=ABC123
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { error: 'Code parameter is required' },
        { status: 400 }
      );
    }

    // Get user by referral code
    const { data: user, error } = await supabase
      .from('users')
      .select('id, full_name, referral_code')
      .eq('referral_code', code.toUpperCase())
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: 'Referral code not found' },
        { status: 404 }
      );
    }

    // Return referrer info
    return NextResponse.json({
      success: true,
      fullName: user.full_name || 'A friend',
      referralCode: user.referral_code,
    });

  } catch (error) {
    console.error('Error fetching referrer info:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

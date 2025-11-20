import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { calculateCommissions } from '../../../lib/supabase/referral';

/**
 * API endpoint to calculate commissions for an order
 * Used when completing pending setup for new users
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, orderId, orderTotal } = await request.json();

    if (!userId || !orderId || !orderTotal) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, orderId, orderTotal' },
        { status: 400 }
      );
    }

    // Create service role client for permissions
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Calculate commissions
    const commissions = await calculateCommissions({
      buyerUserId: userId,
      orderId: orderId,
      orderTotal: parseFloat(orderTotal),
    }, supabaseAdmin);

    return NextResponse.json({
      success: true,
      commissionsCreated: commissions.length,
      commissions,
    });

  } catch (error: any) {
    console.error('Error calculating commissions:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to calculate commissions' },
      { status: 500 }
    );
  }
}

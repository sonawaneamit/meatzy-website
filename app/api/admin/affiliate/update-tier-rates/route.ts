import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Admin API: Update affiliate tier rates
 * Uses service role to bypass RLS
 */
export async function POST(request: NextRequest) {
  try {
    // Create service role client for elevated permissions
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Verify user is authenticated and is admin
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized - No token' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized - Invalid token' }, { status: 401 });
    }

    // Check if user is admin
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (userError || !userData?.is_admin) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Get request body
    const { affiliateId, tierRates } = await request.json();

    if (!affiliateId || !tierRates) {
      return NextResponse.json({ error: 'Missing affiliateId or tierRates' }, { status: 400 });
    }

    console.log('Updating tier rates for affiliate:', affiliateId, tierRates);

    // Update the affiliate's tier rates
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({ tier_rates: tierRates })
      .eq('id', affiliateId)
      .select('tier_rates')
      .single();

    if (error) {
      console.error('Error updating tier rates:', error);
      return NextResponse.json({ error: 'Failed to update tier rates', details: error.message }, { status: 500 });
    }

    console.log('Updated tier rates:', data);

    return NextResponse.json({
      success: true,
      tier_rates: data.tier_rates
    });

  } catch (error) {
    console.error('Error in update-tier-rates API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Admin API: Get all affiliates with wallet data
 * Uses service role to bypass RLS
 */
export async function GET(request: NextRequest) {
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
      console.error('No authorization header');
      return NextResponse.json({ error: 'Unauthorized - No token' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Validating token...');

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json({ error: 'Unauthorized - Invalid token', details: authError.message }, { status: 401 });
    }

    if (!user) {
      console.error('No user found');
      return NextResponse.json({ error: 'Unauthorized - No user' }, { status: 401 });
    }

    console.log('User authenticated:', user.id);

    // Check if user is admin
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (userError) {
      console.error('Error checking admin status:', userError);
      return NextResponse.json({ error: 'Database error checking admin', details: userError.message }, { status: 500 });
    }

    if (!userData?.is_admin) {
      console.error('User is not admin:', user.id);
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    console.log('Admin validated:', user.id);

    // Fetch all affiliates with wallet data
    const { data: affiliates, error: fetchError } = await supabaseAdmin
      .from('users')
      .select(`
        id,
        email,
        full_name,
        referral_code,
        slug,
        has_purchased,
        commission_rate,
        created_at,
        wallet (
          pending_balance,
          available_balance,
          lifetime_earnings
        )
      `)
      .order('created_at', { ascending: false })
      .limit(100);

    if (fetchError) {
      console.error('Error fetching affiliates:', fetchError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      affiliates: affiliates || []
    });

  } catch (error) {
    console.error('Error in affiliates API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

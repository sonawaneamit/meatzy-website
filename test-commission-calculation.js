const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const COMMISSION_TIERS = {
  1: 13.0,
  2: 2.0,
  3: 1.0,
  4: 1.0,
};

async function calculateCommissions(params) {
  console.log('\n=== CALCULATING COMMISSIONS ===');
  console.log('Buyer User ID:', params.buyerUserId);
  console.log('Order ID:', params.orderId);
  console.log('Order Total:', params.orderTotal);
  console.log('');

  // Get ALL ancestors of the buyer (up to 4 levels up)
  const { data: ancestors, error } = await supabase
    .from('user_tree')
    .select(`
      ancestor_id,
      level,
      users:ancestor_id (
        id,
        email,
        commission_rate,
        commission_override
      )
    `)
    .eq('user_id', params.buyerUserId)
    .lte('level', 4)
    .order('level', { ascending: true });

  console.log('=== ANCESTOR QUERY ===');
  console.log('Error:', error);
  console.log('Ancestors found:', ancestors ? ancestors.length : 0);
  console.log('Ancestor data:', JSON.stringify(ancestors, null, 2));
  console.log('');

  if (error || !ancestors) {
    console.error('ERROR: Failed to fetch ancestors:', error);
    return [];
  }

  if (ancestors.length === 0) {
    console.log('WARNING: No ancestors found - buyer has no referrer');
    return [];
  }

  const commissions = [];

  for (const ancestor of ancestors) {
    const user = ancestor.users;

    if (!user) {
      console.error('ERROR: User data missing for ancestor_id:', ancestor.ancestor_id);
      continue;
    }

    const tierLevel = ancestor.level;
    const basePercentage = COMMISSION_TIERS[tierLevel];
    const effectiveRate = user.commission_override || user.commission_rate;
    const commissionAmount = (params.orderTotal * (basePercentage / 100)) * effectiveRate;

    console.log('=== PROCESSING ANCESTOR ===');
    console.log('Email:', user.email);
    console.log('Tier Level:', tierLevel);
    console.log('Base Percentage:', basePercentage + '%');
    console.log('Effective Rate:', (effectiveRate * 100) + '%');
    console.log('Commission Amount: $' + commissionAmount.toFixed(2));

    // Create commission record
    const { data: commission, error: commissionError } = await supabase
      .from('commissions')
      .insert({
        user_id: ancestor.ancestor_id,
        order_id: params.orderId,
        referred_user_id: params.buyerUserId,
        tier_level: tierLevel,
        base_percentage: basePercentage,
        applied_rate: effectiveRate,
        order_total: params.orderTotal,
        commission_amount: commissionAmount,
        status: 'pending',
      })
      .select()
      .single();

    if (commissionError) {
      console.error('ERROR creating commission:', commissionError);
      continue;
    }

    console.log('✅ Commission created successfully!');
    commissions.push(commission);

    // Update wallet pending balance
    const { error: walletError } = await supabase.rpc('increment_pending_balance', {
      p_user_id: ancestor.ancestor_id,
      p_amount: commissionAmount,
    });

    if (walletError) {
      console.error('ERROR updating wallet:', walletError);
    } else {
      console.log('✅ Wallet updated successfully!');
    }
    console.log('');
  }

  console.log('=== FINAL RESULT ===');
  console.log('Total commissions created:', commissions.length);
  return commissions;
}

(async () => {
  try {
    // Test with the actual order data
    const result = await calculateCommissions({
      buyerUserId: '2390dcee-f133-4106-917d-e0fd3f886907',
      orderId: 'TEST-DEBUG-123',
      orderTotal: 149.00,
    });

    console.log('\n✅ Test completed successfully');
    console.log('Commissions created:', result.length);
  } catch (err) {
    console.error('\n❌ Test failed with error:', err);
  }
})();

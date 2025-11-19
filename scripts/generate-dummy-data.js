#!/usr/bin/env node

/**
 * Generate Dummy Data for Dashboard Demo
 *
 * Creates realistic test data:
 * - 20 affiliates with names
 * - Multi-level referral chains
 * - Various commission amounts
 * - Different wallet balances
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Realistic names for dummy data
const FIRST_NAMES = ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Elijah', 'Sophia', 'James', 'Isabella', 'William',
  'Mia', 'Benjamin', 'Charlotte', 'Lucas', 'Amelia', 'Henry', 'Harper', 'Alexander', 'Evelyn', 'Michael'];

const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateEmail(firstName, lastName, index) {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${index}.${random}@example.com`;
}

async function cleanup() {
  console.log('🧹 Cleaning up existing dummy data...\n');

  const { data: users } = await supabase
    .from('users')
    .select('id')
    .like('email', '%@example.com');

  if (users && users.length > 0) {
    const userIds = users.map(u => u.id);
    await supabase.from('commissions').delete().in('user_id', userIds);
    await supabase.from('wallet').delete().in('user_id', userIds);
    await supabase.from('user_tree').delete().in('user_id', userIds);
    await supabase.from('withdrawals').delete().in('user_id', userIds);
    await supabase.from('users').delete().in('id', userIds);
    console.log(`   Removed ${users.length} existing dummy users\n`);
  }
}

async function createUser(firstName, lastName, index, referralCode = null, hasPurchased = true) {
  const email = generateEmail(firstName, lastName, index);
  const fullName = `${firstName} ${lastName}`;
  const newReferralCode = Math.random().toString(36).substring(2, 10).toUpperCase();

  let referrerId = null;
  if (referralCode) {
    const { data: referrer } = await supabase
      .from('users')
      .select('id')
      .eq('referral_code', referralCode)
      .single();

    if (referrer) {
      referrerId = referrer.id;
    }
  }

  const commissionRate = hasPurchased ? 1.0 : 0.5;

  const { data: user, error } = await supabase
    .from('users')
    .insert({
      email,
      full_name: fullName,
      referral_code: newReferralCode,
      referrer_id: referrerId,
      has_purchased: hasPurchased,
      commission_rate: commissionRate,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating user:', error);
    throw error;
  }

  // Create wallet
  await supabase.from('wallet').insert({
    user_id: user.id,
    available_balance: 0,
    pending_balance: 0,
    total_earned: 0,
    total_withdrawn: 0,
  });

  return user;
}

async function simulatePurchase(buyerId, orderTotal) {
  const orderId = `DUMMY_ORDER_${Date.now()}_${Math.random().toString(36).substring(7)}`;

  // Get buyer's ancestors
  const { data: ancestors } = await supabase
    .from('user_tree')
    .select('ancestor_id, level, users:ancestor_id(id, commission_rate)')
    .eq('user_id', buyerId)
    .lte('level', 4);

  if (!ancestors || ancestors.length === 0) return 0;

  const COMMISSION_TIERS = { 1: 13.0, 2: 2.0, 3: 1.0, 4: 1.0 };
  let totalCommissions = 0;

  for (const ancestor of ancestors) {
    const user = ancestor.users;
    const tierLevel = ancestor.level;
    const basePercentage = COMMISSION_TIERS[tierLevel];
    const effectiveRate = user.commission_rate;
    const commissionAmount = (orderTotal * (basePercentage / 100)) * effectiveRate;

    // Create commission
    await supabase.from('commissions').insert({
      user_id: ancestor.ancestor_id,
      order_id: orderId,
      referred_user_id: buyerId,
      tier_level: tierLevel,
      base_percentage: basePercentage,
      applied_rate: effectiveRate,
      order_total: orderTotal,
      commission_amount: commissionAmount,
      status: 'pending',
    });

    // Update wallet
    await supabase.rpc('increment_pending_balance', {
      p_user_id: ancestor.ancestor_id,
      p_amount: commissionAmount,
    });

    totalCommissions += commissionAmount;
  }

  return totalCommissions;
}

async function generateDummyData() {
  console.log('═'.repeat(70));
  console.log('🎨 GENERATING DUMMY DATA FOR DASHBOARD');
  console.log('═'.repeat(70));
  console.log();

  await cleanup();

  console.log('📝 Creating affiliates network...\n');

  const users = [];

  // Create 20 affiliates
  for (let i = 0; i < 20; i++) {
    const firstName = getRandomElement(FIRST_NAMES);
    const lastName = getRandomElement(LAST_NAMES);

    // 30% chance of being referred by existing user
    let referralCode = null;
    const shouldHaveReferrer = users.length > 0 && Math.random() > 0.3;

    if (shouldHaveReferrer) {
      const referrer = getRandomElement(users);
      referralCode = referrer.referral_code;
    }

    // 80% chance of having purchased
    const hasPurchased = Math.random() > 0.2;

    const user = await createUser(firstName, lastName, i, referralCode, hasPurchased);
    users.push(user);

    const status = hasPurchased ? '✅' : '⏸️';
    console.log(`   ${status} ${user.full_name} - Code: ${user.referral_code}`);
  }

  console.log(`\n✅ Created ${users.length} affiliates\n`);

  // Simulate random purchases
  console.log('💰 Simulating purchases and commissions...\n');

  const orderTotals = [189, 189, 189, 249, 249, 299]; // Different box prices
  let totalCommissionsPaid = 0;
  let totalOrders = 0;

  for (const user of users) {
    if (!user.has_purchased) continue;

    // Each user might make 1-5 purchases
    const numPurchases = Math.floor(Math.random() * 5) + 1;

    for (let i = 0; i < numPurchases; i++) {
      const orderTotal = getRandomElement(orderTotals);
      const commissionsGenerated = await simulatePurchase(user.id, orderTotal);

      if (commissionsGenerated > 0) {
        totalCommissionsPaid += commissionsGenerated;
        totalOrders++;
      }
    }
  }

  console.log(`   ✅ Simulated ${totalOrders} orders`);
  console.log(`   ✅ Generated $${totalCommissionsPaid.toFixed(2)} in commissions\n`);

  // Approve some commissions randomly
  console.log('✅ Approving random commissions...\n');

  const { data: allCommissions } = await supabase
    .from('commissions')
    .select('id, user_id, commission_amount')
    .eq('status', 'pending');

  if (allCommissions) {
    let approvedCount = 0;
    for (const commission of allCommissions) {
      // 60% chance to approve
      if (Math.random() > 0.4) {
        await supabase
          .from('commissions')
          .update({ status: 'approved', approved_at: new Date().toISOString() })
          .eq('id', commission.id);

        // Move from pending to available
        await supabase.rpc('approve_commission', {
          p_commission_id: commission.id,
        });

        approvedCount++;
      }
    }
    console.log(`   ✅ Approved ${approvedCount}/${allCommissions.length} commissions\n`);
  }

  // Create some withdrawal requests
  console.log('💸 Creating withdrawal requests...\n');

  const { data: walletsWithBalance } = await supabase
    .from('wallet')
    .select('user_id, available_balance, users:user_id(email, full_name)')
    .gte('available_balance', 100)
    .limit(5);

  if (walletsWithBalance && walletsWithBalance.length > 0) {
    for (const wallet of walletsWithBalance) {
      const amount = Math.min(wallet.available_balance, Math.floor(Math.random() * 200) + 100);
      const user = wallet.users;

      await supabase.from('withdrawals').insert({
        user_id: wallet.user_id,
        amount,
        paypal_email: user.email,
        status: 'pending',
      });

      console.log(`   💰 ${user.full_name} requested $${amount}`);
    }
  }

  // Stats summary
  console.log('\n═'.repeat(70));
  console.log('📊 SUMMARY');
  console.log('═'.repeat(70));

  const { count: totalAffiliates } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .like('email', '%@example.com');

  const { count: activeAffiliates } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .like('email', '%@example.com')
    .eq('has_purchased', true);

  const { count: totalCommissions } = await supabase
    .from('commissions')
    .select('*', { count: 'exact', head: true });

  const { count: pendingCommissions } = await supabase
    .from('commissions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  const { count: pendingWithdrawals } = await supabase
    .from('withdrawals')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  console.log();
  console.log(`   Total Affiliates: ${totalAffiliates}`);
  console.log(`   Active Affiliates: ${activeAffiliates}`);
  console.log(`   Total Commissions: ${totalCommissions}`);
  console.log(`   Pending Commissions: ${pendingCommissions}`);
  console.log(`   Pending Withdrawals: ${pendingWithdrawals}`);
  console.log(`   Total Commission Value: $${totalCommissionsPaid.toFixed(2)}`);
  console.log();

  console.log('✅ Dummy data generated successfully!\n');
  console.log('🎯 Visit http://localhost:3000/admin to view the dashboard\n');
  console.log('═'.repeat(70) + '\n');
}

generateDummyData().catch(error => {
  console.error('❌ Error generating dummy data:', error);
  process.exit(1);
});

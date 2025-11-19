#!/usr/bin/env node

/**
 * Comprehensive Referral System Test Suite
 * Tests all aspects of the Meatzy referral system
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

// Test data
const TEST_EMAIL_PREFIX = 'test_' + Date.now();
const testUsers = {
  alice: {
    email: `${TEST_EMAIL_PREFIX}_alice@meatzy.test`,
    fullName: 'Alice Test',
    referralCode: null,
  },
  bob: {
    email: `${TEST_EMAIL_PREFIX}_bob@meatzy.test`,
    fullName: 'Bob Test',
    referralCode: null,
  },
  charlie: {
    email: `${TEST_EMAIL_PREFIX}_charlie@meatzy.test`,
    fullName: 'Charlie Test',
    referralCode: null,
  },
};

async function cleanup() {
  console.log('\n🧹 Cleaning up test data...\n');

  const emails = Object.values(testUsers).map(u => u.email);

  // Get user IDs
  const { data: users } = await supabase
    .from('users')
    .select('id')
    .in('email', emails);

  if (users && users.length > 0) {
    const userIds = users.map(u => u.id);

    // Delete in reverse order of dependencies
    await supabase.from('commissions').delete().in('user_id', userIds);
    await supabase.from('wallet').delete().in('user_id', userIds);
    await supabase.from('user_tree').delete().in('user_id', userIds);
    await supabase.from('subscriptions').delete().in('user_id', userIds);
    await supabase.from('users').delete().in('id', userIds);

    console.log(`   ✅ Cleaned up ${users.length} test user(s)`);
  } else {
    console.log('   ℹ️  No test data to clean up');
  }
}

async function createTestUser(email, fullName, referralCode = null, hasPurchased = false) {
  // Generate unique referral code
  const newReferralCode = Math.random().toString(36).substring(2, 10).toUpperCase();

  // Find referrer if code provided
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

  // Determine commission rate
  const commissionRate = hasPurchased ? 1.0 : 0.5;

  // Create user
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

  if (error) throw error;

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

async function test1_CreateUsersWithoutReferrals() {
  console.log('\n📝 Test 1: Create users without referrals\n');

  try {
    const alice = await createTestUser(
      testUsers.alice.email,
      testUsers.alice.fullName
    );

    testUsers.alice.referralCode = alice.referral_code;

    console.log(`   ✅ Created Alice with referral code: ${alice.referral_code}`);
    console.log(`      Commission rate: ${alice.commission_rate * 100}%`);

    return true;
  } catch (error) {
    console.error('   ❌ Failed:', error.message);
    return false;
  }
}

async function test2_CreateUserWithReferral() {
  console.log('\n📝 Test 2: Create user with referral code\n');

  try {
    const bob = await createTestUser(
      testUsers.bob.email,
      testUsers.bob.fullName,
      testUsers.alice.referralCode, // Bob referred by Alice
      false
    );

    testUsers.bob.referralCode = bob.referral_code;

    console.log(`   ✅ Created Bob referred by Alice`);
    console.log(`      Bob's referral code: ${bob.referral_code}`);
    console.log(`      Commission rate: ${bob.commission_rate * 100}%`);

    // Verify tree was created
    const { data: tree } = await supabase
      .from('user_tree')
      .select('*')
      .eq('user_id', bob.id);

    if (tree && tree.length > 0) {
      console.log(`   ✅ User tree created: ${tree.length} ancestor(s)`);
    } else {
      console.log('   ⚠️  User tree not found (may need trigger)');
    }

    return true;
  } catch (error) {
    console.error('   ❌ Failed:', error.message);
    return false;
  }
}

async function test3_CreateDeepReferral() {
  console.log('\n📝 Test 3: Create 3-level referral chain\n');

  try {
    const charlie = await createTestUser(
      testUsers.charlie.email,
      testUsers.charlie.fullName,
      testUsers.bob.referralCode, // Charlie referred by Bob
      true // Charlie makes a purchase
    );

    testUsers.charlie.referralCode = charlie.referral_code;

    console.log(`   ✅ Created Charlie referred by Bob`);
    console.log(`      Has purchased: ${charlie.has_purchased}`);
    console.log(`      Commission rate: ${charlie.commission_rate * 100}%`);

    return true;
  } catch (error) {
    console.error('   ❌ Failed:', error.message);
    return false;
  }
}

async function test4_SimulateOrder() {
  console.log('\n📝 Test 4: Simulate Shopify order & commission calculation\n');

  try {
    // Get Charlie's user ID
    const { data: charlie } = await supabase
      .from('users')
      .select('id')
      .eq('email', testUsers.charlie.email)
      .single();

    if (!charlie) throw new Error('Charlie not found');

    // Simulate an order
    const orderId = `TEST_ORDER_${Date.now()}`;
    const orderTotal = 189.00;

    // Get Charlie's ancestors
    const { data: ancestors } = await supabase
      .from('user_tree')
      .select(`
        ancestor_id,
        level,
        users:ancestor_id (
          id,
          email,
          full_name,
          commission_rate
        )
      `)
      .eq('user_id', charlie.id)
      .lte('level', 4);

    console.log(`   Found ${ancestors?.length || 0} ancestor(s) for Charlie`);

    if (!ancestors || ancestors.length === 0) {
      console.log('   ⚠️  No ancestors found - tree may need manual setup');
      console.log('   ℹ️  Expected: Bob (Tier 1), Alice (Tier 2)');
      return false;
    }

    // Calculate commissions for each ancestor
    const COMMISSION_TIERS = { 1: 13.0, 2: 2.0, 3: 1.0, 4: 1.0 };
    const commissions = [];

    for (const ancestor of ancestors) {
      const user = ancestor.users;
      const tierLevel = ancestor.level;
      const basePercentage = COMMISSION_TIERS[tierLevel];
      const effectiveRate = user.commission_rate;
      const commissionAmount = (orderTotal * (basePercentage / 100)) * effectiveRate;

      console.log(`   💰 Tier ${tierLevel} - ${user.full_name}`);
      console.log(`      Base: ${basePercentage}% × Rate: ${effectiveRate * 100}% = $${commissionAmount.toFixed(2)}`);

      // Create commission record
      const { data: commission } = await supabase
        .from('commissions')
        .insert({
          user_id: ancestor.ancestor_id,
          order_id: orderId,
          referred_user_id: charlie.id,
          tier_level: tierLevel,
          base_percentage: basePercentage,
          applied_rate: effectiveRate,
          order_total: orderTotal,
          commission_amount: commissionAmount,
          status: 'pending',
        })
        .select()
        .single();

      if (commission) {
        commissions.push(commission);

        // Update wallet
        await supabase.rpc('increment_pending_balance', {
          p_user_id: ancestor.ancestor_id,
          p_amount: commissionAmount,
        });
      }
    }

    console.log(`\n   ✅ Created ${commissions.length} commission record(s)`);

    // Verify wallet balances
    for (const ancestor of ancestors) {
      const { data: wallet } = await supabase
        .from('wallet')
        .select('*')
        .eq('user_id', ancestor.ancestor_id)
        .single();

      if (wallet) {
        const user = ancestor.users;
        console.log(`   📊 ${user.full_name}: Pending $${wallet.pending_balance.toFixed(2)}`);
      }
    }

    return true;
  } catch (error) {
    console.error('   ❌ Failed:', error.message);
    return false;
  }
}

async function test5_VerifyTree() {
  console.log('\n📝 Test 5: Verify referral tree structure\n');

  try {
    // Get Alice's user
    const { data: alice } = await supabase
      .from('users')
      .select('id, referral_code')
      .eq('email', testUsers.alice.email)
      .single();

    if (!alice) throw new Error('Alice not found');

    // Get Alice's full tree
    const { data: tree } = await supabase
      .from('user_tree')
      .select(`
        user_id,
        level,
        users:user_id (
          email,
          full_name
        )
      `)
      .eq('ancestor_id', alice.id)
      .order('level');

    console.log(`   Alice's referral tree (${tree?.length || 0} referral(s)):\n`);

    if (tree && tree.length > 0) {
      tree.forEach(node => {
        const user = node.users;
        const indent = '   ' + '  '.repeat(node.level);
        console.log(`${indent}└─ Tier ${node.level}: ${user.full_name} (${user.email})`);
      });
      console.log();
      return true;
    } else {
      console.log('   ⚠️  No tree found');
      console.log('   ℹ️  This may mean the trigger is not set up');
      console.log('   ℹ️  Tree must be manually created or trigger added');
      return false;
    }
  } catch (error) {
    console.error('   ❌ Failed:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('='.repeat(60));
  console.log('🧪 MEATZY REFERRAL SYSTEM - TEST SUITE');
  console.log('='.repeat(60));

  // Clean up first
  await cleanup();

  // Run tests
  const results = {
    test1: await test1_CreateUsersWithoutReferrals(),
    test2: await test2_CreateUserWithReferral(),
    test3: await test3_CreateDeepReferral(),
    test4: await test4_SimulateOrder(),
    test5: await test5_VerifyTree(),
  };

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST RESULTS');
  console.log('='.repeat(60));

  const passed = Object.values(results).filter(r => r).length;
  const total = Object.keys(results).length;

  Object.entries(results).forEach(([test, result]) => {
    const status = result ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} - ${test}`);
  });

  console.log(`\n${passed}/${total} tests passed\n`);

  if (passed === total) {
    console.log('✅ ALL TESTS PASSED!');
    console.log('\nYour referral system is working correctly.\n');
  } else {
    console.log('❌ SOME TESTS FAILED');
    console.log('\nIssues to check:');
    if (!results.test5) {
      console.log('- User tree trigger may not be set up');
      console.log('- Run the trigger creation SQL in Supabase');
    }
    console.log();
  }

  // Offer to clean up
  console.log('ℹ️  Test data remains in database for inspection');
  console.log('   Run this script with --cleanup flag to remove test data\n');

  console.log('='.repeat(60) + '\n');

  process.exit(passed === total ? 0 : 1);
}

// Handle cleanup flag
if (process.argv.includes('--cleanup')) {
  cleanup().then(() => {
    console.log('\n✅ Cleanup complete\n');
    process.exit(0);
  });
} else {
  runTests().catch(error => {
    console.error('\n❌ Test suite error:', error);
    process.exit(1);
  });
}

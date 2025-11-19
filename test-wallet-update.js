#!/usr/bin/env node

/**
 * Test wallet balance updates
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testWalletUpdate() {
  console.log('🧪 Testing wallet balance update...\n');

  try {
    // Get a test user
    const { data: users } = await supabase
      .from('users')
      .select('id, email, full_name')
      .like('email', '%@meatzy.test')
      .limit(1);

    if (!users || users.length === 0) {
      console.log('❌ No test users found. Run test-referral-system.js first.');
      return;
    }

    const testUser = users[0];
    console.log(`Testing with user: ${testUser.full_name} (${testUser.email})`);
    console.log(`User ID: ${testUser.id}\n`);

    // Check wallet before
    const { data: walletBefore } = await supabase
      .from('wallet')
      .select('*')
      .eq('user_id', testUser.id)
      .single();

    console.log('Wallet BEFORE:');
    console.log(`  Pending: $${walletBefore?.pending_balance || 0}`);
    console.log(`  Available: $${walletBefore?.available_balance || 0}\n`);

    // Test increment_pending_balance function
    console.log('Calling increment_pending_balance($25.00)...\n');

    const { data, error } = await supabase.rpc('increment_pending_balance', {
      p_user_id: testUser.id,
      p_amount: 25.00,
    });

    if (error) {
      console.error('❌ RPC Error:', error);
      return;
    }

    console.log('✅ RPC call succeeded\n');

    // Check wallet after
    const { data: walletAfter } = await supabase
      .from('wallet')
      .select('*')
      .eq('user_id', testUser.id)
      .single();

    console.log('Wallet AFTER:');
    console.log(`  Pending: $${walletAfter?.pending_balance || 0}`);
    console.log(`  Available: $${walletAfter?.available_balance || 0}\n`);

    const increase = (walletAfter?.pending_balance || 0) - (walletBefore?.pending_balance || 0);

    if (increase === 25.00) {
      console.log('✅ Wallet updated correctly! (+$25.00)');
    } else {
      console.log(`⚠️  Wallet increase: $${increase} (expected $25.00)`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testWalletUpdate();

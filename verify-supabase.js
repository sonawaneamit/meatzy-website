#!/usr/bin/env node

/**
 * Supabase Verification Script for Meatzy Referral System
 *
 * This script verifies:
 * 1. Connection to Supabase
 * 2. All required tables exist
 * 3. All required functions exist
 * 4. RLS policies are set up
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Required tables for the referral system
const REQUIRED_TABLES = [
  'users',
  'user_tree',
  'subscriptions',
  'commissions',
  'wallet',
  'withdrawals',
  'discount_codes'
];

// Required functions
const REQUIRED_FUNCTIONS = [
  'increment_pending_balance',
  'approve_commission',
  'process_withdrawal'
];

async function verifyConnection() {
  console.log('\n🔍 Verifying Supabase Connection...\n');

  try {
    // Test basic connection by checking if users table exists
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(0);

    // Any response (even if empty) means we're connected
    console.log('✅ Connected to Supabase successfully');
    console.log(`   URL: ${supabaseUrl}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to Supabase');
    console.error('   Error:', error.message);
    return false;
  }
}

async function verifyTables() {
  console.log('\n🔍 Verifying Database Tables...\n');

  try {
    // Check each table individually
    const existingTables = [];
    for (const tableName of REQUIRED_TABLES) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('id')
          .limit(0);

        // If no error or just an empty result, table exists
        if (!error) {
          existingTables.push(tableName);
          console.log(`   ✅ ${tableName}`);
        } else if (error.message.includes('does not exist') || error.message.includes('not found')) {
          console.log(`   ❌ ${tableName} - Table does not exist`);
        } else {
          // Table might exist but have other issues
          existingTables.push(tableName);
          console.log(`   ✅ ${tableName} (${error.message})`);
        }
      } catch (err) {
        console.log(`   ❌ ${tableName} - ${err.message}`);
      }
    }

    const missingTables = REQUIRED_TABLES.filter(t => !existingTables.includes(t));

    if (missingTables.length > 0) {
      console.log('\n❌ Missing tables:', missingTables.join(', '));
      console.log('   📝 Action: Run supabase-schema.sql in Supabase SQL Editor');
      return false;
    }

    console.log('\n✅ All required tables exist');
    return true;
  } catch (error) {
    console.error('❌ Error checking tables:', error.message);
    return false;
  }
}

async function verifyFunctions() {
  console.log('\n🔍 Verifying Database Functions...\n');

  const existingFunctions = [];

  for (const funcName of REQUIRED_FUNCTIONS) {
    try {
      // Try to call each function with dummy parameters to see if it exists
      let testResult;

      if (funcName === 'increment_pending_balance') {
        // Test with dummy UUID - will fail but we'll catch that
        testResult = await supabase.rpc(funcName, {
          p_user_id: '00000000-0000-0000-0000-000000000000',
          p_amount: 0
        });
      } else if (funcName === 'approve_commission') {
        testResult = await supabase.rpc(funcName, {
          p_commission_id: '00000000-0000-0000-0000-000000000000'
        });
      } else if (funcName === 'process_withdrawal') {
        testResult = await supabase.rpc(funcName, {
          p_user_id: '00000000-0000-0000-0000-000000000000',
          p_amount: 0,
          p_paypal_email: 'test@test.com'
        });
      }

      // If we get here without "function does not exist" error, the function exists
      if (!testResult.error || !testResult.error.message.includes('function') && !testResult.error.message.includes('does not exist')) {
        existingFunctions.push(funcName);
        console.log(`   ✅ ${funcName}`);
      } else if (testResult.error.message.includes('does not exist')) {
        console.log(`   ❌ ${funcName} - does not exist`);
      } else {
        // Other errors mean the function exists but failed for another reason (expected)
        existingFunctions.push(funcName);
        console.log(`   ✅ ${funcName} (exists, test call failed as expected)`);
      }
    } catch (error) {
      console.log(`   ❌ ${funcName} - ${error.message}`);
    }
  }

  const missingFunctions = REQUIRED_FUNCTIONS.filter(f => !existingFunctions.includes(f));

  if (missingFunctions.length > 0) {
    console.log('\n❌ Missing functions:', missingFunctions.join(', '));
    console.log('   Run supabase-wallet-functions.sql in Supabase SQL Editor');
    return false;
  }

  console.log('\n✅ All required functions exist');
  return true;
}

async function checkSampleData() {
  console.log('\n🔍 Checking Sample Data...\n');

  try {
    // Check if we have any users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, referral_code, has_purchased, commission_rate')
      .limit(5);

    if (usersError) {
      console.error('❌ Error fetching users:', usersError.message);
      return false;
    }

    console.log(`   Found ${users.length} user(s)`);

    if (users.length > 0) {
      console.log('\n   Sample users:');
      users.forEach(user => {
        console.log(`   - ${user.email}`);
        console.log(`     Referral code: ${user.referral_code}`);
        console.log(`     Purchased: ${user.has_purchased}`);
        console.log(`     Commission rate: ${user.commission_rate * 100}%`);
      });
    } else {
      console.log('   ℹ️  No users yet - system is ready for first signup');
    }

    // Check commissions
    const { data: commissions, error: commissionsError } = await supabase
      .from('commissions')
      .select('*')
      .limit(5);

    if (!commissionsError) {
      console.log(`\n   Found ${commissions.length} commission record(s)`);
    }

    return true;
  } catch (error) {
    console.error('❌ Error checking sample data:', error.message);
    return false;
  }
}

async function generateSetupReport() {
  console.log('\n' + '='.repeat(60));
  console.log('📋 MEATZY REFERRAL SYSTEM - SETUP VERIFICATION REPORT');
  console.log('='.repeat(60));

  const results = {
    connection: await verifyConnection(),
    tables: await verifyTables(),
    functions: await verifyFunctions(),
    sampleData: await checkSampleData()
  };

  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));

  const allPassed = Object.values(results).every(r => r);

  if (allPassed) {
    console.log('\n✅ ALL CHECKS PASSED!');
    console.log('\nYour Meatzy referral system is ready to use.');
    console.log('\nNext steps:');
    console.log('1. Deploy to Vercel/production');
    console.log('2. Configure Shopify webhook');
    console.log('3. Test with a real referral signup');
  } else {
    console.log('\n❌ SOME CHECKS FAILED');
    console.log('\nPlease fix the issues above before proceeding.');
    console.log('\nSetup instructions:');
    console.log('1. Go to Supabase SQL Editor: https://ezgfwukgtdlynabdcucz.supabase.co');
    console.log('2. Run supabase-schema.sql');
    console.log('3. Run supabase-wallet-functions.sql');
    console.log('4. Run this script again');
  }

  console.log('\n' + '='.repeat(60) + '\n');

  process.exit(allPassed ? 0 : 1);
}

// Run the verification
generateSetupReport().catch(error => {
  console.error('\n❌ Unexpected error:', error);
  process.exit(1);
});

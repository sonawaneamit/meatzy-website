#!/usr/bin/env node

/**
 * Check if Shopify webhook has created any records
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkWebhookResults() {
  console.log('🔍 Checking for webhook activity...\n');

  try {
    // Check for recent users (created in last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data: recentUsers, error: usersError } = await supabase
      .from('users')
      .select('id, email, full_name, has_purchased, created_at')
      .gte('created_at', oneDayAgo)
      .order('created_at', { ascending: false });

    if (usersError) {
      console.error('❌ Error fetching users:', usersError.message);
      return;
    }

    console.log(`📊 Users created in last 24 hours: ${recentUsers.length}\n`);

    if (recentUsers.length > 0) {
      console.log('Recent users:');
      recentUsers.forEach(user => {
        console.log(`  • ${user.email || 'No email'}`);
        console.log(`    Name: ${user.full_name || 'N/A'}`);
        console.log(`    Purchased: ${user.has_purchased ? 'Yes ✅' : 'No'}`);
        console.log(`    Created: ${new Date(user.created_at).toLocaleString()}`);
        console.log('');
      });
    } else {
      console.log('  ℹ️  No users created recently\n');
    }

    // Check for recent commissions
    const { data: recentCommissions, error: commissionsError } = await supabase
      .from('commissions')
      .select(`
        id,
        commission_amount,
        tier_level,
        status,
        created_at,
        user:user_id (email, full_name),
        referred:referred_user_id (email)
      `)
      .gte('created_at', oneDayAgo)
      .order('created_at', { ascending: false });

    if (commissionsError) {
      console.error('❌ Error fetching commissions:', commissionsError.message);
      return;
    }

    console.log(`💰 Commissions created in last 24 hours: ${recentCommissions.length}\n`);

    if (recentCommissions.length > 0) {
      console.log('Recent commissions:');
      recentCommissions.forEach(comm => {
        const earner = comm.user;
        const buyer = comm.referred;
        console.log(`  • $${comm.commission_amount} for ${earner?.email || 'Unknown'}`);
        console.log(`    Tier ${comm.tier_level} from ${buyer?.email || 'Unknown'} purchase`);
        console.log(`    Status: ${comm.status}`);
        console.log(`    Created: ${new Date(comm.created_at).toLocaleString()}`);
        console.log('');
      });
    } else {
      console.log('  ℹ️  No commissions created recently\n');
    }

    // Check wallet balances
    const { data: wallets, error: walletsError } = await supabase
      .from('wallet')
      .select(`
        pending_balance,
        available_balance,
        total_earned,
        user:user_id (email, full_name)
      `)
      .or('pending_balance.gt.0,available_balance.gt.0')
      .order('total_earned', { ascending: false });

    if (walletsError) {
      console.error('❌ Error fetching wallets:', walletsError.message);
      return;
    }

    console.log(`💵 Wallets with balance: ${wallets.length}\n`);

    if (wallets.length > 0) {
      console.log('Wallet balances:');
      wallets.forEach(wallet => {
        const user = wallet.user;
        console.log(`  • ${user?.email || 'Unknown'}`);
        console.log(`    Pending: $${wallet.pending_balance}`);
        console.log(`    Available: $${wallet.available_balance}`);
        console.log(`    Total earned: $${wallet.total_earned}`);
        console.log('');
      });
    } else {
      console.log('  ℹ️  No wallets have balances yet\n');
    }

    // Summary
    console.log('═'.repeat(60));
    console.log('📋 SUMMARY');
    console.log('═'.repeat(60));

    if (recentUsers.length > 0 || recentCommissions.length > 0) {
      console.log('✅ Webhook appears to be working!');
      console.log(`   ${recentUsers.length} new user(s)`);
      console.log(`   ${recentCommissions.length} new commission(s)`);
    } else {
      console.log('⚠️  No recent webhook activity detected');
      console.log('');
      console.log('Next steps:');
      console.log('1. Click on webhook in Shopify and send test notification');
      console.log('2. Or make a test purchase on your store');
      console.log('3. Run this script again to check results');
    }
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkWebhookResults();

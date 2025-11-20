const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function simulateMagicLinkWebhook() {
  const email = 'asonawane@getmeatzy.com';
  const shopifyCustomerId = '26474061889905';
  const shopifyOrderId = '16442383499633';
  const fullName = 'Amit Sonawane';
  const orderTotal = 99.99;

  try {
    console.log('\n🔄 Simulating Shopify webhook with MAGIC LINK flow...\n');
    console.log('This NEW approach works WITH Supabase\'s auth trigger!\n');

    // Step 1: Clean up any existing data
    console.log('🧹 Cleaning up existing data...');

    // Delete from pending_user_setup
    await supabase.from('pending_user_setup').delete().eq('email', email.toLowerCase());

    // Delete from users table
    const { data: existingUsers } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase());

    if (existingUsers && existingUsers.length > 0) {
      for (const user of existingUsers) {
        // Delete wallet first (foreign key constraint)
        await supabase.from('wallet').delete().eq('user_id', user.id);

        // Delete commissions
        await supabase.from('commissions').delete().eq('user_id', user.id);

        // Delete user
        await supabase.from('users').delete().eq('id', user.id);
      }
    }

    // Delete from auth.users
    const { data: { users: authUsers } } = await supabase.auth.admin.listUsers();
    const existingAuthUser = authUsers.find(u => u.email?.toLowerCase() === email.toLowerCase());

    if (existingAuthUser) {
      await supabase.auth.admin.deleteUser(existingAuthUser.id);
    }

    console.log('✓ Cleanup complete\n');

    // Step 2: Generate referral code for the new user
    const referralCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    // Step 3: Create pending setup record (simulating webhook behavior)
    console.log('📝 Creating pending setup record...');

    const { error: pendingError } = await supabase
      .from('pending_user_setup')
      .insert({
        email: email.toLowerCase(),
        full_name: fullName,
        referral_code: referralCode,
        referred_by_code: null, // No referrer in this test
        shopify_customer_id: shopifyCustomerId,
        shopify_order_id: shopifyOrderId,
        order_total: orderTotal,
      });

    if (pendingError) {
      console.error('❌ Error creating pending setup:', pendingError.message);
      return;
    }

    console.log('✓ Pending setup record created');

    // Step 4: Send magic link via OTP (simulating webhook email)
    console.log('\n📧 Sending magic link via OTP...');

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback?redirect_to=/dashboard?new_user=true`,
      },
    });

    if (otpError) {
      console.error('❌ Error sending magic link:', otpError.message);
      return;
    }

    console.log('✓ Magic link sent to email!');

    console.log('\n' + '='.repeat(80));
    console.log('✅ MAGIC LINK WEBHOOK SIMULATION COMPLETE!');
    console.log('='.repeat(80));
    console.log('\nTest Data:');
    console.log('  Email:', email);
    console.log('  Referral Code:', referralCode);
    console.log('  Shopify Customer ID:', shopifyCustomerId);
    console.log('  Order Total: $' + orderTotal);
    console.log('\n' + '='.repeat(80));
    console.log('\n🎉 NOW TEST THE MAGIC LINK FLOW:\n');
    console.log('1. Check your email:', email);
    console.log('   Subject: "Magic Link - Supabase"');
    console.log('\n2. Click the "Log In" button in the email');
    console.log('\n3. You will be redirected to the dashboard');
    console.log('\n4. Dashboard will automatically:');
    console.log('   - Auth account created (trigger creates users record)');
    console.log('   - Users record updated with webhook data');
    console.log('   - Commissions calculated for your order');
    console.log('   - Pending setup data cleaned up');
    console.log('\n5. Check the dashboard to see:');
    console.log('   - Your referral code:', referralCode);
    console.log('   - Commission from your order ($' + orderTotal + ')');
    console.log('   - Your wallet balance');
    console.log('\n' + '='.repeat(80));
    console.log('\n💡 This approach WORKS WITH Supabase\'s trigger, not against it!');
    console.log('   No more "Database error creating new user" issues!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

simulateMagicLinkWebhook();

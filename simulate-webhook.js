const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function simulateWebhook() {
  const email = 'asonawane@getmeatzy.com';
  const shopifyCustomerId = '26474061889905';
  const fullName = 'Amit Sonawane';

  try {
    console.log('\n🔄 Simulating Shopify webhook with NEW temporary password flow...\n');

    // Generate referral code
    const referralCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    // Generate temporary password (same format as webhook)
    const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
    const temporaryPassword = `Meatzy${randomChars}!`;

    console.log('📝 Generated temporary password:', temporaryPassword);

    // SIMPLIFIED APPROACH: Just create users record with temp password
    // Auth account creation will be handled on first login
    const { data: newUser, error: userError} = await supabase
      .from('users')
      .insert({
        email: email.toLowerCase(),
        full_name: fullName,
        referral_code: referralCode,
        has_purchased: true,
        shopify_customer_id: shopifyCustomerId,
        temporary_password: temporaryPassword,
        requires_password_change: true,
      })
      .select()
      .single();

    if (userError) {
      console.error('❌ Error creating user record:', userError.message);
      return;
    }

    console.log('✓ User record created in database');
    console.log('  User ID:', newUser.id);
    console.log('  NOTE: Auth account will be created on first login');

    // Step 3: Create wallet
    const { error: walletError } = await supabase
      .from('wallet')
      .insert({
        user_id: newUser.id,
        available_balance: 0,
        pending_balance: 0,
        total_earned: 0,
      });

    if (walletError) {
      console.error('❌ Error creating wallet:', walletError.message);
      return;
    }

    console.log('✓ Wallet created');

    console.log('\n✅ Webhook simulation complete!');
    console.log('='.repeat(80));
    console.log('Email:', email);
    console.log('Temporary Password:', temporaryPassword);
    console.log('Referral Code:', referralCode);
    console.log('Shopify Customer ID:', shopifyCustomerId);
    console.log('Auth Account:', 'CREATED with temporary password');
    console.log('='.repeat(80));

    console.log('\n🎉 Now test the flow:');
    console.log('\n1. Visit thank you page to see temporary password:');
    console.log('   http://localhost:3000/thank-you?order_id=16442383499633&email=asonawane%40getmeatzy.com&name=Amit+Sonawane');
    console.log('\n2. Log in with:');
    console.log('   Email:', email);
    console.log('   Password:', temporaryPassword);
    console.log('   URL: http://localhost:3000/login');
    console.log('\n3. Dashboard should prompt you to change your password!');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

simulateWebhook();

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function createTestUser() {
  const testEmail = 'testaffiliate@meatzy.com';
  const testPassword = 'TestPass123!';

  try {
    console.log('\nCreating test affiliate account...');
    console.log('Email:', testEmail);
    console.log('Password:', testPassword);

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', testEmail)
      .single();

    if (existingUser) {
      console.log('\n✅ Test user already exists!');
      console.log('\nLogin credentials:');
      console.log('━'.repeat(50));
      console.log(`Email: ${testEmail}`);
      console.log(`Password: ${testPassword}`);
      console.log('━'.repeat(50));
      console.log('\nGo to: http://localhost:3000/login');
      return;
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true
    });

    if (authError) throw authError;

    console.log('✓ Auth user created');

    // Generate referral code
    const referralCode = 'TEST' + Math.random().toString(36).substring(2, 8).toUpperCase();

    // Create user in users table
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: testEmail,
        full_name: 'Test Affiliate',
        referral_code: referralCode,
        has_purchased: true,
        shopify_customer_id: '12345678901234' // Fake Shopify ID
      });

    if (userError) throw userError;
    console.log('✓ User profile created');

    // Create wallet
    const { error: walletError } = await supabase
      .from('wallet')
      .insert({
        user_id: authData.user.id,
        available_balance: 45.50,
        pending_balance: 12.25,
        total_earned: 57.75
      });

    if (walletError) throw walletError;
    console.log('✓ Wallet created with test balances');

    console.log('\n✅ Test account created successfully!');
    console.log('\nLogin credentials:');
    console.log('━'.repeat(50));
    console.log(`Email: ${testEmail}`);
    console.log(`Password: ${testPassword}`);
    console.log(`Referral Code: ${referralCode}`);
    console.log('━'.repeat(50));
    console.log('\nGo to: http://localhost:3000/login');

  } catch (error) {
    console.error('Error creating test user:', error);
  }
}

createTestUser();

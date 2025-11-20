const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkUsers() {
  try {
    // Get a few users with their basic info
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, full_name, referral_code, has_purchased, shopify_customer_id')
      .limit(5);

    if (error) throw error;

    console.log('\nAvailable test users:');
    console.log('='.repeat(80));
    users.forEach((user, idx) => {
      console.log(`\n${idx + 1}. Email: ${user.email}`);
      console.log(`   Name: ${user.full_name || 'N/A'}`);
      console.log(`   Referral Code: ${user.referral_code}`);
      console.log(`   Has Purchased: ${user.has_purchased}`);
      console.log(`   Shopify Customer ID: ${user.shopify_customer_id || 'None'}`);
    });

    console.log('\n' + '='.repeat(80));
    console.log('\nNote: Passwords are encrypted in Supabase Auth.');
    console.log('Options to test:');
    console.log('1. Use the magic link feature (passwordless login)');
    console.log('2. Reset password for a test user');
    console.log('3. Create a new test account with known password');

  } catch (error) {
    console.error('Error:', error);
  }
}

checkUsers();

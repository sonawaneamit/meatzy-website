const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkUser() {
  const email = 'asonawane@getmeatzy.com';

  try {
    // Check users table
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    console.log('\n='.repeat(80));
    console.log('USER STATUS CHECK');
    console.log('='.repeat(80));

    if (user) {
      console.log('\n✅ User EXISTS in users table:');
      console.log('  Email:', user.email);
      console.log('  Name:', user.full_name || 'Not set');
      console.log('  Referral Code:', user.referral_code);
      console.log('  Has Purchased:', user.has_purchased);
      console.log('  Shopify Customer ID:', user.shopify_customer_id || 'Not set');
      console.log('  Created:', new Date(user.created_at).toLocaleString());
    } else {
      console.log('\n❌ User DOES NOT exist in users table');
    }

    // Check auth.users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

    const authUser = authUsers?.users?.find(u => u.email === email);

    console.log('\n' + '-'.repeat(80));

    if (authUser) {
      console.log('✅ User EXISTS in auth.users:');
      console.log('  Auth ID:', authUser.id);
      console.log('  Email Confirmed:', authUser.email_confirmed_at ? 'Yes' : 'No');
      console.log('  Last Sign In:', authUser.last_sign_in_at || 'Never');
    } else {
      console.log('❌ User DOES NOT exist in auth.users');
    }

    console.log('\n' + '='.repeat(80));
    console.log('DIAGNOSIS:');
    console.log('='.repeat(80));

    if (user && !authUser) {
      console.log('\n⚠️  ISSUE FOUND: User exists in database but NOT in auth system');
      console.log('\nThis means:');
      console.log('  - Shopify webhook created the user record');
      console.log('  - But no auth account was created yet');
      console.log('\nSOLUTION OPTIONS:');
      console.log('  1. Delete the user record and try again');
      console.log('  2. Use magic link login instead (no password needed)');
      console.log('  3. Manually create auth user for this email');
    } else if (user && authUser) {
      console.log('\n✅ User is properly set up in both tables');
      console.log('\nYou can log in at: http://localhost:3000/login');
    } else {
      console.log('\n❓ User not found in either table');
      console.log('The webhook may not have fired yet.');
    }

    console.log('\n');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkUser();

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function resetUser() {
  const email = 'asonawane@getmeatzy.com';

  try {
    console.log('\n🔄 Resetting user account...');

    // Delete from wallet first (foreign key constraint)
    const { error: walletError } = await supabase
      .from('wallet')
      .delete()
      .eq('user_id', '0e374002-99ff-460a-87b3-239e491a71e3');

    if (walletError) {
      console.log('  Note: No wallet to delete (OK)');
    } else {
      console.log('✓ Deleted wallet');
    }

    // Delete user from users table
    const { error: userError } = await supabase
      .from('users')
      .delete()
      .eq('email', email);

    if (userError) {
      console.error('❌ Error deleting user:', userError.message);
      return;
    }

    console.log('✓ Deleted user from database');

    console.log('\n✅ User account reset complete!');
    console.log('='.repeat(80));
    console.log('\nNow you can sign up fresh at:');
    console.log('http://localhost:3000/signup');
    console.log('\nOr use the thank you page password setup:');
    console.log('http://localhost:3000/thank-you?order_id=16442383499633&email=asonawane%40getmeatzy.com&name=Amit+Sonawane');
    console.log('\n='.repeat(80));

  } catch (error) {
    console.error('Error:', error.message);
  }
}

resetUser();

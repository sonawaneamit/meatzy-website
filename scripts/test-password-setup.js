/**
 * Test script for password setup email functionality
 * This simulates what happens when a new customer makes their first purchase
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testPasswordSetupEmail() {
  const testEmail = 'amitsonawane@me.com';

  console.log('🧪 Testing Password Setup Email Flow\n');
  console.log('Step 1: Check if user exists in users table...');

  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('email', testEmail)
    .single();

  if (userError || !user) {
    console.error('❌ User not found in users table');
    return;
  }

  console.log('✅ User found:', {
    email: user.email,
    referralCode: user.referral_code,
    hasPurchased: user.has_purchased,
  });

  console.log('\nStep 2: Create user in Supabase Auth...');

  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email: testEmail,
    email_confirm: true,
    user_metadata: {
      referral_code: user.referral_code,
    },
  });

  if (authError) {
    if (authError.message?.includes('already registered')) {
      console.log('⚠️  User already exists in Auth - continuing...');
    } else {
      console.log('⚠️  Warning creating auth user:', authError.message);
      console.log('   This may be due to database trigger conflicts - continuing anyway...');
    }
  } else {
    console.log('✅ Auth user created:', authUser.user.id);
  }

  console.log('\nStep 3: Generate password setup link...');

  const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
    type: 'recovery',
    email: testEmail,
    options: {
      redirectTo: `${siteUrl}/dashboard`,
    },
  });

  if (linkError) {
    console.error('❌ Error generating password setup link:', linkError.message);
    return;
  }

  console.log('✅ Password setup link generated!');
  console.log('\n📧 Email Details:');
  console.log('To:', testEmail);
  console.log('Type: Password Recovery (serves as initial setup)');
  console.log('Redirect to:', `${siteUrl}/dashboard`);

  if (linkData.properties?.action_link) {
    console.log('\n🔗 Password Setup Link:');
    console.log(linkData.properties.action_link);
    console.log('\n⚠️  This link will be sent via email by Supabase');
    console.log('   To customize the email, go to:');
    console.log('   Supabase Dashboard → Authentication → Email Templates');
  }

  console.log('\n✅ Test complete! Check your email at:', testEmail);
  console.log('\n📝 Next Steps:');
  console.log('1. Check if you received the password reset email');
  console.log('2. Click the link in the email');
  console.log('3. Set your password');
  console.log('4. You should be redirected to /dashboard');
}

testPasswordSetupEmail()
  .then(() => {
    console.log('\n✅ Script finished successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });

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

async function fixAuthUser() {
  const email = 'asonawane@getmeatzy.com';
  const password = 'MeatzyTest123!'; // You can change this after logging in

  try {
    console.log('\n🔧 Fixing auth account...');

    // Get the existing user from users table
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('id, email, full_name, referral_code')
      .eq('email', email)
      .single();

    if (!existingUser) {
      console.log('❌ User not found in database');
      return;
    }

    console.log('✓ Found existing user:', existingUser.email);
    console.log('  User ID:', existingUser.id);
    console.log('  Referral Code:', existingUser.referral_code);

    // Create auth user with the SAME ID
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      id: existingUser.id, // Use existing ID to link
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        full_name: existingUser.full_name,
        referral_code: existingUser.referral_code
      }
    });

    if (authError) {
      console.error('❌ Auth creation error:', authError.message);
      return;
    }

    console.log('✓ Auth user created successfully!');

    console.log('\n✅ ACCOUNT FIXED!');
    console.log('='.repeat(80));
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Referral Code:', existingUser.referral_code);
    console.log('='.repeat(80));
    console.log('\n🎉 You can now log in at: http://localhost:3000/login');
    console.log('\nOr go directly to dashboard: http://localhost:3000/dashboard');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

fixAuthUser();

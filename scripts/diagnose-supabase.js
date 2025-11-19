/**
 * Diagnostic script to check Supabase Auth and Users table
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function diagnose() {
  const testEmail = 'amitsonawane@me.com';

  console.log('🔍 Supabase Diagnostic Tool\n');
  console.log('=' .repeat(60));

  // Check 1: User in public.users table
  console.log('\n1️⃣  Checking public.users table...');
  const { data: publicUser, error: publicError } = await supabase
    .from('users')
    .select('id, email, referral_code, has_purchased, created_at')
    .eq('email', testEmail)
    .single();

  if (publicError) {
    console.log('❌ Error:', publicError.message);
  } else if (publicUser) {
    console.log('✅ User found in public.users:');
    console.log('   ID:', publicUser.id);
    console.log('   Email:', publicUser.email);
    console.log('   Referral Code:', publicUser.referral_code);
    console.log('   Has Purchased:', publicUser.has_purchased);
    console.log('   Created:', publicUser.created_at);
  } else {
    console.log('⚠️  User not found in public.users');
  }

  // Check 2: User in auth.users
  console.log('\n2️⃣  Checking auth.users...');
  const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000, // Get all users
  });

  if (authError) {
    console.log('❌ Error listing auth users:', authError.message);
  } else {
    const authUser = authUsers.users.find(u => u.email === testEmail);
    if (authUser) {
      console.log('✅ User found in auth.users:');
      console.log('   ID:', authUser.id);
      console.log('   Email:', authUser.email);
      console.log('   Email Confirmed:', authUser.email_confirmed_at ? 'Yes' : 'No');
      console.log('   Created:', authUser.created_at);
      console.log('   Last Sign In:', authUser.last_sign_in_at || 'Never');
    } else {
      console.log('❌ User NOT found in auth.users');
      console.log('   This is the problem! Auth user must exist to send password reset.');
    }

    console.log(`\n   Total auth users in system: ${authUsers.users.length}`);
  }

  // Check 3: ID mismatch
  if (publicUser && authUsers?.users) {
    const authUser = authUsers.users.find(u => u.email === testEmail);
    if (authUser && publicUser.id !== authUser.id) {
      console.log('\n⚠️  WARNING: ID Mismatch!');
      console.log('   public.users ID:', publicUser.id);
      console.log('   auth.users ID:', authUser.id);
      console.log('   These should be the same for proper integration!');
    }
  }

  // Check 4: Try to manually create auth user
  console.log('\n3️⃣  Attempting to create auth user...');
  const { data: newAuthUser, error: createError } = await supabase.auth.admin.createUser({
    email: testEmail,
    email_confirm: true,
    user_metadata: {
      referral_code: publicUser?.referral_code,
    },
  });

  if (createError) {
    console.log('❌ Error creating auth user:', createError.message);

    if (createError.message.includes('already registered')) {
      console.log('   → User already exists in auth.users');
    } else if (createError.message.includes('Database error')) {
      console.log('   → Database trigger issue! Check your Supabase SQL logs');
      console.log('   → Likely cause: Trigger trying to insert duplicate row in public.users');
    }
  } else {
    console.log('✅ Auth user created successfully!');
    console.log('   ID:', newAuthUser.user.id);
  }

  // Check 5: Database triggers
  console.log('\n4️⃣  Recommendations:');
  console.log('\nIf auth user creation failed with "Database error":');
  console.log('1. Go to Supabase Dashboard → SQL Editor');
  console.log('2. Check for triggers on auth.users:');
  console.log('   SELECT * FROM information_schema.triggers');
  console.log('   WHERE event_object_table = \'users\';');
  console.log('\n3. The trigger should use ON CONFLICT to handle duplicates:');
  console.log('   INSERT INTO public.users (id, email, ...)');
  console.log('   VALUES (NEW.id, NEW.email, ...)');
  console.log('   ON CONFLICT (email) DO UPDATE SET id = NEW.id;');

  console.log('\n' + '=' .repeat(60));
  console.log('\n✅ Diagnostic complete!\n');
}

diagnose()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('\n❌ Diagnostic failed:', error);
    process.exit(1);
  });

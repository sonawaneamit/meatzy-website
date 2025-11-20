const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkAndDeleteAuthUser() {
  const email = 'asonawane@getmeatzy.com';

  try {
    console.log('\n🔍 Checking for existing auth user...\n');

    // List all auth users to find this email
    const { data: { users }, error } = await supabase.auth.admin.listUsers();

    if (error) {
      console.error('❌ Error listing users:', error.message);
      return;
    }

    const existingUser = users.find(u => u.email?.toLowerCase() === email.toLowerCase());

    if (existingUser) {
      console.log('✓ Found existing auth user:');
      console.log('  ID:', existingUser.id);
      console.log('  Email:', existingUser.email);
      console.log('  Created:', existingUser.created_at);

      // Delete the auth user
      const { error: deleteError } = await supabase.auth.admin.deleteUser(existingUser.id);

      if (deleteError) {
        console.error('❌ Error deleting auth user:', deleteError.message);
        return;
      }

      console.log('\n✓ Deleted auth user!');
    } else {
      console.log('No auth user found for', email);
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkAndDeleteAuthUser();

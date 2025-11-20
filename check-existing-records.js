const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkRecords() {
  const email = 'asonawane@getmeatzy.com';

  try {
    console.log('\n🔍 Checking for existing records...\n');

    // Check users table
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase());

    if (usersError) {
      console.error('Error checking users:', usersError.message);
    } else if (users && users.length > 0) {
      console.log('✓ Found users records:', users.length);
      users.forEach(u => {
        console.log('  - ID:', u.id);
        console.log('    Email:', u.email);
        console.log('    Referral Code:', u.referral_code);
      });
    } else {
      console.log('No users records found');
    }

    // Check auth users
    const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      console.error('Error checking auth users:', authError.message);
    } else {
      const existing = authUsers.find(u => u.email?.toLowerCase() === email.toLowerCase());
      if (existing) {
        console.log('\n✓ Found auth user:');
        console.log('  - ID:', existing.id);
        console.log('    Email:', existing.email);
      } else {
        console.log('\nNo auth user found');
      }
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkRecords();

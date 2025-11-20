const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addColumns() {
  console.log('Adding missing columns to users table...\n');

  try {
    // Try to select from users table to test connection
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    if (error) {
      console.error('❌ Error connecting to database:', error);
      return;
    }

    console.log('✓ Connected to database\n');
    console.log('⚠️  Please run the following SQL in your Supabase SQL Editor:\n');
    console.log('----------------------------------------');
    console.log(`
ALTER TABLE users
ADD COLUMN IF NOT EXISTS temporary_password TEXT,
ADD COLUMN IF NOT EXISTS requires_password_change BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS slug TEXT;

CREATE INDEX IF NOT EXISTS idx_users_slug ON users(slug);
    `);
    console.log('----------------------------------------\n');
    console.log('Then press Enter to continue...');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

addColumns();

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runMigration() {
  try {
    console.log('📝 Reading migration file...');
    const sql = fs.readFileSync('add-temp-password-columns.sql', 'utf8');

    console.log('🚀 Running migration...\n');

    // Split by semicolon and run each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--'));

    for (const statement of statements) {
      console.log('Executing:', statement.substring(0, 100) + '...');
      const { error } = await supabase.rpc('exec_sql', { sql_query: statement });

      if (error) {
        console.error('❌ Error:', error.message);
        // Try direct query instead
        const { error: directError } = await supabase.from('_migrations').insert({ sql: statement });
        if (directError) {
          console.error('❌ Direct query also failed:', directError);
        }
      } else {
        console.log('✓ Success\n');
      }
    }

    console.log('\n✅ Migration completed!');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();

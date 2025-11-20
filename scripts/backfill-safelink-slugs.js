/**
 * Backfill slugs for existing users
 * Run this once to populate SafeLink slugs for all existing users
 *
 * Usage:
 * NEXT_PUBLIC_SUPABASE_URL=xxx SUPABASE_SERVICE_ROLE_KEY=yyy node scripts/backfill-safelink-slugs.js
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Generate a unique human-readable slug
 */
async function generateUniqueSlug(name, userId) {
  // Create base from first name
  const base = name
    .toLowerCase()
    .split(' ')[0]
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 15);

  const cleanBase = base || 'user';

  // Create 4-char suffix from userId
  const suffix = userId.slice(0, 4);

  let slug = `${cleanBase}-${suffix}`;

  // Check for collision and regenerate if needed
  for (let attempts = 0; attempts < 10; attempts++) {
    const { data } = await supabase
      .from('users')
      .select('id')
      .eq('slug', slug)
      .single();

    if (!data) {
      return slug;
    }

    // On collision, add random chars
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    slug = `${cleanBase}-${randomSuffix}`;
  }

  throw new Error('Failed to generate unique slug');
}

async function backfillSlugs() {
  console.log('🔄 Starting SafeLink slug backfill...\\n');

  try {
    // Get all users without slugs
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, full_name, slug, referral_code')
      .is('slug', null);

    if (error) {
      console.error('❌ Error fetching users:', error.message);
      process.exit(1);
    }

    if (!users || users.length === 0) {
      console.log('✅ No users found without slugs');
      return;
    }

    console.log(`Found ${users.length} users without slugs\\n`);

    let updated = 0;
    let failed = 0;

    // Update each user with a slug
    for (const user of users) {
      const nameForSlug = user.full_name || user.email.split('@')[0] || 'user';

      try {
        const slug = await generateUniqueSlug(nameForSlug, user.id);

        const { error: updateError } = await supabase
          .from('users')
          .update({ slug })
          .eq('id', user.id);

        if (updateError) {
          console.error(`❌ Failed to update ${user.email}:`, updateError.message);
          failed++;
        } else {
          const safeLink = `https://getmeatzy.com/go/${slug}`;
          console.log(`✅ ${user.email} → ${safeLink}`);
          updated++;
        }
      } catch (error) {
        console.error(`❌ Failed to generate slug for ${user.email}:`, error.message);
        failed++;
      }
    }

    console.log('\\n' + '='.repeat(60));
    console.log(`\\n✨ Backfill complete!`);
    console.log(`   Updated: ${updated} users`);
    console.log(`   Failed: ${failed} users`);
    console.log(`   Total: ${users.length} users\\n`);

    console.log('📋 Next steps:');
    console.log('1. Run the SQL migration to add slug/discount columns (if not done):');
    console.log('   → docs/SUPABASE-ADD-SAFELINK-COLUMNS.sql');
    console.log('2. Test a SafeLink (use one from above):');
    console.log('   → https://getmeatzy.com/go/[slug]');
    console.log('3. Verify discount codes are created automatically\\n');

  } catch (error) {
    console.error('\\n❌ Unexpected error:', error);
    process.exit(1);
  }
}

backfillSlugs()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('\\n❌ Script failed:', error);
    process.exit(1);
  });

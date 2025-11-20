/**
 * Backfill referral_link for existing users
 * Run this once to populate referral links for all existing users
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

// Get the site URL from env or use default
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://getmeatzy.com';

async function backfillReferralLinks() {
  console.log('🔄 Starting referral link backfill...\n');
  console.log(`Using site URL: ${siteUrl}\n`);

  try {
    // Get all users with referral codes but no referral link
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, referral_code, referral_link')
      .not('referral_code', 'is', null);

    if (error) {
      console.error('❌ Error fetching users:', error.message);
      process.exit(1);
    }

    if (!users || users.length === 0) {
      console.log('✅ No users found with referral codes');
      return;
    }

    console.log(`Found ${users.length} users with referral codes\n`);

    let updated = 0;
    let alreadySet = 0;

    // Update each user with their referral link
    for (const user of users) {
      if (user.referral_link) {
        console.log(`⏭️  Skipping ${user.email} - already has link: ${user.referral_link}`);
        alreadySet++;
        continue;
      }

      const referralLink = `${siteUrl}?ref=${user.referral_code.toUpperCase()}`;

      const { error: updateError } = await supabase
        .from('users')
        .update({ referral_link: referralLink })
        .eq('id', user.id);

      if (updateError) {
        console.error(`❌ Failed to update ${user.email}:`, updateError.message);
      } else {
        console.log(`✅ Updated ${user.email} → ${referralLink}`);
        updated++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`\n✨ Backfill complete!`);
    console.log(`   Updated: ${updated} users`);
    console.log(`   Already set: ${alreadySet} users`);
    console.log(`   Total: ${users.length} users\n`);

  } catch (error) {
    console.error('\n❌ Unexpected error:', error);
    process.exit(1);
  }
}

backfillReferralLinks()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });

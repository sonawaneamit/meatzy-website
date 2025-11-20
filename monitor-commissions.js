const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// User to monitor (Lucas Martinez)
const REFERRER_EMAIL = 'lucas.martinez.13.97113c@example.com';

async function monitorDashboard() {
  console.clear();
  console.log('=== MONITORING LUCAS MARTINEZ DASHBOARD ===');
  console.log('Refreshing every 3 seconds...');
  console.log('Press Ctrl+C to stop\n');

  // Get user
  const { data: user } = await supabase
    .from('users')
    .select('id, full_name, email, referral_code, slug')
    .eq('email', REFERRER_EMAIL)
    .single();

  if (!user) {
    console.error('User not found!');
    return;
  }

  console.log('👤 REFERRER:', user.full_name);
  console.log('📧 Email:', user.email);
  console.log('🔗 SafeLink: https://meatzy-website.vercel.app/go/' + user.slug);
  console.log('─'.repeat(60));

  // Get wallet balance
  const { data: wallet } = await supabase
    .from('wallet')
    .select('*')
    .eq('user_id', user.id)
    .single();

  console.log('\n💰 WALLET BALANCE:');
  console.log('   Pending:   $' + (wallet?.pending_balance || 0).toFixed(2));
  console.log('   Available: $' + (wallet?.available_balance || 0).toFixed(2));
  console.log('   Lifetime:  $' + (wallet?.lifetime_earnings || 0).toFixed(2));

  // Get commissions
  const { data: commissions } = await supabase
    .from('commissions')
    .select(`
      *,
      referred_user:referred_user_id (
        email,
        full_name
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  console.log('\n📊 COMMISSIONS (' + (commissions?.length || 0) + ' total):');
  if (commissions && commissions.length > 0) {
    commissions.forEach((comm, idx) => {
      const refUser = comm.referred_user;
      console.log(`\n   ${idx + 1}. Order: ${comm.order_id}`);
      console.log(`      Customer: ${refUser?.full_name || refUser?.email || 'Unknown'}`);
      console.log(`      Amount: $${comm.commission_amount.toFixed(2)}`);
      console.log(`      Status: ${comm.status}`);
      console.log(`      Date: ${new Date(comm.created_at).toLocaleString()}`);
    });
  } else {
    console.log('   No commissions yet. Waiting for orders...');
  }

  // Get direct referrals
  const { data: referrals } = await supabase
    .from('user_tree')
    .select(`
      user_id,
      users:user_id (
        id,
        email,
        full_name,
        has_purchased,
        created_at
      )
    `)
    .eq('ancestor_id', user.id)
    .eq('level', 1);

  console.log('\n👥 DIRECT REFERRALS (' + (referrals?.length || 0) + ' total):');
  if (referrals && referrals.length > 0) {
    referrals.forEach((ref, idx) => {
      const refUser = ref.users;
      console.log(`\n   ${idx + 1}. ${refUser.full_name || refUser.email}`);
      console.log(`      Email: ${refUser.email}`);
      console.log(`      Purchased: ${refUser.has_purchased ? '✓ Yes' : '✗ No'}`);
      console.log(`      Joined: ${new Date(refUser.created_at).toLocaleString()}`);
    });
  } else {
    console.log('   No referrals yet. Share the link above!');
  }

  console.log('\n' + '─'.repeat(60));
  console.log('Last updated:', new Date().toLocaleString());
}

// Monitor every 3 seconds
setInterval(monitorDashboard, 3000);
monitorDashboard(); // Run immediately

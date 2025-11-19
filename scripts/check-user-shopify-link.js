// Script to check if user has Shopify customer ID linked

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkUser() {
  const email = 'amitvsonawane@gmail.com';

  console.log(`\n🔍 Checking user: ${email}\n`);

  // Get user from Supabase
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    console.error('❌ Error fetching user:', error);
    return;
  }

  console.log('📊 User Data:');
  console.log('─────────────────────────────────────');
  console.log(`ID: ${user.id}`);
  console.log(`Email: ${user.email}`);
  console.log(`Full Name: ${user.full_name}`);
  console.log(`Referral Code: ${user.referral_code}`);
  console.log(`Has Purchased: ${user.has_purchased}`);
  console.log(`Shopify Customer ID: ${user.shopify_customer_id || '❌ NOT SET'}`);
  console.log(`Is Admin: ${user.is_admin}`);
  console.log('─────────────────────────────────────\n');

  if (!user.shopify_customer_id) {
    console.log('⚠️  User does NOT have shopify_customer_id set!');
    console.log('This means orders will try to load by email instead.\n');
  } else {
    console.log('✅ User has Shopify customer ID linked.\n');
  }

  // Check for orders in the test order webhook
  console.log('📦 From your Shopify order link, I can see:');
  console.log('Order ID: 16421713281393');
  console.log('Store: meatzystore.myshopify.com\n');

  console.log('💡 Next Steps:');
  console.log('1. Make sure SHOPIFY_STORE_DOMAIN and SHOPIFY_ADMIN_ACCESS_TOKEN are set in Vercel');
  console.log('2. Check browser console for API errors when loading /account');
  console.log('3. If you want to link this user to Shopify customer, update shopify_customer_id field\n');
}

checkUser().catch(console.error);

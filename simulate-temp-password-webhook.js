const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function simulateWebhook() {
  const email = 'asonawane@getmeatzy.com';
  const shopifyCustomerId = '26474061889905';
  const shopifyOrderId = '16442383499633';
  const fullName = 'Amit Sonawane';
  const orderTotal = 99.99;

  try {
    console.log('\n🔄 Simulating Shopify webhook with TEMPORARY PASSWORD...\\n');

    // Step 1: Clean up any existing data
    console.log('🧹 Cleaning up existing data...');

    // Delete from users table
    const { data: existingUsers } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase());

    if (existingUsers && existingUsers.length > 0) {
      for (const user of existingUsers) {
        // Delete wallet first (foreign key constraint)
        await supabase.from('wallet').delete().eq('user_id', user.id);

        // Delete commissions
        await supabase.from('commissions').delete().eq('user_id', user.id);

        // Delete user
        await supabase.from('users').delete().eq('id', user.id);
      }
    }

    // Delete from auth.users
    const { data: { users: authUsers } } = await supabase.auth.admin.listUsers();
    const existingAuthUser = authUsers.find(u => u.email?.toLowerCase() === email.toLowerCase());

    if (existingAuthUser) {
      await supabase.auth.admin.deleteUser(existingAuthUser.id);
    }

    console.log('✓ Cleanup complete\\n');

    // Step 2: Call the webhook
    console.log('📞 Calling webhook...');

    const webhookData = {
      id: shopifyOrderId,
      order_number: 1001,
      total_price: orderTotal.toString(),
      customer: {
        id: shopifyCustomerId,
        email: email,
        first_name: 'Amit',
        last_name: 'Sonawane',
      },
    };

    const response = await fetch('http://localhost:3000/api/webhooks/shopify/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ Webhook failed:', result.error);
      return;
    }

    console.log('✓ Webhook successful\\n');
    console.log('Result:', JSON.stringify(result, null, 2));

    console.log('\\n' + '='.repeat(80));
    console.log('✅ ACCOUNT CREATED SUCCESSFULLY!');
    console.log('='.repeat(80));
    console.log('\\nLogin Credentials:');
    console.log('  Email:', email);
    console.log('  Temporary Password:', result.temporaryPassword);
    console.log('  Referral Code:', result.referralCode);
    console.log('\\n' + '='.repeat(80));
    console.log('\\n🎉 NOW TEST THE LOGIN:\\n');
    console.log('1. Go to: http://localhost:3000/login');
    console.log('2. Email:', email);
    console.log('3. Password:', result.temporaryPassword);
    console.log('4. After login, you should be prompted to change your password');
    console.log('5. Then you\'ll see your dashboard with orders and referral features!');
    console.log('\\n' + '='.repeat(80));
    console.log('\\n✅ OR CHECK THANK YOU PAGE:\\n');
    console.log('Go to: http://localhost:3000/thank-you?order_id=' + shopifyOrderId + '&email=' + encodeURIComponent(email) + '&name=' + encodeURIComponent(fullName));
    console.log('\\nThis page should show the temporary password and referral link!\\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

simulateWebhook();

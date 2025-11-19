// Test script to fetch ALL orders from Shopify and filter by email

require('dotenv').config({ path: '.env.local' });

const email = 'amitvsonawane@gmail.com';
const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN;
const shopifyAccessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

if (!shopifyDomain || !shopifyAccessToken) {
  console.error('❌ Missing Shopify credentials');
  process.exit(1);
}

async function testAllOrders() {
  console.log('\n🔍 Fetching ALL orders from Shopify\n');

  try {
    // Fetch all orders
    console.log('Fetching orders...');
    const ordersResponse = await fetch(
      `https://${shopifyDomain}/admin/api/2024-01/orders.json?status=any&limit=50`,
      {
        headers: {
          'X-Shopify-Access-Token': shopifyAccessToken,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!ordersResponse.ok) {
      const errorText = await ordersResponse.text();
      console.error('❌ Orders fetch failed:', ordersResponse.status);
      console.error('Error:', errorText);
      return;
    }

    const ordersData = await ordersResponse.json();
    const allOrders = ordersData.orders || [];

    console.log(`✅ Found ${allOrders.length} total order(s)\n`);

    // Filter orders by email
    const userOrders = allOrders.filter(order =>
      order.email && order.email.toLowerCase() === email.toLowerCase()
    );

    console.log(`📦 Orders for ${email}: ${userOrders.length}\n`);

    if (userOrders.length === 0) {
      console.log('⚠️  No orders found for this email.');
      console.log('\nAll emails in orders:');
      allOrders.forEach((order, idx) => {
        console.log(`   ${idx + 1}. ${order.email || 'No email'} - Order #${order.name}`);
      });
      return;
    }

    // Display orders
    console.log('─────────────────────────────────────────────────────────');
    userOrders.forEach((order, idx) => {
      console.log(`\nOrder ${idx + 1}:`);
      console.log(`   Order #: ${order.name}`);
      console.log(`   Order ID: ${order.id}`);
      console.log(`   Date: ${new Date(order.created_at).toLocaleDateString()}`);
      console.log(`   Total: $${order.total_price}`);
      console.log(`   Financial Status: ${order.financial_status}`);
      console.log(`   Fulfillment Status: ${order.fulfillment_status || 'unfulfilled'}`);
      console.log(`   Customer Email: ${order.email}`);
      console.log(`   Items:`);
      order.line_items.forEach((item) => {
        console.log(`      - ${item.quantity}x ${item.title} ($${item.price})`);
      });
    });
    console.log('\n─────────────────────────────────────────────────────────\n');

    console.log('✅ Successfully fetched orders!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAllOrders();

// Test script to fetch orders from Shopify

require('dotenv').config({ path: '.env.local' });

const email = 'amitvsonawane@gmail.com';
const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN;
const shopifyAccessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

if (!shopifyDomain || !shopifyAccessToken) {
  console.error('❌ Missing Shopify credentials');
  console.log('SHOPIFY_STORE_DOMAIN:', shopifyDomain);
  console.log('SHOPIFY_ADMIN_ACCESS_TOKEN:', shopifyAccessToken ? '✅ Set' : '❌ Not set');
  process.exit(1);
}

async function testShopifyAPI() {
  console.log('\n🔍 Testing Shopify API Connection\n');
  console.log(`Store: ${shopifyDomain}`);
  console.log(`Looking for orders from: ${email}\n`);

  try {
    // Search for customer by email
    console.log('Step 1: Searching for customer...');
    const customerResponse = await fetch(
      `https://${shopifyDomain}/admin/api/2024-01/customers/search.json?query=email:${encodeURIComponent(email)}`,
      {
        headers: {
          'X-Shopify-Access-Token': shopifyAccessToken,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!customerResponse.ok) {
      const errorText = await customerResponse.text();
      console.error('❌ Customer search failed:', customerResponse.status);
      console.error('Error:', errorText);
      return;
    }

    const customerData = await customerResponse.json();
    const customers = customerData.customers || [];

    console.log(`✅ Found ${customers.length} customer(s)\n`);

    if (customers.length === 0) {
      console.log('⚠️  No customer found with that email.');
      console.log('Make sure you placed test orders with this email in Shopify.\n');
      return;
    }

    const customer = customers[0];
    console.log('📋 Customer Details:');
    console.log(`   ID: ${customer.id}`);
    console.log(`   Email: ${customer.email}`);
    console.log(`   Name: ${customer.first_name} ${customer.last_name}`);
    console.log(`   Total Orders: ${customer.orders_count || 0}\n`);

    // Fetch orders for this customer
    console.log('Step 2: Fetching orders...');
    const ordersResponse = await fetch(
      `https://${shopifyDomain}/admin/api/2024-01/customers/${customer.id}/orders.json`,
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
    const orders = ordersData.orders || [];

    console.log(`✅ Found ${orders.length} order(s)\n`);

    if (orders.length === 0) {
      console.log('⚠️  No orders found for this customer.\n');
      return;
    }

    // Display orders
    console.log('📦 Orders:');
    console.log('─────────────────────────────────────────────────────────');
    orders.forEach((order, idx) => {
      console.log(`\nOrder ${idx + 1}:`);
      console.log(`   Order #: ${order.name}`);
      console.log(`   Order ID: ${order.id}`);
      console.log(`   Date: ${new Date(order.created_at).toLocaleDateString()}`);
      console.log(`   Total: $${order.total_price}`);
      console.log(`   Status: ${order.financial_status}`);
      console.log(`   Fulfillment: ${order.fulfillment_status || 'unfulfilled'}`);
      console.log(`   Items: ${order.line_items.length}`);
      order.line_items.forEach((item) => {
        console.log(`      - ${item.quantity}x ${item.title} ($${item.price})`);
      });
    });
    console.log('\n─────────────────────────────────────────────────────────\n');

    console.log('✅ Shopify API is working correctly!');
    console.log('\n💡 Next step: Update Vercel environment variables with these credentials.\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testShopifyAPI();

async function getOrder() {
  const email = 'asonawane@getmeatzy.com';

  try {
    const response = await fetch(`http://localhost:3000/api/shopify/orders-by-email?email=${encodeURIComponent(email)}`);

    if (response.ok) {
      const data = await response.json();

      if (data.orders && data.orders.length > 0) {
        const latestOrder = data.orders[0];
        console.log('\n✅ Found your order!');
        console.log('='.repeat(80));
        console.log('Order Number:', latestOrder.name);
        console.log('Order ID:', latestOrder.id);
        console.log('Total:', '$' + latestOrder.total_price);
        console.log('Status:', latestOrder.financial_status);
        console.log('='.repeat(80));

        // Construct thank you page URL
        const thankYouUrl = `http://localhost:3000/thank-you?order_id=${latestOrder.id}&email=${encodeURIComponent(email)}&name=Amit+Sonawane`;

        console.log('\n🎉 Your Custom Thank You Page URL:');
        console.log('─'.repeat(80));
        console.log(thankYouUrl);
        console.log('─'.repeat(80));
        console.log('\nCopy and paste this URL into your browser!');
      } else {
        console.log('\n❌ No orders found for', email);
        console.log('Please check if the order was placed successfully in Shopify.');
      }
    } else {
      console.log('Error fetching orders:', response.status);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

getOrder();

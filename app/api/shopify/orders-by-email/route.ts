import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN;
    const shopifyAccessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

    if (!shopifyDomain || !shopifyAccessToken) {
      console.error('Missing Shopify credentials');
      return NextResponse.json({ orders: [] });
    }

    // Fetch all orders (Shopify's customer orders endpoint sometimes returns empty results)
    // So we fetch all orders and filter by email instead
    const ordersResponse = await fetch(
      `https://${shopifyDomain}/admin/api/2024-01/orders.json?status=any&limit=250`,
      {
        headers: {
          'X-Shopify-Access-Token': shopifyAccessToken,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!ordersResponse.ok) {
      console.error('Shopify orders fetch failed:', await ordersResponse.text());
      return NextResponse.json({ orders: [] });
    }

    const ordersData = await ordersResponse.json();
    const allOrders = ordersData.orders || [];

    // Filter orders by email
    const userOrders = allOrders.filter(order =>
      order.email && order.email.toLowerCase() === email.toLowerCase()
    );

    // Get customer info from first order if available
    let customer = null;
    if (userOrders.length > 0 && userOrders[0].customer) {
      customer = {
        id: userOrders[0].customer.id,
        email: userOrders[0].customer.email,
        first_name: userOrders[0].customer.first_name,
        last_name: userOrders[0].customer.last_name,
      };
    }

    return NextResponse.json({
      orders: userOrders,
      customer
    });

  } catch (error) {
    console.error('Error fetching orders by email:', error);
    return NextResponse.json({ orders: [] });
  }
}

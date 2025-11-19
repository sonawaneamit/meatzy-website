import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ customerId: string }> }
) {
  try {
    const { customerId } = await params;

    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
    }

    const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN;
    const shopifyAccessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

    if (!shopifyDomain || !shopifyAccessToken) {
      console.error('Missing Shopify credentials');
      return NextResponse.json({ orders: [] });
    }

    // Fetch all orders and filter by customer ID
    // (The /customers/{id}/orders endpoint sometimes returns empty results)
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

    // Filter orders by customer ID
    const customerOrders = allOrders.filter(order =>
      order.customer && order.customer.id.toString() === customerId.toString()
    );

    return NextResponse.json({
      orders: customerOrders
    });

  } catch (error) {
    console.error('Error fetching customer orders:', error);
    return NextResponse.json({ orders: [] });
  }
}

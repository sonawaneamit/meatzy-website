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

    // Fetch orders for this customer
    const ordersResponse = await fetch(
      `https://${shopifyDomain}/admin/api/2024-01/customers/${customerId}/orders.json`,
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

    return NextResponse.json({
      orders: ordersData.orders || []
    });

  } catch (error) {
    console.error('Error fetching customer orders:', error);
    return NextResponse.json({ orders: [] });
  }
}

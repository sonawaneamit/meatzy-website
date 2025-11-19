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

    // Search for customer by email
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
      console.error('Shopify customer search failed:', await customerResponse.text());
      return NextResponse.json({ orders: [] });
    }

    const customerData = await customerResponse.json();
    const customers = customerData.customers || [];

    if (customers.length === 0) {
      return NextResponse.json({ orders: [] });
    }

    const customer = customers[0];

    // Fetch orders for this customer
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
      console.error('Shopify orders fetch failed:', await ordersResponse.text());
      return NextResponse.json({ orders: [] });
    }

    const ordersData = await ordersResponse.json();

    return NextResponse.json({
      orders: ordersData.orders || [],
      customer: {
        id: customer.id,
        email: customer.email,
        first_name: customer.first_name,
        last_name: customer.last_name,
      }
    });

  } catch (error) {
    console.error('Error fetching orders by email:', error);
    return NextResponse.json({ orders: [] });
  }
}

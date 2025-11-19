import { NextRequest, NextResponse } from 'next/server';

const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN;
const shopifyAdminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

/**
 * API endpoint to fetch Shopify order details
 * GET /api/shopify/order?order_id=123
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get('order_id');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    if (!shopifyDomain || !shopifyAdminToken) {
      console.error('Missing Shopify credentials');
      return NextResponse.json(
        { error: 'Shopify configuration missing' },
        { status: 500 }
      );
    }

    let order = null;

    // Try fetching by order number first (e.g., 1169)
    // Use the orders.json endpoint with name filter
    let response = await fetch(
      `https://${shopifyDomain}/admin/api/2024-01/orders.json?name=${orderId}`,
      {
        headers: {
          'X-Shopify-Access-Token': shopifyAdminToken,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (data.orders && data.orders.length > 0) {
        order = data.orders[0];
      }
    }

    // If not found by name, try by ID directly
    if (!order) {
      response = await fetch(
        `https://${shopifyDomain}/admin/api/2024-01/orders/${orderId}.json`,
        {
          headers: {
            'X-Shopify-Access-Token': shopifyAdminToken,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        order = data.order;
      }
    }

    if (!response.ok && !order) {
      console.error('Shopify API error:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Failed to fetch order from Shopify' },
        { status: response.status }
      );
    }

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Extract relevant order information
    const orderDetails = {
      id: order.id,
      orderNumber: order.order_number,
      name: order.name,
      email: order.email,
      createdAt: order.created_at,
      totalPrice: order.total_price,
      subtotalPrice: order.subtotal_price,
      totalTax: order.total_tax,
      totalShippingPrice: order.total_shipping_price_set?.shop_money?.amount || '0.00',
      currency: order.currency,
      financialStatus: order.financial_status,
      fulfillmentStatus: order.fulfillment_status,
      customer: {
        firstName: order.customer?.first_name,
        lastName: order.customer?.last_name,
        email: order.customer?.email,
      },
      shippingAddress: order.shipping_address ? {
        name: order.shipping_address.name,
        address1: order.shipping_address.address1,
        address2: order.shipping_address.address2,
        city: order.shipping_address.city,
        province: order.shipping_address.province,
        zip: order.shipping_address.zip,
        country: order.shipping_address.country,
      } : null,
      lineItems: order.line_items?.map((item: any) => ({
        id: item.id,
        title: item.title,
        variantTitle: item.variant_title,
        quantity: item.quantity,
        price: item.price,
        totalDiscount: item.total_discount,
        image: item.image?.src || item.product?.image?.src,
        sku: item.sku,
      })) || [],
    };

    return NextResponse.json(orderDetails);

  } catch (error) {
    console.error('Error fetching Shopify order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

/**
 * Shopify Order Fulfilled Webhook
 * Auto-approves commissions when an order is fulfilled
 *
 * Configure in Shopify Admin:
 * Settings → Notifications → Webhooks → Create webhook
 * Event: Order fulfillment
 * Format: JSON
 * URL: https://your-domain.com/api/webhooks/shopify/order-fulfilled
 */
export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get raw body for HMAC verification
    const rawBody = await request.text();

    // Verify webhook signature
    if (!verifyShopifyWebhook(request, rawBody)) {
      console.error('Invalid Shopify webhook signature');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = JSON.parse(rawBody);

    console.log('Received Shopify order fulfilled webhook:', {
      orderId: body.id,
      orderNumber: body.order_number,
      fulfillmentStatus: body.fulfillment_status,
    });

    const orderId = body.id.toString();

    // Find all pending commissions for this order
    const { data: commissions, error: fetchError } = await supabaseAdmin
      .from('commissions')
      .select('id, user_id, commission_amount, status')
      .eq('order_id', orderId)
      .eq('status', 'pending');

    if (fetchError) {
      console.error('Error fetching commissions:', fetchError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!commissions || commissions.length === 0) {
      console.log('No pending commissions found for order:', orderId);
      return NextResponse.json({
        success: true,
        message: 'No pending commissions to approve'
      });
    }

    console.log(`Found ${commissions.length} pending commission(s) to approve`);

    // Approve each commission and move from pending → available
    for (const commission of commissions) {
      // 1. Update commission status to approved
      const { error: updateError } = await supabaseAdmin
        .from('commissions')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString()
        })
        .eq('id', commission.id);

      if (updateError) {
        console.error(`Error approving commission ${commission.id}:`, updateError);
        continue;
      }

      // 2. Move amount from pending_balance → available_balance
      const { error: walletError } = await supabaseAdmin.rpc('approve_commission', {
        p_user_id: commission.user_id,
        p_amount: commission.commission_amount,
      });

      if (walletError) {
        console.error(`Error updating wallet for commission ${commission.id}:`, walletError);
        continue;
      }

      console.log(`✅ Approved commission ${commission.id}: $${commission.commission_amount} for user ${commission.user_id}`);
    }

    return NextResponse.json({
      success: true,
      orderId,
      commissionsApproved: commissions.length,
    });

  } catch (error) {
    console.error('Error processing order fulfilled webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Verify Shopify webhook signature using HMAC
 */
function verifyShopifyWebhook(request: NextRequest, body: string): boolean {
  const hmacHeader = request.headers.get('x-shopify-hmac-sha256');
  const shopifySecret = process.env.SHOPIFY_WEBHOOK_SECRET;

  if (!shopifySecret) {
    console.warn('⚠️  SHOPIFY_WEBHOOK_SECRET not set - skipping verification');
    return true;
  }

  if (!hmacHeader) {
    console.error('Missing x-shopify-hmac-sha256 header');
    return false;
  }

  try {
    const hash = crypto
      .createHmac('sha256', shopifySecret)
      .update(body, 'utf8')
      .digest('base64');

    const isValid = crypto.timingSafeEqual(
      Buffer.from(hash),
      Buffer.from(hmacHeader)
    );

    if (!isValid) {
      console.error('HMAC verification failed');
    }

    return isValid;
  } catch (error) {
    console.error('Error verifying HMAC:', error);
    return false;
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

/**
 * Shopify Order Cancelled Webhook
 * Removes/reverses commissions when an order is cancelled
 *
 * Configure in Shopify Admin:
 * Settings → Notifications → Webhooks → Create webhook
 * Event: Order cancellation
 * Format: JSON
 * URL: https://your-domain.com/api/webhooks/shopify/order-cancelled
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

    console.log('Received Shopify order cancelled webhook:', {
      orderId: body.id,
      orderNumber: body.order_number,
      cancelledAt: body.cancelled_at,
    });

    const orderId = body.id.toString();

    // Find all commissions for this order (pending or approved)
    const { data: commissions, error: fetchError } = await supabaseAdmin
      .from('commissions')
      .select('id, user_id, commission_amount, status')
      .eq('order_id', orderId)
      .in('status', ['pending', 'approved']);

    if (fetchError) {
      console.error('Error fetching commissions:', fetchError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!commissions || commissions.length === 0) {
      console.log('No commissions found for order:', orderId);
      return NextResponse.json({
        success: true,
        message: 'No commissions to reverse'
      });
    }

    console.log(`Found ${commissions.length} commission(s) to reverse`);

    // Reverse each commission
    for (const commission of commissions) {
      // 1. Update commission status to cancelled
      const { error: updateError } = await supabaseAdmin
        .from('commissions')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString()
        })
        .eq('id', commission.id);

      if (updateError) {
        console.error(`Error cancelling commission ${commission.id}:`, updateError);
        continue;
      }

      // 2. Reverse the wallet balance based on commission status
      if (commission.status === 'pending') {
        // Was still pending → subtract from pending_balance
        const { error: walletError } = await supabaseAdmin.rpc('decrement_pending_balance', {
          p_user_id: commission.user_id,
          p_amount: commission.commission_amount,
        });

        if (walletError) {
          console.error(`Error reversing pending balance for ${commission.id}:`, walletError);
          continue;
        }

        console.log(`✅ Reversed pending commission ${commission.id}: -$${commission.commission_amount} from user ${commission.user_id}`);
      } else if (commission.status === 'approved') {
        // Was already approved → subtract from available_balance and lifetime_earnings
        const { error: walletError } = await supabaseAdmin.rpc('reverse_approved_commission', {
          p_user_id: commission.user_id,
          p_amount: commission.commission_amount,
        });

        if (walletError) {
          console.error(`Error reversing approved balance for ${commission.id}:`, walletError);
          continue;
        }

        console.log(`✅ Reversed approved commission ${commission.id}: -$${commission.commission_amount} from user ${commission.user_id}`);
      }
    }

    return NextResponse.json({
      success: true,
      orderId,
      commissionsReversed: commissions.length,
    });

  } catch (error) {
    console.error('Error processing order cancelled webhook:', error);
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

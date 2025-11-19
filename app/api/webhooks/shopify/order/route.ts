import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { calculateCommissions, createUser, getUserByEmail, getUserByShopifyId } from '../../../../../lib/supabase/referral';

/**
 * Shopify Order Created Webhook
 * This endpoint receives notifications when orders are created in Shopify
 *
 * Configure in Shopify Admin:
 * Settings → Notifications → Webhooks → Create webhook
 * Event: Order creation
 * Format: JSON
 * URL: https://your-domain.com/api/webhooks/shopify/order
 */
export async function POST(request: NextRequest) {
  try {
    // Create a Supabase client with service role for webhook use
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

    console.log('Received Shopify order webhook:', {
      orderId: body.id,
      orderNumber: body.order_number,
      customer: body.customer?.email,
    });

    // Extract order data
    const order = {
      id: body.id.toString(),
      orderNumber: body.order_number,
      totalPrice: parseFloat(body.total_price),
      customer: {
        id: body.customer?.id?.toString(),
        email: body.customer?.email,
        firstName: body.customer?.first_name,
        lastName: body.customer?.last_name,
        phone: body.customer?.phone,
      },
      // Check if this is a subscription order
      isSubscription: body.note_attributes?.some(
        (attr: any) => attr.name === 'subscription' && attr.value === 'true'
      ) || false,
    };

    if (!order.customer.email) {
      return NextResponse.json({ error: 'No customer email' }, { status: 400 });
    }

    // Step 1: Find or create user
    let user = await getUserByEmail(order.customer.email);
    let isNewUser = false;

    if (!user) {
      // Check if they have a Shopify customer ID already
      if (order.customer.id) {
        user = await getUserByShopifyId(order.customer.id);
      }

      if (!user) {
        // Create new user
        isNewUser = true;
        const fullName = `${order.customer.firstName || ''} ${order.customer.lastName || ''}`.trim();

        // Check for referral code in multiple places
        let referralCode = null;

        // Method 1: Check note_attributes
        const refAttr = body.note_attributes?.find((attr: any) =>
          attr.name === 'referral_code' || attr.name === 'Referral Code'
        );
        if (refAttr) {
          referralCode = refAttr.value;
        }

        // Method 2: Check line item properties
        if (!referralCode && body.line_items) {
          for (const item of body.line_items) {
            if (item.properties) {
              const refProp = item.properties.find((prop: any) =>
                prop.name === 'Referral Code' || prop.name === 'referral_code'
              );
              if (refProp && refProp.value) {
                referralCode = refProp.value;
                break;
              }
            }
          }
        }

        // Method 3: Check order note for referral code pattern
        if (!referralCode && body.note) {
          const match = body.note.match(/(?:ref|referral|code):\s*([A-Z0-9]{6,10})/i);
          if (match) {
            referralCode = match[1];
          }
        }

        console.log('Referral code extracted:', referralCode || 'None');

        user = await createUser({
          email: order.customer.email,
          fullName: fullName || undefined,
          phone: order.customer.phone,
          shopifyCustomerId: order.customer.id,
          referralCode: referralCode,
          hasPurchased: true,
        });

        console.log('Created new user:', user.id, user.email);
      }
    } else if (!user.has_purchased) {
      // Update user to mark as having purchased
      await supabaseAdmin
        .from('users')
        .update({
          has_purchased: true,
          commission_rate: 1.0, // Upgrade to 100% commission
        })
        .eq('id', user.id);

      console.log('Updated user to has_purchased:', user.id);
    }

    // Step 2: Create subscription record if applicable
    if (order.isSubscription) {
      await supabaseAdmin
        .from('subscriptions')
        .insert({
          user_id: user.id,
          shopify_order_id: order.id,
          status: 'active',
          box_type: 'curated', // Default, can be updated later
          frequency: 'monthly', // Default
        });

      console.log('Created subscription for user:', user.id);
    }

    // Step 3: Calculate commissions
    const commissions = await calculateCommissions({
      buyerUserId: user.id,
      orderId: order.id,
      orderTotal: order.totalPrice,
    });

    console.log('Created commissions:', commissions.length);

    // Step 4: Send password setup email for new customers to access dashboard
    // Only send if this is a newly created user (not an existing user making another purchase)
    if (isNewUser) {
      try {
        await sendPasswordSetupEmail(supabaseAdmin, user.email, user.referral_code);
        console.log('Sent password setup email to:', user.email);
      } catch (emailError) {
        console.error('Failed to send password setup email:', emailError);
        // Don't fail the webhook if email fails
      }
    }

    return NextResponse.json({
      success: true,
      userId: user.id,
      referralCode: user.referral_code,
      commissionsCreated: commissions.length,
    });

  } catch (error) {
    console.error('Error processing Shopify webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Send password setup email for new customers
 * Uses Supabase Auth to generate a password reset link that serves as initial account setup
 */
async function sendPasswordSetupEmail(supabaseAdmin: any, email: string, referralCode: string) {
  // Try to create the user in Supabase Auth (if they don't exist)
  // Note: This may fail if there's a database trigger conflict with the users table
  const { data: authUser, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
    email,
    email_confirm: true, // Auto-confirm their email
    user_metadata: {
      referral_code: referralCode,
    },
  });

  if (signUpError) {
    if (signUpError.message?.includes('already registered')) {
      console.log(`Auth user already exists for ${email}, sending password reset link`);
    } else {
      // Log the error but continue - we'll try to send the recovery link anyway
      console.error('Warning: Error creating auth user:', signUpError.message);
      console.log('Continuing to send password setup link...');
    }
  } else {
    console.log(`Auth user created for ${email}`);
  }

  // Always try to generate and send the password recovery link
  // This works whether the user was just created or already exists
  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: 'recovery',
    email,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
    },
  });

  if (error) {
    throw error;
  }

  // TODO: Send custom branded email via Klaviyo with the password setup link
  // For now, Supabase will send the default password recovery email
  // Customize the email template in Supabase Dashboard → Authentication → Email Templates
  // The link will be: data.properties.action_link

  console.log(`Password setup email sent to ${email} (Code: ${referralCode})`);
}

/**
 * Verify Shopify webhook signature using HMAC
 * This ensures the webhook is actually from Shopify
 */
function verifyShopifyWebhook(request: NextRequest, body: string): boolean {
  const hmacHeader = request.headers.get('x-shopify-hmac-sha256');
  const shopifySecret = process.env.SHOPIFY_WEBHOOK_SECRET;

  // If no secret is configured, skip verification (dev mode)
  if (!shopifySecret) {
    console.warn('⚠️  SHOPIFY_WEBHOOK_SECRET not set - skipping verification');
    return true;
  }

  if (!hmacHeader) {
    console.error('Missing x-shopify-hmac-sha256 header');
    return false;
  }

  try {
    // Calculate expected HMAC
    const hash = crypto
      .createHmac('sha256', shopifySecret)
      .update(body, 'utf8')
      .digest('base64');

    // Compare with header (timing-safe comparison)
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

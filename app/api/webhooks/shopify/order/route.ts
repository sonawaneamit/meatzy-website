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

    // Step 1: Find user or prepare for new user creation
    let user = await getUserByEmail(order.customer.email);
    let isNewUser = false;
    let extractedReferralCode = null;

    if (!user) {
      // Check if they have a Shopify customer ID already
      if (order.customer.id) {
        user = await getUserByShopifyId(order.customer.id);
      }

      if (!user) {
        // This is a NEW user - create their affiliate account with temporary password
        isNewUser = true;
        const fullName = `${order.customer.firstName || ''} ${order.customer.lastName || ''}`.trim();

        // Check for referral code in multiple places
        // Method 1: Check note_attributes
        const refAttr = body.note_attributes?.find((attr: any) =>
          attr.name === 'referral_code' || attr.name === 'Referral Code'
        );
        if (refAttr) {
          extractedReferralCode = refAttr.value;
        }

        // Method 2: Check line item properties
        if (!extractedReferralCode && body.line_items) {
          for (const item of body.line_items) {
            if (item.properties) {
              const refProp = item.properties.find((prop: any) =>
                prop.name === 'Referral Code' || prop.name === 'referral_code'
              );
              if (refProp && refProp.value) {
                extractedReferralCode = refProp.value;
                break;
              }
            }
          }
        }

        // Method 3: Check order note for referral code pattern
        if (!extractedReferralCode && body.note) {
          const match = body.note.match(/(?:ref|referral|code):\s*([A-Z0-9]{6,10})/i);
          if (match) {
            extractedReferralCode = match[1];
          }
        }

        console.log('Referral code extracted:', extractedReferralCode || 'None');

        // Look up referrer by code if provided
        let referrerId = null;
        if (extractedReferralCode) {
          const { data: referrer } = await supabaseAdmin
            .from('users')
            .select('id')
            .eq('referral_code', extractedReferralCode.toUpperCase())
            .single();

          if (referrer) {
            referrerId = referrer.id;
            console.log('✓ Found referrer:', referrerId);
          } else {
            console.log('⚠️  Referral code not found:', extractedReferralCode);
          }
        }

        // Generate referral code and temporary password
        const newUserReferralCode = Math.random().toString(36).substring(2, 10).toUpperCase();
        const temporaryPassword = generateMemorablePassword();

        // Step 1: Create auth account (no trigger conflict since we disabled it!)
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: order.customer.email,
          password: temporaryPassword,
          email_confirm: true, // Auto-confirm email
        });

        if (authError) {
          console.error('Error creating auth account:', authError);
          throw new Error(`Failed to create auth account: ${authError.message}`);
        }

        console.log('✓ Auth account created for:', order.customer.email);

        // Step 2: Create users record with all the data
        const { data: userData, error: userError } = await supabaseAdmin
          .from('users')
          .insert({
            id: authData.user.id,
            email: order.customer.email.toLowerCase(),
            full_name: fullName || null,
            referral_code: newUserReferralCode,
            referrer_id: referrerId, // Use UUID, not code
            shopify_customer_id: order.customer.id,
            has_purchased: true,
            commission_rate: 1.0, // 100% commission for customers
            temporary_password: temporaryPassword,
            requires_password_change: true,
          })
          .select()
          .single();

        if (userError) {
          console.error('Error creating user record:', userError);
          // Clean up auth account if user record creation fails
          await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
          throw new Error(`Failed to create user record: ${userError.message}`);
        }

        console.log('✓ User record created:', userData.id);

        user = userData;
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
    }, supabaseAdmin);

    console.log('Created commissions:', commissions.length);

    // Step 4: Send welcome email for new customers
    // TODO: Add email service (Resend/SendGrid) to send credentials
    if (isNewUser) {
      console.log('New user created - email should be sent with credentials');
      console.log('Email:', user.email);
      console.log('Temp Password:', user.temporary_password);
      console.log('Referral Code:', user.referral_code);
      // Email sending will be added next
    }

    return NextResponse.json({
      success: true,
      userId: user.id,
      referralCode: user.referral_code,
      commissionsCreated: commissions.length,
      isNewUser,
      temporaryPassword: isNewUser ? user.temporary_password : undefined,
    });

  } catch (error) {
    console.error('Error processing Shopify webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// TODO: Add email service integration (Resend/SendGrid/Klaviyo)
// Email template should include:
// - Welcome message
// - Temporary password
// - Dashboard login link
// - Referral code and link
// - Commission structure info
// - Next steps

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

/**
 * Generate memorable temporary password
 * Format: adjectiveNounNumber (e.g., pinkElephant121)
 */
function generateMemorablePassword(): string {
  const adjectives = [
    'red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'gold',
    'silver', 'brave', 'happy', 'swift', 'bright', 'cool', 'warm', 'fresh',
    'wild', 'calm', 'bold', 'smart', 'quick', 'strong', 'sweet', 'smooth'
  ];

  const nouns = [
    'Tiger', 'Eagle', 'Dolphin', 'Lion', 'Panda', 'Falcon', 'Wolf', 'Bear',
    'Fox', 'Hawk', 'Shark', 'Dragon', 'Phoenix', 'Rabbit', 'Elephant', 'Zebra',
    'Giraffe', 'Penguin', 'Koala', 'Cheetah', 'Leopard', 'Jaguar', 'Owl', 'Deer'
  ];

  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 900) + 100; // 3-digit number (100-999)

  return `${adjective}${noun}${number}`;
}

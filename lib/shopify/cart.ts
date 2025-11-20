import { shopifyClient } from './client';
import { CREATE_CART, ADD_TO_CART } from './queries';
import type { Cart, CreateCartResponse, AddToCartResponse } from './types';
import { getReferralCode } from '../../hooks/useReferralTracking';

/**
 * Get referral data from the secure HTTPOnly cookie via API
 */
async function getReferralDataFromCookie(): Promise<{
  referralCode: string | null;
  discountCode: string | null;
  affiliateId: string | null;
} | null> {
  try {
    const response = await fetch('/api/referral/get-cookie');
    const data = await response.json();
    return data.hasReferral ? data : null;
  } catch (error) {
    console.error('Error fetching referral cookie:', error);
    return null;
  }
}

/**
 * Create a new Shopify cart
 */
export async function createCart(variantId: string, quantity: number = 1): Promise<Cart | null> {
  try {
    console.log('Creating cart with variant:', variantId, 'quantity:', quantity);

    // Get referral data from cookie (preferred) or fall back to localStorage
    const cookieReferral = await getReferralDataFromCookie();
    const localReferralCode = getReferralCode();

    // Use cookie data if available, otherwise fall back to localStorage
    const referralCode = cookieReferral?.referralCode || localReferralCode;
    const discountCode = cookieReferral?.discountCode;
    const affiliateId = cookieReferral?.affiliateId;

    // Build cart input
    const input: any = {
      lines: [
        {
          merchandiseId: variantId,
          quantity,
          // Add referral code as line item attribute (shows in Shopify order)
          ...(referralCode && {
            attributes: [
              {
                key: 'Referral Code',
                value: referralCode,
              },
            ],
          }),
        },
      ],
    };

    // Add referral code as cart-level attribute AND as note
    if (referralCode) {
      input.attributes = [
        {
          key: 'referral_code',
          value: referralCode,
        },
        {
          key: 'Referral Code',
          value: referralCode,
        },
      ];

      // Add affiliate ID if available (from cookie-based referral)
      if (affiliateId) {
        input.attributes.push({
          key: 'referrer_id',
          value: affiliateId,
        });
      }

      // Also add to cart note for maximum visibility
      input.note = `Referral Code: ${referralCode}`;
      console.log('Adding referral code to cart:', referralCode);
    }

    // Note: Discount code is applied via checkout URL parameter (see saveCheckoutUrl)
    // This avoids sales channel configuration issues

    const data = await shopifyClient.request<CreateCartResponse>(CREATE_CART, { input });

    console.log('Cart creation response:', JSON.stringify(data, null, 2));

    if (data.cartCreate.userErrors.length > 0) {
      console.error('Cart creation errors:', data.cartCreate.userErrors);
      return null;
    }

    if (!data.cartCreate.cart) {
      console.error('Cart creation returned null cart. Full response:', JSON.stringify(data, null, 2));
      return null;
    }

    console.log('Cart created successfully:', data.cartCreate.cart.id);
    return data.cartCreate.cart;
  } catch (error) {
    console.error('Error creating cart:', error);
    return null;
  }
}

/**
 * Add items to an existing cart
 */
export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart | null> {
  try {
    console.log('Adding to cart:', cartId, 'lines:', lines);
    const data = await shopifyClient.request<AddToCartResponse>(ADD_TO_CART, {
      cartId,
      lines,
    });

    console.log('Add to cart response:', JSON.stringify(data, null, 2));

    if (data.cartLinesAdd.userErrors.length > 0) {
      console.error('Add to cart errors:', data.cartLinesAdd.userErrors);
      return null;
    }

    if (!data.cartLinesAdd.cart) {
      console.error('Add to cart returned null cart');
      return null;
    }

    console.log('Items added successfully. Cart ID:', data.cartLinesAdd.cart.id);
    console.log('Checkout URL from response:', data.cartLinesAdd.cart.checkoutUrl);
    return data.cartLinesAdd.cart;
  } catch (error) {
    console.error('Error adding to cart:', error);
    return null;
  }
}

/**
 * Get or create a cart ID from localStorage
 */
export function getCartId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('shopify_cart_id');
}

/**
 * Save cart ID to localStorage
 */
export function saveCartId(cartId: string): void {
  if (typeof window === 'undefined') return;
  console.log('Saving cart ID to localStorage:', cartId);
  localStorage.setItem('shopify_cart_id', cartId);
}

/**
 * Save checkout URL to localStorage
 * Automatically appends discount code if one exists in the referral cookie
 */
export async function saveCheckoutUrl(checkoutUrl: string): Promise<void> {
  if (typeof window === 'undefined') return;

  // Try to append discount code from referral cookie
  try {
    const cookieReferral = await getReferralDataFromCookie();
    if (cookieReferral?.discountCode) {
      const url = new URL(checkoutUrl);
      url.searchParams.set('discount', cookieReferral.discountCode);
      checkoutUrl = url.toString();
      console.log('Appended discount code to checkout URL:', cookieReferral.discountCode);
    }
  } catch (error) {
    console.error('Error appending discount code to checkout URL:', error);
  }

  console.log('Saving checkout URL to localStorage:', checkoutUrl);
  localStorage.setItem('shopify_checkout_url', checkoutUrl);
}

/**
 * Get checkout URL from localStorage
 */
export function getCheckoutUrl(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('shopify_checkout_url');
}

/**
 * Clear cart ID from localStorage
 */
export function clearCartId(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('shopify_cart_id');
  localStorage.removeItem('shopify_checkout_url');
}

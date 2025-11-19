import { shopifyClient } from './client';
import { CREATE_CART, ADD_TO_CART } from './queries';
import type { Cart, CreateCartResponse, AddToCartResponse } from './types';

/**
 * Create a new Shopify cart
 */
export async function createCart(variantId: string, quantity: number = 1): Promise<Cart | null> {
  try {
    const data = await shopifyClient.request<CreateCartResponse>(CREATE_CART, {
      input: {
        lines: [
          {
            merchandiseId: variantId,
            quantity,
          },
        ],
      },
    });

    if (data.cartCreate.userErrors.length > 0) {
      console.error('Cart creation errors:', data.cartCreate.userErrors);
      return null;
    }

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
    const data = await shopifyClient.request<AddToCartResponse>(ADD_TO_CART, {
      cartId,
      lines,
    });

    if (data.cartLinesAdd.userErrors.length > 0) {
      console.error('Add to cart errors:', data.cartLinesAdd.userErrors);
      return null;
    }

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
  localStorage.setItem('shopify_cart_id', cartId);
}

/**
 * Save checkout URL to localStorage
 */
export function saveCheckoutUrl(checkoutUrl: string): void {
  if (typeof window === 'undefined') return;
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

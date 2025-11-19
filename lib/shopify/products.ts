import { shopifyClient } from './client';
import {
  GET_ALL_PRODUCTS,
  GET_PRODUCT_BY_HANDLE,
  GET_COLLECTIONS,
  GET_COLLECTION_BY_HANDLE,
} from './queries';
import type {
  ProductsResponse,
  ProductByHandleResponse,
  CollectionsResponse,
  CollectionByHandleResponse,
  Product,
  Collection,
} from './types';

/**
 * Fetch all products from Shopify
 */
export async function getAllProducts(first: number = 25): Promise<Product[]> {
  try {
    const data = await shopifyClient.request<ProductsResponse>(GET_ALL_PRODUCTS, { first });
    return data.products.edges.map((edge) => edge.node);
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

/**
 * Fetch a single product by handle
 */
export async function getProductByHandle(handle: string): Promise<Product | null> {
  try {
    const data = await shopifyClient.request<ProductByHandleResponse>(
      GET_PRODUCT_BY_HANDLE,
      { handle }
    );
    return data.productByHandle;
  } catch (error) {
    console.error(`Error fetching product ${handle}:`, error);
    return null;
  }
}

/**
 * Fetch all collections
 */
export async function getAllCollections(first: number = 10): Promise<Collection[]> {
  try {
    const data = await shopifyClient.request<CollectionsResponse>(GET_COLLECTIONS, { first });
    return data.collections.edges.map((edge) => edge.node);
  } catch (error) {
    console.error('Error fetching collections:', error);
    throw error;
  }
}

/**
 * Fetch a single collection by handle
 */
export async function getCollectionByHandle(
  handle: string,
  first: number = 20
): Promise<Collection | null> {
  try {
    const data = await shopifyClient.request<CollectionByHandleResponse>(
      GET_COLLECTION_BY_HANDLE,
      { handle, first }
    );
    return data.collectionByHandle;
  } catch (error) {
    console.error(`Error fetching collection ${handle}:`, error);
    return null;
  }
}

/**
 * Helper function to categorize products
 * Separates boxes (tagged "Homepage Boxes") from add-ons (tagged "Addon")
 */
export function categorizeProducts(products: Product[]): {
  boxes: Product[];
  addons: Product[];
} {
  const boxes: Product[] = [];
  const addons: Product[] = [];

  products.forEach((product) => {
    const isHomepageBox = product.tags.some((tag) => tag === 'Homepage Boxes');
    const isAddon = product.tags.some((tag) => tag === 'Addon');

    if (isHomepageBox) {
      boxes.push(product);
    } else if (isAddon) {
      addons.push(product);
    }
  });

  return { boxes, addons };
}

/**
 * Format price for display
 */
export function formatPrice(price: string, currencyCode: string = 'USD'): string {
  const amount = parseFloat(price);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
}

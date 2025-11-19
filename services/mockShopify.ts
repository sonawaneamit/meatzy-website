import { Product } from '../types';

/**
 * SHOPIFY STOREFRONT API INTEGRATION GUIDE
 * 
 * To replace this mock data with real Shopify data:
 * 
 * 1. Install dependencies: npm install @shopify/hydrogen-react
 * 2. Get your Storefront Access Token from Shopify Admin -> Sales Channels -> Headless
 * 
 * 3. GraphQL Query for Products:
 * const GRAPHQL_QUERY = `
 *   query getProducts {
 *     products(first: 10, sortKey: TITLE) {
 *       edges {
 *         node {
 *           id
 *           title
 *           handle
 *           description
 *           priceRange {
 *             minVariantPrice {
 *               amount
 *               currencyCode
 *             }
 *           }
 *           featuredImage {
 *             url
 *             altText
 *           }
 *           sellingPlanGroups(first: 1) {
 *             edges {
 *               node {
 *                 name
 *                 sellingPlans(first: 1) {
 *                   edges {
 *                     node {
 *                       id
 *                       priceAdjustments {
 *                         adjustmentValue {
 *                           ... on SellingPlanFixedAmountPriceAdjustment {
 *                             adjustmentAmount { amount currencyCode }
 *                           }
 *                           ... on SellingPlanPercentagePriceAdjustment {
 *                             adjustmentPercentage
 *                           }
 *                         }
 *                       }
 *                     }
 *                   }
 *                 }
 *               }
 *             }
 *           }
 *         }
 *       }
 *     }
 *   }
 * `;
 */

export const getProducts = async (): Promise<Product[]> => {
  // Simulating network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return [
    {
      id: 'gid://shopify/Product/1',
      title: 'The Cattleman',
      handle: 'cattleman-box',
      description: 'For the steak lover. Includes 2 Ribeyes, 2 NY Strips, and 2lbs of Wagyu Ground Beef. Hand-trimmed and perfectly aged for maximum flavor.',
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=800&auto=format&fit=crop',
        altText: 'Steak Box'
      },
      priceRange: {
        minVariantPrice: { amount: '169.00', currencyCode: 'USD' }
      },
      tags: ['Best Seller', 'Beef']
    },
    {
      id: 'gid://shopify/Product/2',
      title: 'Family Feast Bundle',
      handle: 'family-feast',
      description: 'Feed the whole crew. 4 Chicken Breasts, 2 Sirloins, 1lb Bacon, and 2lbs Ground Beef. Versatile cuts for every meal of the week.',
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop',
        altText: 'Family Box'
      },
      priceRange: {
        minVariantPrice: { amount: '189.00', currencyCode: 'USD' }
      },
      tags: ['Value', 'Mixed']
    },
    {
      id: 'gid://shopify/Product/3',
      title: 'Better Than Organic Chicken',
      handle: 'chicken-box',
      description: 'Pasture-raised, no antibiotics ever. 10lbs of perfectly trimmed chicken breasts. The cleanest protein you can buy.',
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?q=80&w=800&auto=format&fit=crop',
        altText: 'Chicken Box'
      },
      priceRange: {
        minVariantPrice: { amount: '129.00', currencyCode: 'USD' }
      },
      tags: ['Chicken', 'Lean']
    }
  ];
};
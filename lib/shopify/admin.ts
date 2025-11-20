/**
 * Shopify Admin API Client
 * Used for creating discount codes dynamically for referral SafeLinks
 */

const SHOPIFY_ADMIN_ENDPOINT = `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/${process.env.SHOPIFY_API_VERSION}/graphql.json`;

interface CreateDiscountCodeParams {
  code: string;           // e.g., "REF-ABC12345"
  title: string;          // e.g., "Referral discount for Natalia"
  amount: number;         // e.g., 20 (for $20 off)
  minimumAmount: number;  // e.g., 50 (minimum $50 order)
}

interface CreateDiscountCodeResult {
  success: boolean;
  discountId?: string;
  error?: string;
}

/**
 * Create a discount code in Shopify using Admin GraphQL API
 * Creates a fixed amount discount ($20 off) with minimum order requirement ($50)
 * Single use code - each SafeLink click generates a unique code for one customer
 * Stackable with other Shopify promotions (order, product, and shipping discounts)
 */
export async function createDiscountCode(
  params: CreateDiscountCodeParams
): Promise<CreateDiscountCodeResult> {
  const mutation = `
    mutation CreateDiscountCode($basicCodeDiscount: DiscountCodeBasicInput!) {
      discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
        codeDiscountNode {
          id
          codeDiscount {
            ... on DiscountCodeBasic {
              title
              codes(first: 1) {
                edges {
                  node {
                    code
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    basicCodeDiscount: {
      title: params.title,
      code: params.code,
      startsAt: new Date().toISOString(),
      customerGets: {
        value: {
          discountAmount: {
            amount: params.amount.toString(),
            appliesOnEachItem: false
          }
        },
        items: {
          all: true
        }
      },
      customerSelection: {
        all: true
      },
      appliesOncePerCustomer: true,
      usageLimit: 1, // Single use - each SafeLink generates unique code per customer
      combinesWith: {
        // Allow stacking with other discount types
        orderDiscounts: true,
        productDiscounts: true,
        shippingDiscounts: true
      }
    }
  };

  try {
    const response = await fetch(SHOPIFY_ADMIN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!
      },
      body: JSON.stringify({ query: mutation, variables })
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Shopify API error: ${response.status} ${response.statusText}`
      };
    }

    const result = await response.json();

    // Check for GraphQL errors
    if (result.errors) {
      return {
        success: false,
        error: result.errors[0]?.message || 'GraphQL error'
      };
    }

    // Check for user errors (validation errors)
    if (result.data?.discountCodeBasicCreate?.userErrors?.length > 0) {
      const userError = result.data.discountCodeBasicCreate.userErrors[0];
      return {
        success: false,
        error: `${userError.field || 'Unknown field'}: ${userError.message}`
      };
    }

    // Success!
    return {
      success: true,
      discountId: result.data?.discountCodeBasicCreate?.codeDiscountNode?.id
    };
  } catch (error) {
    console.error('Error creating discount code:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Check if a discount code exists in Shopify
 * Useful for verifying if a code was already created
 */
export async function checkDiscountCodeExists(code: string): Promise<boolean> {
  const query = `
    query GetDiscountCode($query: String!) {
      codeDiscountNodes(first: 1, query: $query) {
        edges {
          node {
            id
            codeDiscount {
              ... on DiscountCodeBasic {
                codes(first: 1) {
                  edges {
                    node {
                      code
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const variables = {
    query: `code:${code}`
  };

  try {
    const response = await fetch(SHOPIFY_ADMIN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!
      },
      body: JSON.stringify({ query, variables })
    });

    const result = await response.json();
    const edges = result.data?.codeDiscountNodes?.edges || [];

    return edges.length > 0;
  } catch (error) {
    console.error('Error checking discount code:', error);
    return false;
  }
}

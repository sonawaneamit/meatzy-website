// Test script to fetch products from Shopify Storefront API

require('dotenv').config({ path: '.env.local' });

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

async function shopifyFetch({ query, variables }) {
  const endpoint = `https://${domain}/api/2024-01/graphql.json`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.statusText}`);
  }

  const json = await response.json();

  if (json.errors) {
    throw new Error(json.errors[0].message);
  }

  return json.data;
}

async function testProducts() {
  console.log('\n🔍 Fetching products from Shopify...\n');

  // First, let's get all products
  const allProductsQuery = `
    query {
      products(first: 50) {
        edges {
          node {
            id
            title
            handle
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 5) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const data = await shopifyFetch({ query: allProductsQuery });
    const products = data.products.edges;

    console.log(`✅ Found ${products.length} products\n`);
    console.log('─────────────────────────────────────────────────────────\n');

    products.forEach((edge, idx) => {
      const product = edge.node;
      console.log(`${idx + 1}. ${product.title}`);
      console.log(`   Handle: ${product.handle}`);
      console.log(`   Price: $${product.priceRange.minVariantPrice.amount}`);
      console.log(`   Images: ${product.images.edges.length}`);
      if (product.images.edges.length > 0) {
        console.log(`   First image: ${product.images.edges[0].node.url}`);
      }
      console.log('');
    });

    console.log('─────────────────────────────────────────────────────────\n');

    // Look for Keto Box specifically
    console.log('🔍 Looking for Keto Box...\n');
    const ketoBox = products.find(edge =>
      edge.node.title.toLowerCase().includes('keto') ||
      edge.node.handle.includes('keto')
    );

    if (ketoBox) {
      console.log('✅ Found Keto Box!');
      console.log(`   Handle: ${ketoBox.node.handle}`);
      console.log(`   Images available: ${ketoBox.node.images.edges.length}`);
      ketoBox.node.images.edges.forEach((img, idx) => {
        console.log(`   Image ${idx + 1}: ${img.node.url}`);
      });
    } else {
      console.log('⚠️  Keto Box not found. Available products:');
      products.forEach(edge => {
        console.log(`   - ${edge.node.title} (handle: ${edge.node.handle})`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testProducts();

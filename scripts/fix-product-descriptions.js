require('dotenv').config({ path: '.env.local' });

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const adminAccessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

// Product descriptions to update
const productUpdates = {
  'holiday-box': `<p><strong>Holiday Box</strong></p>
<ul>
<li><a href="/products/short-rib">Short rib, USDA choice, bone-in, grass-fed</a></li>
<li><a href="/products/tri-tip-steak">Tri-tip steak, grass-fed 3x 8 oz steaks</a></li>
<li><a href="/products/ground-beef-80-20">Ground beef 80/20 2 lbs</a></li>
<li><a href="/products/sweet-italian-sausage">Sweet Italian sausage 2 lbs</a></li>
<li><a href="/products/organic-boneless-skinless-chicken-thighs-box">Organic boneless skinless chicken thighs ~3 lbs</a></li>
</ul>`,

  'family-favorites': `<p><strong>Family Favorites</strong></p>
<ul>
<li><a href="/products/ground-beef-80-20">Ground beef 80/20 2 lbs</a></li>
<li><a href="/products/boneless-pork-chops">Boneless pork chops</a></li>
<li><a href="/products/organic-boneless-skinless-chicken-thighs-box">Organic boneless skinless chicken thighs ~3 lbs</a></li>
<li><a href="/products/sweet-italian-sausage">Sweet Italian sausage 2 lbs</a></li>
<li><a href="/products/burgers-80-20">Burgers 80/20</a></li>
</ul>`
};

// Product plain text descriptions (shown on the page)
const productDescriptions = {
  'holiday-box': 'Celebrate the season with our premium Holiday Box. Packed with show-stopping cuts perfect for festive gatherings—featuring grass-fed short ribs, tri-tip steaks, and all your holiday dinner essentials. Each cut is carefully selected to make your celebrations unforgettable.',
  'family-favorites': 'Feed the whole family with our Family Favorites Box. Packed with versatile, crowd-pleasing cuts that everyone loves—from juicy burgers to tender chicken thighs. Perfect for busy weeknight dinners and weekend BBQs alike.'
};

async function getProductIdByHandle(handle) {
  const query = `
    query getProduct($handle: String!) {
      product(handle: $handle) {
        id
        title
        descriptionHtml
      }
    }
  `;

  const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
    },
    body: JSON.stringify({
      query,
      variables: { handle }
    })
  });

  const data = await response.json();
  return data.data.product;
}

async function updateProductDescription(productId, descriptionHtml, plainDescription) {
  // Convert Storefront API ID to Admin API ID
  const gid = productId.replace('gid://shopify/Product/', '');

  const mutation = `
    mutation productUpdate($input: ProductInput!) {
      productUpdate(input: $input) {
        product {
          id
          description
          descriptionHtml
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const input = {
    id: `gid://shopify/Product/${gid}`,
    descriptionHtml: descriptionHtml
  };

  // Add plain description if provided
  if (plainDescription) {
    input.description = plainDescription;
  }

  const response = await fetch(`https://${domain}/admin/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': adminAccessToken,
    },
    body: JSON.stringify({
      query: mutation,
      variables: { input }
    })
  });

  const data = await response.json();
  return data;
}

async function fixProductDescriptions() {
  console.log('Starting product description cleanup...\n');

  for (const [handle, newDescription] of Object.entries(productUpdates)) {
    try {
      console.log(`\n📦 Processing ${handle}...`);

      // Get product ID
      const product = await getProductIdByHandle(handle);

      if (!product) {
        console.log(`❌ Product not found: ${handle}`);
        continue;
      }

      console.log(`   Current description length: ${product.descriptionHtml?.length || 0} chars`);
      console.log(`   Product ID: ${product.id}`);

      // Update description
      const plainDesc = productDescriptions[handle];
      const result = await updateProductDescription(product.id, newDescription, plainDesc);

      if (result.data?.productUpdate?.userErrors?.length > 0) {
        console.log(`❌ Errors updating ${handle}:`);
        result.data.productUpdate.userErrors.forEach(error => {
          console.log(`   - ${error.field}: ${error.message}`);
        });
      } else {
        console.log(`✅ Successfully updated ${handle}`);
        console.log(`   New description length: ${newDescription.length} chars`);
      }

    } catch (error) {
      console.log(`❌ Error processing ${handle}:`, error.message);
    }
  }

  console.log('\n✨ Description cleanup complete!');
}

// Check if we have the required credentials
if (!domain || !storefrontAccessToken || !adminAccessToken) {
  console.error('❌ Missing required environment variables:');
  console.error('   - NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN');
  console.error('   - NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN');
  console.error('   - SHOPIFY_ADMIN_ACCESS_TOKEN');
  process.exit(1);
}

fixProductDescriptions().catch(console.error);

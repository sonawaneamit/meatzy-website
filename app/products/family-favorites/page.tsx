import { getProductByHandle, getProducts } from '../../../lib/shopify/storefront';
import ProductBoxClient from '../../../components/ProductBoxClient';

// Expanded list of add-on product handles
const ADD_ON_HANDLES = [
  'atlantic-salmon',
  'ribeye-steak',
  'ground-beef-93-7',
  'baby-back-ribs',
  'boneless-pork-chops',
  'sweet-italian-sausage',
  'ground-beef-80-20',
  'burgers-80-20',
  'ny-strip-single',
  'flat-iron',
  'tri-tip-steak',
  'flank-steak',
  'hanger-steak',
  'picahna',
  'pork-tenderloin',
  'ground-pork',
  'chuck-roast',
  'beef-shank',
  'short-rib',
  'peeled-and-deveined-shrimp',
];

// Parse product description HTML to extract product items and their handles
function parseProductItems(descriptionHtml: string) {
  // Extract text from anchor tags inside list items
  const linkTextRegex = /<a[^>]*>([^<]+)<\/a>/g;
  const items = [];
  let match;

  while ((match = linkTextRegex.exec(descriptionHtml)) !== null) {
    const text = match[1].trim();
    if (text) {
      items.push(text);
    }
  }

  return items;
}

// Extract product handles from description HTML links
function extractProductHandles(descriptionHtml: string) {
  const handleRegex = /<a[^>]*href=["']\/products\/([^"']+)["'][^>]*>/g;
  const handles: string[] = [];
  let match;

  while ((match = handleRegex.exec(descriptionHtml)) !== null) {
    handles.push(match[1]);
  }

  return handles;
}

export default async function FamilyFavoritesPage() {
  // Fetch the Family Favorites product
  const product = await getProductByHandle('family-favorites');

  // Extract product handles from the description to fetch box contents
  const boxItemHandles = extractProductHandles(product?.descriptionHtml || '');

  // Fetch the actual products that are in the box
  const boxItemProducts = await getProducts(boxItemHandles);

  // Fetch add-on products
  const addOnProducts = await getProducts(ADD_ON_HANDLES);

  // Extract images
  const productImages = product?.images?.edges?.map((edge: any) => ({
    url: edge.node.url,
    altText: edge.node.altText || 'Family Favorites',
  })) || [];

  // Parse product items from description for the checklist
  const productItems = parseProductItems(product?.descriptionHtml || '');

  // Map box items to detailed format with descriptions and images
  const boxItems = boxItemProducts.map((p: any) => ({
    name: p?.title || '',
    description: p?.description || '',
    image: p?.images?.edges?.[0]?.node?.url || '',
    handle: p?.handle || '',
  }));

  // Map add-ons to the format expected by the client component
  const addOns = addOnProducts
    .filter((p: any) => parseFloat(p?.priceRange?.minVariantPrice?.amount || '0') > 0)
    .map((p: any) => ({
      name: p?.title || '',
      price: parseFloat(p?.priceRange?.minVariantPrice?.amount || '0'),
      image: p?.images?.edges?.[0]?.node?.url || '',
      handle: p?.handle || '',
    }));

  const price = parseFloat(product?.priceRange?.minVariantPrice?.amount || '169');

  // SEO-optimized description
  const customDescription = 'Simplify dinner time with family-friendly favorites the whole household will love. Our Family Favorites Box delivers versatile cuts perfect for busy weeknight meals and weekend BBQs—including juicy burgers, tender chicken thighs, premium ground beef, and more. Quality proteins that make meal planning easy and delicious.';

  // Product-specific FAQs
  const faqs = [
    {
      question: "What makes the Family Favorites Box perfect for families?",
      answer: "The Family Favorites Box features versatile, crowd-pleasing cuts that even picky eaters love—including juicy burgers, tender chicken thighs, premium ground beef, boneless pork chops, and Italian sausage. Every item is easy to prepare and perfect for quick weeknight dinners or weekend BBQs."
    },
    {
      question: "How many meals does the Family Favorites Box provide?",
      answer: "The box contains approximately 14 lbs of premium meat, providing 12-15 family meals for a household of 4. The variety of cuts means you can create everything from burger nights to grilled chicken dinners throughout the week."
    },
    {
      question: "Are the meats kid-friendly and safe?",
      answer: "Absolutely! All our meats are raised without antibiotics or hormones, making them a healthy choice for growing kids. The Family Favorites Box includes mild, familiar flavors that children love, with no artificial ingredients or preservatives."
    },
    {
      question: "Is the meat easy to cook for busy weeknights?",
      answer: "Yes! Every cut in the Family Favorites Box is selected for quick, simple preparation. Burgers and ground beef cook in minutes, chicken thighs are forgiving and flavorful, and pork chops grill up fast. Perfect for parents short on time but not on quality."
    },
    {
      question: "Can I freeze the meat and how long does it last?",
      answer: "All meats arrive vacuum-sealed and frozen, maintaining peak quality for 6-12 months when stored at 0°F or below. The individual packaging makes it easy to grab exactly what you need for each meal, keeping the rest frozen for later."
    },
    {
      question: "How does shipping work and what if I'm not home?",
      answer: "We ship in insulated boxes with dry ice that keep meat frozen for up to 48 hours. If you're not home, the box can safely sit outside during this period. You'll receive tracking information and delivery updates via email and text."
    },
    {
      question: "What's included in your satisfaction guarantee?",
      answer: "We stand behind every product 100%. If your family isn't completely satisfied with any item, contact us within 7 days of delivery for a full refund or replacement. Your family's happiness is our priority."
    },
    {
      question: "Do you offer a referral program for families?",
      answer: "Yes! Share Meatzy with other families and you'll both earn credits toward future orders. Many families love sharing their favorite meal solutions—visit your account to get your referral link and start earning rewards."
    }
  ];

  return (
    <ProductBoxClient
      productTitle="Family Favorites"
      productHandle="family-favorites"
      productDescription={customDescription}
      productBadge="FAMILY PACK"
      productImages={productImages}
      addOns={addOns}
      basePrice={price}
      productItems={productItems}
      boxItems={boxItems}
      faqs={faqs}
    />
  );
}

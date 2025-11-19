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

export default async function LeanMachinePage() {
  // Fetch the Lean Machine product
  const product = await getProductByHandle('lean-machine');

  // Extract product handles from the description to fetch box contents
  const boxItemHandles = extractProductHandles(product?.descriptionHtml || '');

  // Fetch the actual products that are in the box
  const boxItemProducts = await getProducts(boxItemHandles);

  // Fetch add-on products
  const addOnProducts = await getProducts(ADD_ON_HANDLES);

  // Extract images
  const productImages = product?.images?.edges?.map((edge: any) => ({
    url: edge.node.url,
    altText: edge.node.altText || 'Lean Machine',
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
      variantId: p?.variants?.edges?.[0]?.node?.id || '',
    }));

  const price = parseFloat(product?.priceRange?.minVariantPrice?.amount || '169');
  const variantId = product?.variants?.edges?.[0]?.node?.id || '';

  // SEO-optimized description
  const customDescription = 'Build muscle and burn fat with our Lean Machine Box—packed with premium lean proteins including 93/7 ground beef, skinless chicken breast, and tenderloin cuts. Perfect for athletes, fitness enthusiasts, and anyone pursuing a healthy lifestyle. Get high-protein, low-fat meats that support your wellness goals without sacrificing flavor.';

  // Product-specific FAQs
  const faqs = [
    {
      question: "What makes the Lean Machine Box ideal for fitness goals?",
      answer: "The Lean Machine Box features premium lean cuts with high protein and low fat content—perfect for building muscle, losing weight, or maintaining a healthy lifestyle. Every cut is selected for its nutritional profile, including 93/7 ground beef, skinless chicken breast, and tenderloin cuts."
    },
    {
      question: "How much protein and fat is in the Lean Machine Box?",
      answer: "The box contains approximately 14 lbs of lean protein with an average fat content under 10%. Each serving provides 25-30g of protein with minimal fat, making it ideal for macro tracking and meal prep for fitness-focused diets."
    },
    {
      question: "Is the Lean Machine Box good for weight loss?",
      answer: "Absolutely! Lean proteins help you feel full longer while supporting muscle retention during weight loss. The high protein-to-calorie ratio in our Lean Machine cuts makes them perfect for cutting phases, calorie-controlled diets, and sustainable weight management."
    },
    {
      question: "Are the meats in this box organic or grass-fed?",
      answer: "Our beef is 100% grass-fed and grass-finished, while our chicken is pasture-raised without antibiotics or hormones. We source from farms that prioritize animal welfare and sustainable practices, ensuring you get the cleanest lean proteins available."
    },
    {
      question: "How is the meat shipped and how long does it stay fresh?",
      answer: "All meat arrives vacuum-sealed and frozen in insulated packaging with dry ice, staying frozen for up to 48 hours in transit. Once frozen, the meat maintains peak quality for 6-12 months, and you'll receive tracking details when your order ships."
    },
    {
      question: "Can I modify my subscription or add extra items?",
      answer: "Yes! You can add items from our add-ons section, skip deliveries, pause your subscription, or switch to a different box anytime from your account dashboard. For complete control, try our Build Your Box feature."
    },
    {
      question: "What's your satisfaction guarantee policy?",
      answer: "We offer a 100% satisfaction guarantee. If any product doesn't meet your expectations, contact us within 7 days of delivery for a full refund or replacement. Your satisfaction is our priority."
    },
    {
      question: "Do you have a referral program?",
      answer: "Yes! Share your unique referral link with friends and you'll both earn credits toward future orders. Access your referral dashboard in your account to track rewards and share the healthy lifestyle."
    }
  ];

  return (
    <ProductBoxClient
      productTitle="Lean Machine"
      productHandle="lean-machine"
      productDescription={customDescription}
      productBadge="LEAN & HEALTHY"
      productImages={productImages}
      addOns={addOns}
      basePrice={price}
      productItems={productItems}
      boxItems={boxItems}
      faqs={faqs}
      variantId={variantId}
    />
  );
}

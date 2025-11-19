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
  // Extract text from list items in the HTML
  const listItemRegex = /<li>(?:<a[^>]*>)?([^<]+)(?:<\/a>)?<\/li>/g;
  const items = [];
  let match;

  while ((match = listItemRegex.exec(descriptionHtml)) !== null) {
    const text = match[1].trim();
    items.push(text);
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

export default async function KetoBoxPage() {
  // Fetch the Keto Box product
  const ketoBox = await getProductByHandle('keto-box');

  // Extract product handles from the description to fetch box contents
  const boxItemHandles = extractProductHandles(ketoBox?.descriptionHtml || '');

  // Fetch the actual products that are in the box
  const boxItemProducts = await getProducts(boxItemHandles);

  // Fetch add-on products
  const addOnProducts = await getProducts(ADD_ON_HANDLES);

  // Extract images from Keto Box
  const productImages = ketoBox?.images?.edges?.map((edge: any) => ({
    url: edge.node.url,
    altText: edge.node.altText || 'Keto Box',
  })) || [];

  // Parse product items from description for the checklist
  const productItems = parseProductItems(ketoBox?.descriptionHtml || '');

  // Map box items to detailed format with descriptions and images
  const boxItems = boxItemProducts.map((product: any) => ({
    name: product?.title || '',
    description: product?.description || '',
    image: product?.images?.edges?.[0]?.node?.url || '',
    handle: product?.handle || '',
  }));

  // Map add-ons to the format expected by the client component, filter out items with no price
  const addOns = addOnProducts
    .filter((product: any) => parseFloat(product?.priceRange?.minVariantPrice?.amount || '0') > 0)
    .map((product: any) => ({
      name: product?.title || '',
      price: parseFloat(product?.priceRange?.minVariantPrice?.amount || '0'),
      image: product?.images?.edges?.[0]?.node?.url || '',
      handle: product?.handle || '',
    }));

  const price = parseFloat(ketoBox?.priceRange?.minVariantPrice?.amount || '169');

  // SEO-optimized description
  const customDescription = 'Power your keto diet with premium grass-fed beef, pasture-raised chicken, and heritage pork. Our Keto Box delivers high-protein, zero-carb cuts perfect for low-carb meal prep—featuring quality meats that keep you in ketosis while satisfying your cravings. Fuel your ketogenic lifestyle with restaurant-quality proteins delivered to your door.';

  // Product-specific FAQs
  const faqs = [
    {
      question: "What makes the Keto Box perfect for a ketogenic diet?",
      answer: "The Keto Box is specifically curated with high-quality proteins and healthy fats perfect for keto. All items are zero-carb, hormone-free, and include a variety of beef, chicken, and pork to keep your meals interesting while staying in ketosis."
    },
    {
      question: "How much protein is in the Keto Box?",
      answer: "The Keto Box contains approximately 14 lbs of premium protein, which typically lasts 2-4 weeks for most individuals following a keto diet. Each cut is selected for its high fat-to-protein ratio, perfect for maintaining ketosis."
    },
    {
      question: "Are all the meats in the Keto Box grass-fed and pasture-raised?",
      answer: "Yes! Our beef is 100% grass-fed and grass-finished from cattle raised on open pastures. Our chicken is pasture-raised with access to bugs, grass, and sunshine. Our pork comes from heritage breeds raised without antibiotics or hormones."
    },
    {
      question: "How is the meat packaged and shipped?",
      answer: "All meat is individually vacuum-sealed and shipped frozen in insulated boxes with dry ice. The packaging is designed to keep your meat frozen for up to 48 hours in transit. You'll receive tracking information once your order ships."
    },
    {
      question: "Can I customize my Keto Box or skip deliveries?",
      answer: "The Keto Box comes with our curated selection of keto-friendly proteins. You can add extra items from the add-ons section above. For full customization, try our Build Your Box feature. You can easily skip, pause, or modify your subscription anytime from your account dashboard."
    },
    {
      question: "What's your return and satisfaction guarantee?",
      answer: "We stand behind our quality 100%. If you're not completely satisfied with any product, contact us within 7 days of delivery and we'll make it right with a full refund or replacement—no questions asked."
    },
    {
      question: "Do you offer an affiliate or referral program?",
      answer: "Yes! Our referral program rewards you when friends sign up. You'll both receive credits toward future orders. Visit your account dashboard to get your unique referral link and track your rewards."
    },
    {
      question: "How long can I store the meat?",
      answer: "When kept frozen at 0°F or below, our vacuum-sealed meats maintain peak quality for 6-12 months. For best results, we recommend consuming within 3-6 months. Store in your freezer immediately upon arrival."
    }
  ];

  return (
    <ProductBoxClient
      productTitle="Keto Box"
      productHandle="keto-box"
      productDescription={customDescription}
      productBadge="KETO FRIENDLY"
      productImages={productImages}
      addOns={addOns}
      basePrice={price}
      productItems={productItems}
      boxItems={boxItems}
      faqs={faqs}
    />
  );
}

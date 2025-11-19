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

export default async function HolidayBoxPage() {
  // Fetch the Holiday Box product
  const product = await getProductByHandle('holiday-box');

  // Extract product handles from the description to fetch box contents
  const boxItemHandles = extractProductHandles(product?.descriptionHtml || '');

  // Fetch the actual products that are in the box
  const boxItemProducts = await getProducts(boxItemHandles);

  // Fetch add-on products
  const addOnProducts = await getProducts(ADD_ON_HANDLES);

  // Extract images
  const productImages = product?.images?.edges?.map((edge: any) => ({
    url: edge.node.url,
    altText: edge.node.altText || 'Holiday Box',
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

  const price = parseFloat(product?.priceRange?.minVariantPrice?.amount || '199');

  // SEO-optimized description
  const customDescription = 'Make every holiday meal unforgettable with premium grass-fed beef and specialty cuts. Our Holiday Box features show-stopping short ribs, tri-tip steaks, and entertaining essentials perfect for Christmas dinners, Thanksgiving feasts, and special celebrations. Impress your guests with restaurant-quality meats delivered fresh to your door.';

  // Product-specific FAQs
  const faqs = [
    {
      question: "What makes the Holiday Box perfect for entertaining?",
      answer: "The Holiday Box features premium show-stopping cuts designed to impress—including grass-fed short ribs, tri-tip steaks, and crowd-pleasing favorites. Each cut is selected for its wow-factor presentation and exceptional flavor, perfect for Christmas dinners, Thanksgiving feasts, and special celebrations."
    },
    {
      question: "How many people does the Holiday Box serve?",
      answer: "The Holiday Box contains enough premium meat to serve 8-12 people for a special meal, or 4-6 people for multiple holiday gatherings. The variety of cuts allows you to create multiple impressive dishes throughout the holiday season."
    },
    {
      question: "When should I order for the holidays?",
      answer: "We recommend ordering at least 1-2 weeks before your event to ensure availability and timely delivery. For major holidays like Christmas and Thanksgiving, order 2-3 weeks in advance. All orders ship frozen and can be stored for months."
    },
    {
      question: "Are the short ribs and specialty cuts restaurant-quality?",
      answer: "Absolutely! Our Holiday Box features the same premium, grass-fed cuts used by top steakhouses. The USDA choice short ribs are bone-in for maximum flavor, and all cuts are hand-selected for quality, marbling, and tenderness."
    },
    {
      question: "How should I prepare the meats for best results?",
      answer: "Each cut comes with recommended cooking instructions. For short ribs, we suggest slow braising for fall-off-the-bone tenderness. Tri-tip steaks are perfect for grilling or roasting. All meats should be thawed in the refrigerator 24-48 hours before cooking."
    },
    {
      question: "How is the Holiday Box shipped and packaged?",
      answer: "All meats arrive individually vacuum-sealed and frozen in premium insulated packaging with dry ice. The box stays frozen for up to 48 hours in transit, and you'll receive tracking information when your order ships."
    },
    {
      question: "What's your satisfaction guarantee?",
      answer: "We guarantee 100% satisfaction. If any product doesn't meet your expectations, contact us within 7 days of delivery for a full refund or replacement. We want your holiday celebration to be perfect."
    },
    {
      question: "Can I send the Holiday Box as a gift?",
      answer: "Yes! The Holiday Box makes an excellent gift. During checkout, you can add a gift message and ship directly to the recipient. We also offer gift wrapping options for an additional fee."
    }
  ];

  return (
    <ProductBoxClient
      productTitle="Holiday Box"
      productHandle="holiday-box"
      productDescription={customDescription}
      productBadge="HOLIDAY SPECIAL"
      productImages={productImages}
      addOns={addOns}
      basePrice={price}
      productItems={productItems}
      boxItems={boxItems}
      faqs={faqs}
    />
  );
}

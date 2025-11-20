import MultiStepProductFlow from './MultiStepProductFlow';
import { getProductByHandle, getProducts } from '../../../lib/shopify/storefront';

// Add-on product handles
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

export default async function KetoBoxMultiStepPage() {
  // Fetch the main Keto Box product
  const product = await getProductByHandle('keto-box');

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Product not found</p>
      </div>
    );
  }

  // Fetch add-on products (filter out null values)
  const addOnsFetch = await getProducts(ADD_ON_HANDLES);
  const addOns = addOnsFetch.filter((p) => p !== null);

  return (
    <MultiStepProductFlow
      mainProduct={product}
      addOnProducts={addOns}
    />
  );
}

// Simulating Shopify Storefront API Shapes
export interface MoneyV2 {
  amount: string;
  currencyCode: string;
}

export interface Image {
  url: string;
  altText: string;
  width?: number;
  height?: number;
}

export interface ProductVariant {
  id: string;
  title: string;
  price: MoneyV2;
  availableForSale: boolean;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  handle: string;
  featuredImage: Image;
  priceRange: {
    minVariantPrice: MoneyV2;
  };
  tags: string[];
}

export interface CartItem {
  id: string;
  quantity: number;
  merchandise: ProductVariant;
  product: Product;
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  quote: string;
  rating: number;
  image: string;
}

export enum ReferralTier {
  TIER1 = 'Direct',
  TIER2 = 'Friend of Friend',
  TIER3 = 'Extended',
  TIER4 = 'Network'
}

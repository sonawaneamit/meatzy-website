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
  sku?: string;
  quantityAvailable?: number;
  selectedOptions?: {
    name: string;
    value: string;
  }[];
}

export interface Product {
  id: string;
  title: string;
  description: string;
  descriptionHtml?: string;
  handle: string;
  tags: string[];
  featuredImage: Image;
  images?: {
    edges: {
      node: Image;
    }[];
  };
  priceRange: {
    minVariantPrice: MoneyV2;
    maxVariantPrice?: MoneyV2;
  };
  variants: {
    edges: {
      node: ProductVariant;
    }[];
  };
  options?: {
    name: string;
    values: string[];
  }[];
  availableForSale: boolean;
}

export interface Collection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image?: Image;
  products: {
    edges: {
      node: Product;
    }[];
  };
}

export interface CartLine {
  id: string;
  quantity: number;
  merchandise: ProductVariant & {
    product: {
      title: string;
      featuredImage: Image;
    };
  };
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  lines: {
    edges: {
      node: CartLine;
    }[];
  };
  cost: {
    totalAmount: MoneyV2;
    subtotalAmount: MoneyV2;
  };
}

// Response types from GraphQL
export interface ProductsResponse {
  products: {
    edges: {
      node: Product;
    }[];
  };
}

export interface ProductByHandleResponse {
  productByHandle: Product;
}

export interface CollectionsResponse {
  collections: {
    edges: {
      node: Collection;
    }[];
  };
}

export interface CollectionByHandleResponse {
  collectionByHandle: Collection;
}

export interface CreateCartResponse {
  cartCreate: {
    cart: Cart;
    userErrors: {
      field: string[];
      message: string;
    }[];
  };
}

export interface AddToCartResponse {
  cartLinesAdd: {
    cart: Cart;
    userErrors: {
      field: string[];
      message: string;
    }[];
  };
}

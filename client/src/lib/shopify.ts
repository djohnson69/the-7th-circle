export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml?: string;
  productType: string;
  tags?: string[];
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice?: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
        width?: number;
        height?: number;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        priceV2: {
          amount: string;
          currencyCode: string;
        };
        availableForSale: boolean;
        quantityAvailable?: number;
        selectedOptions?: Array<{
          name: string;
          value: string;
        }>;
        image?: {
          url: string;
          altText: string | null;
        };
      };
    }>;
  };
  options?: Array<{
    id: string;
    name: string;
    values: string[];
  }>;
}

export interface ShopifyProductEdge {
  node: ShopifyProduct;
}

export interface ShopifyProductsResponse {
  edges: ShopifyProductEdge[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string;
  };
}

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image?: {
    url: string;
    altText: string | null;
  };
  products?: {
    edges: ShopifyProductEdge[];
  };
}

export async function fetchProducts(first: number = 50): Promise<ShopifyProductsResponse> {
  const response = await fetch(`/api/products?first=${first}`);
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return response.json();
}

export async function fetchProduct(handle: string): Promise<ShopifyProduct> {
  const response = await fetch(`/api/products/${handle}`);
  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }
  return response.json();
}

export async function fetchCollections(first: number = 20): Promise<{ edges: Array<{ node: ShopifyCollection }> }> {
  const response = await fetch(`/api/collections?first=${first}`);
  if (!response.ok) {
    throw new Error("Failed to fetch collections");
  }
  return response.json();
}

export async function fetchCollection(handle: string, first: number = 50): Promise<ShopifyCollection> {
  const response = await fetch(`/api/collections/${handle}?first=${first}`);
  if (!response.ok) {
    throw new Error("Failed to fetch collection");
  }
  return response.json();
}

export async function searchProducts(query: string, first: number = 20): Promise<ShopifyProductsResponse> {
  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&first=${first}`);
  if (!response.ok) {
    throw new Error("Failed to search products");
  }
  return response.json();
}

export function transformProductForCard(product: ShopifyProduct) {
  const firstImage = product.images.edges[0]?.node;
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const firstVariant = product.variants.edges[0]?.node;
  
  const hasSizeOptions = product.variants.edges.some(v => 
    v.node.selectedOptions?.some(opt => opt.name.toLowerCase() === "size")
  );
  const hasMultipleVariants = product.variants.edges.length > 1;
  
  return {
    id: product.handle,
    title: product.title,
    price,
    image: firstImage?.url || "https://placehold.co/600x600/1a1a1a/ffffff?text=No+Image",
    category: product.productType || "Apparel",
    variantId: firstVariant?.id || "",
    requiresSizeSelection: hasSizeOptions && hasMultipleVariants,
  };
}

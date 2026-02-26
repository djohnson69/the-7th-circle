import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import { insertReviewSchema, insertSubscriberSchema, insertAnalyticsEventSchema } from "@shared/schema";
import crypto from "crypto";
import { setupAuth, isAuthenticated } from "./replitAuth";

const SHOPIFY_STORE_DOMAIN = "apgxpf-9s.myshopify.com";
const SHOPIFY_ADMIN_API_VERSION = "2025-01";

async function shopifyAdminRequest(query: string, variables: Record<string, unknown> = {}) {
  const accessToken = process.env.SHOPIFY_ADMIN_TOKEN;
  
  if (!accessToken) {
    throw new Error("SHOPIFY_ADMIN_TOKEN is not configured");
  }

  const endpoint = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_ADMIN_API_VERSION}/graphql.json`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": accessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await response.json();

  if (json.errors) {
    console.error("Shopify GraphQL Errors:", json.errors);
    throw new Error(json.errors[0]?.message || "Shopify API error");
  }

  return json.data;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  await setupAuth(app);

  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.get("/api/search", async (req, res) => {
    try {
      const searchQuery = req.query.q as string || "";
      const first = parseInt(req.query.first as string) || 20;

      if (!searchQuery.trim()) {
        return res.json({ edges: [] });
      }

      const query = `
        query searchProducts($query: String!, $first: Int!) {
          products(first: $first, query: $query) {
            edges {
              node {
                id
                title
                handle
                description
                productType
                status
                priceRangeV2 {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
                images(first: 1) {
                  edges {
                    node {
                      url
                      altText
                    }
                  }
                }
                variants(first: 1) {
                  edges {
                    node {
                      id
                      price
                    }
                  }
                }
              }
            }
          }
        }
      `;

      const data = await shopifyAdminRequest(query, { query: searchQuery, first });
      
      const transformedProducts = {
        edges: data.products.edges
          .filter((edge: any) => edge.node.status === "ACTIVE")
          .map((edge: any) => ({
            node: {
              ...edge.node,
              priceRange: edge.node.priceRangeV2,
              variants: {
                edges: edge.node.variants.edges.map((v: any) => ({
                  node: {
                    ...v.node,
                    priceV2: {
                      amount: v.node.price,
                      currencyCode: edge.node.priceRangeV2?.minVariantPrice?.currencyCode || "USD"
                    }
                  }
                }))
              }
            }
          }))
      };
      
      res.json(transformedProducts);
    } catch (error) {
      console.error("Error searching products:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.get("/api/products", async (req, res) => {
    try {
      const first = parseInt(req.query.first as string) || 50;

      const query = `
        query getProducts($first: Int!) {
          products(first: $first) {
            edges {
              node {
                id
                title
                handle
                description
                productType
                status
                priceRangeV2 {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                  maxVariantPrice {
                    amount
                    currencyCode
                  }
                }
                images(first: 5) {
                  edges {
                    node {
                      url
                      altText
                      width
                      height
                    }
                  }
                }
                variants(first: 20) {
                  edges {
                    node {
                      id
                      title
                      price
                      inventoryQuantity
                      selectedOptions {
                        name
                        value
                      }
                    }
                  }
                }
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      `;

      const data = await shopifyAdminRequest(query, { first });
      
      const transformedProducts = {
        edges: data.products.edges
          .filter((edge: any) => edge.node.status === "ACTIVE")
          .map((edge: any) => ({
            node: {
              ...edge.node,
              priceRange: edge.node.priceRangeV2,
              variants: {
                edges: edge.node.variants.edges.map((v: any) => ({
                  node: {
                    ...v.node,
                    priceV2: {
                      amount: v.node.price,
                      currencyCode: edge.node.priceRangeV2?.minVariantPrice?.currencyCode || "USD"
                    },
                    availableForSale: v.node.inventoryQuantity > 0,
                    quantityAvailable: v.node.inventoryQuantity
                  }
                }))
              }
            }
          })),
        pageInfo: data.products.pageInfo
      };
      
      res.json(transformedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.get("/api/products/:handle", async (req, res) => {
    try {
      const { handle } = req.params;

      const query = `
        query getProduct($handle: String!) {
          productByHandle(handle: $handle) {
            id
            title
            handle
            description
            descriptionHtml
            productType
            tags
            status
            priceRangeV2 {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 10) {
              edges {
                node {
                  url
                  altText
                  width
                  height
                }
              }
            }
            variants(first: 50) {
              edges {
                node {
                  id
                  title
                  price
                  inventoryQuantity
                  selectedOptions {
                    name
                    value
                  }
                  image {
                    url
                    altText
                  }
                }
              }
            }
            options {
              id
              name
              values
            }
          }
        }
      `;

      const data = await shopifyAdminRequest(query, { handle });
      
      if (!data.productByHandle) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      const product = data.productByHandle;
      const transformedProduct = {
        ...product,
        priceRange: product.priceRangeV2,
        variants: {
          edges: product.variants.edges.map((v: any) => ({
            node: {
              ...v.node,
              priceV2: {
                amount: v.node.price,
                currencyCode: product.priceRangeV2?.minVariantPrice?.currencyCode || "USD"
              },
              availableForSale: v.node.inventoryQuantity > 0,
              quantityAvailable: v.node.inventoryQuantity
            }
          }))
        }
      };
      
      res.json(transformedProduct);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.get("/api/collections", async (req, res) => {
    try {
      const first = parseInt(req.query.first as string) || 20;

      const query = `
        query getCollections($first: Int!) {
          collections(first: $first) {
            edges {
              node {
                id
                title
                handle
                description
                image {
                  url
                  altText
                }
              }
            }
          }
        }
      `;

      const data = await shopifyAdminRequest(query, { first });
      res.json(data.collections);
    } catch (error) {
      console.error("Error fetching collections:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.get("/api/collections/:handle", async (req, res) => {
    try {
      const { handle } = req.params;
      const first = parseInt(req.query.first as string) || 50;

      const query = `
        query getCollection($handle: String!, $first: Int!) {
          collectionByHandle(handle: $handle) {
            id
            title
            handle
            description
            image {
              url
              altText
            }
            products(first: $first) {
              edges {
                node {
                  id
                  title
                  handle
                  productType
                  status
                  priceRangeV2 {
                    minVariantPrice {
                      amount
                      currencyCode
                    }
                  }
                  images(first: 1) {
                    edges {
                      node {
                        url
                        altText
                      }
                    }
                  }
                  variants(first: 1) {
                    edges {
                      node {
                        id
                        price
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `;

      const data = await shopifyAdminRequest(query, { handle, first });
      
      if (!data.collectionByHandle) {
        return res.status(404).json({ error: "Collection not found" });
      }
      
      const collection = data.collectionByHandle;
      const transformedCollection = {
        ...collection,
        products: {
          edges: collection.products.edges
            .filter((edge: any) => edge.node.status === "ACTIVE")
            .map((edge: any) => ({
              node: {
                ...edge.node,
                priceRange: edge.node.priceRangeV2,
                variants: {
                  edges: edge.node.variants.edges.map((v: any) => ({
                    node: {
                      ...v.node,
                      priceV2: {
                        amount: v.node.price,
                        currencyCode: edge.node.priceRangeV2?.minVariantPrice?.currencyCode || "USD"
                      }
                    }
                  }))
                }
              }
            }))
        }
      };
      
      res.json(transformedCollection);
    } catch (error) {
      console.error("Error fetching collection:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.get("/api/variants/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const gid = id.startsWith("gid://") ? id : `gid://shopify/ProductVariant/${id}`;

      const query = `
        query getVariant($id: ID!) {
          productVariant(id: $id) {
            id
            title
            price
            availableForSale
            inventoryQuantity
            image {
              url
              altText
            }
            product {
              title
              handle
            }
          }
        }
      `;

      const data = await shopifyAdminRequest(query, { id: gid });
      
      if (!data.productVariant) {
        return res.status(404).json({ error: "Variant not found" });
      }
      
      const variant = data.productVariant;
      res.json({
        id: variant.id,
        title: variant.title,
        price: { amount: variant.price, currencyCode: "USD" },
        image: variant.image || { url: "", altText: "" },
        product: variant.product,
        availableForSale: variant.availableForSale,
        inventoryQuantity: variant.inventoryQuantity
      });
    } catch (error) {
      console.error("Error fetching variant:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.get("/objects/:objectPath(*)", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error getting object:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  app.post("/api/objects/upload", async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.get("/api/reviews/:productHandle", async (req, res) => {
    try {
      const { productHandle } = req.params;
      const reviews = await storage.getReviewsByProduct(productHandle);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      const parsed = insertReviewSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.message });
      }
      
      const objectStorageService = new ObjectStorageService();
      const images = parsed.data.images?.map(img => 
        objectStorageService.normalizeObjectEntityPath(img)
      ) || [];
      
      const review = await storage.createReview({
        ...parsed.data,
        images,
      });
      res.status(201).json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.post("/api/subscribers", async (req, res) => {
    try {
      const parsed = insertSubscriberSchema.safeParse({
        ...req.body,
        email: req.body.email?.toLowerCase().trim(),
      });
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.message });
      }
      
      const subscriber = await storage.createSubscriber(parsed.data);
      res.status(201).json({ success: true, subscriber });
    } catch (error) {
      console.error("Error creating subscriber:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.get("/api/subscribers", isAuthenticated, async (req, res) => {
    try {
      const subscribers = await storage.getAllSubscribers();
      res.json(subscribers);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.post("/api/analytics/event", async (req, res) => {
    try {
      const ipHash = crypto.createHash('sha256')
        .update(req.ip || req.headers['x-forwarded-for']?.toString() || 'unknown')
        .digest('hex')
        .substring(0, 16);
      
      const parsed = insertAnalyticsEventSchema.safeParse({
        ...req.body,
        userAgent: req.headers['user-agent'],
        ipHash,
      });
      
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.message });
      }
      
      const event = await storage.logAnalyticsEvent(parsed.data);
      
      if (process.env.META_PIXEL_ACCESS_TOKEN && process.env.META_PIXEL_ID) {
        try {
          await sendMetaConversionsAPI(parsed.data, ipHash, req.headers['user-agent'] || '');
        } catch (metaError) {
          console.error("Meta CAPI error:", metaError);
        }
      }
      
      res.status(201).json({ success: true });
    } catch (error) {
      console.error("Error logging analytics event:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  return httpServer;
}

async function sendMetaConversionsAPI(event: any, ipHash: string, userAgent: string) {
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_PIXEL_ACCESS_TOKEN;
  
  if (!pixelId || !accessToken) return;
  
  const eventNameMap: Record<string, string> = {
    'page_view': 'PageView',
    'view_content': 'ViewContent',
    'add_to_cart': 'AddToCart',
    'begin_checkout': 'InitiateCheckout',
    'purchase': 'Purchase',
    'lead': 'Lead',
  };
  
  const fbEventName = eventNameMap[event.eventName] || event.eventName;
  
  const payload = {
    data: [{
      event_name: fbEventName,
      event_time: Math.floor(Date.now() / 1000),
      action_source: 'website',
      user_data: {
        client_ip_address: ipHash,
        client_user_agent: userAgent,
      },
      custom_data: event.eventData,
    }],
  };
  
  const response = await fetch(
    `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }
  );
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Meta CAPI error: ${errorText}`);
  }
}

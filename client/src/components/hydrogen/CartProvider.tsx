import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { trackAddToCart, trackBeginCheckout } from '@/lib/analytics';

const SHOPIFY_STORE_URL = "https://the7thcircle.us";

interface CartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: { amount: string; currencyCode: string };
    image?: { url: string; altText?: string };
    product: { title: string };
  };
}

interface Cart {
  id: string;
  lines: CartLine[];
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: { amount: string; currencyCode: string };
    totalAmount: { amount: string; currencyCode: string };
    totalTaxAmount: { amount: string; currencyCode: string };
  };
}

interface CartContextType {
  cart: Cart | null;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  linesAdd: (lines: Array<{ merchandiseId: string; quantity: number }>) => Promise<void>;
  linesRemove: (lineIds: string[]) => void;
  linesUpdate: (lines: Array<{ id: string; quantity: number }>) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function generateCheckoutUrl(lines: CartLine[]): string {
  if (lines.length === 0) return "#";
  
  const cartItems = lines.map(line => {
    const variantId = line.merchandise.id.replace("gid://shopify/ProductVariant/", "");
    return `${variantId}:${line.quantity}`;
  }).join(",");
  
  return `${SHOPIFY_STORE_URL}/cart/${cartItems}`;
}

function calculateTotals(lines: CartLine[]) {
  const totalQuantity = lines.reduce((sum, line) => sum + line.quantity, 0);
  const totalAmount = lines.reduce(
    (sum, line) => sum + parseFloat(line.merchandise.price.amount) * line.quantity,
    0
  );
  
  return {
    totalQuantity,
    cost: {
      subtotalAmount: { amount: totalAmount.toFixed(2), currencyCode: 'USD' },
      totalAmount: { amount: totalAmount.toFixed(2), currencyCode: 'USD' },
      totalTaxAmount: { amount: '0.00', currencyCode: 'USD' },
    },
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<Cart | null>({
    id: 'local-cart',
    lines: [],
    checkoutUrl: '#',
    totalQuantity: 0,
    cost: {
      subtotalAmount: { amount: '0.00', currencyCode: 'USD' },
      totalAmount: { amount: '0.00', currencyCode: 'USD' },
      totalTaxAmount: { amount: '0.00', currencyCode: 'USD' },
    },
  });

  const linesAdd = useCallback(async (newLines: Array<{ merchandiseId: string; quantity: number }>) => {
    for (const line of newLines) {
      try {
        const encodedId = encodeURIComponent(line.merchandiseId);
        const response = await fetch(`/api/variants/${encodedId}`);
        
        if (!response.ok) {
          console.error("Failed to fetch variant data");
          continue;
        }
        
        const variantData = await response.json();
        
        trackAddToCart({
          id: variantData.product?.handle || line.merchandiseId,
          variantId: line.merchandiseId,
          title: variantData.product?.title || 'Product',
          price: parseFloat(variantData.price?.amount || '0'),
          quantity: line.quantity,
        });
        
        setCart((prev) => {
          if (!prev) return null;
          
          const updatedLines = [...prev.lines];
          const existingLineIndex = updatedLines.findIndex(l => l.merchandise.id === line.merchandiseId);
          
          if (existingLineIndex >= 0) {
            updatedLines[existingLineIndex].quantity += line.quantity;
          } else {
            updatedLines.push({
              id: `line-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              quantity: line.quantity,
              merchandise: {
                id: line.merchandiseId,
                title: variantData.title || "Default",
                price: variantData.price,
                product: { title: variantData.product?.title || "Product" },
                image: variantData.image?.url ? { url: variantData.image.url, altText: variantData.image.altText } : undefined
              }
            });
          }

          const totals = calculateTotals(updatedLines);
          const checkoutUrl = generateCheckoutUrl(updatedLines);
          
          return { ...prev, lines: updatedLines, checkoutUrl, ...totals };
        });
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    }
    
    setCartOpen(true);
  }, []);

  const linesRemove = useCallback((lineIds: string[]) => {
    setCart((prev) => {
      if (!prev) return null;
      const updatedLines = prev.lines.filter((line) => !lineIds.includes(line.id));
      const totals = calculateTotals(updatedLines);
      const checkoutUrl = generateCheckoutUrl(updatedLines);
      return { ...prev, lines: updatedLines, checkoutUrl, ...totals };
    });
  }, []);

  const linesUpdate = useCallback((updatedLines: Array<{ id: string; quantity: number }>) => {
    setCart((prev) => {
      if (!prev) return null;
      const newLines = prev.lines.map((line) => {
        const update = updatedLines.find((u) => u.id === line.id);
        if (update) {
          return { ...line, quantity: update.quantity };
        }
        return line;
      });
      const totals = calculateTotals(newLines);
      const checkoutUrl = generateCheckoutUrl(newLines);
      return { ...prev, lines: newLines, checkoutUrl, ...totals };
    });
  }, []);

  const value = useMemo(() => ({
    cart,
    cartOpen,
    setCartOpen,
    linesAdd,
    linesRemove,
    linesUpdate,
  }), [cart, cartOpen, linesAdd, linesRemove, linesUpdate]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

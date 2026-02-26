import { useEffect, useState } from "react";
import { useSearch } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { searchProducts, transformProductForCard, type ShopifyProduct } from "@/lib/shopify";
import { ProductCard } from "@/components/ProductCard";
import { Loader2 } from "lucide-react";

export default function Search() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const query = params.get("q") || "";

  const { data: results, isLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      if (!query.trim()) return { edges: [] };
      return searchProducts(query, 50);
    },
    enabled: !!query.trim(),
  });

  const products = results?.edges.map(e => e.node) || [];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight mb-2">
          Search Results
        </h1>
        {query && (
          <p className="text-muted-foreground">
            {isLoading ? "Searching..." : `${products.length} result${products.length !== 1 ? 's' : ''} for "${query}"`}
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {products.map((product: ShopifyProduct) => {
            const cardData = transformProductForCard(product);
            return (
              <div key={product.id} data-testid={`card-product-${product.handle}`}>
                <ProductCard {...cardData} />
              </div>
            );
          })}
        </div>
      ) : query ? (
        <div className="py-20 text-center">
          <p className="text-xl text-muted-foreground mb-4">No products found for "{query}"</p>
          <p className="text-sm text-muted-foreground">Try a different search term</p>
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-xl text-muted-foreground">Enter a search term to find products</p>
        </div>
      )}
    </div>
  );
}

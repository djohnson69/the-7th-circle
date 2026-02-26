import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "./ProductCard";
import { fetchProducts, transformProductForCard, type ShopifyProduct } from "@/lib/shopify";
import { Loader2 } from "lucide-react";

export function FeaturedCollection({ title = "Latest Drop" }: { title?: string }) {
  const { data: productsData, isLoading, error } = useQuery({
    queryKey: ["featured-products"],
    queryFn: () => fetchProducts(8),
  });

  const products = productsData?.edges.slice(0, 4).map(e => transformProductForCard(e.node)) || [];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex items-end justify-between border-b border-border pb-4">
          <div>
            <h2 className="font-display text-4xl font-bold uppercase tracking-tighter text-foreground">
              {title}
            </h2>
            <p className="mt-2 text-muted-foreground max-w-md">
              Fresh gear for the mission ahead. 
            </p>
          </div>
          <a href="/collections/all" className="hidden md:block font-display text-sm font-bold uppercase tracking-widest text-primary hover:text-white transition-colors" data-testid="link-view-all">
            View All Products &rarr;
          </a>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Unable to load products</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} data-testid={`featured-product-${product.id}`}>
                <ProductCard {...product} />
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-12 text-center md:hidden">
          <a href="/collections/all" className="font-display text-sm font-bold uppercase tracking-widest text-primary" data-testid="link-view-all-mobile">
            View All Products &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}

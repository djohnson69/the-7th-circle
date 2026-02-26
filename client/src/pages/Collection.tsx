import { ProductGrid } from "@/components/ProductGrid";
import { useRoute } from "wouter";

export default function Collection() {
  const [match, params] = useRoute("/collections/:handle");
  const handle = params?.handle || "all";
  
  // Format handle to title (e.g., "latest-drop" -> "Latest Drop")
  const title = handle.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <main className="flex-grow">
        <div className="bg-secondary/10 py-12 border-b border-border">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-display text-5xl font-bold uppercase tracking-tighter text-foreground">
              {title}
            </h1>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Premium tactical apparel designed for the relentless. 
              Built to withstand the rigors of training and the demands of the lifestyle.
            </p>
          </div>
        </div>
        <ProductGrid collectionHandle={handle} />
      </main>
    </div>
  );
}

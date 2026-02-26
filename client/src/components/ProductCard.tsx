import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Image } from "@/components/hydrogen/Image";
import { Money } from "@/components/hydrogen/Money";
import { Link, useLocation } from "wouter";
import { useCart } from "@/components/hydrogen/CartProvider";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";

interface ProductProps {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  variantId?: string;
  requiresSizeSelection?: boolean;
}

interface Review {
  id: string;
  rating: number;
}

export function ProductCard({ id, title, price, image, category, variantId, requiresSizeSelection }: ProductProps) {
  const { linesAdd } = useCart();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: reviews = [] } = useQuery<Review[]>({
    queryKey: ["reviews", id],
    queryFn: async () => {
      const res = await fetch(`/api/reviews/${id}`);
      return res.json();
    },
    staleTime: 60000,
  });

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
    : 0;
  const reviewCount = reviews.length;

  const priceData = {
    amount: price.toString(),
    currencyCode: 'USD'
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (requiresSizeSelection) {
      setLocation(`/products/${id}`);
      toast({
        title: "Select a Size",
        description: "Please choose your size on the product page.",
      });
      return;
    }
    
    linesAdd([{ merchandiseId: variantId || `variant-${id}`, quantity: 1 }]);
    toast({
      title: "Added to Cart",
      description: `${title} added to your cart.`,
    });
  };

  return (
    <Card className="group relative overflow-hidden rounded-none border-none bg-transparent transition-all">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden bg-secondary/20">
          <Link href={`/products/${id}`}>
            <div className="cursor-pointer h-full w-full">
              <Image 
                src={image} 
                alt={title} 
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                width={600}
                height={600}
              />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
            </div>
          </Link>
          
          <div className="absolute bottom-0 left-0 right-0 translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0">
            <Button 
              className="w-full rounded-none bg-white text-black hover:bg-primary hover:text-primary-foreground font-display uppercase tracking-wider font-bold"
              onClick={handleQuickAdd}
              data-testid={`button-quick-add-${id}`}
            >
              {requiresSizeSelection ? "Select Size" : "Quick Add"}
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-1 p-4 pl-0">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground" data-testid={`text-category-${id}`}>{category}</span>
        <Link href={`/products/${id}`}>
          <h3 className="font-display text-xl font-bold uppercase tracking-tight text-foreground group-hover:text-primary transition-colors cursor-pointer" data-testid={`text-title-${id}`}>
            {title}
          </h3>
        </Link>
        <div className="flex items-center gap-3">
          <Money 
            data={priceData} 
            className="font-sans text-lg font-medium text-foreground/80"
          />
          {reviewCount > 0 && (
            <div className="flex items-center gap-1" data-testid={`rating-${id}`}>
              <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
              <span className="text-sm text-muted-foreground">
                {averageRating.toFixed(1)} ({reviewCount})
              </span>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

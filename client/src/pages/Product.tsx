import { Button } from "@/components/ui/button";
import { Image } from "@/components/hydrogen/Image";
import { Money } from "@/components/hydrogen/Money";
import { ShopPayButton } from "@/components/hydrogen/ShopPayButton";
import { useCart } from "@/components/hydrogen/CartProvider";
import { useState, useEffect, useRef } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { fetchProduct, fetchProducts, transformProductForCard, type ShopifyProduct } from "@/lib/shopify";
import { Loader2, Clock, Star } from "lucide-react";
import { ReviewSection } from "@/components/ReviewSection";
import { trackViewContent } from "@/lib/analytics";

interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  authorName: string;
  createdAt: string;
}

function RelatedProducts() {
  const { data: productsData } = useQuery({
    queryKey: ["related-products"],
    queryFn: () => fetchProducts(8),
  });

  const relatedProducts = productsData?.edges.slice(0, 4).map(e => transformProductForCard(e.node)) || [];

  if (relatedProducts.length === 0) return null;

  return (
    <div className="border-t border-border pt-16 mt-0">
      <h3 className="font-display text-2xl font-bold uppercase tracking-wide mb-8">Complete The Loadout</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <a href={`/products/${product.id}`} key={product.id} className="group cursor-pointer" data-testid={`related-product-${product.id}`}>
            <div className="aspect-square bg-white mb-4 overflow-hidden border border-transparent group-hover:border-primary transition-colors">
              <img src={product.image} alt={product.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
            </div>
            <h4 className="font-display font-bold uppercase tracking-wide text-sm group-hover:text-primary transition-colors">{product.title}</h4>
            <p className="text-muted-foreground text-sm">${product.price.toFixed(2)}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function Product() {
  const { handle } = useParams<{ handle: string }>();
  const { linesAdd } = useCart();
  const { toast } = useToast();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", handle],
    queryFn: () => fetchProduct(handle!),
    enabled: !!handle,
  });

  const { data: reviews = [] } = useQuery<Review[]>({
    queryKey: ["reviews", handle],
    queryFn: async () => {
      const res = await fetch(`/api/reviews/${handle}`);
      return res.json();
    },
    enabled: !!handle,
  });

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
    : 0;
  const reviewCount = reviews.length;

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  const hasTrackedView = useRef(false);
  
  useEffect(() => {
    if (product) {
      const firstVariant = product.variants.edges[0]?.node;
      if (firstVariant && !selectedVariantId) {
        setSelectedVariantId(firstVariant.id);
      }
      const firstImage = product.images.edges[0]?.node;
      if (firstImage && !selectedImageUrl) {
        setSelectedImageUrl(firstImage.url);
      }
      
      if (!hasTrackedView.current) {
        trackViewContent({
          id: product.handle,
          title: product.title,
          price: parseFloat(product.priceRange?.minVariantPrice?.amount || '0'),
          category: product.productType || undefined,
        });
        hasTrackedView.current = true;
      }
    }
  }, [product, selectedVariantId, selectedImageUrl]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
        <a href="/collections/all" className="text-primary hover:underline">Browse all products</a>
      </div>
    );
  }

  const variants = product.variants.edges.map(e => e.node);
  const images = product.images.edges.map(e => e.node);
  const selectedVariant = variants.find(v => v.id === selectedVariantId) || variants[0];
  const selectedImage = images.find(i => i.url === selectedImageUrl) || images[0];

  const productOptions = product.options || [];
  const hasMultipleVariants = variants.length > 1;

  const selectedOptions: Record<string, string> = {};
  selectedVariant?.selectedOptions?.forEach(opt => {
    selectedOptions[opt.name] = opt.value;
  });

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    linesAdd([{ merchandiseId: selectedVariant.id, quantity: 1 }]);
    toast({
      title: "Added to Cart",
      description: `${product.title} added to your cart.`,
    });
  };

  const handleOptionChange = (optionName: string, value: string) => {
    const newOptions = { ...selectedOptions, [optionName]: value };
    const matchingVariant = variants.find(v => 
      v.selectedOptions?.every(opt => newOptions[opt.name] === opt.value)
    );
    if (matchingVariant) {
      setSelectedVariantId(matchingVariant.id);
      if (matchingVariant.image?.url) {
        setSelectedImageUrl(matchingVariant.image.url);
      }
    }
  };

  const isOptionValueAvailable = (optionName: string, value: string) => {
    const testOptions = { ...selectedOptions, [optionName]: value };
    const variant = variants.find(v => 
      v.selectedOptions?.every(opt => testOptions[opt.name] === opt.value)
    );
    return variant?.availableForSale !== false;
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden">
            {selectedImage && (
              <Image 
                data={{ url: selectedImage.url, altText: selectedImage.altText || product.title }} 
                className="w-full h-full object-contain"
                width={1000}
                height={1000}
              />
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {images.map((image, index) => (
                <button 
                  key={index}
                  onClick={() => setSelectedImageUrl(image.url)}
                  className={`aspect-square overflow-hidden rounded ${selectedImageUrl === image.url ? 'ring-2 ring-primary' : ''} hover:ring-2 hover:ring-primary/50 transition-all`}
                  data-testid={`button-image-${index}`}
                >
                  <Image 
                    data={{ url: image.url, altText: image.altText || `${product.title} ${index + 1}` }} 
                    className="w-full h-full object-contain"
                    width={200}
                    height={200}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <h1 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tighter text-foreground mb-2" data-testid="text-product-title">
            {product.title}
          </h1>
          <div className="flex items-center gap-4 mb-6" data-testid="text-product-price">
            <span className="text-2xl text-primary font-sans font-bold">
              <Money data={product.priceRange.minVariantPrice} />
            </span>
            {reviewCount > 0 && (
              <div className="flex items-center gap-2" data-testid="product-rating">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= Math.round(averageRating)
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground text-sm">
                  {averageRating.toFixed(1)} ({reviewCount})
                </span>
              </div>
            )}
          </div>

          {product.descriptionHtml ? (
            <div 
              className="prose prose-invert text-muted-foreground mb-8"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          ) : product.description ? (
            <p className="text-muted-foreground mb-8">{product.description}</p>
          ) : null}
          
          {hasMultipleVariants && productOptions.length > 0 && (
            <div className="space-y-6 mb-8">
              {productOptions.map((option) => (
                <div key={option.name}>
                  <label className="block text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
                    {option.name}: <span className="text-foreground">{selectedOptions[option.name]}</span>
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {option.values.map((value) => {
                      const isAvailable = isOptionValueAvailable(option.name, value);
                      const isSelected = selectedOptions[option.name] === value;
                      
                      return (
                        <button
                          key={value}
                          onClick={() => handleOptionChange(option.name, value)}
                          disabled={!isAvailable}
                          className={`min-w-[3rem] h-12 px-4 border font-bold uppercase transition-all ${
                            !isAvailable ? 'border-border/50 text-muted-foreground/50 cursor-not-allowed line-through' : 'hover:border-red-500/50 hover:text-foreground'
                          }`}
                          style={isSelected ? {
                            backgroundColor: 'hsl(354, 85%, 45%)',
                            borderColor: 'hsl(354, 85%, 45%)',
                            color: 'white'
                          } : {
                            backgroundColor: 'transparent',
                            borderColor: 'hsl(0, 0%, 20%)',
                            color: 'hsl(0, 0%, 60%)'
                          }}
                          data-testid={`button-option-${option.name}-${value}`}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-4">
            <Button 
              onClick={handleAddToCart}
              disabled={!selectedVariant?.availableForSale}
              className="w-full h-14 bg-primary text-primary-foreground font-display text-xl font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors rounded-none"
              data-testid="button-add-to-cart"
            >
              {selectedVariant?.availableForSale !== false ? 'Add to Cart' : 'Sold Out'}
            </Button>
            
            <ShopPayButton 
              variantIds={selectedVariant ? [selectedVariant.id] : []} 
              className="w-full h-14 rounded-none"
            />
          </div>

          
          {selectedVariant?.quantityAvailable !== undefined && selectedVariant.quantityAvailable <= 5 && selectedVariant.quantityAvailable > 0 && (
            <div className="mt-6 p-4 border border-red-900/50 bg-red-950/20 animate-pulse">
              <p className="text-red-500 font-bold uppercase tracking-wider text-sm text-center flex items-center justify-center gap-2">
                <Clock className="h-4 w-4" />
                Low Stock - Only {selectedVariant.quantityAvailable} items left
              </p>
            </div>
          )}
          
        </div>
      </div>
      
      <RelatedProducts />
      <ReviewSection productHandle={handle!} />
    </div>
  );
}

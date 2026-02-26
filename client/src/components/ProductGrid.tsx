import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "./ProductCard";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Filter, SlidersHorizontal, Loader2, X, ChevronDown, Check } from "lucide-react";
import { fetchProducts, fetchCollection, transformProductForCard, type ShopifyProduct } from "@/lib/shopify";

interface ProductGridProps {
  collectionHandle?: string;
}

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "One Size"];

const CATEGORIES = [
  { label: "T-Shirts", keywords: ["t-shirt", "tee", "shirt"] },
  { label: "Tanks", keywords: ["tank", "racerback"] },
  { label: "Hoodies", keywords: ["hoodie", "sweatshirt"] },
  { label: "Shorts", keywords: ["shorts"] },
  { label: "Swimwear", keywords: ["swim", "trunks"] },
  { label: "Outerwear", keywords: ["windbreaker", "jacket"] },
  { label: "Headwear", keywords: ["hat", "cap", "beanie", "trucker"] },
  { label: "Flags", keywords: ["flag"] },
  { label: "Stickers", keywords: ["slap", "sticker"] },
  { label: "Accessories", keywords: ["mousepad", "slides", "sign"] },
];

export function ProductGrid({ collectionHandle }: ProductGridProps) {
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("featured");
  const [sizeDropdownOpen, setSizeDropdownOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  const { data: productsData, isLoading, error } = useQuery({
    queryKey: ["products", collectionHandle],
    queryFn: async () => {
      if (collectionHandle && collectionHandle !== "all" && collectionHandle !== "latest-drop") {
        try {
          const collection = await fetchCollection(collectionHandle);
          return collection.products?.edges.map(e => e.node) || [];
        } catch {
          const allProducts = await fetchProducts();
          return allProducts.edges.map(e => e.node);
        }
      }
      const allProducts = await fetchProducts();
      return allProducts.edges.map(e => e.node);
    },
  });

  const products = productsData || [];

  const priceStats = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 100 };
    const prices = products
      .map((p: ShopifyProduct) => parseFloat(p.priceRange?.minVariantPrice?.amount || "0"))
      .filter((price) => Number.isFinite(price) && price > 0);
    if (prices.length === 0) return { min: 0, max: 100 };
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices))
    };
  }, [products]);

  const getProductCategory = (product: ShopifyProduct): string | null => {
    const title = product.title.toLowerCase();
    const handle = product.handle.toLowerCase();
    for (const cat of CATEGORIES) {
      if (cat.keywords.some(kw => title.includes(kw) || handle.includes(kw))) {
        return cat.label;
      }
    }
    return null;
  };

  const sizes = useMemo(() => {
    const allSizes = new Set<string>();
    const productsToCheck = selectedCategories.length > 0
      ? products.filter((p: ShopifyProduct) => {
          const cat = getProductCategory(p);
          return cat && selectedCategories.includes(cat);
        })
      : products;
    
    productsToCheck.forEach((p: ShopifyProduct) => {
      p.variants.edges.forEach(v => {
        v.node.selectedOptions?.forEach(opt => {
          if (opt.name.toLowerCase() === "size") {
            allSizes.add(opt.value);
          }
        });
      });
    });
    return Array.from(allSizes).sort((a, b) => {
      const aIndex = SIZE_ORDER.indexOf(a);
      const bIndex = SIZE_ORDER.indexOf(b);
      if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  }, [products, selectedCategories]);

  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p: ShopifyProduct) => {
      const cat = getProductCategory(p);
      if (cat) cats.add(cat);
    });
    return CATEGORIES.filter(c => cats.has(c.label)).map(c => c.label);
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = products;

    // Price filter
    if (priceRange) {
      result = result.filter((p: ShopifyProduct) => {
        const price = parseFloat(p.priceRange.minVariantPrice.amount);
        return price >= priceRange[0] && price <= priceRange[1];
      });
    }

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter((p: ShopifyProduct) => {
        const cat = getProductCategory(p);
        return cat && selectedCategories.includes(cat);
      });
    }

    // Size filter
    if (selectedSizes.length > 0) {
      result = result.filter((p: ShopifyProduct) => 
        p.variants.edges.some(v => 
          v.node.selectedOptions?.some(opt => 
            opt.name.toLowerCase() === "size" && selectedSizes.includes(opt.value)
          )
        )
      );
    }

    // Availability filter
    if (selectedAvailability.length > 0) {
      result = result.filter((p: ShopifyProduct) => {
        const hasInStock = p.variants.edges.some(v => v.node.availableForSale === true);
        const allOutOfStock = p.variants.edges.every(v => v.node.availableForSale === false);
        const isComingSoon = p.tags?.includes("coming-soon") || p.title.toLowerCase().includes("coming soon");
        
        if (selectedAvailability.includes("In Stock") && hasInStock) return true;
        if (selectedAvailability.includes("Out of Stock") && allOutOfStock && !isComingSoon) return true;
        if (selectedAvailability.includes("Coming Soon") && isComingSoon) return true;
        return false;
      });
    }

    // Sorting
    if (sortBy === "price-asc") {
      result = [...result].sort((a: ShopifyProduct, b: ShopifyProduct) => 
        parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount)
      );
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a: ShopifyProduct, b: ShopifyProduct) => 
        parseFloat(b.priceRange.minVariantPrice.amount) - parseFloat(a.priceRange.minVariantPrice.amount)
      );
    } else if (sortBy === "title-asc") {
      result = [...result].sort((a: ShopifyProduct, b: ShopifyProduct) => a.title.localeCompare(b.title));
    } else if (sortBy === "title-desc") {
      result = [...result].sort((a: ShopifyProduct, b: ShopifyProduct) => b.title.localeCompare(a.title));
    }

    return result;
  }, [products, priceRange, selectedCategories, selectedSizes, selectedAvailability, sortBy]);

  const toggleFilter = (item: string, current: string[], setFn: (val: string[]) => void) => {
    if (current.includes(item)) {
      setFn(current.filter(i => i !== item));
    } else {
      setFn([...current, item]);
    }
  };

  const clearAllFilters = () => {
    setPriceRange(null);
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedAvailability([]);
  };

  const isPriceFiltered = priceRange !== null && (priceRange[0] > priceStats.min || priceRange[1] < priceStats.max);
  const activeFilterCount = (isPriceFiltered ? 1 : 0) + selectedCategories.length + selectedSizes.length + selectedAvailability.length;

  const currentPriceRange: [number, number] = priceRange || [priceStats.min, priceStats.max];

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">{activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} applied</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAllFilters}
              className="text-xs text-primary hover:text-primary/80 h-auto p-0"
            >
              Clear All
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {isPriceFiltered && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                ${currentPriceRange[0]} - ${currentPriceRange[1]}
                <button onClick={() => setPriceRange(null)}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedCategories.map(cat => (
              <span key={cat} className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                {cat}
                <button onClick={() => toggleFilter(cat, selectedCategories, setSelectedCategories)}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {selectedSizes.map(size => (
              <span key={size} className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                Size: {size}
                <button onClick={() => toggleFilter(size, selectedSizes, setSelectedSizes)}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {selectedAvailability.map(avail => (
              <span key={avail} className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                {avail}
                <button onClick={() => toggleFilter(avail, selectedAvailability, setSelectedAvailability)}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Price Range Slider */}
      <div>
        <h3 className="font-display font-bold uppercase tracking-wide mb-4 text-sm">Price</h3>
        <div className="space-y-10">
          <Slider
            value={currentPriceRange}
            onValueCommit={(value) => setPriceRange([value[0], value[1]])}
            min={priceStats.min}
            max={priceStats.max}
            step={1}
            className="w-full"
          />
        </div>
      </div>

      {/* Category */}
      {availableCategories.length > 0 && (
        <div>
          <h3 className="font-display font-bold uppercase tracking-wide mb-4 text-sm">Category</h3>
          <div className="space-y-2">
            {availableCategories.map(cat => (
              <div key={cat} className="flex items-center space-x-3">
                <Checkbox 
                  id={`cat-${cat}`} 
                  checked={selectedCategories.includes(cat)}
                  onCheckedChange={() => toggleFilter(cat, selectedCategories, setSelectedCategories)}
                />
                <Label 
                  htmlFor={`cat-${cat}`} 
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  {cat}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Size Multi-Select Dropdown */}
      {sizes.length > 0 && (
        <div>
          <h3 className="font-display font-bold uppercase tracking-wide mb-4 text-sm">Size</h3>
          <div className="relative">
            <button
              onClick={() => setSizeDropdownOpen(!sizeDropdownOpen)}
              className="w-full flex items-center justify-between px-3 py-2 border border-border bg-background text-sm font-medium hover:border-primary/50 transition-colors"
              data-testid="button-size-dropdown"
            >
              <span className={selectedSizes.length > 0 ? "text-foreground" : "text-muted-foreground"}>
                {selectedSizes.length > 0 
                  ? `${selectedSizes.length} size${selectedSizes.length > 1 ? 's' : ''} selected`
                  : "Select sizes"}
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform ${sizeDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {sizeDropdownOpen && (
              <div className="absolute z-50 w-full mt-1 bg-black/80 backdrop-blur-md border border-white/20 shadow-lg max-h-60 overflow-auto rounded">
                {sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => toggleFilter(size, selectedSizes, setSelectedSizes)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                    data-testid={`option-size-${size}`}
                  >
                    <span>{size}</span>
                    {selectedSizes.includes(size) && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Availability */}
      <div>
        <h3 className="font-display font-bold uppercase tracking-wide mb-4 text-sm">Availability</h3>
        <div className="space-y-2">
          {["In Stock", "Out of Stock", "Coming Soon"].map(avail => (
            <div key={avail} className="flex items-center space-x-3">
              <Checkbox 
                id={`avail-${avail}`} 
                checked={selectedAvailability.includes(avail)}
                onCheckedChange={() => toggleFilter(avail, selectedAvailability, setSelectedAvailability)}
              />
              <Label 
                htmlFor={`avail-${avail}`} 
                className="text-sm font-medium leading-none cursor-pointer"
              >
                {avail}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-xl text-destructive">Failed to load products. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Mobile Controls - Sticky with glassmorphism */}
      <div className="sticky top-16 z-40 -mx-4 px-4 py-3 mb-6 md:hidden bg-background/95 backdrop-blur-xl border-b border-white/20">
        <div className="flex justify-between items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex-1 rounded-none border-white/20 bg-background/95 backdrop-blur-xl font-display uppercase font-bold tracking-wider text-sm" data-testid="button-filters-mobile">
                <Filter className="mr-2 h-4 w-4" /> 
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] overflow-y-auto bg-background/95 backdrop-blur-xl border-r border-white/20 text-white">
              <SheetHeader>
                <SheetTitle className="font-display uppercase font-bold tracking-wider text-left mb-6">Filters</SheetTitle>
              </SheetHeader>
              <FilterContent />
            </SheetContent>
          </Sheet>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="flex-1 rounded-none border-white/20 bg-background/95 backdrop-blur-xl font-display uppercase font-bold tracking-wider text-sm" data-testid="select-sort-mobile">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent className="bg-background/95 backdrop-blur-xl border-white/20 text-black">
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="title-asc">Name: A-Z</SelectItem>
              <SelectItem value="title-desc">Name: Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Desktop Toolbar */}
      <div className="hidden md:flex items-center justify-between mb-6 pb-4 border-b border-white/20">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="rounded-none border-white/20 bg-background/95 backdrop-blur-xl"
            data-testid="button-toggle-filters"
          >
            <Filter className="mr-2 h-4 w-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
          <p className="text-sm text-muted-foreground">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </p>
          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Active:</span>
              <div className="flex flex-wrap gap-1">
                {isPriceFiltered && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded">
                    ${currentPriceRange[0]} - ${currentPriceRange[1]}
                    <button onClick={() => setPriceRange(null)} className="hover:text-primary-foreground">×</button>
                  </span>
                )}
                {selectedCategories.map(cat => (
                  <span key={cat} className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded">
                    {cat}
                    <button onClick={() => toggleFilter(cat, selectedCategories, setSelectedCategories)} className="hover:text-primary-foreground">×</button>
                  </span>
                ))}
                {selectedSizes.map(size => (
                  <span key={size} className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded">
                    {size}
                    <button onClick={() => toggleFilter(size, selectedSizes, setSelectedSizes)} className="hover:text-primary-foreground">×</button>
                  </span>
                ))}
                {selectedAvailability.map(avail => (
                  <span key={avail} className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded">
                    {avail}
                    <button onClick={() => toggleFilter(avail, selectedAvailability, setSelectedAvailability)} className="hover:text-primary-foreground">×</button>
                  </span>
                ))}
              </div>
              <button onClick={clearAllFilters} className="text-xs text-primary hover:underline ml-2">Clear All</button>
            </div>
          )}
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px] rounded-none border-white/20 bg-background/95 backdrop-blur-xl text-sm" data-testid="select-sort-desktop">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent className="bg-background/95 backdrop-blur-xl border-white/20 text-black">
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="title-asc">Name: A-Z</SelectItem>
            <SelectItem value="title-desc">Name: Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop Sidebar */}
        {showFilters && (
          <aside className="hidden md:block w-52 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-base font-bold uppercase tracking-wider">Filters</h2>
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
              <FilterContent />
            </div>
          </aside>
        )}

        {/* Product Grid */}
        <div className="flex-1">

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {filteredProducts.map((product: ShopifyProduct) => {
                const cardData = transformProductForCard(product);
                return (
                  <div key={product.id} data-testid={`card-product-${product.handle}`}>
                    <ProductCard {...cardData} />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-xl text-muted-foreground mb-4">No products found matching your criteria.</p>
              <Button 
                variant="outline" 
                onClick={clearAllFilters}
                className="rounded-none"
                data-testid="button-clear-filters"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

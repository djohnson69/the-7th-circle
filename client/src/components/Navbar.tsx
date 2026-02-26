import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Menu, ShoppingCart, Search, User, X, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import logo from "@assets/the_7th_circle_logo_1764612795621.png";
import { useCart } from "@/components/hydrogen/CartProvider";
import { searchProducts, type ShopifyProduct } from "@/lib/shopify";
import { useAuth } from "@/hooks/useAuth";

const menSubcategories = [
  { label: "All Men's", href: "/collections/men" },
  { label: "T-Shirts", href: "/collections/mens-t-shirts" },
  { label: "Tanks", href: "/collections/mens-tanks" },
  { label: "Hoodies", href: "/collections/mens-hoodies" },
  { label: "Shorts", href: "/collections/mens-shorts" },
  { label: "Swimwear", href: "/collections/mens-swimwear" },
  { label: "Outerwear", href: "/collections/mens-outerwear" },
];

const womenSubcategories = [
  { label: "All Women's", href: "/collections/women" },
  { label: "T-Shirts", href: "/collections/womens-t-shirts" },
  { label: "Tanks", href: "/collections/womens-tanks" },
  { label: "Hoodies", href: "/collections/womens-hoodies" },
  { label: "Shorts", href: "/collections/womens-shorts" },
  { label: "Swimwear", href: "/collections/womens-swimwear" },
  { label: "Sports Bras", href: "/collections/womens-sports-bras" },
];

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ShopifyProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [menOpen, setMenOpen] = useState(false);
  const [womenOpen, setWomenOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cart, setCartOpen } = useCart();
  const totalQuantity = cart?.totalQuantity || 0;
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchProducts(searchQuery, 8);
        setSearchResults(results.edges.map(e => e.node));
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* Mobile Menu */}
        <div className="flex md:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-[#D00000]">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] border-r border-white/20 bg-background/80 backdrop-blur-md px-0 overflow-y-auto">
              <div className="flex flex-col gap-6 p-6">
                <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <img src={logo} alt="The 7th Circle" className="h-10 w-auto" />
                    <span className="font-display text-xl font-bold tracking-tighter text-white">
                      THE 7TH CIRCLE
                    </span>
                  </div>
                </Link>
                <div className="flex flex-col gap-2">
                  <Link href="/collections/latest-drop" onClick={() => setMobileMenuOpen(false)}>
                    <span className="font-display text-lg uppercase tracking-wide hover:text-primary cursor-pointer text-[#D00000] block py-2">Latest Drop</span>
                  </Link>
                  
                  {/* Men's Collapsible */}
                  <Collapsible open={menOpen} onOpenChange={setMenOpen}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
                      <span className="font-display text-lg uppercase tracking-wide text-white">Men</span>
                      <ChevronDown className={`h-4 w-4 text-white/60 transition-transform ${menOpen ? 'rotate-180' : ''}`} />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-4 flex flex-col gap-1">
                      {menSubcategories.map((item) => (
                        <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                          <span className="font-display text-sm uppercase tracking-wide text-white/70 hover:text-primary cursor-pointer block py-2">{item.label}</span>
                        </Link>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                  
                  {/* Women's Collapsible */}
                  <Collapsible open={womenOpen} onOpenChange={setWomenOpen}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
                      <span className="font-display text-lg uppercase tracking-wide text-white">Women</span>
                      <ChevronDown className={`h-4 w-4 text-white/60 transition-transform ${womenOpen ? 'rotate-180' : ''}`} />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-4 flex flex-col gap-1">
                      {womenSubcategories.map((item) => (
                        <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                          <span className="font-display text-sm uppercase tracking-wide text-white/70 hover:text-primary cursor-pointer block py-2">{item.label}</span>
                        </Link>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                  
                  <Link href="/collections/offensive" onClick={() => setMobileMenuOpen(false)}>
                    <span className="font-display text-lg uppercase tracking-wide hover:text-primary cursor-pointer text-white block py-2">Offensive</span>
                  </Link>
                  <Link href="/collections/hats" onClick={() => setMobileMenuOpen(false)}>
                    <span className="font-display text-lg uppercase tracking-wide hover:text-primary cursor-pointer text-white block py-2">Hats</span>
                  </Link>
                  <Link href="/collections/flags" onClick={() => setMobileMenuOpen(false)}>
                    <span className="font-display text-lg uppercase tracking-wide hover:text-primary cursor-pointer text-white block py-2">Flags</span>
                  </Link>
                  <Link href="/collections/stickers" onClick={() => setMobileMenuOpen(false)}>
                    <span className="font-display text-lg uppercase tracking-wide hover:text-primary cursor-pointer text-white block py-2">Stickers</span>
                  </Link>
                  <Link href="/collections/accessories" onClick={() => setMobileMenuOpen(false)}>
                    <span className="font-display text-lg uppercase tracking-wide hover:text-primary cursor-pointer text-white block py-2">Accessories</span>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <img src={logo} alt="The 7th Circle" className="h-12 w-auto" />
              <span className="hidden md:inline font-display text-3xl font-bold tracking-tighter text-foreground">
                THE 7TH CIRCLE
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/collections/latest-drop">
            <span className="font-display text-sm font-medium uppercase tracking-widest hover:text-primary cursor-pointer transition-colors text-[#D00000]">Latest Drop</span>
          </Link>
          
          {/* Men's Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 font-display text-sm font-medium uppercase tracking-widest hover:text-primary cursor-pointer transition-colors outline-none">
              Men <ChevronDown className="h-3 w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-background/95 backdrop-blur-xl border-white/20 min-w-[160px]">
              {menSubcategories.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={item.href}>
                    <span className="font-display text-sm uppercase tracking-wide cursor-pointer w-full">{item.label}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Women's Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 font-display text-sm font-medium uppercase tracking-widest hover:text-primary cursor-pointer transition-colors outline-none">
              Women <ChevronDown className="h-3 w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-background/95 backdrop-blur-xl border-white/20 min-w-[160px]">
              {womenSubcategories.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={item.href}>
                    <span className="font-display text-sm uppercase tracking-wide cursor-pointer w-full">{item.label}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Link href="/collections/offensive">
            <span className="font-display text-sm font-medium uppercase tracking-widest hover:text-primary cursor-pointer transition-colors">Offensive</span>
          </Link>
          <Link href="/collections/hats">
            <span className="font-display text-sm font-medium uppercase tracking-widest hover:text-primary cursor-pointer transition-colors">Hats</span>
          </Link>
          <Link href="/collections/flags">
            <span className="font-display text-sm font-medium uppercase tracking-widest hover:text-primary cursor-pointer transition-colors">Flags</span>
          </Link>
          <Link href="/collections/accessories">
            <span className="font-display text-sm font-medium uppercase tracking-widest hover:text-primary cursor-pointer transition-colors">Accessories</span>
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-foreground hover:text-primary" onClick={() => setIsSearchOpen(!isSearchOpen)}>
            <Search className="h-5 w-5" />
          </Button>
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden md:flex text-foreground hover:text-primary" data-testid="button-user-menu">
                  {user?.profileImageUrl ? (
                    <img src={user.profileImageUrl} alt="Profile" className="h-7 w-7 rounded-full object-cover" />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background/95 backdrop-blur-xl border-white/20 min-w-[160px]">
                <DropdownMenuItem className="text-muted-foreground text-sm" disabled>
                  {user?.email || user?.firstName || "Account"}
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/api/logout" className="cursor-pointer w-full font-display text-sm uppercase tracking-wide text-primary">
                    Log Out
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden md:flex text-foreground hover:text-primary"
              onClick={() => window.location.href = "/api/login"}
              data-testid="button-login"
            >
              <User className="h-5 w-5" />
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-foreground hover:text-primary relative"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingCart className="h-5 w-5" />
            {totalQuantity > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Search Bar Dropdown */}
      {isSearchOpen && (
        <div 
          className="absolute top-full left-0 w-full border-y border-white/20 p-4 animate-in slide-in-from-top-2 z-50"
          style={{ 
            background: 'rgba(26, 26, 26, 0.95)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)'
          }}
        >
          <div className="container mx-auto max-w-2xl">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Input 
                placeholder="SEARCH PRODUCTS..." 
                className="h-12 w-full bg-white/10 border-white/20 text-lg font-display uppercase tracking-wide text-white placeholder:text-white/70 focus-visible:ring-primary pr-20"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {isSearching && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                <Button 
                  type="button"
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground hover:text-foreground"
                  onClick={closeSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </form>
            
            {searchResults.length > 0 && (
              <div 
                className="mt-2 border border-white/20 rounded max-h-96 overflow-y-auto"
                style={{ 
                  background: 'rgba(26, 26, 26, 0.95)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)'
                }}
              >
                {searchResults.map((product) => (
                  <Link 
                    key={product.id} 
                    href={`/products/${product.handle}`}
                    onClick={closeSearch}
                  >
                    <div className="flex items-center gap-4 p-3 hover:bg-white/5 transition-colors cursor-pointer border-b border-white/10 last:border-0" data-testid={`search-result-${product.handle}`}>
                      <img 
                        src={product.images.edges[0]?.node.url || "https://placehold.co/60x60/1a1a1a/ffffff?text=No+Image"} 
                        alt={product.title}
                        className="w-14 h-14 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-sm uppercase tracking-wide text-white truncate">{product.title}</p>
                        <p className="text-sm text-primary font-medium">
                          ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
                {searchQuery.trim() && (
                  <button
                    onClick={() => {
                      setLocation(`/search?q=${encodeURIComponent(searchQuery)}`);
                      closeSearch();
                    }}
                    className="w-full p-3 text-center text-sm text-primary hover:bg-white/5 transition-colors font-display uppercase tracking-wide"
                    data-testid="button-view-all-results"
                  >
                    View All Results
                  </button>
                )}
              </div>
            )}
            
            {searchQuery.trim() && !isSearching && searchResults.length === 0 && (
              <div 
                className="mt-2 p-4 text-center text-muted-foreground border border-white/20 rounded"
                style={{ 
                  background: 'rgba(26, 26, 26, 0.95)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)'
                }}
              >
                No products found for "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/hydrogen/CartProvider";
import { Money } from "@/components/hydrogen/Money";
import { Image } from "@/components/hydrogen/Image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { trackBeginCheckout } from "@/lib/analytics";

export function CartDrawer() {
  const { cart, cartOpen, setCartOpen, linesRemove, linesUpdate } = useCart();

  if (!cart) return null;

  const FREE_SHIPPING_THRESHOLD = 150;
  const subtotal = parseFloat(cart.cost.subtotalAmount?.amount || "0");
  const amountUntilFree = FREE_SHIPPING_THRESHOLD - subtotal;
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md bg-white/10 backdrop-blur-xl border-l border-white/20 text-white p-0 flex flex-col shadow-2xl">
        <SheetHeader className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <SheetTitle className="font-display text-2xl font-bold uppercase tracking-wider text-white">
              Cart ({cart.totalQuantity})
            </SheetTitle>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs uppercase tracking-wide font-bold">
              {amountUntilFree > 0 ? (
                <span className="text-white/70">Add <span className="text-primary">${amountUntilFree.toFixed(2)}</span> for Free Shipping</span>
              ) : (
                <span className="text-green-400">Mission Status: Free Shipping Unlocked</span>
              )}
              <span className="text-white/50">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-white/10" indicatorClassName={amountUntilFree <= 0 ? "bg-green-500" : "bg-primary"} />
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.lines.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <p className="text-white/70 text-lg">Your cart is empty.</p>
              <Button 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/20 hover:text-white rounded-none uppercase tracking-widest font-display font-bold"
                onClick={() => setCartOpen(false)}
                data-testid="button-continue-shopping"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            cart.lines.map((line) => (
              <div key={line.id} className="flex gap-4" data-testid={`cart-line-${line.id}`}>
                <div className="w-24 h-24 bg-white/5 flex-shrink-0 border border-white/10 overflow-hidden">
                  {line.merchandise.image && (
                    <Image 
                      data={line.merchandise.image} 
                      className="w-full h-full object-cover" 
                      width={96} 
                      height={96}
                    />
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-base font-bold uppercase tracking-wide text-white">
                      {line.merchandise.product.title}
                    </h3>
                    <p className="text-sm text-white/60">{line.merchandise.title}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-white/20">
                      <button 
                        className="p-2 hover:bg-white/10 disabled:opacity-50 transition-colors"
                        onClick={() => {
                          if (line.quantity <= 1) return;
                          linesUpdate([{ id: line.id, quantity: line.quantity - 1 }]);
                        }}
                        disabled={line.quantity <= 1}
                        data-testid={`button-decrease-${line.id}`}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-10 text-center text-sm font-bold">{line.quantity}</span>
                      <button 
                        className="p-2 hover:bg-white/10 transition-colors"
                        onClick={() => linesUpdate([{ id: line.id, quantity: line.quantity + 1 }])}
                        data-testid={`button-increase-${line.id}`}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <Money data={line.merchandise.price} className="font-sans font-bold text-primary" />
                      <button 
                        onClick={() => linesRemove([line.id])}
                        className="text-white/50 hover:text-primary transition-colors"
                        data-testid={`button-remove-${line.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.lines.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-white/5 space-y-4">
            <div className="flex justify-between items-center text-lg">
              <span className="text-white/70 font-display uppercase tracking-wide">Subtotal</span>
              <Money data={cart.cost.subtotalAmount} className="font-bold text-white" />
            </div>
            <p className="text-xs text-white/50 text-center uppercase tracking-wide">
              Taxes and shipping calculated at checkout
            </p>
            <a 
              href={cart.checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
              data-testid="link-checkout"
              onClick={() => {
                trackBeginCheckout({
                  items: cart.lines.map(line => ({
                    id: line.merchandise.id,
                    title: line.merchandise.product.title,
                    price: parseFloat(line.merchandise.price.amount),
                    quantity: line.quantity,
                  })),
                  total: parseFloat(cart.cost.totalAmount.amount),
                });
              }}
            >
              <Button className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 font-display text-lg font-bold uppercase tracking-widest rounded-none">
                Checkout
              </Button>
            </a>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

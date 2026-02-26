import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { validateEmailDomain } from "@/lib/emailValidation";
import { trackLead } from "@/lib/analytics";

export function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem("hasSeenNewsletterPopup");
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("hasSeenNewsletterPopup", "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    
    const validation = validateEmailDomain(email);
    if (!validation.valid) {
      setError(validation.error || "Please enter a valid email address.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          source: 'newsletter_popup',
          discountCode: 'WELCOME10',
          tags: ['welcome_discount'],
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to subscribe');
      }
      
      trackLead(email, 'newsletter_popup');
      setSubmitted(true);
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-transparent border-none shadow-none p-0 gap-0 overflow-hidden">
        <div className="relative bg-black/80 backdrop-blur-xl p-8 text-center border border-white/20 shadow-2xl">
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            data-testid="button-close-newsletter"
          >
            <X className="h-5 w-5" />
          </button>
          
          {!submitted ? (
            <>
              <h2 className="text-3xl font-display font-bold uppercase tracking-tighter text-white mb-3 drop-shadow-md">
                Join The Brotherhood
              </h2>
              <p className="text-gray-200 font-medium mb-6 text-lg leading-relaxed drop-shadow-sm">
                Unlock 10% off your first order and get access to exclusive drops before anyone else.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input 
                    type="email" 
                    placeholder="ENTER YOUR EMAIL" 
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    className={`bg-white/10 border-white/30 text-white placeholder:text-gray-400 text-center uppercase tracking-widest font-bold h-12 focus-visible:ring-primary focus-visible:border-primary transition-all ${error ? 'border-red-500' : ''}`}
                    data-testid="input-newsletter-email"
                    disabled={isLoading}
                  />
                  {error && (
                    <p className="text-red-400 text-sm mt-2 uppercase tracking-wide" data-testid="text-newsletter-error">{error}</p>
                  )}
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-primary text-white hover:bg-primary/90 font-display uppercase tracking-widest font-bold text-lg h-12 rounded-none shadow-lg hover:shadow-primary/20 transition-all"
                  disabled={isLoading}
                  data-testid="button-newsletter-submit"
                >
                  {isLoading ? 'Joining...' : 'Unlock Discount'}
                </Button>
              </form>
              
              <button 
                onClick={handleClose}
                className="mt-6 text-xs text-gray-400 hover:text-white uppercase tracking-wider underline underline-offset-4 transition-colors"
                data-testid="button-newsletter-dismiss"
              >
                No thanks, I hate saving money
              </button>
            </>
          ) : (
            <div className="py-8" data-testid="newsletter-success">
              <h2 className="text-3xl font-display font-bold uppercase tracking-tighter text-primary mb-4 drop-shadow-md">
                Welcome Aboard
              </h2>
              <p className="text-white text-lg">
                Your discount code: <span className="font-bold text-primary text-xl ml-2 tracking-wider">WELCOME10</span>
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

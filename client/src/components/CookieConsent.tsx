import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { setConsent, loadConsentFromStorage } from "@/lib/analytics";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = loadConsentFromStorage();
    const hasDecided = localStorage.getItem("cookieConsentDecided");
    if (!hasDecided) {
      setIsVisible(true);
    } else if (consent.analytics || consent.marketing) {
      setConsent(consent);
    }
  }, []);

  const handleAccept = () => {
    setConsent({ analytics: true, marketing: true });
    localStorage.setItem("cookieConsentDecided", "true");
    setIsVisible(false);
  };

  const handleDecline = () => {
    setConsent({ analytics: false, marketing: false });
    localStorage.setItem("cookieConsentDecided", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a] border-t border-primary/20 p-4 md:p-6 animate-in slide-in-from-bottom-full duration-500" data-testid="cookie-consent-banner">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-1">
            Mission Data Protocols
          </h3>
          <p className="text-xs text-muted-foreground max-w-2xl">
            We use automated tracking cookies to optimize your mission experience and analyze sector traffic. 
            By continuing, you acknowledge that we are tracking your digital footprint on this frequency.
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDecline}
            className="rounded-none border-muted-foreground text-muted-foreground hover:text-white uppercase tracking-wider text-xs"
            data-testid="button-cookie-decline"
          >
            Evacuate
          </Button>
          <Button 
            size="sm" 
            onClick={handleAccept}
            className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-wider font-bold text-xs"
            data-testid="button-cookie-accept"
          >
            Acknowledge
          </Button>
        </div>
      </div>
    </div>
  );
}

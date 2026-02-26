import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { trackPageView, loadConsentFromStorage, initGA, initMetaPixel, getConsent } from '../lib/analytics';

export function useAnalytics() {
  const [location] = useLocation();
  const prevLocationRef = useRef<string>(location);
  const initializedRef = useRef(false);
  
  useEffect(() => {
    if (!initializedRef.current) {
      const consent = loadConsentFromStorage();
      if (consent.analytics) {
        initGA();
      }
      if (consent.marketing) {
        initMetaPixel();
      }
      initializedRef.current = true;
    }
  }, []);
  
  useEffect(() => {
    if (location !== prevLocationRef.current || !prevLocationRef.current) {
      trackPageView(location, document.title);
      prevLocationRef.current = location;
    }
  }, [location]);
}

export function useConsentStatus() {
  return getConsent();
}

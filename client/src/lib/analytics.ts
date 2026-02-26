declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
  }
}

type ConsentState = {
  analytics: boolean;
  marketing: boolean;
};

let consentState: ConsentState = {
  analytics: false,
  marketing: false,
};

let isGAInitialized = false;
let isMetaPixelInitialized = false;

export function getConsent(): ConsentState {
  return { ...consentState };
}

export function setConsent(consent: Partial<ConsentState>) {
  consentState = { ...consentState, ...consent };
  localStorage.setItem('trackingConsent', JSON.stringify(consentState));
  
  if (consentState.analytics) {
    initGA();
  }
  if (consentState.marketing) {
    initMetaPixel();
  }
}

export function loadConsentFromStorage(): ConsentState {
  try {
    const stored = localStorage.getItem('trackingConsent');
    if (stored) {
      consentState = JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Failed to load consent from storage');
  }
  return consentState;
}

export function initGA() {
  if (isGAInitialized) return;
  
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId) {
    console.warn('Missing VITE_GA_MEASUREMENT_ID');
    return;
  }

  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);

  const script2 = document.createElement('script');
  script2.textContent = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${measurementId}', { send_page_view: false });
  `;
  document.head.appendChild(script2);
  
  isGAInitialized = true;
}

export function initMetaPixel() {
  if (isMetaPixelInitialized) return;
  
  const pixelId = import.meta.env.VITE_META_PIXEL_ID;
  if (!pixelId) {
    console.warn('Missing VITE_META_PIXEL_ID');
    return;
  }

  const script = document.createElement('script');
  script.textContent = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${pixelId}');
  `;
  document.head.appendChild(script);
  
  isMetaPixelInitialized = true;
}

export function trackPageView(url: string, title?: string) {
  if (!consentState.analytics && !consentState.marketing) return;
  
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  
  if (consentState.analytics && window.gtag && measurementId) {
    window.gtag('config', measurementId, {
      page_path: url,
      page_title: title,
    });
  }
  
  if (consentState.marketing && window.fbq) {
    window.fbq('track', 'PageView');
  }
  
  sendServerEvent('page_view', { url, title });
}

export function trackViewContent(product: {
  id: string;
  title: string;
  price: number;
  currency?: string;
  category?: string;
}) {
  if (!consentState.analytics && !consentState.marketing) return;
  
  const eventData = {
    content_type: 'product',
    content_ids: [product.id],
    content_name: product.title,
    value: product.price,
    currency: product.currency || 'USD',
    content_category: product.category,
  };
  
  if (consentState.analytics && window.gtag) {
    window.gtag('event', 'view_item', {
      items: [{
        item_id: product.id,
        item_name: product.title,
        price: product.price,
        currency: product.currency || 'USD',
        item_category: product.category,
      }],
      value: product.price,
      currency: product.currency || 'USD',
    });
  }
  
  if (consentState.marketing && window.fbq) {
    window.fbq('track', 'ViewContent', eventData);
  }
  
  sendServerEvent('view_content', eventData);
}

export function trackAddToCart(product: {
  id: string;
  variantId: string;
  title: string;
  price: number;
  quantity: number;
  currency?: string;
}) {
  if (!consentState.analytics && !consentState.marketing) return;
  
  const eventData = {
    content_type: 'product',
    content_ids: [product.variantId],
    content_name: product.title,
    value: product.price * product.quantity,
    currency: product.currency || 'USD',
    num_items: product.quantity,
  };
  
  if (consentState.analytics && window.gtag) {
    window.gtag('event', 'add_to_cart', {
      items: [{
        item_id: product.id,
        item_variant: product.variantId,
        item_name: product.title,
        price: product.price,
        quantity: product.quantity,
        currency: product.currency || 'USD',
      }],
      value: product.price * product.quantity,
      currency: product.currency || 'USD',
    });
  }
  
  if (consentState.marketing && window.fbq) {
    window.fbq('track', 'AddToCart', eventData);
  }
  
  sendServerEvent('add_to_cart', eventData);
}

export function trackBeginCheckout(cart: {
  items: Array<{ id: string; title: string; price: number; quantity: number }>;
  total: number;
  currency?: string;
}) {
  if (!consentState.analytics && !consentState.marketing) return;
  
  const eventData = {
    content_type: 'product',
    content_ids: cart.items.map(i => i.id),
    value: cart.total,
    currency: cart.currency || 'USD',
    num_items: cart.items.reduce((sum, i) => sum + i.quantity, 0),
  };
  
  if (consentState.analytics && window.gtag) {
    window.gtag('event', 'begin_checkout', {
      items: cart.items.map(item => ({
        item_id: item.id,
        item_name: item.title,
        price: item.price,
        quantity: item.quantity,
      })),
      value: cart.total,
      currency: cart.currency || 'USD',
    });
  }
  
  if (consentState.marketing && window.fbq) {
    window.fbq('track', 'InitiateCheckout', eventData);
  }
  
  sendServerEvent('begin_checkout', eventData);
}

export function trackLead(email: string, source?: string) {
  if (!consentState.analytics && !consentState.marketing) return;
  
  const eventData = {
    email_hash: hashEmail(email),
    source: source || 'newsletter',
  };
  
  if (consentState.analytics && window.gtag) {
    window.gtag('event', 'generate_lead', {
      currency: 'USD',
      value: 10,
    });
  }
  
  if (consentState.marketing && window.fbq) {
    window.fbq('track', 'Lead', eventData);
  }
  
  sendServerEvent('lead', eventData);
}

export function trackEvent(
  action: string,
  category?: string,
  label?: string,
  value?: number
) {
  if (!consentState.analytics && !consentState.marketing) return;
  
  if (consentState.analytics && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
  
  sendServerEvent(action, { category, label, value });
}

function hashEmail(email: string): string {
  return btoa(email.toLowerCase().trim()).substring(0, 16);
}

let sessionId: string | null = null;
function getSessionId(): string {
  if (!sessionId) {
    sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem('session_id', sessionId);
    }
  }
  return sessionId;
}

async function sendServerEvent(eventName: string, eventData: Record<string, any>) {
  try {
    await fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName,
        eventData,
        sessionId: getSessionId(),
      }),
    });
  } catch (error) {
    console.warn('Failed to send analytics event:', error);
  }
}

export { isGAInitialized, isMetaPixelInitialized };

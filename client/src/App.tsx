import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/components/hydrogen/CartProvider";
import { Layout } from "@/components/Layout";
import { CookieConsent } from "@/components/CookieConsent";
import { useAnalytics } from "@/hooks/use-analytics";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import About from "@/pages/About";
import FAQ from "@/pages/FAQ";
import ShippingReturns from "@/pages/ShippingReturns";
import Contact from "@/pages/Contact";
import MilitaryDiscount from "@/pages/MilitaryDiscount";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Terms from "@/pages/Terms";
import RefundPolicy from "@/pages/RefundPolicy";
import ShippingPolicy from "@/pages/ShippingPolicy";
import Product from "@/pages/Product";
import Collection from "@/pages/Collection";
import Search from "@/pages/Search";

function Router() {
  useAnalytics();
  
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/collections/:handle" component={Collection} />
        <Route path="/products/:handle" component={Product} />
        <Route path="/search" component={Search} />
        <Route path="/pages/about" component={About} />
        <Route path="/pages/shipping-returns" component={ShippingReturns} />
        <Route path="/pages/contact" component={Contact} />
        <Route path="/pages/military-discount" component={MilitaryDiscount} />
        <Route path="/pages/privacy-policy" component={PrivacyPolicy} />
        <Route path="/pages/terms-of-service" component={Terms} />
        <Route path="/pages/refund-policy" component={RefundPolicy} />
        <Route path="/pages/shipping-policy" component={ShippingPolicy} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Router />
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

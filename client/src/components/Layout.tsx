import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { NewsletterPopup } from "@/components/NewsletterPopup";
import { CookieConsent } from "@/components/CookieConsent";
import { AnnouncementBar } from "@/components/AnnouncementBar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <CartDrawer />
      <NewsletterPopup />
    </div>
  );
}

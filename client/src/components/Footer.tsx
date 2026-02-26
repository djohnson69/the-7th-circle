import { useState } from "react";
import { Link } from "wouter";
import { Instagram } from "lucide-react";
import logo from "@assets/the_7th_circle_logo_1764612795621.png";
import { validateEmailDomain } from "@/lib/emailValidation";

export function Footer() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubscribe = () => {
    setError("");
    
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    
    const validation = validateEmailDomain(email);
    if (!validation.valid) {
      setError(validation.error || "Please enter a valid email.");
      return;
    }
    
    setSuccess(true);
    setEmail("");
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <footer className="bg-card">
      {/* Newsletter - Horizontal, Full Width Black Section */}
      <div className="w-full bg-black py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="text-center w-full md:w-auto">
              <h4 className="font-display text-2xl font-bold uppercase tracking-wider text-white mb-2">Join The Brotherhood</h4>
              <p className="text-sm text-neutral-300">
                Subscribe for exclusive drops and intel.
              </p>
            </div>
            <div className="flex flex-col w-full md:max-w-xl gap-2 mx-auto md:mx-0">
              <div className="flex w-full gap-0 shadow-sm">
                <input 
                  type="email" 
                  placeholder="ENTER YOUR EMAIL" 
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  className={`flex-1 bg-white border-2 border-r-0 px-4 md:px-6 py-4 text-base font-sans focus:outline-none uppercase placeholder:text-neutral-500 text-black min-w-0 ${error ? 'border-red-500' : 'border-white'}`}
                />
                <button 
                  className="bg-[#D00000] px-6 md:px-8 py-4 text-white font-display font-bold uppercase tracking-wider hover:bg-[#b00000] whitespace-nowrap transition-colors"
                  onClick={handleSubscribe}
                >
                  Join
                </button>
              </div>
              {error && (
                <p className="text-red-400 text-sm uppercase tracking-wide text-center md:text-left">{error}</p>
              )}
              {success && (
                <p className="text-green-400 text-sm uppercase tracking-wide text-center md:text-left">Welcome to The Brotherhood!</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-12 md:pt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Brand */}
          <div className="col-span-1 text-center flex flex-col items-center">
            <Link href="/">
              <div className="flex items-center justify-center gap-2 cursor-pointer mb-4">
                <img src={logo} alt="The 7th Circle" className="h-12 w-auto" />
                <span className="font-display text-2xl font-bold tracking-tighter text-foreground">
                  THE 7TH CIRCLE
                </span>
              </div>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
              We build apparel for those who walk the path less traveled. 
              For the warriors, the rebels, and the relentless.
            </p>
            <div className="mt-6 flex justify-center gap-8 items-center">
              <a href="https://www.instagram.com/the_7th_circle" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><Instagram className="h-[28px] w-[28px]" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-[26px] w-[26px] fill-current"><title>X</title><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
              </a>
            </div>
          </div>

          {/* Shop & Support Container - Side by side on mobile, individual columns on desktop */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-8 text-center">
            {/* Shop */}
            <div>
              <h4 className="font-display text-lg font-bold uppercase tracking-wider text-foreground mb-6">Shop</h4>
              <ul className="space-y-3">
                <li><Link href="/collections/latest-drop"><span className="text-sm text-muted-foreground hover:text-primary uppercase tracking-wide cursor-pointer">Latest Drop</span></Link></li>
                <li><Link href="/collections/men"><span className="text-sm text-muted-foreground hover:text-primary uppercase tracking-wide cursor-pointer">Mens</span></Link></li>
                <li><Link href="/collections/women"><span className="text-sm text-muted-foreground hover:text-primary uppercase tracking-wide cursor-pointer">Womens</span></Link></li>
                <li><Link href="/collections/accessories"><span className="text-sm text-muted-foreground hover:text-primary uppercase tracking-wide cursor-pointer">Accessories</span></Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-display text-lg font-bold uppercase tracking-wider text-foreground mb-6">Support</h4>
              <ul className="space-y-3">
                <li><Link href="/pages/about"><span className="text-sm text-muted-foreground hover:text-primary uppercase tracking-wide cursor-pointer">Our Story</span></Link></li>
                <li><Link href="/pages/shipping-policy"><span className="text-sm text-muted-foreground hover:text-primary uppercase tracking-wide cursor-pointer">Shipping Policy</span></Link></li>
                <li><Link href="/pages/refund-policy"><span className="text-sm text-muted-foreground hover:text-primary uppercase tracking-wide cursor-pointer">Refund Policy</span></Link></li>
                <li><Link href="/pages/contact"><span className="text-sm text-muted-foreground hover:text-primary uppercase tracking-wide cursor-pointer">Contact Us</span></Link></li>
              </ul>
            </div>
          </div>

        </div>
        
        <div className="mt-16 border-t border-border py-8 flex flex-col items-center justify-center gap-4 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            © 2025 The 7th Circle LLC. All rights reserved.
          </p>
        </div>
      </div>
    </div>
    </footer>
  );
}

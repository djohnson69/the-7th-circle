import { useEffect } from "react";

export default function ShippingPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tighter mb-8 text-primary">
        Shipping Policy
      </h1>
      <p className="text-muted-foreground mb-8 uppercase tracking-widest text-sm">Last Updated: December 5, 2025</p>
      
      <div className="prose prose-invert max-w-none text-muted-foreground">
        
        <p className="mb-6 text-lg">
          Boo-boo, sugar pie, superstar shopper — WELCOME to the 7th Circle, LLC Shipping Experience!
        </p>
        <p className="mb-6">
          If you've come this far, you are <em>hot!</em> And we are telling you <em>exactly</em> how your fabulous gear gets from our universe to yours.
        </p>
        <p className="mb-6">
          Bzzzzzz! Let’s go!
        </p>

        <hr className="my-12 border-border" />

        <h2 className="text-2xl font-display font-bold uppercase tracking-wide text-foreground mb-6">ORDER PROCESSING — OH YES, WE AREN'T AMAZON BABY!</h2>
        <p className="mb-4">That means:</p>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li><strong>Standard processing:</strong> 3–7 business days</li>
          <li>Specialty or high-demand items? Oooh, honey — they might take a little longer. Beauty takes time.</li>
        </ul>
        <p className="mb-6">
          Once your order is confirmed, production begins and the magic starts.
        </p>
        <p className="mb-6">
          No rushin’ the art, darling!
        </p>

        <hr className="my-12 border-border" />

        <h2 className="text-2xl font-display font-bold uppercase tracking-wide text-foreground mb-6">SHIPPING TIMES — HOLD ONTO YOUR MICROPHONE</h2>
        <p className="mb-4">Estimated delivery windows:</p>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li><strong>USA:</strong> 5–12 business days</li>
          <li><strong>Canada:</strong> 7–15 business days</li>
          <li><strong>International:</strong> 10–25 business days</li>
        </ul>
        <p className="mb-6">
          Now listen, earth angel:
        </p>
        <p className="mb-6">
          Cosmic storms, carrier delays, holiday chaos, global logistics meltdowns — ANY of that can stretch delivery times.
        </p>
        <p className="mb-6">
          We stay fabulous regardless.
        </p>
        <p className="mb-6">
          You’ll get a tracking number the moment your order hits the space highway.
        </p>

        <hr className="my-12 border-border" />

        <h2 className="text-2xl font-display font-bold uppercase tracking-wide text-foreground mb-6">MULTIPLE PACKAGES — YOUR ITEMS LOVE TO MAKE AN ENTRANCE</h2>
        <p className="mb-6">
          Sometimes your sexy new gear might arrive in multiple packages. Why? Because they’re divas and they travel how they WANT.
        </p>
        <p className="mb-6">
          But trust us baby, they're all coming home to you.
        </p>

        <hr className="my-12 border-border" />

        <h2 className="text-2xl font-display font-bold uppercase tracking-wide text-foreground mb-6">SHIPPING DELAYS — DON’T PANIC, DON’T SWEAT, DON’T SMUDGE YOUR MAKEUP</h2>
        <p className="mb-4">If delays happen, it’s usually because:</p>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li>Carriers get overwhelmed</li>
          <li>Holidays scramble the universe</li>
          <li>Customs officers need a moment</li>
          <li>Or fate decides to add a dash of drama</li>
        </ul>
        <p className="mb-6">
          But you? You stay calm, cool, and hotter than a supernova until your items arrive.
        </p>

        <hr className="my-12 border-border" />

        <h2 className="text-2xl font-display font-bold uppercase tracking-wide text-foreground mb-6">ADDRESS ACCURACY — LISTEN, HONEY, DOUBLE-CHECK THAT ADDRESS</h2>
        <p className="mb-6">
          We need the RIGHT address — the WHOLE address — and NOTHING BUT the address.
        </p>
        <p className="mb-6">
          If a package gets lost because the address was missing an apartment number or sent to your ex’s place, that’s on you, babe.
        </p>
        <p className="mb-6">
          Returned packages may require extra shipping fees to send back out.
        </p>

        <hr className="my-12 border-border" />

        <h2 className="text-2xl font-display font-bold uppercase tracking-wide text-foreground mb-6">LOST OR MISSING PACKAGES — CHECK WITH THE CARRIER FIRST, SWEETHEART</h2>
        <p className="mb-4">If tracking says “delivered” but your porch is as empty as a priest’s liquor cabinet:</p>
        <ol className="list-decimal pl-6 space-y-2 mb-6">
          <li>Contact the carrier — they have the freshest intel. We aren't USPS.</li>
          <li>THEN, email us and we’ll help however we can.</li>
        </ol>

        <hr className="my-12 border-border" />

        <h2 className="text-2xl font-display font-bold uppercase tracking-wide text-foreground mb-6">INTERNATIONAL DUTIES & TAXES — SPICE UP YOUR LIFE</h2>
        <p className="mb-6">
          If your country charges customs, duties, or taxes, that’s between you and your government. We don’t control that part of the show.
        </p>

        <hr className="my-12 border-border" />

        <h2 className="text-2xl font-display font-bold uppercase tracking-wide text-foreground mb-6">CONTACT US — WE WANTS TO HEAR FROM YOU (not really, lol)</h2>
        <p className="mb-6">
          Baby, if you need help, if you need answers, holler at us to share the word of the day:
          <br /><br />
          <strong>support@the7thcircle.us</strong>
          <br />
          <strong>info@the7thcircle.us</strong>
        </p>
      </div>
    </div>
  );
}

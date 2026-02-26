import { useEffect } from "react";

export default function RefundPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tighter mb-8 text-primary">
        Refund Policy
      </h1>
      
      <div className="prose prose-invert max-w-none text-muted-foreground">
        
        <h2 className="text-2xl font-display font-bold uppercase tracking-wide text-foreground mt-12 mb-6">WORD OF THE DAAAYYYY ISSSSSS (RETURN & REFUND POLICY):</h2>
        <p className="text-xl font-bold text-foreground mb-4">
          NO RETURNS. NO EXCHANGES. NONE. ZIP. ZEEE-ROOOO!
        </p>
        <p className="mb-6">
          Listen up, sugar blossoms — <strong>returns and exchanges are NOT accepted.</strong>
        </p>
        <p className="mb-6">
          Not today, not tomorrow, not in the 23rd century.
        </p>
        <p className="mb-6">
          We said it. We meant it. We stamped it with glitter.
        </p>

        <hr className="my-12 border-border" />

        <h2 className="text-2xl font-display font-bold uppercase tracking-wide text-foreground mb-6">SIZE CHARTS — READ THEM, BABY! READ THEM LIKE YOUR LIFE DEPENDS ON IT!</h2>
        <p className="mb-6">
          We attach size charts to practically EVERYTHING in the product description.
        </p>
        <p className="mb-6">
          So pay <strong>THE F*CK</strong> attention to the measurements.
        </p>
        <p className="mb-6">
          (And yes — <em>especially if you fat</em>. We love you, but we tell the TRUTH.)
        </p>
        <p className="mb-6">
          Green?
        </p>
        <p className="mb-6 font-bold text-foreground">
          Super green.
        </p>
        <p className="mb-6">
          Thanksssssssss! &lt;3
        </p>

        <hr className="my-12 border-border" />

        <h2 className="text-2xl font-display font-bold uppercase tracking-wide text-foreground mb-6">BUT IF SOMETHING ARRIVES MESSED UP… OHHH, NOW THAT’S DIFFERENT</h2>
        <p className="mb-4">If your precious package arrives with:</p>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li>Stitching lookin’ like it lost a knife fight</li>
          <li>Prints that don't look right</li>
          <li>Colors gone rogue (actually)</li>
          <li>Or you receive a product that AIN’T what you ordered (like, who the hell sent you THAT?!)</li>
        </ul>

        <p className="mb-6">
          Then listen closely, staaaar child:
        </p>

        <p className="mb-4">
          Email us at: <strong>support@the7thcircle.us</strong>
        </p>

        <p className="mb-4">Include:</p>
        <ol className="list-decimal pl-6 space-y-2 mb-6">
          <li><strong>Photos</strong> of the issue</li>
          <li>A <strong>brief description</strong> of what went wrong</li>
          <li>Your <strong>original order number</strong></li>
          <li>A calm voice, a deep breath, and maybe a little attitude — we appreciate seasoning.</li>
        </ol>

        <p className="mb-6">
          We’ll review it, handle it, fix it, correct it, love it, and get you taken care of.
        </p>
      </div>
    </div>
  );
}

export default function ShippingReturns() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tighter mb-8 text-primary">
        Shipping & Returns
      </h1>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-display font-bold uppercase tracking-wide mb-4 border-l-4 border-primary pl-4">Shipping Policy</h2>
          <div className="prose prose-invert max-w-none text-muted-foreground">
            <p className="mb-4">
              <strong>Processing Time:</strong> All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays.
            </p>
            <p className="mb-4">
              <strong>Domestic Shipping:</strong> We offer standard (3-5 business days) and expedited (2 business days) shipping options. Free standard shipping is available for orders over $150 within the continental US.
            </p>
            <p className="mb-4">
              <strong>International Shipping:</strong> We ship to most countries worldwide. Shipping charges for your order will be calculated and displayed at checkout. You are responsible for any customs duties, taxes, or fees assessed by your country.
            </p>
            <p>
              <strong>Lost Packages:</strong> The 7th Circle is not liable for any products damaged or lost during shipping. If you received your order damaged, please contact the shipment carrier to file a claim.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-display font-bold uppercase tracking-wide mb-4 border-l-4 border-primary pl-4">Return Policy</h2>
          <div className="prose prose-invert max-w-none text-muted-foreground">
            <p className="mb-4">
              <strong>All Sales Final:</strong> All sales are final. Returns and/or exchanges are not accepted.
            </p>
            <p className="mb-4">
              <strong>Sizing:</strong> Size Chart links are attached to almost all products within the product description so please pay close attention to the given sizing measurements.
            </p>
            <p className="mb-4">
              <strong>Defective Items:</strong> If upon arrival the product has defects such as, stitch issues, print issues or a product other than what you had ordered was sent to you then please email photos of the issue along with a description of the problem along with the original order number to <a href="mailto:support@the7thcircle.us" className="text-primary hover:underline">support@the7thcircle.us</a> for service and further correction of the issue.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

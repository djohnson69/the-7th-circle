import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQ() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tighter mb-8 text-primary">
        Frequently Asked Questions
      </h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-display font-bold uppercase tracking-wide mb-4 border-b border-border pb-2">Orders & Shipping</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="font-display text-lg uppercase tracking-wide">How long will my order take to ship?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Orders are processed within 24-48 hours. Standard shipping takes 3-5 business days within the continental US. International shipping times vary based on destination.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="font-display text-lg uppercase tracking-wide">Do you ship internationally?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes, we ship worldwide. International shipping rates are calculated at checkout based on your location and package weight. Note that customs fees may apply and are the responsibility of the customer.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="font-display text-lg uppercase tracking-wide">Where is my tracking number?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Once your order ships, you will receive an automated email with your tracking information. If you don't see it, check your spam folder or log into your account to view order status.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <section>
          <h2 className="text-2xl font-display font-bold uppercase tracking-wide mb-4 border-b border-border pb-2">Returns & Exchanges</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-4">
              <AccordionTrigger className="font-display text-lg uppercase tracking-wide">What is your return policy?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                All sales are final. Returns and/or exchanges are not accepted. Please review sizing charts carefully before ordering.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger className="font-display text-lg uppercase tracking-wide">I received a defective item, what do I do?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                If upon arrival the product has defects (stitch issues, print issues) or you received the wrong item, please email photos of the issue along with a description and your order number to <a href="mailto:support@the7thcircle.us" className="text-primary hover:underline">support@the7thcircle.us</a> for correction.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <section>
          <h2 className="text-2xl font-display font-bold uppercase tracking-wide mb-4 border-b border-border pb-2">Products & Care</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-6">
              <AccordionTrigger className="font-display text-lg uppercase tracking-wide">How should I wash my gear?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                For longevity, we recommend washing in cold water and hanging to dry. Avoid high heat drying to prevent shrinkage and preserve print quality.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-7">
              <AccordionTrigger className="font-display text-lg uppercase tracking-wide">Where are your products made?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We source high-quality materials globally and print/finish all our apparel in the USA. We prioritize durability and performance in every garment.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </div>
    </div>
  );
}

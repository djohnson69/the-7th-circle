import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function Contact() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof contactSchema>) {
    console.log(values);
    toast({
      title: "Message Sent",
      description: "We've received your transmission. Stand by for a response.",
    });
    form.reset();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tighter mb-6 text-primary">
            Contact Us
          </h1>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Have a question about your order, our gear, or just want to reach out? 
            Fill out the form or use the contact details below. We respond to all inquiries within 72 hours.
          </p>

          <div className="space-y-6">
            
            <div>
              <h3 className="font-display text-xl font-bold uppercase tracking-wide text-foreground mb-2">Email</h3>
              <p className="text-muted-foreground">
                support@the7thcircle.us
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card p-8 border border-border">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase font-bold tracking-wider">Name</FormLabel>
                    <FormControl>
                      <Input placeholder="YOUR NAME" {...field} className="bg-background border-border rounded-none h-12 font-sans" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase font-bold tracking-wider">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="YOUR EMAIL" {...field} className="bg-background border-border rounded-none h-12 font-sans" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase font-bold tracking-wider">Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="ORDER # / INQUIRY" {...field} className="bg-background border-border rounded-none h-12 font-sans" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase font-bold tracking-wider">Message</FormLabel>
                    <FormControl>
                      <Textarea placeholder="ENTER YOUR MESSAGE..." {...field} className="bg-background border-border rounded-none min-h-[150px] font-sans resize-none" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full h-14 rounded-none bg-primary text-primary-foreground font-display text-lg font-bold uppercase tracking-widest hover:bg-primary/90">
                Send Transmission
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

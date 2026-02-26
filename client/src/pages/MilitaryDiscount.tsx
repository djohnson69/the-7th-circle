import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function MilitaryDiscount() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tighter mb-6 text-white">
          Service <span className="text-primary">Rewards</span> Sacrifice
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We honor those who serve. Active Duty, Veterans, Law Enforcement, and First Responders receive an exclusive discount on all gear, always.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-card border border-border p-8 md:p-12">
        <div>
          <h2 className="text-3xl font-display font-bold uppercase tracking-wide mb-6">Who Is Eligible?</h2>
          <ul className="space-y-4">
            {[
              "Active Duty Military",
              "Military Veterans",
              "Law Enforcement Officers",
              "Firefighters",
              "EMTs / Paramedics",
              "Government Employees"
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-lg text-muted-foreground">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-center text-center p-8 bg-background/50 border border-dashed border-border">
          <h3 className="text-2xl font-display font-bold uppercase tracking-wide mb-4">Get Verified</h3>
          <p className="text-muted-foreground mb-8">
            We use GovX ID to verify your service status instantly. It's fast, secure, and free.
          </p>
          <Button size="lg" className="w-full h-16 rounded-none bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white font-bold uppercase tracking-widest border border-white/10">
            Verify with GovX ID
          </Button>
          <p className="mt-4 text-xs text-muted-foreground">
            By clicking verify, you will be redirected to GovX for authentication.
          </p>
        </div>
      </div>
    </div>
  );
}

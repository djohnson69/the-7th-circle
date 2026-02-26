import heroImage from "@assets/generated_images/dark_gritty_tactical_fitness_hero_image.png";

export default function About() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full overflow-hidden">
         <div className="absolute inset-0 z-0">
           <img 
             src={heroImage} 
             alt="About The 7th Circle" 
             className="h-full w-full object-cover opacity-50 grayscale"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
           <div className="absolute inset-0 bg-black/40" />
         </div>
         <div className="container relative z-10 mx-auto flex h-full items-center justify-center px-4">
           <h1 className="font-display text-6xl md:text-8xl font-bold uppercase tracking-tighter text-white text-center">
             Our Story
           </h1>
         </div>
      </section>

      <section className="container mx-auto px-4 py-20 max-w-4xl">
        <div className="prose prose-invert prose-lg max-w-none">
          <h2 className="font-display text-4xl font-bold uppercase tracking-wide text-primary mb-8">
            Forged in Fire
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed mb-8">
            The 7th Circle wasn't born in a boardroom. It was forged in the sweat, blood, and grit of the iron paradise. We saw a market saturated with cheap fabrics and weak messages, and we decided to burn it down.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            We believe that strength is the only virtue that matters. Without it, you are nothing but a victim waiting to happen. Our apparel is designed for the relentless few who wake up every day and choose violence against mediocrity.
          </p>
          <div className="border-l-4 border-primary pl-6 my-12">
            <p className="font-display text-2xl font-bold uppercase italic text-foreground">
              "We do not cater to the weak. We armor the strong."
            </p>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Every stitch, every print, and every fabric choice is made with one purpose: to withstand the rigors of your war, whatever that may be. Whether you're in the gym, on the range, or in the field, The 7th Circle stands with you.
          </p>
        </div>
      </section>

      <section className="bg-secondary/10 py-20 border-y border-border">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-display text-3xl font-bold uppercase tracking-wide mb-8">The Code</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-6 border border-border bg-card/50">
              <h4 className="font-display text-xl font-bold text-primary mb-4">Discipline</h4>
              <p className="text-muted-foreground">Doing what needs to be done, even when you don't want to do it.</p>
            </div>
            <div className="p-6 border border-border bg-card/50">
              <h4 className="font-display text-xl font-bold text-primary mb-4">Strength</h4>
              <p className="text-muted-foreground">Physical, mental, and spiritual. Weakness is a choice.</p>
            </div>
            <div className="p-6 border border-border bg-card/50">
              <h4 className="font-display text-xl font-bold text-primary mb-4">Loyalty</h4>
              <p className="text-muted-foreground">To the mission, to the tribe, and to yourself.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

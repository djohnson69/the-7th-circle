import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "wouter";
import heroImage from "@assets/IMG_98576_1765424932961.png";

export function Hero() {
  return (
    <section className="relative h-[85vh] w-full overflow-hidden bg-black">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Tactical Fitness" 
          className="h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent opacity-80" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto flex h-full flex-col justify-end pb-8 md:pb-10 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl px-2 md:px-0"
        >
          <div className="mb-4 inline-block border-l-4 border-white pl-4">
            <span className="font-display text-base md:text-lg font-bold uppercase tracking-[0.2em] text-white">
              Est. 2025
            </span>
          </div>
          <h1 className="mb-4 md:mb-6 font-display text-4xl md:text-8xl font-bold uppercase leading-[0.9] tracking-tighter">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D00000] to-[#D00000]/50">Reserved</span> <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D00000] to-[#D00000]/50">for the Violent</span>
          </h1>
          <p className="mb-6 md:mb-8 max-w-xl text-base md:text-lg text-white font-light leading-relaxed">
            Gear built for the few who refuse to quit. We don't make apparel for the weak-minded. 
            Stand for something or fall for anything.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/collections/men">
              <Button size="lg" variant="outline" className="h-14 min-w-[180px] rounded-none border-2 border-white bg-transparent px-8 text-lg font-bold uppercase tracking-widest text-white hover:bg-white/20 hover:text-white">
                Shop Mens
              </Button>
            </Link>
            <Link href="/collections/latest-drop">
              <Button size="lg" variant="outline" className="h-14 min-w-[180px] rounded-none border-2 border-white bg-transparent px-8 text-lg font-bold uppercase tracking-widest text-white hover:bg-white/20 hover:text-white">
                Shop Latest Drop
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

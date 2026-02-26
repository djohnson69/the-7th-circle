import { Hero } from "@/components/Hero";
import { FeaturedCollection } from "@/components/FeaturedCollection";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Home() {
  return (
    <>
      <Hero />

      <FeaturedCollection />

      {/* Lifestyle / Category Split */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[600px]">
        <div className="relative flex items-center justify-center overflow-hidden group bg-neutral-900">
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-40 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-50" />
           <div className="relative z-10 text-center p-8">
             <h2 className="font-display text-5xl font-bold uppercase tracking-tighter text-white mb-4 drop-shadow-lg">Training</h2>
             <Link href="/collections/men">
               <Button variant="outline" className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-black uppercase font-bold tracking-widest rounded-none px-8 py-6">
                 Shop Gear
               </Button>
             </Link>
           </div>
        </div>
        <div className="relative flex items-center justify-center overflow-hidden group bg-neutral-900">
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1616279967983-338861f57f2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-40 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-50" />
           <div className="relative z-10 text-center p-8">
             <h2 className="font-display text-5xl font-bold uppercase tracking-tighter text-white mb-4 drop-shadow-lg">Lifestyle</h2>
             <Link href="/collections/women">
               <Button variant="outline" className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-black uppercase font-bold tracking-widest rounded-none px-8 py-6">
                 Shop Apparel
               </Button>
             </Link>
           </div>
        </div>
      </section>
    </>
  );
}

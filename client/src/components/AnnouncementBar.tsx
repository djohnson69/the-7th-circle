import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ANNOUNCEMENTS = [
  "FREE SHIPPING ON ORDERS OVER $150"
];

export function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#D00000] text-black overflow-hidden py-2 relative">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <button 
          onClick={() => setCurrentIndex((prev) => (prev - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length)}
          className="hidden md:block p-1 hover:bg-black/10 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        
        <div className="flex-1 flex justify-center">
          <p className="font-display font-bold uppercase tracking-widest text-xs md:text-sm animate-in fade-in slide-in-from-bottom-2 duration-500 key={currentIndex}">
            {ANNOUNCEMENTS[currentIndex]}
          </p>
        </div>

        <button 
          onClick={() => setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length)}
          className="hidden md:block p-1 hover:bg-black/10 transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

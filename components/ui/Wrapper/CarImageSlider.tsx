"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming you have a cn utility, else use standard string concat

type CarImageSliderProps = {
  images: string[];
  model: string;
};

export default function CarImageSlider({ images, model }: CarImageSliderProps) {
  const [mainIndex, setMainIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="w-full h-[400px] bg-slate-100 dark:bg-slate-900 rounded-[2rem] flex flex-col items-center justify-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800">
        <p className="text-xs font-black uppercase tracking-widest">No Visuals Available</p>
      </div>
    );
  }

  const prevImage = () => setMainIndex((p) => (p === 0 ? images.length - 1 : p - 1));
  const nextImage = () => setMainIndex((p) => (p === images.length - 1 ? 0 : p + 1));

  return (
    <div className="group space-y-6">
      
      {/* --- Main Stage --- */}
      <div className="relative w-full aspect-[16/10] md:aspect-[16/9] rounded-[2.5rem] overflow-hidden bg-slate-100 dark:bg-slate-900 shadow-2xl">
        {/* Main Image with smooth crossfade */}
        <Image
          src={images[mainIndex]}
          alt={`${model} view ${mainIndex + 1}`}
          fill
          priority
          sizes="(max-width: 1280px) 100vw, 80vw"
          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />

        {/* Premium Overlay Controls */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
        
        {/* Navigation Arrows - Glassmorphic */}
        {images.length > 1 && (
          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={prevImage}
              className="p-3 rounded-full bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all active:scale-90"
            >
              <ChevronLeft size={24} strokeWidth={2.5} />
            </button>

            <button
              onClick={nextImage}
              className="p-3 rounded-full bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all active:scale-90"
            >
              <ChevronRight size={24} strokeWidth={2.5} />
            </button>
          </div>
        )}

        {/* Counter Badge */}
        <div className="absolute bottom-6 right-6 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-black text-white uppercase tracking-tighter">
          {mainIndex + 1} / {images.length}
        </div>
      </div>

      {/* --- Smart Thumbnails --- */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar px-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setMainIndex(idx)}
              className={cn(
                "relative w-24 h-16 shrink-0 rounded-2xl overflow-hidden transition-all duration-300 transform",
                idx === mainIndex 
                  ? "ring-2 ring-blue-600 ring-offset-4 ring-offset-white dark:ring-offset-[#050505] scale-105 shadow-lg" 
                  : "opacity-40 hover:opacity-100 border border-slate-200 dark:border-slate-800"
              )}
            >
              <Image
                src={img}
                alt={`Thumbnail ${idx}`}
                fill
                sizes="96px"
                className="object-cover"
              />
              {/* Active Overlay */}
              {idx === mainIndex && (
                <div className="absolute inset-0 bg-blue-600/10 pointer-events-none" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
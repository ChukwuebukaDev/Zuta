"use client";

import Link from "next/link";
import { Sparkles, ShieldCheck, CarFront, SlidersHorizontal, ArrowRight } from "lucide-react";

interface CarsHeroProps {
  totalCars?: number;
  onOpenFilter?: () => void;
}

export default function CarsHero({ totalCars = 0, onOpenFilter }: CarsHeroProps) {
  const POPULAR_BRANDS = ["Toyota", "Lexus", "Mercedes-Benz", "BMW", "Honda", "Hyundai"];

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-neutral-900 via-zinc-900 to-white pt-10 pb-12 rounded-3xl mb-8 border border-neutral-800/60 shadow-2xl">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-amber-500/10 blur-[120px] pointer-events-none rounded-full" />

      {/* Grid Pattern Background overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center z-10">
        
        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-950/80 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-widest shadow-lg mb-6 backdrop-blur-md">
          <Sparkles size={13} className="animate-pulse" />
          <span>Verified Marketplace Platform</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-none">
          Drive the Exception. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
            Find Your Next Vehicle.
          </span>
        </h1>

        {/* Subtitle Description */}
        <p className="mt-4 text-xs sm:text-base text-neutral-300 max-w-2xl font-medium leading-relaxed">
          Explore structured inventory from verified dealers and private owners across Nigeria. Full vehicle specs, structural history, and direct pricing transparency.
        </p>

        {/* Quick Action Trigger Bar */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 w-full max-w-md">
          {onOpenFilter && (
            <button
              onClick={onOpenFilter}
              type="button"
              className="flex-1 min-w-[140px] flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
            >
              <SlidersHorizontal size={15} />
              <span>Filter Specs</span>
            </button>
          )}

          <Link
            href="/sell"
            className="flex-1 min-w-[140px] flex items-center justify-center gap-2 bg-neutral-950/90 hover:bg-neutral-800 text-white border border-neutral-700 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 group"
          >
            <span>List Vehicle</span>
            <ArrowRight size={14} className="text-amber-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Quick Brand Filter Pills */}
        <div className="mt-8 pt-6 border-t border-neutral-800/80 w-full flex flex-col items-center gap-3">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">
            Popular Brands:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {POPULAR_BRANDS.map((brand) => (
              <Link
                key={brand}
                href={`/cars?brand=${encodeURIComponent(brand)}`}
                className="px-3 py-1 rounded-lg bg-neutral-900/90 hover:bg-amber-500/20 hover:border-amber-500/40 border border-neutral-800 text-neutral-300 hover:text-amber-400 text-xs font-bold transition duration-200"
              >
                {brand}
              </Link>
            ))}
          </div>
        </div>

        {/* Trust Badges Bar */}
        <div className="mt-8 flex items-center justify-center gap-6 sm:gap-10 text-neutral-400 text-[11px] font-bold uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={15} className="text-emerald-400" />
            <span>Verified Postings</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CarFront size={15} className="text-amber-400" />
            <span>{totalCars > 0 ? `${totalCars}+ Vehicles` : "Active Inventory"}</span>
          </div>
        </div>

      </div>
    </section>
  );
}
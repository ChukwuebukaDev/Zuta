"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ShieldCheck,
  CarFront,
  SlidersHorizontal,
  ArrowRight,
  Search,
  Loader2,
} from "lucide-react";
import { useAISearch } from "@/hooks/useAiSearch";
import {createSearchParams} from "@/lib/search/params";

interface CarsHeroProps {
  totalCars?: number;
  onOpenFilter?: () => void;
}

export default function CarsHero({
  totalCars = 0,
  onOpenFilter,
}: CarsHeroProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
 const { search, isSearching } = useAISearch();

  const POPULAR_BRANDS = [
    "Toyota",
    "Lexus",
    "Mercedes-Benz",
    "BMW",
    "Honda",
    "Hyundai",
  ];

 const handleSearchSubmit = async (
  e: React.FormEvent
) => {
  e.preventDefault();

  if (!searchQuery.trim()) return;

  const url = await search(searchQuery.trim());

  router.push(url);
};

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-neutral-950 via-zinc-950 to-neutral-900 pt-12 pb-14 rounded-3xl mb-10 border border-neutral-800/80 shadow-2xl">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[650px] h-[300px] bg-amber-500/10 blur-[130px] pointer-events-none rounded-full" />

      {/* Grid Pattern Background Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#26262615_1px,transparent_1px),linear-gradient(to_bottom,#26262615_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center z-10">
        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900/90 border border-amber-500/30 text-amber-400 text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-xl mb-6 backdrop-blur-md">
          <Sparkles size={13} className="animate-pulse text-amber-400" />
          <span>Gemini AI Search Active</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1]">
          Drive the Exception. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
            Find Your Next Vehicle.
          </span>
        </h1>

        {/* Subtitle Description */}
        <p className="mt-4 text-xs sm:text-base text-neutral-400 max-w-2xl font-medium leading-relaxed">
          Explore structured inventory from verified dealers and private owners across Nigeria. Full vehicle specs, structural history, and direct pricing transparency.
        </p>

        {/* --- GEMINI AI LIVE SEARCH INPUT BAR --- */}
        <form
          onSubmit={handleSearchSubmit}
          className="mt-8 w-full max-w-xl bg-neutral-900/90 border border-neutral-800 focus-within:border-amber-500/80 rounded-2xl p-2 flex items-center gap-2 shadow-2xl backdrop-blur-md transition-all group"
        >
          <div className="pl-3 text-neutral-500 group-focus-within:text-amber-400 transition-colors">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isSearching}
            placeholder='Try "car of 6.5m for uber" or "Toyota Corolla under 10m"...'
            className="w-full bg-transparent text-xs sm:text-sm text-white placeholder:text-neutral-500 outline-none font-medium disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition shrink-0 cursor-pointer shadow-lg shadow-amber-500/10 active:scale-95 flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSearching ? (
              <>
                <Loader2 size={14} className="animate-spin text-slate-950" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles size={14} />
                <span>AI Search</span>
              </>
            )}
          </button>
        </form>

        {/* --- INTERACTIVE PROMPT PILLS --- */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[11px] text-neutral-400">
          <span className="font-bold uppercase tracking-wider text-[9px] text-neutral-500">
            Examples:
          </span>
          <button
            type="button"
            onClick={() => setSearchQuery("car of 6.5m for uber")}
            className="text-neutral-400 hover:text-amber-400 underline underline-offset-2 transition cursor-pointer"
          >
            car of 6.5m for uber
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => setSearchQuery("SUV under 15m foreign used")}
            className="text-neutral-400 hover:text-amber-400 underline underline-offset-2 transition cursor-pointer"
          >
            SUV under 15m foreign used
          </button>
        </div>

        {/* --- ACTION BUTTONS --- */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 w-full max-w-md">
          {onOpenFilter && (
            <button
              onClick={onOpenFilter}
              type="button"
              className="flex-1 min-w-[140px] flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-200 hover:text-white px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <SlidersHorizontal size={15} className="text-amber-400" />
              <span>Advanced Filters</span>
            </button>
          )}

          <Link
            href="/sell"
            className="flex-1 min-w-[140px] flex items-center justify-center gap-2 bg-neutral-950 hover:bg-neutral-900 text-white border border-neutral-800 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 group"
          >
            <span>List Vehicle</span>
            <ArrowRight
              size={14}
              className="text-amber-400 group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {/* --- POPULAR BRAND PILLS --- */}
        <div className="mt-8 pt-6 border-t border-neutral-800/80 w-full flex flex-col items-center gap-3">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-500">
            Popular Brands:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {POPULAR_BRANDS.map((brand) => (
              <Link
                key={brand}
                href={`/cars?brand=${encodeURIComponent(brand)}`}
                className="px-3.5 py-1.5 rounded-xl bg-neutral-900/90 hover:bg-amber-500/10 hover:border-amber-500/40 border border-neutral-800 text-neutral-300 hover:text-amber-400 text-xs font-bold transition duration-200 hover:ring-1 hover:ring-amber-500/30"
              >
                {brand}
              </Link>
            ))}
          </div>
        </div>

        {/* --- TRUST BADGES --- */}
        <div className="mt-8 flex items-center justify-center gap-6 sm:gap-10 text-neutral-400 text-[11px] font-bold uppercase tracking-wider">
          <div className="flex items-center gap-2 bg-neutral-900/40 px-3 py-1.5 rounded-lg border border-neutral-800/60">
            <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
            <span>Verified Postings</span>
          </div>
          <div className="flex items-center gap-2 bg-neutral-900/40 px-3 py-1.5 rounded-lg border border-neutral-800/60">
            <CarFront size={16} className="text-amber-400 shrink-0" />
            <span>
              {totalCars > 0 ? `${totalCars}+ Vehicles` : "Active Inventory"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
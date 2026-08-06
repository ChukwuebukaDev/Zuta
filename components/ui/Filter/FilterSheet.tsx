"use client";

import { useState } from "react";
import { SlidersHorizontal, ChevronDown, RotateCcw } from "lucide-react";

interface FilterSheetProps {
  children: React.ReactNode;
  totalResults?: number;
  defaultOpen?: boolean;
  activeFilterCount?: number;
  onClearFilters?: () => void;
}

export default function FilterSheet({
  children,
  totalResults,
  defaultOpen = true,
  activeFilterCount = 0,
  onClearFilters,
}: FilterSheetProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="w-full mb-6">
      {/* Header Panel */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-3">
          {/* Toggle Accordion Trigger Button */}
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-controls="filter-panel"
            className="group flex items-center gap-2.5 h-10 px-4 rounded-xl border border-neutral-800 bg-neutral-900/90 text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white hover:bg-neutral-850 hover:border-neutral-700 transition-all duration-200 cursor-pointer shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400 group-hover:text-amber-400 transition-colors" />
            <span>Filter Specs</span>

            {/* Active Filter Counter Badge */}
            {activeFilterCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-[10px] font-black rounded-full bg-amber-500 text-slate-950">
                {activeFilterCount}
              </span>
            )}

            <ChevronDown
              className={`w-3.5 h-3.5 text-neutral-500 transition-transform duration-300 group-hover:text-neutral-300 ${
                open ? "rotate-180 text-amber-400" : ""
              }`}
            />
          </button>

          {/* Quick Clear Filters Trigger */}
          {activeFilterCount > 0 && onClearFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-amber-400 font-semibold transition-colors cursor-pointer"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Total Results Counter */}
        {totalResults !== undefined && (
          <p className="text-xs text-neutral-400 font-medium">
            <span className="font-black text-amber-400 bg-neutral-900 border border-neutral-800/80 px-2 py-1 rounded-lg mr-1.5 font-mono">
              {totalResults.toLocaleString()}
            </span>
            {totalResults === 1 ? "vehicle match" : "vehicles available"}
          </p>
        )}
      </div>

      {/* Accordion Draw Panel */}
      <div
        id="filter-panel"
        className={`grid transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          open
            ? "grid-rows-[1fr] opacity-100 translate-y-0"
            : "grid-rows-[0fr] opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="overflow-hidden">
          <div className="py-2 bg-neutral-950/60 border border-neutral-800/80 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
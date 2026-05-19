"use client";

import { useState } from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";

export default function FilterSheet({
  children,
  totalResults,
  defaultOpen = true,
}: {
  children: React.ReactNode;
  totalResults?: number;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="w-full mb-4">
      {/* Header Panel */}
      <div className="flex items-center justify-between mb-2 px-1">
        <button
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-controls="filter-panel"
          className="group flex items-center gap-2 h-10 px-4 rounded-xl border border-slate-800 bg-zinc-900 text-xs font-medium text-slate-200 hover:text-white hover:bg-zinc-800 transition-all duration-200"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-400 transition-colors" />
          <span>Filters</span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-300 group-hover:text-slate-300 ${
              open ? "rotate-180 text-blue-400" : ""
            }`}
          />
        </button>

        {totalResults !== undefined && (
          <p className="text-xs text-slate-400">
            <span className="font-semibold text-slate-200 bg-zinc-900 border border-slate-800/60 px-2 py-1 rounded-md mr-1">
              {totalResults.toLocaleString()}
            </span>{" "}
            {totalResults === 1 ? "vehicle" : "vehicles"} available
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
          {/* Removed the extra card frame and background wrapper to stop vertical clutter */}
          <div className="py-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
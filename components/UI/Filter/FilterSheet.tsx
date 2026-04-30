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
    <div className="mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-controls="filter-panel"
          className="group flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium shadow-sm hover:shadow-md hover:bg-gray-50 transition-all"
        >
          <SlidersHorizontal className="w-4 h-4 text-gray-600 group-hover:text-black transition-colors" />
          
          <span className="text-gray-700 group-hover:text-black">
            Filters
          </span>

          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {totalResults !== undefined && (
          <p className="text-sm text-gray-500">
            <span className="font-medium text-gray-800">
              {totalResults.toLocaleString()}
            </span>{" "}
            {totalResults === 1 ? "result" : "results"}
          </p>
        )}
      </div>

      {/* Panel */}
      <div
        id="filter-panel"
        className={`grid transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          open
            ? "grid-rows-[1fr] opacity-100 scale-y-100"
            : "grid-rows-[0fr] opacity-0 scale-y-95"
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
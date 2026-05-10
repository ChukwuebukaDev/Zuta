"use client";

import { useState } from "react";
import CarsFilter from "./CarsFilter";

export default function FiltersSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-24 left-4 z-50 bg-black text-white px-4 py-2 rounded-xl shadow"
      >
        Filters
      </button>

      {/* Overlay (mobile) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-72 z-50
          transform transition-transform duration-300 ease-in-out
          bg-white border-r border-gray-100 shadow-sm p-6

          ${open ? "translate-x-0" : "-translate-x-full"}
          
          lg:translate-x-0 lg:sticky lg:block lg:h-auto lg:shadow-none lg:border lg:rounded-2xl lg:top-24
        `}
      >
        {/* Close button (mobile) */}
        <button
          onClick={() => setOpen(false)}
          className="lg:hidden mb-4 text-sm text-gray-500"
        >
          Close ✕
        </button>

        <h2 className="text-lg font-semibold mb-6">Filters</h2>
        <CarsFilter />
      </aside>
    </>
  );
}

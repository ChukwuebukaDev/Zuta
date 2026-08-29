"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  MoreVertical, 
  Pencil, 
  Eye, 
  Tag, 
  Archive, 
  Trash2 
} from "lucide-react";

type DealerCarDropdownProps = {
  carId: string;
};

export default function DealerCarDropdown({ carId }: DealerCarDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <button 
        onClick={(e) => {
  e.stopPropagation();
  setIsOpen((prev) => !prev);
}}
        className="p-1.5 text-slate-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors focus:outline-none"
        aria-label="Dealer actions"
      >
        <MoreVertical size={18} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-44 bg-zinc-900 border border-slate-800 rounded-xl shadow-xl z-20 overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-150">
          
          <Link 
            href={`/dashboard/inventory/${carId}/edit`}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-300 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <Pencil size={14} className="text-slate-400" />
            Edit Spec
          </Link>
          
          <Link 
            href={`/cars/${carId}`}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-300 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <Eye size={14} className="text-slate-400" />
            View Listing
          </Link>

          <button 
            onClick={() => {
              // Add your status update logic here
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-300 hover:bg-zinc-800 hover:text-white transition-colors text-left"
          >
            <Tag size={14} className="text-slate-400" />
            Mark as Sold
          </button>

          <button 
            onClick={() => {
              // Add your unlist logic here
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-300 hover:bg-zinc-800 hover:text-white transition-colors text-left"
          >
            <Archive size={14} className="text-slate-400" />
            Unlist / Hide
          </button>

          <div className="h-px bg-slate-800 my-1"></div>

          <button 
            onClick={() => {
              // Add your delete logic here
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-left"
          >
            <Trash2 size={14} />
            Delete Car
          </button>
          
        </div>
      )}
    </div>
  );
}
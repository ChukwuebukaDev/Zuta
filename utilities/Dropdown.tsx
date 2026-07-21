"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Search, X } from "lucide-react";

type DropdownProps = {
  options: string[];
  value: string | number;
  placeholder?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
};

export default function Dropdown({
  options,
  value,
  placeholder,
  disabled,
  onChange,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Filter options
  const filtered = useMemo(() => {
    return options.filter((opt) =>
      opt.toLowerCase().includes(query.toLowerCase())
    );
  }, [options, query]);

  return (
    <div className="relative w-full" ref={ref}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={`w-full p-4 rounded-xl border transition-all duration-300 flex justify-between items-center group
          ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
          ${open ? 'border-blue-500/50 bg-black ring-1 ring-blue-500/20' : 'bg-black border-slate-800 hover:border-slate-700'}
        `}
      >
        <span className={`text-sm capitalize ${value ? 'text-white font-medium' : 'text-slate-500'}`}>
          {value || placeholder || "Select"}
        </span>
        <ChevronDown 
          size={16} 
          className={`text-slate-500 transition-transform duration-300 ${open ? 'rotate-180 text-blue-500' : ''}`} 
        />
      </button>

      {/* Dropdown Menu */}
      {open && !disabled && (
        <div className="absolute z-[60] mt-2 w-full bg-black/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Search Header */}
          <div className="relative border-b border-slate-800/50 p-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
            <input
              autoFocus
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full p-3 pl-10 bg-transparent text-sm text-white outline-none placeholder:text-slate-700"
            />
            {query && (
              <button 
                onClick={() => setQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Options List */}
          <ul className="max-h-60 overflow-y-auto custom-scrollbar py-2">
            {filtered.length === 0 ? (
              <li className="p-4 text-center text-xs text-slate-600 italic">
                No matching options found
              </li>
            ) : (
              filtered.map((opt) => (
                <li
                  key={opt}
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={`px-4 py-3 text-sm cursor-pointer transition-colors capitalize
                    ${opt === value 
                      ? "bg-blue-600/10 text-blue-400 font-bold" 
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    {opt}
                    {opt === value && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />}
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
"use client";

import { useState, useRef, useEffect, useMemo } from "react";

type DropdownProps = {
  options: string[];
  value: string;
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
      opt.toLowerCase().includes(query.toLowerCase()),
    );
  }, [options, query]);

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className="w-full p-3 rounded-xl bg-[#1a1a1a] border border-gray-800 text-left text-white flex justify-between items-center"
      >
        {value || placeholder || "Select"}
        <span className="text-gray-400">▾</span>
      </button>

      {open && !disabled && (
        <div className="absolute z-50 mt-2 w-full bg-[#1a1a1a] border border-gray-800 rounded-xl shadow-lg">
          {/* Search */}
          <input
            autoFocus
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-3 border-b border-gray-800 bg-transparent text-white outline-none"
          />

          {/* Options */}
          <ul className="max-h-60 overflow-y-auto">
            {filtered.length === 0 && (
              <li className="p-3 text-gray-400">No results</li>
            )}

            {filtered.map((opt) => (
              <li
                key={opt}
                className={`p-3 cursor-pointer hover:bg-gray-700 ${
                  opt === value ? "bg-gray-800" : ""
                }`}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                  setQuery("");
                }}
              >
                {opt}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

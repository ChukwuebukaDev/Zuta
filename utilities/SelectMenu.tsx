"use client";
import { useEffect, useRef, useState, useMemo } from "react";

interface SelectMenuProps {
  options: string[];
  value?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  width?: string;
  disabled?: boolean;
}

export default function SelectMenu({
  options,
  value,
  placeholder = "Select",
  onChange,
  width = "w-56",
  disabled = false,
}: SelectMenuProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  // 🔍 Filtered options
  const filteredOptions = useMemo(() => {
    if (!query) return options;
    return options.filter((opt) =>
      opt.toLowerCase().includes(query.toLowerCase()),
    );
  }, [options, query]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center gap-2 h-10 focus:outline-none focus:ring-2 focus:ring-black/10 border-gray-200 bg-white px-3 py-2 rounded-xl transition
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <span className="text-sm font-medium text-gray-800">
          {value || placeholder}
        </span>

        {/* Arrow */}
        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && !disabled && (
        <div
          className={`absolute z-50 mt-2 ${width} bg-black border rounded-xl shadow-lg`}
        >
          {/* 🔍 Search Input */}
          <div className="p-2 border-b">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-full px-2 py-1 text-sm border rounded-md outline-none"
            />
          </div>

          {/* Options */}
          <ul className="max-h-56 overflow-y-auto py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option}
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 hover:text-black ${
                    option === value ? "bg-gray-100 font-medium" : ""
                  }`}
                >
                  {option}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-sm text-gray-400">No results</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

"use client";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";

interface SelectMenuProps {
  options: string[];
  value?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  width?: string;
  disabled?: boolean;
  searchable?: boolean; // make search optional
}

export default function SelectMenu({
  options,
  value,
  placeholder = "Select option",
  onChange,
  width = "w-56",
  disabled = false,
  searchable = true,
}: SelectMenuProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Filtered options
  const filteredOptions = useMemo(() => {
    if (!query) return options;
    const q = query.toLowerCase();
    return options.filter(opt => opt.toLowerCase().includes(q));
  }, [options, query]);

  // Reset highlight when list changes
  useEffect(() => {
    setHighlightedIndex(0);
  }, [query, open]);

  // Close on outside click + Escape
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < filteredOptions.length - 1? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev > 0? prev - 1 : filteredOptions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (filteredOptions[highlightedIndex]) {
          selectOption(filteredOptions[highlightedIndex]);
        }
        break;
      case "Tab":
        setOpen(false);
        setQuery("");
        break;
    }
  }, [open, filteredOptions, highlightedIndex]);

  // Scroll highlighted item into view
  useEffect(() => {
    const item = listRef.current?.children[highlightedIndex] as HTMLElement;
    item?.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex]);

  const selectOption = (option: string) => {
    onChange(option);
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={containerRef} className={`relative ${width}`}>
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(prev =>!prev)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-2 h-10 border border-gray-200 bg-white px-3 py-2 rounded-xl transition-all
          focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-300
          ${disabled? "opacity-50 cursor-not-allowed" : "hover:border-gray-300"}
        `}
      >
        <span className={`text-sm truncate ${value? "text-gray-900" : "text-gray-500"}`}>
          {value || placeholder}
        </span>

        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${open? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open &&!disabled && (
        <div
          className={`absolute z-50 mt-1.5 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden`}
          role="listbox"
        >
          {/* Search Input */}
          {searchable && (
            <div className="p-2 border-b border-gray-100">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search..."
                className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-300"
              />
            </div>
          )}

          {/* Options */}
          <ul
            ref={listRef}
            className="max-h-56 overflow-y-auto py-1"
          >
            {filteredOptions.length > 0? (
              filteredOptions.map((option, idx) => (
                <li
                  key={option}
                  role="option"
                  aria-selected={option === value}
                  onClick={() => selectOption(option)}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  className={`px-3 py-2 text-sm cursor-pointer transition-colors
                    ${idx === highlightedIndex? "bg-gray-100" : ""}
                    ${option === value? "font-medium text-gray-900 bg-gray-50" : "text-gray-700"}
                    hover:bg-gray-100
                  `}
                >
                  {option}
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-sm text-gray-400 select-none">
                No results found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
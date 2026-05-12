"use client";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Search, ChevronDown, Check, X } from "lucide-react";

interface SelectMenuProps {
  options: string[];
  value?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  width?: string;
  disabled?: boolean;
  searchable?: boolean;
}

export default function SelectMenu({
  options,
  value,
  placeholder = "Select option",
  onChange,
  width = "w-full",
  disabled = false,
  searchable = true,
}: SelectMenuProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filteredOptions = useMemo(() => {
    if (!query) return options;
    const q = query.toLowerCase();
    return options.filter((opt) => opt.toLowerCase().includes(q));
  }, [options, query]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [query, open]);

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

  const selectOption = (option: string) => {
    onChange(option);
    setOpen(false);
    setQuery("");
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
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
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : 0,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredOptions.length - 1,
          );
          break;
        case "Enter":
          e.preventDefault();
          if (filteredOptions[highlightedIndex])
            selectOption(filteredOptions[highlightedIndex]);
          break;
        case "Tab":
          setOpen(false);
          setQuery("");
          break;
      }
    },
    [open, filteredOptions, highlightedIndex],
  );

  useEffect(() => {
    const item = listRef.current?.children[highlightedIndex] as HTMLElement;
    item?.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex]);

  return (
    <div ref={containerRef} className={`relative ${width}`}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-2 h-[58px] border rounded-xl px-4 transition-all duration-300
          ${disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
          ${
            open
              ? "border-blue-500/50 bg-black ring-1 ring-blue-500/20"
              : "bg-black border-slate-800 hover:border-slate-700"
          }
        `}
      >
        <span
          className={`text-sm truncate capitalize ${value ? "text-white font-medium" : "text-slate-500"}`}
        >
          {value || placeholder}
        </span>

        <ChevronDown
          size={18}
          className={`text-slate-500 transition-transform duration-300 ${open ? "rotate-180 text-blue-500" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {open && !disabled && (
        <div className="absolute z-70 mt-2 w-full bg-black/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Integrated Search Input */}
          {searchable && (
            <div className="relative p-2 border-b border-slate-800/50">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                size={14}
              />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-transparent text-white outline-none placeholder:text-slate-700"
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
          )}

          {/* Options List */}
          <ul
            ref={listRef}
            className="max-h-60 overflow-y-auto py-2 custom-scrollbar"
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, idx) => (
                <li
                  key={option}
                  role="option"
                  aria-selected={option === value}
                  onClick={() => selectOption(option)}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  className={`px-4 py-3 text-sm cursor-pointer transition-colors capitalize flex items-center justify-between
                    ${idx === highlightedIndex ? "bg-slate-900 text-white" : "text-slate-400"}
                    ${option === value ? "text-blue-400 font-bold bg-blue-600/5" : ""}
                  `}
                >
                  <span>{option}</span>
                  {option === value && (
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                  )}
                </li>
              ))
            ) : (
              <li className="px-4 py-8 text-center text-xs text-slate-600 italic">
                No matching results
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

interface SearchBarProps {
  type?: "cars" | "parts" | "all";
  className?: string;
  onSearchSuccess?: () => void;
}

export default function SearchBar({ type = "all", className = "", onSearchSuccess }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");

  // Keep input synchronized if query parameter changes elsewhere
  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const encodedQuery = encodeURIComponent(query.trim());
    
    // Determine target route based on search bar placement
    let targetRoute = `/cars?q=${encodedQuery}`;
    if (type === "parts") targetRoute = `/parts?q=${encodedQuery}`;
    if (type === "all") targetRoute = `/marketplace/search?q=${encodedQuery}`;

    router.push(targetRoute);
    
    // Optional mobile menu callback to drop overlay states
    if (onSearchSuccess) onSearchSuccess();
  };

  const placeholderText = {
    cars: "Search make, model, or year...",
    parts: "Search engines, tyres, batteries...",
    all: "Search Zuta marketplace..."
  }[type];

  return (
    <form onSubmit={handleSearch} className={`relative w-full group ${className}`}>
      <input
        type="text"
        placeholder={placeholderText}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-10 pr-4 py-2 text-xs font-medium bg-gray-100/80 border border-transparent focus:border-gray-200 focus:bg-white rounded-xl text-gray-900 outline-none transition-all placeholder:text-gray-400"
      />
      <Search 
        size={14} 
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors pointer-events-none" 
      />
    </form>
  );
}
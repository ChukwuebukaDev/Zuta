"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, useEffect } from "react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState("");

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (query.trim()) {
      params.set("q", query.trim());
    } else {
      params.delete("q");
    }

    // Reset pagination
    params.delete("page");

    startTransition(() => {
      router.replace(`/cars?${params.toString()}`);
    });
  };

  return (
    <div className="flex items-center gap-2 w-full max-w-2xl">
      <input
        type="text"
        placeholder="Search Toyota, Camry, SUV..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="flex-1 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
      />

      <button
        onClick={handleSearch}
        disabled={isPending}
        className="bg-black text-white px-5 py-3 rounded-xl"
      >
        Search
      </button>
    </div>
  );
}

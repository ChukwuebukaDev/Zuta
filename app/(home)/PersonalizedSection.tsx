"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PersonalizedSection() {
  const [lastSearch, setLastSearch] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("zuta_last_search");

    if (!stored) return;

    const parsed = JSON.parse(stored);

    // Optional: ignore searches older than 7 days
    const isFresh =
      parsed.timestamp &&
      Date.now() - parsed.timestamp < 7 * 24 * 60 * 60 * 1000;

    if (isFresh) {
      setLastSearch(parsed);
    }
  }, []);

  if (!lastSearch) return null;

  const query = new URLSearchParams(lastSearch).toString();

  return (
    <div className="bg-gray-50 rounded-2xl p-6 mb-8 border">
      <h2 className="text-2xl font-semibold mb-2">Welcome back 👋</h2>

      <p className="text-gray-600 mb-4">
        Continue exploring {lastSearch.brand || "cars"} you searched for
      </p>

      <Link
        href={`/cars?${query}`}
        className="bg-black text-white px-4 py-2 rounded-lg inline-block"
      >
        Continue Search
      </Link>
    </div>
  );
}

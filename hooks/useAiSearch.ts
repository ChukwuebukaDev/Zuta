"use client";

import { useState } from "react";
import { createSearchParams } from "@/lib/search/params";

export function useAISearch() {
  const [isSearching, setIsSearching] = useState(false);

  async function search(prompt: string): Promise<string> {
    setIsSearching(true);

    try {
      const res = await fetch("/api/search/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
        }),
      });

      if (!res.ok) {
        throw new Error("AI search failed.");
      }

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error);
      }

      const params = createSearchParams(data.filters);

      return `/cars?${params.toString()}`;
    } catch (error) {
      console.error("[AI_SEARCH]", error);

      return `/cars?search=${encodeURIComponent(prompt)}`;
    } finally {
      setIsSearching(false);
    }
  }

  return {
    search,
    isSearching,
  };
}
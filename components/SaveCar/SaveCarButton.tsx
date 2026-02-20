"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  saveCar,
  removeSavedCar,
  isCarSaved,
} from "@/lib/utils/saveCar";

export default function SaveCarButton({ slug }: { slug: string }) {
  const [saved, setSaved] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setSaved(isCarSaved(slug));
  }, [slug]);

  const handleToggle = () => {
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);

    if (saved) {
      removeSavedCar(slug);
      setSaved(false);
      toast.success("Removed from saved cars");
    } else {
      saveCar(slug);
      setSaved(true);
      toast.success("Car saved successfully 🚗");
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        relative px-6 py-3 rounded-full font-medium
        backdrop-blur-xl
        border
        transition-all duration-300
        flex items-center gap-2
        overflow-hidden
        ${
          saved
            ? "bg-white/20 border-white/40 shadow-[0_8px_30px_rgba(0,0,0,0.12)] scale-105"
            : "bg-white/10 border-white/30 hover:bg-white/20"
        }
      `}
    >
      {/* Glow Layer */}
      {saved && (
        <span className="absolute inset-0 rounded-full bg-white/10 blur-xl animate-pulse" />
      )}

      {/* Heart */}
      <span
        className={`relative transition-all duration-300 ${
          saved ? "scale-125" : "scale-100"
        } ${animating ? "animate-bounce" : ""}`}
      >
        {saved ? "❤️" : "🤍"}
      </span>

      <span className="relative">
        {saved ? "Saved" : "Save Car"}
      </span>
    </button>
  );
}
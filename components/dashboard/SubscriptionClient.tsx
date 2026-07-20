"use client";

import { useState, useEffect } from "react";
import { Sparkles, Crown } from "lucide-react";
import SubscriptionModal from "@/components/dashboard/SubscriptionModal";

export default function SubscriptionClient() {
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Safely mount to prevent hydration mismatch errors across server/client lines
  useEffect(() => {
    setTimeout(() => setIsMounted(true), 0);
  }, []);

  const handleOpen = () => setIsUpgradeOpen(true);
  const handleClose = () => setIsUpgradeOpen(false);

  return (
    <>
      {/* Floating Action Button - Mobile Bottom Stick & Desktop Top-Right Absolute Grid */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:absolute md:top-4 md:right-4 md:bottom-auto md:left-auto md:translate-x-0 z-[999] w-[90%] md:w-auto">
        <button
          onClick={handleOpen}
          className="group relative w-full md:w-auto px-5 sm:px-6 py-3.5 md:py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-widest rounded-2xl md:rounded-xl shadow-lg hover:shadow-amber-500/20 hover:shadow-xl transition-all duration-300 ease-out flex items-center justify-center gap-2.5 border border-white/10 active:scale-97 md:active:scale-100 cursor-pointer"
        >
          {/* Mobile Display Icon */}
          <Crown className="w-4 h-4 md:hidden text-slate-950/80 group-hover:text-slate-950 transition-colors shrink-0" />
          
          <span className="relative font-bold">
            Upgrade Account
            <Sparkles className="absolute -top-1 -right-5 w-3 h-3 text-yellow-200 animate-pulse hidden sm:inline" />
          </span>

          {/* Desktop Display Icon */}
          <Sparkles className="hidden md:inline w-3.5 h-3.5 text-slate-950/70 group-hover:rotate-12 transition-transform shrink-0" />

          {/* Liquid Light Hover Glow Effect */}
          <span className="absolute inset-0 rounded-2xl md:rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </button>

        {/* Desktop Helper Subtitle Label */}
        <p className="hidden md:block text-[10px] text-white/40 text-center mt-1.5 font-bold uppercase tracking-widest antialiased">
          Unlock Premium Fleet Slots
        </p>
      </div>

      {/* Subscription Overlay Framework */}
      <SubscriptionModal 
        isOpen={isUpgradeOpen} 
        onClose={handleClose}
      />

      {/* Shortcuts Keyboard Guide Overlay (Safely mounted to prevent console warnings) */}
      {isMounted && (
        <div className="fixed bottom-4 right-4 text-[10px] font-bold uppercase tracking-wider text-white/20 z-50 pointer-events-none hidden md:block">
          Press <kbd className="px-1.5 py-0.5 bg-zinc-900 border border-slate-800 rounded text-white/40 mx-0.5 font-sans">Esc</kbd> to close
        </div>
      )}
    </>
  );
}
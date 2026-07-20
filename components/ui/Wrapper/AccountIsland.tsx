"use client";

import { useState, useRef, useEffect } from "react";
import { 
  ShieldCheck, Store, UserCheck, ChevronDown, 
  Sparkles, Layers, ArrowRight 
} from "lucide-react";
import { Role } from "@prisma/client";

interface AccountStatusIslandProps {
  user: {
    name: string | null;
    role: Role;
    listingLimit: number;
    isVerified: boolean;
  };
}

export default function AccountStatusIsland({ user }: AccountStatusIslandProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [modalCoords, setModalCoords] = useState({ top: 0, left: 0 });

  const isDealer = user.role === Role.DEALER;
  const isAdmin = user.role === Role.ADMIN;

  // Track coordinates dynamically when opened
  useEffect(() => {
    if (isExpanded && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setModalCoords({
        top: rect.bottom + window.scrollY + 12, // 12px clean layout margin
        left: rect.left + window.scrollX + rect.width / 2,
      });
    }
  }, [isExpanded]);

  // Global click/tap-away listener to collapse the island safely
  useEffect(() => {
    const handleDismiss = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleDismiss);
      document.addEventListener("touchstart", handleDismiss);
    }

    return () => {
      document.removeEventListener("mousedown", handleDismiss);
      document.removeEventListener("touchstart", handleDismiss);
    };
  }, [isExpanded]);

  // 🚀 DESKTOP HOVER HANDLERS: Wrapped in safety checks
  const handleMouseEnter = () => {
    // Only trigger hover state if the device supports actual fine pointer hover (Desktop)
    if (window.matchMedia("(pointer: fine)").matches) {
      setIsExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (window.matchMedia("(pointer: fine)").matches) {
      setIsExpanded(false);
    }
  };

  // 📱 MOBILE TAP HANDLER: Explicit toggle event
  const handleToggleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded((prev) => !prev);
  };

  return (
    /* Outer layout perimeter track */
    <div 
      ref={containerRef}
      className="absolute z-[9999] flex items-center w-full justify-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* --- LAYER 1: IDLE CAPSULE BUTTON --- */}
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggleClick}
        className={`
          w-56 h-10 rounded-full py-2 px-3 
          bg-zinc-950 border border-slate-800/80 
          backdrop-blur-xl justify-between items-center flex 
          select-none group cursor-pointer transition-all duration-300 ease-out
          hover:border-slate-700 hover:bg-zinc-900/40
          ${isExpanded ? "scale-[1.02] border-slate-700 bg-zinc-900/40 shadow-lg shadow-black/40" : "active:scale-[0.98]"}
        `}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative flex h-2 w-2 shrink-0">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isDealer ? "bg-emerald-400" : "bg-blue-400"
            }`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              isDealer ? "bg-emerald-500" : "bg-blue-500"
            }`} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest truncate text-slate-300">
            {isDealer ? "Dealer Profile" : "Private Desk"}
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-zinc-900 px-2 py-0.5 rounded-full border border-slate-800 text-slate-400 group-hover:text-white transition">
          {isDealer ? <Store size={10} /> : <UserCheck size={10} />}
          <ChevronDown size={10} className={`transition-transform duration-300 ${isExpanded ? "rotate-180 text-white" : ""}`} />
        </div>
      </button>

      {/* --- LAYER 2: VIEWPORT-ISOLATED FLOW PANEL --- */}
      {isExpanded && (
        <div className="fixed inset-0 z-[9999] overflow-hidden pointer-events-none animate-in fade-in duration-200">
          
          {/* Expanded Card Panel */}
          <div
            className="absolute w-[92%] max-w-sm bg-zinc-950/95 border border-slate-800 rounded-[2rem] p-5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9)] backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-300 -translate-x-1/2 pointer-events-auto"
            style={{
              top: `${modalCoords.top}px`,
              left: `${modalCoords.left}px`,
            }}
            onClick={(e) => e.stopPropagation()} // Stop bubbling inside the card layout
          >
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/5 blur-[80px] rounded-full pointer-events-none" />

            {/* Profile Row */}
            <div className="flex items-center justify-between relative z-10">
              <div className="space-y-0.5 min-w-0">
                <span className="text-[8px] uppercase font-black tracking-[0.2em] text-slate-500 block">
                  Identity Registry Node
                </span>
                <h4 className="text-sm font-black uppercase italic tracking-tight text-white truncate">
                  {user.name || "Verified Zuta User"}
                </h4>
              </div>

              <span className={`inline-flex items-center gap-1.5 border px-2.5 py-1 rounded-xl text-[9px] font-bold uppercase tracking-wider shrink-0 ${
                isDealer 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
              }`}>
                {isDealer ? <Store size={11} /> : <ShieldCheck size={11} />}
                {isDealer ? "Authorized Dealer" : "Private Tier"}
              </span>
            </div>

            <hr className="border-slate-900 my-4" />

            {/* Stats Metrics Grid */}
            <div className="grid grid-cols-2 gap-2.5 relative z-10">
              <div className="p-3 bg-zinc-900/40 border border-slate-900 rounded-xl flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
                  <Layers size={13} />
                </div>
                <div className="min-w-0">
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider block">Fleet Limit</span>
                  <p className="text-xs font-black text-slate-200 mt-0.5 truncate">
                    {isAdmin ? "Infinite" : `${user.listingLimit} Open Slots`}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-zinc-900/40 border border-slate-900 rounded-xl flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                  <ShieldCheck size={13} />
                </div>
                <div className="min-w-0">
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider block">Node Sync</span>
                  <p className="text-xs font-black text-slate-200 mt-0.5 uppercase tracking-wide truncate">
                    {isDealer ? "Verified" : "Active Pool"}
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Option Box */}
            {!isDealer && (
              <div className="pt-3.5 relative z-10">
                <button 
                  type="button"
                  className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition duration-300 shadow-md shadow-amber-500/5 group cursor-pointer"
                >
                  <Sparkles size={11} className="text-slate-950 fill-slate-950/10" />
                  <span>Request Dealer License</span>
                  <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform duration-300" />
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
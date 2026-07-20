"use client";

import { useState } from "react";
import { Wrench, Compass, ArrowRight, ShieldCheck, Cpu } from "lucide-react";
import { toast } from "sonner";

export default function PartsComingSoonPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please provide a valid diagnostic contact address.");
      return;
    }

    setStatus("loading");
    
    // Simulate catalog registration allocation pipeline
    try {
      await new Promise((res) => setTimeout(res, 1200));
      setStatus("success");
      toast.success("Priority Allocation slot locked successfully.");
      setEmail("");
    } catch {
      toast.error("Allocation queue failure. Retry shortly.");
      setStatus("idle");
    }
  };

  return (
    <div className="min-h-[85vh] w-full flex items-center justify-center bg-zinc-950 text-slate-100 px-4 py-12 relative overflow-hidden">
      
      {/* Premium Ambient Visual Scrim Blowouts */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Grid Pattern Mesh Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f11_1px,transparent_1px),linear-gradient(to_bottom,#0f0f11_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-70 pointer-events-none" />

      {/* Main Structural Layout Container */}
      <div className="max-w-2xl w-full text-center space-y-8 relative z-10">
        
        {/* Animated Badge Icon Display */}
        <div className="inline-flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-md border border-slate-800/80 rounded-3xl shadow-xl group hover:border-blue-500/30 transition-all duration-500">
          <div className="p-3 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-2xl relative">
            <Wrench size={26} className="animate-pulse" />
            <Cpu size={12} className="absolute -top-1 -right-1 text-indigo-400" />
          </div>
        </div>

        {/* Text Area Configuration Block */}
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2.5">
            <span className="h-4 w-1 bg-blue-600 rounded-full shadow-[0_0_12px_rgba(37,99,235,0.8)]" />
            <h1 className="text-xs md:text-sm font-black tracking-[0.3em] uppercase bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent italic">
              Zuta Component Forge
            </h1>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase italic leading-none pt-1">
            Parts Engine <br className="sm:hidden" />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Coming Soon</span>
          </h2>
          
          <p className="text-xs md:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed pt-2 font-medium antialiased">
            We are indexing an uncompromised directory of high-performance mechanical assets, structural panels, and electrical components map layouts.
          </p>
        </div>

        {/* --- Interactive Allocation Notification Form Matrix --- */}
        <div className="max-w-md mx-auto p-4 bg-zinc-900/20 border border-slate-900/90 rounded-2xl backdrop-blur-sm shadow-2xl">
          {status === "success" ? (
            <div className="py-4 flex flex-col items-center justify-center space-y-2 animate-in fade-in duration-500">
              <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck size={20} />
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-white">Priority Vault Allocation Active</p>
              <p className="text-[11px] text-slate-500">You will be routed early access keys as components load.</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                disabled={status === "loading"}
                placeholder="Secure email diagnostic routing address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-zinc-950 border border-slate-800/80 focus:border-blue-500/80 rounded-xl px-4 py-3 text-xs text-white outline-none transition duration-300 disabled:opacity-40 placeholder:text-slate-600 font-medium"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white text-xs font-black uppercase tracking-widest px-6 py-3 sm:py-0 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-blue-600/10 active:scale-97 shrink-0 cursor-pointer"
              >
                <span>{status === "loading" ? "Locking..." : "Secure Access"}</span>
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>
          )}
        </div>

        {/* Informative Status Footer Metrics */}
        <div className="flex justify-center items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-500 pt-4">
          <div className="flex items-center gap-1.5"><Compass size={12} /> <span>Global Ingestion</span></div>
          <div className="h-3 w-px bg-slate-900" />
          <div className="flex items-center gap-1.5"><ShieldCheck size={12} /> <span>Escrow Encrypted</span></div>
        </div>

      </div>
    </div>
  );
}
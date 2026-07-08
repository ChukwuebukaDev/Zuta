"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/controls/Button";

export default function SellHero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative h-screen w-full flex items-center justify-center bg-zinc-950 text-slate-100 overflow-hidden">
      
      {/* Cinematic Asset Background Canvas */}
      <div className="absolute inset-0 -z-20">
        <Image
          src="/images/sell-hero-background.png"
          alt="Premium vehicle transactional environment"
          fill
          priority
          className="object-cover opacity-40 mix-blend-luminosity grayscale group-hover:scale-105 transition-transform duration-1000"
        />
      </div>

      {/* Modern Low-Light Illumination Masks */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/90 via-zinc-950/40 to-zinc-950 -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Floating Control Navigation Gateway */}
      <Link
        href="/"
        className="fixed top-8 left-6 md:left-10 z-50 flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition duration-300 bg-zinc-900/40 backdrop-blur-md border border-slate-900/60 pl-3 pr-4 py-2 rounded-xl shadow-2xl"
      >
        <ArrowLeft size={14} className="text-zinc-500" />
        Marketplace
      </Link>

      {/* Identity Layout Content Body */}
      <div className="relative text-center px-4 max-w-4xl space-y-6">
        <div className="space-y-3">
          <motion.span 
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={{ opacity: 1, letterSpacing: "0.2em" }}
            transition={{ duration: 0.5 }}
            className="inline-block text-[10px] md:text-xs font-black uppercase text-emerald-400 tracking-widest border border-emerald-500/10 bg-emerald-500/5 px-3 py-1 rounded-md"
          >
            Zuta Logistics Pipeline
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter text-white leading-[0.95]"
          >
            Sell Your Vehicle <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-slate-300 to-zinc-500">
              The Smart Way
            </span>
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="max-w-2xl mx-auto text-sm md:text-base text-slate-400 font-medium tracking-normal leading-relaxed"
        >
          Connect with vetted, serious buyers across Nigeria. List your asset directly on our premium marketplace interface and close deals with structural confidence.
        </motion.p>

        {/* Action Controls Cluster */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-3 w-full sm:w-auto"
        >
          <Button
            className="w-full sm:w-auto px-8 py-5 text-xs font-black uppercase italic tracking-widest rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 shadow-lg shadow-white/5 transition-all"
            onClick={() => scrollToSection("sell-form")}
          >
            Start Listing
          </Button>

          <Button
            variant="outline"
            className="w-full sm:w-auto px-8 py-5 text-xs font-black uppercase italic tracking-widest rounded-xl border-slate-800 bg-zinc-900/20 text-slate-300 hover:bg-zinc-900 hover:text-white transition-all"
            onClick={() => scrollToSection("how-it-works")}
          >
            See System Engine
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
"use client";

import { ShieldCheck, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Verified Integrity",
    description:
      "Every single listing undergoes system review before deployment, keeping the Zuta inventory clean and highly trusted.",
    accentClass: "text-emerald-400 bg-emerald-500/5 border-emerald-500/10",
  },
  {
    icon: Users,
    title: "Serious Buyers Only",
    description:
      "Skip the casual window shoppers. Bypass noise and connect directly with high-intent buyers searching across Nigeria.",
    accentClass: "text-amber-400 bg-amber-500/5 border-amber-500/10",
  },
  {
    icon: Zap,
    title: "Streamlined Engine",
    description:
      "Accelerated processing channels mean your premium automotive asset hits the active marketplace feed within hours.",
    accentClass: "text-blue-400 bg-blue-500/5 border-blue-500/10",
  },
];

export default function SellBenefits() {
  return (
    <section className="bg-zinc-950 text-slate-100 py-28 px-4 border-t border-slate-900/60">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Editorial Section Header */}
        <div className="text-center space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white"
          >
            Why Sell on Zuta?
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto font-medium leading-relaxed tracking-normal"
          >
            Zuta isn&apos;t a generic classifieds board. It is a highly optimized, high-fidelity transactional engine built exclusively for serious automotive trade parameters.
          </motion.p>
        </div>

        {/* System Benefits Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-[2rem] bg-zinc-900/30 border border-slate-900 p-8 flex flex-col items-start text-left hover:border-zinc-800 hover:bg-zinc-900/50 transition-all duration-300 shadow-xl"
              >
                {/* Ambient Subtle Card Backlight Flare */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/[0.01] rounded-full blur-2xl group-hover:bg-white/[0.03] transition-all duration-500" />

                {/* Styled Utility Icon Box */}
                <div className={`p-3 rounded-xl border mb-6 flex items-center justify-center shrink-0 ${benefit.accentClass}`}>
                  <Icon size={20} strokeWidth={2} />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold uppercase tracking-tight text-white group-hover:text-zinc-200 transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-medium">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
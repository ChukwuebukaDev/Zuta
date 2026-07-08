"use client";

import { motion } from "framer-motion";
import { FileText, ShieldCheck, MessageCircle } from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "Asset Specification",
    description:
      "Input your vehicle metrics comprehensively—including brand variants, mechanical historical logs, and custom pricing arrays.",
  },
  {
    icon: ShieldCheck,
    title: "System Authentication",
    description:
      "Our integrity team reviews and audits your parameters swiftly to maintain an optimized, premium-tier marketplace standard.",
  },
  {
    icon: MessageCircle,
    title: "Direct Gateway Access",
    description:
      "Uncover active real-time deals, receive targeted verified offers, and close transactions securely inside your buyer workspace.",
  },
];

export default function SellSteps() {
  return (
    <section id="how-it-works" className="bg-zinc-950 text-slate-100 py-28 px-4 border-t border-slate-900/60 relative">
      {/* Background Ambient Depth Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f141c_1px,transparent_1px),linear-gradient(to_bottom,#0f141c_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        
        {/* Section Typography Header */}
        <div className="text-center space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white"
          >
            System Engine Workflow
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto font-medium leading-relaxed tracking-normal"
          >
            Deploying your automotive asset on Zuta is an engineered, linear sequence built for structural tracking accuracy.
          </motion.p>
        </div>

        {/* Process Step Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                viewport={{ once: true }}
                className="group flex flex-col justify-between rounded-[2rem] bg-zinc-900/20 border border-slate-900/80 p-8 hover:border-zinc-800 transition-all duration-300"
              >
                <div>
                  {/* Technical Index Counter Row */}
                  <div className="flex items-center justify-between border-b border-slate-900/60 pb-6 mb-6">
                    <span className="font-mono text-xs font-black text-zinc-600 group-hover:text-emerald-400 transition-colors">
                      [{String(index + 1).padStart(2, "0")}]
                    </span>
                    <Icon size={16} className="text-zinc-500 group-hover:text-white transition-colors" strokeWidth={1.5} />
                  </div>

                  {/* Body Block text */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold uppercase tracking-tight text-white">
                      {step.title}
                    </h3>
                    <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-medium">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
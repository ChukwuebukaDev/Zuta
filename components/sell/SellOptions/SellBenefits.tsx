"use client";

import { ShieldCheck, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Secure & Verified Listings",
    description:
      "Every listing is reviewed before going live, keeping Zuta clean and trusted.",
  },
  {
    icon: Users,
    title: "Serious Buyers Only",
    description:
      "Connect with buyers actively searching for vehicles across Nigeria.",
  },
  {
    icon: Zap,
    title: "Fast Approval Process",
    description:
      "Get your car listed quickly with our streamlined review system.",
  },
];

export default function SellBenefits() {
  return (
    <section className="bg-[#0f0f0f] text-white py-24 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold"
        >
          Why Sell on Zuta?
        </motion.h2>

        <p className="mt-6 text-gray-400 max-w-2xl mx-auto">
          Zuta isn’t just another listing site. It’s a focused car marketplace
          built for serious sellers and buyers.
        </p>

        <div className="mt-16 grid md:grid-cols-3 gap-10">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#1a1a1a] p-8 rounded-2xl border border-gray-800 hover:border-gray-600 transition"
              >
                <Icon className="mx-auto mb-6 text-white" size={32} />
                <h3 className="text-xl font-semibold">
                  {benefit.title}
                </h3>
                <p className="mt-4 text-gray-400 text-sm">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
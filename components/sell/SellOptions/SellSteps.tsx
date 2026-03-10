"use client";

import { motion } from "framer-motion";
import { FileText, ShieldCheck, MessageCircle } from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "Add Your Car Details",
    description:
      "Provide information about your vehicle including brand, model, year, and price.",
  },
  {
    icon: ShieldCheck,
    title: "We Review & Approve",
    description:
      "Our team verifies your listing to maintain a high-quality marketplace.",
  },
  {
    icon: MessageCircle,
    title: "Connect With Buyers",
    description:
      "Interested buyers reach out and you close the deal confidently.",
  },
];

export default function SellSteps() {
  return (
    <section id="how-it-works" className="bg-[#141414] text-white py-24 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold"
        >
          How It Works
        </motion.h2>

        <p className="mt-6 text-gray-400 max-w-2xl mx-auto">
          Listing your car on Zuta is simple, secure, and designed for serious
          sellers.
        </p>

        <div className="mt-16 grid md:grid-cols-3 gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Step Number */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white text-black w-10 h-10 rounded-full flex items-center justify-center font-semibold">
                  {index + 1}
                </div>

                <div className="bg-[#1c1c1c] p-10 rounded-2xl border border-gray-800">
                  <Icon className="mx-auto mb-6 text-white" size={32} />
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="mt-4 text-gray-400 text-sm">
                    {step.description}
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

"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Car } from "lucide-react";
import { Button } from "../Controls/Button";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-zinc-950 via-zinc-900 to-black text-white">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
      </div>

      <div className="container mx-auto px-6 text-center max-w-5xl">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-block mb-6 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-white/80"
        >
          🚗 Zuta Marketplace
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold leading-tight"
        >
          Find your{" "}
          <span className="block bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            dream car
          </span>
          , faster.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-lg text-white/70"
        >
          Buy, sell, or discover cars effortlessly. Zuta brings the entire car
          market to your fingertips.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-row flex-wrap items-center justify-center gap-4 max-w-full overflow-x-hidden"
        >
          <Link href="/cars">
            <Button size="lg">
              Browse Cars <Car className="ml-2 h-4 w-4" />
            </Button>
          </Link>

          <Link href="/sell">
            <Button variant="outline" size="lg">
              Sell Your Car <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

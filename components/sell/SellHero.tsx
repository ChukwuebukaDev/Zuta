"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../UI/Controls/Button";

export default function SellHero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center text-white overflow-hidden">
      

      <div className="absolute inset-0 -z-20">
        <Image
          src="/images/sell-hero-background.png"
          alt="Car key exchange"
          fill
          priority
          className="object-cover"
        />
      </div>


      <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/60 to-black/80 -z-10" />
       <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-sm text-gray-200 hover:text-white transition"
      >
        <ArrowLeft size={18} />
        Back to Marketplace
      </Link>
  
      <div className="relative text-center px-6 max-w-3xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold leading-tight"
        >
          Sell Your Car the Smart Way
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-6 text-lg md:text-xl text-gray-200"
        >
          Connect with serious buyers across Nigeria and close your deal with confidence.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex justify-center gap-4 flex-wrap"
        >
          <Button className="px-8 py-6 text-lg">
            Start Selling
          </Button>

          <Button
            variant="outline"
            className="px-8 py-6 text-lg border-white text-white hover:bg-white hover:text-black"
          >
            See How It Works
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
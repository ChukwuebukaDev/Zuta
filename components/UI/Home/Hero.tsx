"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Car } from "lucide-react";
import { Button } from "../Controls/Button";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden text-white">
      
      {/* Background Image */}
      <div className="absolute inset-0 -z-20">
        <Image
          src="/images/car-background.jpg" 
          alt="Luxury car with engineer in workshop"
          fill
          priority
          className="object-cover scale-105"
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 -z-10 bg-black/10" />

      {/* Gold Gradient */}
      <div className="absolute inset-0 -z-10 bg-linear-to-tr from-black via-black/70 to-amber-900/20" />

      <div className="container mx-auto px-6 text-center max-w-5xl">
        
      
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-block mb-6 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1 text-sm text-amber-300 tracking-wide"
        >
          Premium Automotive Marketplace
        </motion.div>

       
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold leading-tight tracking-tight"
        >
          Own the road.
          <span className="block bg-linear-to-r from-amber-300 to-yellow-500 bg-clip-text text-transparent">
            Drive excellence.
          </span>
        </motion.h1>
  
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-lg text-white/70 max-w-2xl mx-auto"
        >
          Discover elite vehicles, premium parts, and trusted automotive
          professionals — all in one refined marketplace.
        </motion.p>
 
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-6"
        >
          <Link href="/cars">
            <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-black">
              Browse Collection <Car className="ml-2 h-4 w-4" />
            </Button>
          </Link>

          <Link href="/sell">
            <Button
              variant="outline"
              size="lg"
              className="border-amber-400 text-amber-300 hover:bg-amber-400/10"
            >
              Sell Your Vehicle <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
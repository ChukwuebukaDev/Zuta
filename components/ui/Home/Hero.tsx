"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation"; 
import { motion } from "framer-motion";
import { Role } from "@prisma/client";
import { ArrowRight, Car, LayoutDashboard, MessageSquare, PlusCircle, ShieldCheck, Star } from "lucide-react";
import { Button } from "../controls/Button";
import { AuthModal } from "@/components/auth/AuthModal";
import { showListingPromptToast } from "@/components/toast/ListingPromptToast";

interface DbUser {
  id: string | null;
  name: string | null;
  email: string | null;
  role?: Role;
  privateListingLimit?: number;
  dealerProfile?: {
    businessName: string;
    rating: number;
    totalSales: number;
  } | null;
}

interface HeroProps {
  user: DbUser | null;
}

export default function Hero({ user }: HeroProps) {
  const router = useRouter(); // 👈 Initialized router
  const isAuthenticated = !!user?.id;
  const firstName = user?.name ? user.name.trim().split(" ")[0] : null;
  const isDealer = user?.role === Role.DEALER;
  const isAdmin = user?.role === Role.ADMIN;

  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: "login" | "signup" }>({
    isOpen: false,
    mode: "login"
  });

  const openAuth = (mode: "login" | "signup") => {
    setAuthModal({ isOpen: true, mode });
  };

  // 🛠️ The Corrected Action Handler
  const handleListVehicleClick = () => {
    // 1. If not logged in, pop open the clean entry portal modal!
    if (!isAuthenticated) {
      return openAuth("login");
    }

    // 2. If already an onboarded Dealer, bypass prompt and land right on /sell
    if (user?.role === Role.DEALER) {
      return router.push("/sell");
    }

    // 3. If standard user, run our custom action prompt toast
    if (user?.role === Role.USER) {
      showListingPromptToast({
        listingsRemaining: user.privateListingLimit ?? 2,
        onChoosePrivate: () => {
          router.push("/sell#sell-form");
        },
        onChooseDealer: () => {
          router.push("/onboarding");
        },
      });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden text-white">
      {/* Base Stacking Background Layers remain identical */}
      <div className="absolute inset-0 bg-neutral-950 -z-30" />
      <div className="absolute inset-0 -z-20">
        <Image
          src="/images/car-background.jpg"
          alt="Luxury car with engineer in workshop"
          fill
          priority
          className="object-cover scale-105"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-black/40" />
      <div className="absolute inset-0 -z-10 bg-linear-to-tr from-neutral-950 via-neutral-950/70 to-amber-900/20" />

      <div className="container mx-auto px-6 text-center max-w-5xl z-10">
        {/* UPPER CONTEXT BADGE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 mb-6 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1 text-sm text-amber-300 tracking-wide"
        >
          {isAdmin && <ShieldCheck className="h-4 w-4 text-amber-400" />}
          {isDealer
            ? `${user.dealerProfile?.businessName || "Authorized Dealership"} • Portal`
            : isAuthenticated
            ? `Premium Account • Welcome back, ${firstName}`
            : "Premium Automotive Marketplace"}
        </motion.div>

        {/* CONDITIONALLY RENDERED INTERFACES */}
        {!isAuthenticated ? (
          <div className="space-y-6">
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
            <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
              Discover elite vehicles, premium metrics, and trusted automotive
              professionals — all in one refined marketplace.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-100"
            >
              Hello, <span className="text-amber-400">{firstName}</span>. What are we doing today?
            </motion.h1>

            {/* Quick Insights Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
              {isDealer ? (
                <>
                  <div className="bg-neutral-900/80 backdrop-blur-md p-4 rounded-xl border border-neutral-800">
                    <p className="text-xs uppercase text-neutral-400 font-semibold tracking-wider">Rating</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-xl font-bold text-neutral-100">{user?.dealerProfile?.rating ?? "5.0"}</span>
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    </div>
                  </div>
                  <div className="bg-neutral-900/80 backdrop-blur-md p-4 rounded-xl border border-neutral-800">
                    <p className="text-xs uppercase text-neutral-400 font-semibold tracking-wider">Total Sales</p>
                    <p className="text-xl font-bold text-neutral-100 mt-1">{user?.dealerProfile?.totalSales ?? 0} units</p>
                  </div>
                </>
              ) : (
                <div className="bg-neutral-900/80 backdrop-blur-md p-4 rounded-xl border border-neutral-800">
                  <p className="text-xs uppercase text-neutral-400 font-semibold tracking-wider">Listing Slots Open</p>
                  <p className="text-xl font-bold text-neutral-100 mt-1">{user?.privateListingLimit ?? 2} Remaining</p>
                </div>
              )}
              <div className="bg-neutral-900/80 backdrop-blur-md p-4 rounded-xl border border-neutral-800">
                <p className="text-xs uppercase text-neutral-400 font-semibold tracking-wider">Account Status</p>
                <p className="text-xl font-bold text-emerald-400 mt-1">Active</p>
              </div>
              <Link href="/valuation" className="bg-neutral-900/80 hover:bg-neutral-800/50 backdrop-blur-md p-4 rounded-xl border border-neutral-800">
                <p className="text-xs uppercase text-neutral-400 font-semibold tracking-wider">Car Valuation</p>
                <p className="text-xl font-bold text-gray-400 mt-1">Valuate my car</p>
              </Link>
            </div>
          </div>
        )}

        {/* ACTION PANEL */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link href="/cars">
            <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-8 cursor-pointer">
              Explore Showroom <Car className="ml-2 h-4 w-4" />
            </Button>
          </Link>

          {isAuthenticated ? (
            <>
              {isDealer || isAdmin ? (
                <Link href="/dashboard">
                  <Button variant="outline" size="lg" className="border-neutral-700 text-neutral-300 hover:bg-neutral-900/50 font-semibold cursor-pointer">
                    Console <LayoutDashboard className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
        
                <Button 
                  onClick={handleListVehicleClick} 
                  variant="outline" 
                  size="lg" 
                  className="border-amber-500/40 text-amber-400 hover:bg-amber-400/10 font-semibold cursor-pointer animate-none"
                >
                  List a Vehicle <PlusCircle className="ml-2 h-4 w-4" />
                </Button>
                
              )}
              <Link href="/messages">
                <Button variant="ghost" size="lg" className="text-neutral-300 hover:text-white hover:bg-white/5 cursor-pointer">
                  Inbox <MessageSquare className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </>
          ) : (
            /* Direct click also points standard guests to the click intercept wrapper */
            <Button
              variant="outline"
              size="lg"
              onClick={handleListVehicleClick}
              className="border-neutral-700 text-neutral-300 hover:bg-neutral-900 font-semibold cursor-pointer"
            >
              Sell Your Vehicle <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </motion.div>
      </div>

      {/* RENDER POPPING MODAL SCREEN PORTAL */}
      <AuthModal
        isOpen={authModal.isOpen}
        initialMode={authModal.mode}
        onClose={() => setAuthModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </section>
  );
}
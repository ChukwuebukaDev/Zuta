"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation"; 
import { motion } from "framer-motion";
import { Role } from "@prisma/client";
import { ArrowRight, Car, LayoutDashboard, MessageSquare, PlusCircle, ShieldCheck, Star } from "lucide-react";
import { Button } from "../controls/Button";
import { showListingPromptToast } from "@/components/toast/ListingPromptToast";
import AccountStatusIsland from "@/components/ui/Wrapper/AccountIsland";
import SubscriptionClient from "@/components/dashboard/SubscriptionClient";

interface DbUser {
  id: string | null;
  name: string | null;
  email: string | null;
  role?: Role;
  privateListingLimit?: number;
  isVerified?: boolean; 
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
  const router = useRouter(); 
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

  const handleListVehicleClick = () => {
    if (!isAuthenticated) {
      return openAuth("login");
    }

    if (user?.role === Role.DEALER) {
      return router.push("/sell");
    }

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
    <>
      {user && user.id && (
        <AccountStatusIsland 
          user={{
            name: user.name || "Showroom Broker",
            role: user.role || Role.USER,
            listingLimit: user.privateListingLimit ?? 0,
            isVerified: user.isVerified ?? false,
          }} 
        />
      )}
      {user && user.id && <SubscriptionClient />}
     
      <section className="relative min-h-[92vh] md:min-h-screen w-full flex items-center justify-center overflow-hidden text-white px-4 py-12 md:py-0">
       
        
        <div className="absolute inset-0 z-10 pointer-events-none">
          <Image
            src="/images/car-background.jpg"
            alt="Luxury car workshop presentation layout backdrop"
            fill
            priority
            className="object-cover scale-103 opacity-30 md:opacity-45 object-center"
          />
        </div>
        
        <div className="absolute inset-0 bg-black/70 md:bg-black/60 z-20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-tr from-neutral-950 via-neutral-950/80 to-amber-950/10 z-20 pointer-events-none" />

        <div className="w-full container mx-auto px-2 sm:px-6 text-center max-w-5xl z-30 space-y-6 md:space-y-8 relative">
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-1.5 text-[11px] md:text-sm font-semibold text-amber-400 tracking-wider backdrop-blur-xs shadow-sm max-w-[90%] sm:max-w-full"
          >
            {isAdmin && <ShieldCheck className="h-3.5 w-3.5 text-amber-400 shrink-0" />}
            <span className="truncate">
              {isDealer
                ? `${user.dealerProfile?.businessName || "Authorized Dealership"} • Showroom Portal`
                : isAuthenticated
                ? `Premium Vault Identity • Welcome back, ${firstName}`
                : "Premium Automotive Marketplace"}
            </span>
          </motion.div>

          {!isAuthenticated ? (
            <div className="space-y-4 md:space-y-6">
              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight uppercase italic"
              >
                Own the road.
                <span className="block bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 bg-clip-text text-transparent mt-1 md:mt-2">
                  Drive excellence.
                </span>
              </motion.h1>
              <p className="text-xs sm:text-sm md:text-lg text-neutral-400 max-w-2xl mx-auto font-medium leading-relaxed antialiased px-2">
                Discover elite vehicles, advanced performance metrics, and trusted global automotive professionals — all in one refined digital marketplace environment.
              </p>
            </div>
          ) : (
            <div className="space-y-6 md:space-y-8">
              <motion.h1
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl sm:text-3xl md:text-5xl font-black tracking-tight text-neutral-100 uppercase italic leading-tight"
              >
                Hello, <span className="bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent">{firstName}</span>. <br className="sm:hidden" /> What are we doing today?
              </motion.h1>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 max-w-3xl mx-auto text-left relative z-10 px-2 sm:px-0">
                {isDealer ? (
                  <>
                    <div className="bg-neutral-900/40 backdrop-blur-md p-4 rounded-xl border border-neutral-900/60 hover:border-neutral-800 transition">
                      <p className="text-[9px] uppercase text-neutral-500 font-bold tracking-wider">Showroom Rating</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-base font-black text-neutral-100">{user?.dealerProfile?.rating ?? "5.0"}</span>
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />
                      </div>
                    </div>
                    <div className="bg-neutral-900/40 backdrop-blur-md p-4 rounded-xl border border-neutral-900/60 hover:border-neutral-800 transition">
                      <p className="text-[9px] uppercase text-neutral-500 font-bold tracking-wider">Total Revenue Units</p>
                      <p className="text-base font-black text-neutral-100 mt-1">{user?.dealerProfile?.totalSales ?? 0} units sold</p>
                    </div>
                  </>
                ) : (
                  <div className="bg-neutral-900/40 backdrop-blur-md p-4 rounded-xl border border-neutral-900/60 hover:border-neutral-800 transition">
                    <p className="text-[9px] uppercase text-neutral-500 font-bold tracking-wider">Free Listing Slots Open</p>
                    <p className="text-base font-black text-slate-200 mt-1">{user?.privateListingLimit ?? 2} Remaining</p>
                  </div>
                )}
                <Link href="/messages" className="bg-neutral-900/40 backdrop-blur-md p-4 rounded-xl border text-neutral-500 border-neutral-900/60 hover:border-neutral-800 transition">
                Inbox <MessageSquare className="ml-2 h-4 w-4 text-slate-200 shrink-0" />
                </Link>
                <Link href="/valuation" className="bg-neutral-900/40 hover:bg-neutral-900/80 backdrop-blur-md p-4 rounded-xl border border-neutral-900/60 hover:border-slate-800/80 transition group col-span-1 sm:col-span-3 lg:col-span-1">
                  <p className="text-[9px] uppercase text-neutral-500 font-bold tracking-wider group-hover:text-amber-400 transition-colors">Instant Valuation</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-400 mt-1 flex items-center gap-1">Valuate my asset <ArrowRight size={12} /></p>
                </Link>
              </div>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 w-full px-2 sm:px-0 relative z-20"
          >
            <Link href="/cars" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-widest px-8 py-3.5 sm:py-3 cursor-pointer rounded-xl transition duration-300 shadow-xl shadow-amber-500/5 flex items-center justify-center">
                Explore Showroom <Car className="ml-2 h-4 w-4 shrink-0" />
              </Button>
            </Link>

            {isAuthenticated ? (
              <>
                {isDealer || isAdmin ? (
                  <Link href="/dashboard" className="w-full sm:w-auto">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto border-neutral-800 text-neutral-300 hover:bg-neutral-900/50 hover:text-white font-bold text-xs uppercase tracking-widest py-3.5 sm:py-3 cursor-pointer rounded-xl transition flex items-center justify-center">
                      Management Console <LayoutDashboard className="ml-2 h-4 w-4 shrink-0" />
                    </Button>
                  </Link>
                ) : (
                  <Button 
                    onClick={handleListVehicleClick} 
                    variant="outline" 
                    size="lg" 
                    className="w-full sm:w-auto border-amber-500/30 text-amber-400 hover:bg-amber-400/10 font-bold text-xs uppercase tracking-widest py-3.5 sm:py-3 cursor-pointer rounded-xl transition flex items-center justify-center"
                  >
                    Sell a Vehicle <PlusCircle className="ml-2 h-4 w-4 shrink-0" />
                  </Button>
                )}
              
              </>
            ) : (
              <Link href='/sell'
                className="w-full sm:w-auto border-neutral-800 text-neutral-300 hover:bg-neutral-900 hover:text-white font-bold text-xs uppercase tracking-widest py-3.5 sm:py-3 cursor-pointer rounded-xl transition flex items-center justify-center"
              >
                Sell Your Vehicle <ArrowRight className="ml-2 h-4 w-4 shrink-0" />
              </Link>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}
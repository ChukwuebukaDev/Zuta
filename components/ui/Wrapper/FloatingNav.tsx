"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Compass, Car, PlusCircle, LayoutDashboard, 
  MessageSquare, User, Wrench, Calculator, 
  X, ChevronRight, ArrowLeft
} from "lucide-react";

interface NavLinkItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  color?: string;
}

const NAV_LINKS: NavLinkItem[] = [
  { label: "Showroom", href: "/cars", icon: Car },
  { label: "List a Vehicle", href: "/sell", icon: PlusCircle, badge: "Free", color: "text-amber-400" },
  { label: "Car Valuation", href: "/valuation", icon: Calculator },
  { label: "Console", href: "/dashboard", icon: LayoutDashboard, badge: "Dealer" },
  { label: "Inbox Messages", href: "/messages", icon: MessageSquare },
  { label: "Account Profile", href: "/profile", icon: User },
];

export default function FloatingNav() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Close menu automatically on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Click-away listener to collapse menu when tapping outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("touchstart", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [isOpen]);

  // Back Navigation Action
  const handleBackNavigation = () => {
    setIsOpen(false);
    router.back();
  };

  return (
    <div 
      ref={menuRef}
      className="fixed bottom-6 right-6 z-[999] flex flex-col items-end pointer-events-auto select-none"
    >
      {/* 🚀 EXPANDED PAGE NAVIGATION DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mb-4 w-68 bg-zinc-950/95 border border-slate-800 rounded-[2rem] p-3 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl overflow-hidden"
          >
            {/* Header Identity */}
            <div className="px-3 py-2 border-b border-slate-900 flex items-center justify-between">
              <span className="text-[9px] uppercase font-black tracking-[0.2em] text-slate-500 flex items-center gap-1.5">
                <Compass size={12} className="text-amber-400" />
                Zuta Directory
              </span>
              <span className="text-[9px] font-bold text-slate-600 uppercase">Quick Jump</span>
            </div>

            {/* ⚡ PREMIUM ADDITION: Back Button Trigger */}
            {pathname !== "/" && (
              <div className="pt-2 pb-1">
                <button
                  type="button"
                  onClick={handleBackNavigation}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-slate-300 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 hover:text-white transition duration-200 cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <ArrowLeft size={14} className="text-amber-400 group-hover:-translate-x-1 transition-transform" />
                    <span>Previous Page</span>
                  </div>
                  <span className="text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    Back
                  </span>
                </button>
              </div>
            )}

            {/* Links List */}
            <div className="py-1 space-y-1 max-h-[55vh] overflow-y-auto custom-scrollbar">
              {NAV_LINKS.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`
                      flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition duration-200 group
                      ${isActive 
                        ? "bg-zinc-900 text-amber-400 border border-slate-800" 
                        : "text-slate-300 hover:bg-zinc-900 hover:text-white"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-1.5 rounded-lg shrink-0 ${isActive ? "bg-amber-500/20 text-amber-400" : "bg-zinc-900 text-slate-400 group-hover:text-white group-hover:bg-zinc-800"}`}>
                        <Icon size={14} />
                      </div>
                      <span className="truncate">{link.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {link.badge && (
                        <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md border bg-zinc-900 ${link.color || "text-slate-400"} border-slate-800`}>
                          {link.badge}
                        </span>
                      )}
                      <ChevronRight size={12} className="text-slate-600 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🚀 CORE FLOATING SPEED-DIAL BUTTON */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`
          h-14 w-14 rounded-full flex items-center justify-center 
          bg-zinc-950 border border-slate-800 text-white 
          shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl 
          hover:border-amber-500/50 hover:scale-105 active:scale-95 
          transition duration-300 group cursor-pointer relative
          ${isOpen ? "border-amber-500 bg-amber-500/10 text-amber-400" : ""}
        `}
      >
        <span className="absolute inset-0 rounded-full bg-amber-500/10 blur-md opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />

        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={20} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Compass size={22} className="group-hover:text-amber-400 transition" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
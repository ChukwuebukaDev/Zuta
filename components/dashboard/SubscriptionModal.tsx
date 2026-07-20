"use client";

import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { 
  X,Store, ShieldCheck, ArrowRight, Sparkles, Crown, Calendar, Clock, 
  TrendingUp, BadgeCheck, BarChart3, Users, MessageSquare, Star, Zap as ZapIcon
} from "lucide-react";
import { toast } from "sonner";
import type { LucideIcon } from "lucide-react";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type BillingCycle = "daily" | "monthly" | "yearly";

interface PricingPlan {
  label: string;
  price: number;
  strikePrice?: number;
  subtext: string;
}

interface Perk {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export default function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const [loading, setLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("yearly");
  const [hoveredPerk, setHoveredPerk] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ⚡ FIXED: Clean, direct pricing layout maps to eliminate matrix reference errors
  const plans: Record<BillingCycle, PricingPlan> = {
    daily: {
      label: "Per Day",
      price: 1500,
      subtext: "Flex tier alignment allocations",
    },
    monthly: {
      label: "Per Month",
      price: 30000,
      strikePrice: 45000, // Based on daily rate accumulation (1500 * 30)
      subtext: "Standard monthly operational lease",
    },
    yearly: {
      label: "Per Year",
      price: 150000,
      strikePrice: 360000, // Based on standard monthly accumulation (30000 * 12)
      subtext: "✓ Just ₦12,500/month when billed annually",
    },
  };

  // Safe percentage calculation logic engine
  const calculateSavingsPercentage = (cycle: BillingCycle) => {
    if (cycle === "yearly") return 58; // 360k down to 150k is ~58% off
    if (cycle === "monthly") return 33; // 45k down to 30k is ~33% off
    return 0;
  };

  const formatToNaira = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCycleIcon = (cycle: BillingCycle) => {
    const icons = { daily: Clock, monthly: Calendar, yearly: Crown };
    return icons[cycle];
  };

  const handleUpgradeRoute = async () => {
    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 1500));
      toast.success(`Processing ${billingCycle} subscription...`, {
        icon: "🚀",
        description: "Redirecting to secure Zuta Escrow Payment gateway...",
      });
      onClose();
    } catch (err) {
      toast.error("Failed to process subscription");
    } finally {
      setLoading(false);
    }
  };

  const perks: Perk[] = [
    { icon: Store, title: "Unlimited Showroom Slots", desc: "Bypass standard private constraints and list infinite cars with premium visibility." },
    { icon: BadgeCheck, title: "Verified Dealer Badge", desc: "Instantly unlock buyer trust metrics with the official escrow shield certification." },
    { icon: TrendingUp, title: "Priority Lead Routing", desc: "Your listings jump to the top of trending buyer search grids with AI optimization." },
    { icon: BarChart3, title: "Advanced Analytics Desk", desc: "Track offer history, impression clicks, and lead conversion rates in real-time." },
    { icon: Users, title: "Team Access (5 Users)", desc: "Add up to 5 team members with role-based permissions and activity tracking." },
    { icon: MessageSquare, title: "Priority Support Desk", desc: "24/7 dedicated support with < 1hr response time for enterprise queries." },
  ];

  const displayedPerks = isMobile ? perks.slice(0, 4) : perks;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[9999]" onClose={onClose}>
        
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-lg" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-3 sm:p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <Dialog.Panel className="w-full max-w-2xl bg-gradient-to-b from-zinc-950 to-black border border-slate-800/50 rounded-[2.5rem] sm:rounded-[3rem] p-5 sm:p-8 text-left shadow-2xl relative overflow-hidden">
                
                {/* Visual Glow Ambient Accents */}
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-xl bg-zinc-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all duration-200 cursor-pointer z-10"
                >
                  <X size={18} strokeWidth={2} />
                </button>

                {/* Header Container */}
                <div className="space-y-2 mt-1 sm:mt-2 relative">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-lg border border-amber-500/20">
                      <Sparkles size={14} className="text-amber-400 fill-amber-400/20" />
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-black bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                      Zuta Enterprise Premium
                    </span>
                  </div>
                  
                  <Dialog.Title as="h3" className="text-xl sm:text-3xl font-black uppercase italic tracking-tight text-white leading-tight">
                    Scale Up to <br className="sm:hidden" />
                    <span className="bg-gradient-to-r from-white via-amber-100 to-slate-300 bg-clip-text text-transparent">
                      Authorized Dealership
                    </span>
                  </Dialog.Title>
                  
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium max-w-lg">
                    Unlock professional brokerage infrastructure tools to streamline vehicle listing loops and maximize client conversion metrics.
                  </p>
                </div>

                {/* Billing Cycle Selector Switches */}
                <div className="mt-5 sm:mt-6 relative">
                  <div className="bg-zinc-900/50 border border-slate-800 rounded-2xl p-1.5 flex items-center gap-1">
                    {(["daily", "monthly", "yearly"] as BillingCycle[]).map((cycle) => {
                      const Icon = getCycleIcon(cycle);
                      const isActive = billingCycle === cycle;
                      const percentageSavings = calculateSavingsPercentage(cycle);
                      
                      return (
                        <button
                          key={cycle}
                          type="button"
                          onClick={() => setBillingCycle(cycle)}
                          className={`
                            flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 rounded-xl
                            text-[10px] sm:text-xs font-bold uppercase tracking-wider
                            transition-all duration-300 relative cursor-pointer
                            ${isActive 
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/10' 
                              : 'text-slate-400 hover:text-white hover:bg-zinc-800/50'
                            }
                          `}
                        >
                          <Icon size={14} className={isActive ? 'text-slate-950' : 'text-slate-500'} />
                          <span>{cycle}</span>
                          {percentageSavings > 0 && (
                            <span className="absolute -top-2 -right-1 sm:-top-2.5 sm:-right-1.5 px-1.5 py-0.5 bg-emerald-600 text-white text-[6px] sm:text-[7px] font-black rounded-full uppercase tracking-tighter">
                              -{percentageSavings}%
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Pricing Output Banner Panel */}
                <div className="mt-6 sm:mt-7 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-zinc-900/80 to-black border border-slate-800/50">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <span className="text-[10px] uppercase font-black tracking-widest text-slate-500 block">
                        {plans[billingCycle].label}
                      </span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                          {formatToNaira(plans[billingCycle].price)}
                        </span>
                        {plans[billingCycle].strikePrice && (
                          <span className="text-xs sm:text-sm text-slate-500 font-medium line-through">
                            {formatToNaira(plans[billingCycle].strikePrice!)}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-emerald-400 font-semibold mt-1">
                        {plans[billingCycle].subtext}
                      </p>
                    </div>
                    <div className="px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 shrink-0 self-center">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-blue-400">
                        Tax Inclusive
                      </span>
                    </div>
                  </div>
                </div>

                {/* Perks Matrix Row Grid */}
                <div className="mt-5 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {displayedPerks.map((perk, idx) => (
                    <div 
                      key={idx} 
                      className="flex gap-3 items-start p-2.5 sm:p-3 bg-zinc-900/30 border border-slate-800/50 rounded-xl hover:border-amber-500/20 hover:bg-zinc-900/40 transition-all duration-300 cursor-default"
                      onMouseEnter={() => setHoveredPerk(idx)}
                      onMouseLeave={() => setHoveredPerk(null)}
                    >
                      <div className={`
                        p-1.5 rounded-lg shrink-0 mt-0.5 transition-all duration-300
                        ${hoveredPerk === idx 
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' 
                          : 'bg-amber-500/5 border border-amber-500/10 text-amber-500/70'
                        }
                      `}>
                        <perk.icon size={14} strokeWidth={2} />
                      </div>
                      <div>
                        <h4 className="text-[10px] sm:text-xs font-bold text-slate-100 uppercase tracking-wide">
                          {perk.title}
                        </h4>
                        <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium mt-0.5 leading-relaxed">
                          {perk.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Form Action Submissions Group */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-3.5 sm:py-3 bg-transparent border border-slate-800 hover:border-slate-700 rounded-2xl sm:rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-200 transition-all duration-200 active:scale-95 cursor-pointer"
                  >
                    Keep Private Plan
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleUpgradeRoute}
                    disabled={loading}
                    className="group w-full py-3.5 sm:py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 text-slate-950 text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-2xl sm:rounded-xl flex items-center justify-center gap-2.5 transition-all duration-300 shadow-lg shadow-amber-500/10 active:scale-95 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <span>{loading ? "Processing..." : `Upgrade Now`}</span>
                    {!loading && <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />}
                    {loading && (
                      <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                    )}
                  </button>
                </div>

                {/* Trust Signatures Footnotes */}
                <div className="mt-4 flex items-center justify-center gap-4 sm:gap-6">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <ShieldCheck size={12} className="text-emerald-400" />
                    <span className="text-[8px] sm:text-[9px] font-medium">256-bit Encrypted</span>
                  </div>
                  <div className="w-px h-4 bg-slate-900" />
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <ZapIcon size={12} className="text-amber-400" />
                    <span className="text-[8px] sm:text-[9px] font-medium">Instant Activation</span>
                  </div>
                  <div className="w-px h-4 bg-slate-900" />
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Star size={12} className="text-yellow-400" />
                    <span className="text-[8px] sm:text-[9px] font-medium">4.9/5 Rating</span>
                  </div>
                </div>

                <p className="mt-3 text-[8px] sm:text-[9px] text-slate-600 text-center font-medium">
                  Cancel anytime. No hidden fees. 14-day money-back guarantee.
                </p>

              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
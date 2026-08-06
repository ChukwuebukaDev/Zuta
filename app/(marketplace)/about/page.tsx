import Link from "next/link";
import Image from "next/image";
import { 
  ShieldCheck, 
  Sparkles, 
  Car, 
  Search, 
  BadgeCheck, 
  ArrowRight, 
  TrendingUp, 
  Users 
} from "lucide-react";

export const metadata = {
  title: "About Us | Zuta – Premium Automotive Marketplace",
  description: "Learn about Zuta, Nigeria's verified car marketplace delivering transparent vehicle listings, automated valuation, and trusted dealer connections.",
};

export default function AboutPage() {
  const STATS = [
    { label: "Verified Listings", value: "100%" },
    { label: "Car Categories", value: "New & Used" },
    { label: "State Coverage", value: "36 States + FCT" },
    { label: "Platform Uptime", value: "99.9%" },
  ];

  const PILLARS = [
    {
      icon: ShieldCheck,
      title: "Verified Inventory",
      description:
        "Every listing undergoes structural angle and spec verification to eliminate ghost listings and fake car posts.",
    },
    {
      icon: Search,
      title: "Granular Vehicle Specs",
      description:
        "Filter by exact engine displacement, door count, trim packages (LE, XLE, SE, M Sport), and fuel capacity.",
    },
    {
      icon: TrendingUp,
      title: "Fair-Market Pricing",
      description:
        "Direct seller-to-buyer pricing transparency without inflated middleman markups or undisclosed fees.",
    },
    {
      icon: Users,
      title: "Verified Seller Badges",
      description:
        "Clear distinction between private vehicle owners and registered dealerships for safe, confident deals.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-amber-500 selection:text-slate-950">
      
      {/* 🚀 HERO SECTION */}
      <section className="relative overflow-hidden bg-neutral-950 text-white pt-20 pb-24 border-b border-neutral-800">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[130px] pointer-events-none rounded-full" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-widest mb-6 shadow-lg">
            <Sparkles size={13} className="animate-pulse" />
            <span>Redefining Automotive Commerce</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
            The Modern Standard for <br />
            <span className="bg-linear-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
              Buying & Selling Cars in Nigeria.
            </span>
          </h1>

          <p className="mt-6 text-sm sm:text-base md:text-lg text-neutral-400 max-w-3xl mx-auto font-medium leading-relaxed">
            Zuta was built to replace uncertainty with engineering precision. We empower automotive buyers and verified sellers across Nigeria with transparent vehicle specs, fair valuations, and trusted connections.
          </p>

          {/* Quick Action CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/cars"
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-lg shadow-amber-500/20 active:scale-95"
            >
              <Car size={16} />
              <span>Explore Showroom</span>
            </Link>

            <Link
              href="/sell"
              className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 group"
            >
              <span>List Your Car</span>
              <ArrowRight size={15} className="text-amber-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* 📊 STATS HIGHLIGHT BAR */}
      <section className="bg-white border-b border-slate-200 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map((stat) => (
              <div key={stat.label} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🎯 MISSION & VISION SECTION */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-amber-600 bg-amber-500/10 px-3 py-1 rounded-md border border-amber-500/20">
              Our Vision
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-4">
              Building Trust in Every Transaction.
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
              Finding a car shouldn't feel like a gamble. Zuta bridges the gap between buyers looking for verified vehicle quality and dealership/private sellers seeking high-intent buyers.
            </p>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              From exact engine sizes to trim levels (SE, XLE, M Sport), door options, and verified locations—we standardize vehicle listings so you know exactly what you are paying for before making contact.
            </p>
          </div>

          <div className="relative rounded-3xl bg-neutral-900 p-8 text-white border border-neutral-800 shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <h3 className="text-xl font-black text-white tracking-tight mb-4 flex items-center gap-2">
              <BadgeCheck className="text-amber-400" size={22} />
              The Zuta Guarantee
            </h3>
            <ul className="space-y-4 text-xs sm:text-sm text-neutral-300">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span><strong>No Hidden Fees:</strong> Direct prices listed transparently by verified car owners and dealers.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span><strong>Structural Photo Ordering:</strong> Require clear perspective photography across all listings.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span><strong>Direct Messages:</strong> Reach out directly to verified sellers through our secure inbox console.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 🛡️ CORE PILLARS GRID */}
      <section className="bg-slate-100 py-20 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-black uppercase tracking-widest text-amber-600">
              Why Choose Zuta
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
              Engineered for Buyer & Seller Confidence.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center mb-4">
                      <Icon size={20} />
                    </div>
                    <h3 className="font-bold text-base text-slate-900 tracking-tight mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 🏁 BOTTOM CALL-TO-ACTION */}
      <section className="py-20 bg-neutral-950 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Ready to Find Your Next Drive?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-neutral-400">
            Browse hundreds of verified cars or list your vehicle for free today.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/cars"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition active:scale-95 shadow-lg shadow-amber-500/20"
            >
              Browse Showroom
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
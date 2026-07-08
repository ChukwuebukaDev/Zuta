import { prisma as db } from "@/lib/prisma";
import { ShieldCheck, MapPin, Star, Wrench, Sparkles, Truck } from "lucide-react";
import Link from "next/link";

export default async function ServicesPage() {
  // Fetch seed/mocked provider rows from your database context
  const providers = await db.serviceProvider.findMany({
    orderBy: { rating: "desc" },
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "MECHANIC": return <Wrench size={16} className="text-amber-400" />;
      case "CAR_WASH":
      case "DETAILING": return <Sparkles size={16} className="text-blue-400" />;
      default: return <Truck size={16} className="text-rose-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-100 p-4 lg:p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-black uppercase italic tracking-tight text-white">
          Premium Services Desk
        </h1>
        <p className="text-sm text-slate-400">
          Book verified local mechanics, elite detailing workshops, and specialized assistance.
        </p>
      </div>

      {/* Provider Cards Layout Grid Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((provider) => (
          <div 
            key={provider.id} 
            className="group relative overflow-hidden rounded-[2rem] bg-zinc-900/40 border border-slate-900 p-5 flex flex-col justify-between hover:border-zinc-800 transition-all duration-300 shadow-xl"
          >
            <div className="space-y-4">
              {/* Optional Service Banner Image Wrapper */}
              <div className="relative h-40 w-full rounded-2xl bg-zinc-950 overflow-hidden border border-slate-800/60 flex items-center justify-center">
                {provider.image ? (
                  <img src={provider.image} alt={provider.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="text-zinc-800 font-black italic text-4xl uppercase tracking-widest">ZUTA</div>
                )}
                
                <span className="absolute top-3 left-3 bg-zinc-950/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border border-slate-800">
                  {getIcon(provider.type)}
                  {provider.type.replace("_", " ")}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-white group-hover:text-amber-400 transition-colors uppercase tracking-tight">
                    {provider.name}
                  </h3>
                  {provider.isVerified && (
                    <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                  <span className="flex items-center gap-1"><MapPin size={12} /> {provider.location}</span>
                  <span className="flex items-center gap-0.5 text-amber-400"><Star size={12} fill="currentColor" /> {provider.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-900/60 flex items-center justify-between">
              <div>
                <span className="block text-[9px] uppercase font-black text-slate-500 tracking-wider">Base Pricing</span>
                <span className="text-md font-black text-white">₦{provider.priceFrom.toLocaleString()}</span>
              </div>
              
              <Link 
                href={`/services/book/${provider.id}`}
                className="px-4 py-2 text-xs font-black uppercase italic tracking-wider rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 transition-colors"
              >
                Schedule Unit
              </Link>
            </div>
          </div>
        ))}

        {providers.length === 0 && (
          <div className="col-span-full border border-dashed border-slate-900 rounded-3xl p-12 text-center text-sm italic text-slate-500">
            No active certified service networks registered in this operational sector yet.
          </div>
        )}
      </div>
    </div>
  );
}
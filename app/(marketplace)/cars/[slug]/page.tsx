import { getCarBySlug } from "@/lib/engine/marketplace";
import Link from "next/link";
import { Metadata } from "next";
import CarImageSlider from "@/components/ui/Wrapper/CarImageSlider";
import MapContainer from "@/map/MapContainer";
import { 
  ChevronLeft, Share2, Heart, ShieldCheck, 
  MapPin, Gauge, Settings2, Fuel, Verified, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type Props = {
  params: { slug: string };
};

export default async function CarDetailsPage({ params }: Props) {
  const { slug } = await params;
  const car = await getCarBySlug(slug);

  if (!car) {
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-4 bg-white text-black">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter">Car Not Found</h1>
        <Link href="/cars" className="px-8 py-3 bg-black text-white rounded-full font-bold uppercase text-xs tracking-widest">
          Back To Showroom
        </Link>
      </div>
    );
  }

  const seller = car.user;

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 pb-20 selection:bg-black selection:text-white">
      {/* --- Top Navigation --- */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <Link href="/cars" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-black transition-all">
          <ChevronLeft size={14} strokeWidth={3} /> Back to showroom
        </Link>
        <div className="flex gap-2">
          <button className="p-3 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors shadow-sm"><Share2 size={16} /></button>
          <button className="p-3 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors shadow-sm"><Heart size={16} /></button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* --- Left Content (8 Cols) --- */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Main Gallery Card - White Border & Soft Glow */}
          <section className="rounded-[2.5rem] overflow-hidden border border-white bg-white shadow-[0_30px_80px_rgba(0,0,0,0.06)]">
            <CarImageSlider images={car.images} model={car.model} />
          </section>

          {/* Title & Price Header */}
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-black text-[9px] font-black uppercase tracking-widest text-white">Featured</span>
                <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Verified Listing</p>
              </div>
              <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none text-slate-900">
                {car.year} <span className="text-slate-300 font-normal">{car.brand}</span> {car.model}
              </h1>
            </div>
            <div className="md:text-right">
              <p className="text-4xl font-black text-black tracking-tighter mb-1">₦{car.price.toLocaleString()}</p>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
                <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest">
                  {car.negotiable ? "Negotiable" : "Fixed Price"}
                </span>
              </div>
            </div>
          </section>

          {/* Icon Specs Row - Light Version */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickFeature icon={<Gauge size={18}/>} label="Mileage" value={`${car.mileage.toLocaleString()} km`} />
            <QuickFeature icon={<Settings2 size={18}/>} label="Gearbox" value={car.transmission} />
            <QuickFeature icon={<Fuel size={18}/>} label="Engine" value={car.fuelType} />
            <QuickFeature icon={<MapPin size={18}/>} label="Location" value={car.location || "Lagos, NG"} />
          </section>

          {/* Technical Details Grid */}
          <section className="p-10 rounded-[3rem] bg-white border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-10">Technical <span className="text-slate-300">Overview</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-16">
              <DetailRow label="Body Style" value={car.bodyType} />
              <DetailRow label="Drivetrain" value={car.drivetrain} />
              <DetailRow label="Exterior Color" value={String(car.color)} />
              <DetailRow label="Condition" value={car.condition} />
              <DetailRow label="Status" value={car.status} />
              <DetailRow label="Market Value" value="Verified" />
            </div>
          </section>

          {/* Availability Map */}
          <section className="space-y-6">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">Availability <span className="text-slate-300">Map</span></h2>
            <div className="h-[400px] rounded-[3rem] overflow-hidden border border-slate-200 shadow-inner">
              <MapContainer />
            </div>
          </section>
        </div>

        {/* --- Right Sidebar (4 Cols) --- */}
        <aside className="lg:col-span-4">
          <div className="sticky top-8 space-y-6">
            {/* Seller Card - White Version */}
            <div className="p-8 rounded-[3rem] bg-white border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.04)] space-y-8">
              <div className="flex items-center gap-5">
                <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                  {seller?.imageUrl ? (
                    <Image src={seller.imageUrl} alt={seller.name || "Seller"} fill className="object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center font-black text-2xl text-slate-300">
                      {seller?.name?.[0] || "Z"}
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-black uppercase italic text-sm tracking-tight text-slate-900">{seller?.name || "Private Seller"}</p>
                    {seller?.isVerified && <Verified size={14} className="text-blue-500" />}
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Verified Dealer</p>
                </div>
              </div>

              <div className="space-y-3">
                <Button className="w-full h-16 rounded-2xl bg-black hover:bg-slate-800 text-white font-black uppercase tracking-widest text-[11px] transition-all active:scale-95 shadow-lg shadow-black/10">
                  Contact Seller
                </Button>
                <Button variant="outline" className="w-full h-16 rounded-2xl border-slate-200 bg-white hover:bg-slate-50 font-black uppercase tracking-widest text-[10px]">
                  Schedule Inspection
                </Button>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  <ShieldCheck size={16} className="text-emerald-500" /> Buyer Protection Active
                </div>
                <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  <Info size={16} className="text-slate-400" /> 24h Response Rate
                </div>
              </div>
            </div>

            {/* Quick Stats - Light */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-[2rem] bg-white border border-slate-200 text-center shadow-sm">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Page Views</p>
                <p className="text-xl font-black text-black">{car.views}</p>
              </div>
              <div className="p-6 rounded-[2rem] bg-white border border-slate-200 text-center shadow-sm">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Saved By</p>
                <p className="text-xl font-black text-black">12</p>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

// --- Light Mode Styled Sub-components ---

function QuickFeature({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="group p-6 rounded-3xl bg-white border border-slate-200 hover:border-black transition-all duration-300 shadow-sm hover:shadow-md">
      <div className="text-slate-400 group-hover:text-black mb-4 transition-colors duration-300">{icon}</div>
      <div>
        <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className="text-[11px] font-black uppercase text-black tracking-tight">{value}</p>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-l-2 border-slate-100 pl-6 hover:border-black transition-colors">
      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{label}</p>
      <p className="text-lg font-bold text-slate-900 uppercase italic tracking-tight leading-tight">{value}</p>
    </div>
  );
}
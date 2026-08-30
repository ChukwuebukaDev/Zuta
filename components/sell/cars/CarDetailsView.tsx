"use client";

import Link from "next/link";
import { useState } from "react";
import { X, ChevronLeft, Share2, Heart, MapPin, Gauge, Settings2, Fuel, MessageSquare,Cpu,Badge,CircleGauge,FuelIcon } from "lucide-react";
import CarImageSlider from "@/components/ui/Wrapper/CarImageSlider";
import MapContainer from "@/map/MapContainer";
import ContactSellerSection from "./ContactSellerSection";
import { Button } from "@/components/ui/button";
import { getCarBySlug } from "@/lib/engine/marketplace";

type PromisedCarType = ReturnType<typeof getCarBySlug>;
type UnwrappedCarType = PromisedCarType extends Promise<infer T> ? T : never;

type OriginalCar = NonNullable<UnwrappedCarType>;

export type SerializedCar = Omit<
  OriginalCar,
  "price" | "createdAt" | "updatedAt" | "publishedAt" | "expiresAt" | "soldAt" | "archivedAt" | "carImages"
> & {
  price: number;
  trim: string;
  engineSize: string;
  fuelCapacity: number;
  horsePower: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  expiresAt: string | null;
  soldAt: string | null;
  archivedAt: string | null;
  country?:string;
  engineCode?:string;
  carImages?: string[];
};

export interface CarDetailsViewProps {
  car: SerializedCar; 
  currentUserId: string;
}

export default function CarDetailsView({ car, currentUserId }: CarDetailsViewProps) {

  const [showChatDesk, setShowChatDesk] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [shareStatus, setShareStatus] = useState<"idle" | "copied">("idle");
  //const [isDialogOpen, setIsDialogOpen] = useState(false);

  const seller = car;
  const formattedSeller = {
    id: seller?.userId || "unknown_seller",
    avatarUrl: seller?.thumbnail || "",
    listingStatus: seller?.listingStatus || '',
    rating: 4.9,
    totalReviews: 24,
    location: car.location || "Lagos, Nigeria",
    name:'ebuka',   //for testing only, not real
    phoneNumber:'08098982921', // for testing only
    joinedDate: "2024", // testing only
  };

  const mockOtherListings = [
    {
      slug: "listing-example-1",
      thumbnail: car.images?.[0] || "",
      title: `${car.brand} Alternative Spec`,
      price: `₦${(car.price * 0.95).toLocaleString()}`,
      year: String(car.year)
    }
  ];

  const handleShareListing = async () => {
    const shareData = { title: `${car.year} ${car.brand} ${car.model}`, url: window.location.href };
    if (navigator.share && navigator.canShare?.(shareData)) {
      await navigator.share(shareData).catch(() => {});
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setShareStatus("copied");
      setTimeout(() => setShareStatus("idle"), 2500);
    }
  };

  const handleToggleSaveListing = async () => {
    const targetState = !isSaved;
    setIsSaved(targetState);
    try {
      await fetch("/api/cars/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carId: car.id, save: targetState }),
      });
    } catch {
      setIsSaved(!targetState);
    }
  };
  
  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 pb-20 selection:bg-black selection:text-white">

      {/* --- Top Navigation --- */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative">
        <Link href="/cars" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-black transition-all">
          <ChevronLeft size={14} strokeWidth={3} /> Back to showroom
        </Link>
        <div className="flex gap-2 items-center relative">
          {shareStatus === "copied" && (
            <div className="absolute right-28 top-3 px-3 py-1.5 bg-black text-[9px] font-bold text-white uppercase tracking-widest rounded-lg shadow-md animate-in fade-in slide-in-from-right-3 duration-200">
              Link Copied 📋
            </div>
          )}
          <button onClick={handleShareListing} className="p-3 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors shadow-sm"><Share2 size={16} /></button>
          <button onClick={handleToggleSaveListing} className={`p-3 border rounded-full transition-all ${isSaved ? "bg-red-50 border-red-200 text-red-500" : "bg-white border-slate-200"}`}>
            <Heart size={16} className={isSaved ? "fill-red-500" : ""} />
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
     
        <div className="lg:col-span-8 space-y-12">
          <section className="rounded-[2.5rem] overflow-hidden border border-white bg-white shadow-[0_30px_80px_rgba(0,0,0,0.06)]">
            <CarImageSlider images={car.images} model={car.model} />
          </section>
          
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
            <div>
              <span className="px-2 py-0.5 rounded bg-black text-[9px] font-black uppercase tracking-widest text-white">Featured</span>
              <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none mt-2">{car.year} {car.brand} {car.model}</h1>
            </div>
            <p className="text-4xl font-black tracking-tighter">₦{car.price.toLocaleString()}</p>
          </section>
          <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest text-center"><h2>PROVIDED INFORMATIONS</h2></div>
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickFeature icon={<Gauge size={18}/>} label="Mileage" value={`${car.mileage.toLocaleString()} km`} />
            <QuickFeature icon={<Settings2 size={18}/>} label="Gearbox" value={car.transmission} />
            <QuickFeature icon={<Fuel size={18}/>} label="Engine" value={car.fuelType} />
            <QuickFeature icon={<MapPin size={18}/>} label="Location" value={car.location || "Lagos, NG"} />
            <QuickFeature icon={<Badge size={18}/>} label="Trim Level" value={car.trim} />
            <QuickFeature icon={<Cpu size={18}/>} label="Engine Size" value={car.engineSize} />
            <QuickFeature icon={<CircleGauge size={18}/>} label="Horsepower" value={`${car.horsePower}`} />
            <QuickFeature icon={<FuelIcon size={18}/>} label="Fuel Capacity" value={`${car.fuelCapacity}`} />

          </section>

          <section className="p-10 rounded-[3rem] bg-white border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-10">Technical Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-16">
              <DetailRow label="Body Style" value={car.bodyType} />
              <DetailRow label="Drivetrain" value={car.drivetrain} />
              <DetailRow label="Condition" value={car.condition} />
              <DetailRow label="Status" value={car.status} />
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-6">Availability Map</h2>
            <div className="h-96 rounded-[3rem] overflow-hidden border border-slate-200"><MapContainer /></div>
          </section>

          {/* Vehicle intelligence modal control*/}
          {/* <button onClick={()=>setIsDialogOpen(true)}>view more details</button> */}
        </div>

        {seller.userId !== currentUserId && (
          <aside className="lg:col-span-4">
            <div className="sticky top-10 p-8 rounded-[3rem] bg-white border border-slate-200 shadow-sm space-y-6">
              <Button onClick={() => setShowChatDesk(true)} className="w-full h-16 rounded-2xl bg-black text-white font-black uppercase tracking-widest flex items-center gap-2">
                <MessageSquare size={14} /> Contact Seller
              </Button>
            </div>
          </aside>
        )}
      </main>

      {/* --- MODAL OVERLAY --- */}
      {showChatDesk && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-zinc-950 rounded-[2.5rem] shadow-2xl overflow-scroll flex flex-col animate-in zoom-in-95 duration-200">
            <button onClick={() => setShowChatDesk(false)} className="absolute top-0 right-0 p-2 bg-red-900 text-white rounded-full hover:bg-red-800 z-10">
              <X size={20} />
            </button>
        
            <ContactSellerSection 
              key={car.id} 
              seller={formattedSeller} 
              otherListings={mockOtherListings} 
              carId={car.id} 
              currentUserId={currentUserId} 
            />
          </div>
        </div>
      )}
    </div>
  );
}

function QuickFeature({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {

  if(!label || !value || +value === 0)return;
  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
      <div className="text-slate-400 mb-4">{icon}</div>
      <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">{label}</p>
      <p className="text-[11px] font-black uppercase text-black">{value}</p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-l-2 border-slate-100 pl-6">
      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{label}</p>
      <p className="text-lg font-bold text-slate-900 uppercase italic tracking-tight">{value}</p>
    </div>
  );
}
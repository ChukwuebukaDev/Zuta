import { Card } from "@/components/ui/card/Card";
import { Plus, Car, Clock, CheckCircle, PackageSearch, Tag, MessageSquare, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { prisma as db } from "@/lib/prisma";
import Image from "next/image";

// --- Types ---
interface InventoryCar {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  thumbnail: string;
  listingStatus: "PENDING" | "APPROVED" | "REJECTED" | "SOLD";
  transmission: string;
  fuelType: string;
  mileage: number;
}

// --- Helpers ---
const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('en-NG', { 
    style: 'currency', 
    currency: 'NGN', 
    minimumFractionDigits: 0 
  }).format(amount);
};

const getStatusClasses = (status: InventoryCar['listingStatus']) => {
  const map = {
    PENDING: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    APPROVED: "bg-green-500/10 text-green-500 border-green-500/20",
    REJECTED: "bg-red-500/10 text-red-500 border-red-500/20",
    SOLD: "bg-slate-500/10 text-slate-500 border-slate-500/20",
  };
  return map[status] || map.PENDING;
};

// --- Sub-components ---
function StatCard({ title, value, icon, colorClass, href }: { title: string; value: string; icon: React.ReactNode; colorClass: string; href?: string }) {
  const CardContent = (
    <Card className="p-6 bg-slate-900/30 border-slate-800 rounded-2xl backdrop-blur-sm group transition-all hover:bg-slate-900/50 cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl bg-black ${colorClass} transition-transform group-hover:scale-105`}>{icon}</div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{title}</p>
            <p className="text-3xl font-black italic text-white">{value}</p>
          </div>
        </div>
      </div>
    </Card>
  );

  return href ? <Link href={href}>{CardContent}</Link> : CardContent;
}

function InventoryCarCard({ car }: { car: InventoryCar }) {
  return (
    <Card className="relative bg-slate-900/30 border border-slate-800/50 rounded-2xl overflow-hidden backdrop-blur-sm group hover:border-slate-700 transition-all flex flex-col justify-between">
      <div>
        <div className={`absolute top-3 right-3 z-10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border ${getStatusClasses(car.listingStatus)}`}>
          {car.listingStatus === 'PENDING' ? 'Under Review' : car.listingStatus}
        </div>

        <div className="relative aspect-[16/10] overflow-hidden">
          <Image 
            src={car.thumbnail} 
            alt={`${car.brand} ${car.model}`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        <div className="p-5 pb-0 space-y-3">
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{car.year} • {car.fuelType.toLowerCase()}</p>
            <h4 className="text-lg font-bold text-white uppercase group-hover:text-blue-400 transition-colors">{car.brand} {car.model}</h4>
          </div>

          <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-400">
            <Tag size={12} className="text-blue-500"/> {car.transmission.toLowerCase()}
            <span className="mx-1 text-slate-700">|</span>
            {car.mileage.toLocaleString()} km
          </div>
        </div>
      </div>

      {/* --- Action & Price Footer Section --- */}
      <div className="p-5 pt-4 mt-4 border-t border-slate-900 flex justify-between items-center bg-black/10">
        <p className="text-xl font-black text-white tracking-tighter">{formatPrice(car.price)}</p>
        
        <Link href={`/dashboard/inventory/${car.id}/edit`}>
          <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-900 border border-slate-800 hover:border-slate-600 text-[11px] font-bold uppercase tracking-wider text-slate-300 hover:text-white rounded-xl transition duration-150 active:scale-95">
            <Pencil size={12} className="text-slate-400" />
            Edit Spec
          </button>
        </Link>
      </div>
    </Card>
  );
}

// --- Main Page ---
export default async function DealerDashboard() {
  const { userId } = await auth();

  // 1. Fetch Inventory Listings
  const myCars = await db.car.findMany({
    where: { userId: userId as string },
    orderBy: { createdAt: 'desc' },
  }) as unknown as InventoryCar[];

  // 2. Fetch Active Conversation Count (Where dealer is either buyer or seller)
  const conversationCount = await db.conversation.count({
    where: {
      OR: [
        { buyerId: userId as string },
        { sellerId: userId as string }
      ]
    }
  });

  const pendingCount = myCars.filter(c => c.listingStatus === "PENDING").length;
  const approvedCount = myCars.filter(c => c.listingStatus === "APPROVED").length;

  return (
    <div className="p-8 space-y-10 max-w-7xl mx-auto">
      <div className="flex justify-between items-end gap-6">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">Your <span className="text-blue-600">Inventory</span></h1>
          <p className="text-slate-500 text-sm mt-1">Manage your luxury listings and track verification status.</p>
        </div>
        <Link href="/sell">
          <Button className="bg-blue-600 hover:bg-blue-700 gap-2 font-bold px-6 rounded-full">
            <Plus size={18} /> List Car
          </Button>
        </Link>
      </div>

      {/* Grid expanded to 4 items on desktop viewports */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Live" value={String(approvedCount)} icon={<CheckCircle size={20}/>} colorClass="text-green-500" />
        <StatCard title="Review" value={String(pendingCount)} icon={<Clock size={20}/>} colorClass="text-yellow-500" />
        <StatCard title="Total Cars" value={String(myCars.length)} icon={<Car size={20}/>} colorClass="text-blue-500" />
        
        {/* Dynamic Connected Chat Counter Card */}
        <StatCard 
          title="Offers & Chat" 
          value={String(conversationCount)} 
          icon={<MessageSquare size={20}/>} 
          colorClass="text-purple-500 group-hover:text-purple-400" 
          href="/dashboard/messages"
        />
      </div>

      {myCars.length === 0 ? (
        <Card className="p-20 border-dashed border-slate-800 bg-transparent flex flex-col items-center justify-center text-center rounded-[2.5rem] space-y-4">
          <PackageSearch size={48} className="text-slate-700" />
          <h3 className="text-xl font-bold text-white uppercase tracking-tight">Showroom Empty</h3>
          <p className="text-slate-500 text-sm max-w-xs">Start adding vehicles to reach premium buyers.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myCars.map((car) => (
            <InventoryCarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
}
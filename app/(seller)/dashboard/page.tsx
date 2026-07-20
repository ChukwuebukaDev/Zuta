import { Card } from "@/components/ui/card/Card";
import { Plus, Car, Clock, CheckCircle, PackageSearch, Tag, MessageSquare, Pencil, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/supabase/server";
import { prisma as db } from "@/lib/prisma";
import Image from "next/image";
import { redirect } from "next/navigation";

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
  const map: Record<InventoryCar['listingStatus'], string> = {
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
    <Card className="p-6 bg-slate-900/30 border-slate-800 rounded-2xl backdrop-blur-sm group transition-all hover:bg-slate-900/50 cursor-pointer h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl bg-black ${colorClass} transition-transform group-hover:scale-105`}>{icon}</div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{title}</p>
            <p className="text-2xl font-black italic text-white truncate max-w-[150px]">{value}</p>
          </div>
        </div>
      </div>
    </Card>
  );

  return href ? <Link href={href} className="block h-full">{CardContent}</Link> : CardContent;
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
            src={car.thumbnail || "/placeholder-car.jpg"} 
            alt={`${car.brand} ${car.model}`}
            fill
            sizes="(max-w-7xl) 33vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        <div className="p-5 pb-0 space-y-3">
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{car.year} • {car.fuelType?.toLowerCase()}</p>
            <h4 className="text-lg font-bold text-white uppercase group-hover:text-blue-400 transition-colors truncate">{car.brand} {car.model}</h4>
          </div>

          <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-400">
            <Tag size={12} className="text-blue-500"/> {car.transmission?.toLowerCase()}
            <span className="mx-1 text-slate-700">|</span>
            {car.mileage?.toLocaleString()} km
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
  // 💡 SWAPPED: Fetch session information securely using the Supabase Server Client
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  
  if (!authUser) {
    redirect("/login");
  }

  const userId = authUser.id;

  // Fetching data concurrently to optimize load times
  const [myCarsRaw, dbUser, conversationCount] = await Promise.all([
    db.car.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    }),
    db.user.findUnique({
      where: { id: userId },
      select: { name: true }
    }),
    db.conversation.count({
      where: {
        OR: [
          { buyerId: userId },
          { sellerId: userId }
        ]
      }
    })
  ]);

  const myCars = myCarsRaw as unknown as InventoryCar[];
  
  // Safe Name parsing logic
  const firstName = dbUser?.name ? dbUser.name.trim().split(' ')[0] : "Dealer";

  const pendingCount = myCars.filter(c => c.listingStatus === "PENDING").length;
  const approvedCount = myCars.filter(c => c.listingStatus === "APPROVED").length;

  return (
    <div className="p-8 space-y-10 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">Your <span className="text-blue-600">Inventory</span></h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back, {firstName}. Manage your luxury listings.</p>
        </div>
        <Link href="/sell">
          <Button className="bg-blue-600 hover:bg-blue-700 gap-2 font-bold px-6 rounded-full w-full sm:w-auto">
            <Plus size={18} /> List Car
          </Button>
        </Link>
      </div>

      {/* Expanded responsive grid for 5 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
        <StatCard title="Live" value={String(approvedCount)} icon={<CheckCircle size={20}/>} colorClass="text-green-500" />
        <StatCard title="Review" value={String(pendingCount)} icon={<Clock size={20}/>} colorClass="text-yellow-500" />
        <StatCard title="Total Cars" value={String(myCars.length)} icon={<Car size={20}/>} colorClass="text-blue-500" />
        <StatCard title="My Profile" value={firstName} icon={<User size={24}/>} colorClass="text-blue-500" href="/profile" />
        <StatCard 
          title="Offers & Chat" 
          value={String(conversationCount)} 
          icon={<MessageSquare size={20}/>} 
          colorClass="text-purple-500" 
          href="/messages"
        />
      </div>

      {myCars.length === 0 ? (
        <Card className="p-20 border-dashed border-slate-800 bg-transparent flex flex-col items-center justify-center text-center rounded-[2.5rem] space-y-4">
          <PackageSearch size={48} className="text-slate-700" />
          <h3 className="text-xl font-bold text-white uppercase tracking-tight">Showroom is Empty</h3>
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
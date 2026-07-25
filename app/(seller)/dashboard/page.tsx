import { Card } from "@/components/ui/card/Card";
import { Plus, Car, Ban, Clock, CheckCircle, PackageSearch, MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/supabase/server";
import { prisma as db } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SellerCarCard } from '@/components/seller/SellerCard';

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
  rejectionReason?: string | null;
  adminFeedback?: string | null;
  rejectedAt?: string | Date | null;
}

// --- Stat Card Helper ---
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

// --- Main Page ---
export default async function DealerDashboard() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  
  if (!authUser) {
    redirect("/login");
  }

  const userId = authUser.id;

  // Fetching data concurrently
  const [myCarsRaw, dbUser, conversationCount] = await Promise.all([
    db.car.findMany({
      where: { userId },
      select: {
        id: true,
        brand: true,
        model: true,
        year: true,
        price: true,
        thumbnail: true,
        listingStatus: true,
        transmission: true,
        fuelType: true,
        mileage: true,
        rejectionReason: true, // 👈 Required for rejection modal
        adminFeedback: true,   // 👈 Required for admin feedback
        rejectedAt: true,      // 👈 Required for date
      },
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

  const serializedCars = JSON.parse(JSON.stringify(myCarsRaw));
  const myCars = serializedCars as InventoryCar[];
  
  const firstName = dbUser?.name ? dbUser.name.trim().split(' ')[0] : "Dealer";

  const pendingCount = myCars.filter(c => c.listingStatus === "PENDING").length;
  const approvedCount = myCars.filter(c => c.listingStatus === "APPROVED").length;
  const rejectedCount = myCars.filter(c => c.listingStatus === "REJECTED").length;

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

      {/* Responsive Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
        <StatCard title="Live" value={String(approvedCount)} icon={<CheckCircle size={20}/>} colorClass="text-green-500" />
        <StatCard title="Review" value={String(pendingCount)} icon={<Clock size={20}/>} colorClass="text-yellow-500" />
        <StatCard title="Rejected" value={String(rejectedCount)} icon={<Ban size={20}/>} colorClass="text-red-500" />
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

      {/* Inventory Grid */}
      {myCars.length === 0 ? (
        <Card className="p-20 border-dashed border-slate-800 bg-transparent flex flex-col items-center justify-center text-center rounded-[2.5rem] space-y-4">
          <PackageSearch size={48} className="text-slate-700" />
          <h3 className="text-xl font-bold text-white uppercase tracking-tight">Showroom is Empty</h3>
          <p className="text-slate-500 text-sm max-w-xs">Start adding vehicles to reach premium buyers.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myCars.map((car) => (
            <SellerCarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
}
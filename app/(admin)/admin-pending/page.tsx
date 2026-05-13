import { prisma as db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { ApproveButton } from "./ApproveButton";

type PendingCarWithSeller = {
  id: string;
  brand: string;
  model: string;
  thumbnail: string;
  sellerName: string;
  sellerEmail: string;
  listingStatus: string;
  createdAt: Date;
  user: {
    name: string | null;
    email: string | null;
  };
};

export default async function AdminPendingPage() {
  const { userId } = await auth();
  
  const user = await db.user.findUnique({ where: { id: userId as string } });
  // if (user?.role !== "ADMIN") redirect("/");

  const pendingCars = (await db.car.findMany({
    where: { listingStatus: "PENDING" },
    include: { 
      user: {
        select: { name: true, email: true }
      } 
    },
    orderBy: { createdAt: "asc" },
  })) as unknown as PendingCarWithSeller[];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">
        Pending <span className="text-blue-600">Approvals</span>
      </h1>

      <div className="grid gap-4">
        {/* 3. Now 'car' is typed, so no more 'any' error */}
        {pendingCars.map((car: PendingCarWithSeller) => (
          <div key={car.id} className="flex items-center gap-6 p-4 bg-slate-900/50 border border-slate-800 rounded-2xl backdrop-blur-sm">
            <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-slate-800">
              <Image 
                src={car.thumbnail} 
                alt={car.model} 
                fill 
                className="object-cover" 
              />
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-white uppercase tracking-tight">
                {car.brand} {car.model}
              </h3>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">
                Seller: {car.sellerName || car.user.name}
              </p>
              <p className="text-[10px] text-blue-500/60 font-medium">
                {car.sellerEmail || car.user.email}
              </p>
            </div>

            <div className="flex gap-2">
              <ApproveButton carId={car.id} />
              <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                Reject
              </button>
            </div>
          </div>
        ))}

        {pendingCars.length === 0 && (
          <div className="text-center py-20 border border-dashed border-slate-800 rounded-[2rem]">
            <p className="text-slate-500 italic text-sm">No vehicles currently awaiting review.</p>
          </div>
        )}
      </div>
    </div>
  );
}
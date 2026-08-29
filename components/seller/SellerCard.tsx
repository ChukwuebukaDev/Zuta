"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card/Card";
import { Tag, Pencil, AlertTriangle } from "lucide-react";
import { RejectionDetailsModal } from "./RejectionDetailModal";
import EditCar from "@/utilities/carEdit";
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

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
};

const getStatusClasses = (status: InventoryCar["listingStatus"]) => {
  const map: Record<InventoryCar["listingStatus"], string> = {
    PENDING: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    APPROVED: "bg-green-500/10 text-green-500 border-green-500/20",
    REJECTED: "bg-red-500/10 text-red-500 border-red-500/20",
    SOLD: "bg-slate-500/10 text-slate-500 border-slate-500/20",
  };
  return map[status] || map.PENDING;
};

export function SellerCarCard({ car }: { car: InventoryCar }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const carTitle = `${car.year} ${car.brand} ${car.model}`;
  const isRejected = car.listingStatus === "REJECTED";

  return (
    <>
      <Card
        id={`car-${car.id}`}
        className={`relative bg-slate-900/30 border rounded-2xl overflow-hidden backdrop-blur-sm group transition-all flex flex-col justify-between ${
          isRejected
            ? "border-red-500/40 hover:border-red-500/60"
            : "border-slate-800/50 hover:border-slate-700"
        }`}
      >
        <div>
          {/* Status Badge */}
          <div
            className={`absolute top-3 right-3 z-10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border ${getStatusClasses(
              car.listingStatus
            )}`}
          >
            {car.listingStatus === "PENDING"
              ? "Under Review"
              : car.listingStatus}
          </div>

          {/* Cover Photo */}
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={car.thumbnail || "/placeholder-car.jpg"}
              alt={carTitle}
              fill
              sizes="(max-w-7xl) 33vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          </div>

          <div className="p-5 pb-0 space-y-3">
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                {car.year} • {car.fuelType?.toLowerCase()}
              </p>
              <h4 className="text-lg font-bold text-white uppercase group-hover:text-blue-400 transition-colors truncate">
                {car.brand} {car.model}
              </h4>
            </div>

            <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-400">
              <Tag size={12} className="text-blue-500" />{" "}
              {car.transmission?.toLowerCase()}
              <span className="mx-1 text-slate-700">|</span>
              {car.mileage?.toLocaleString()} km
            </div>
          </div>
        </div>

        {/* ⚡ REJECTION ALERT STRIP */}
        {isRejected && (
          <div className="mx-5 mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-red-400 text-xs font-semibold truncate">
              <AlertTriangle size={14} className="shrink-0" />
              <span className="truncate">Listing Rejected</span>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 text-[10px] font-black uppercase tracking-wider rounded-lg transition shrink-0 cursor-pointer"
            >
              Why?
            </button>
          </div>
        )}

        {/* --- Action & Price Footer --- */}
        <div className="p-5 pt-4 mt-4 border-t border-slate-900 flex justify-between items-center bg-black/10">
          <p className="text-xl font-black text-white tracking-tighter">
            {formatPrice(car.price)}
          </p>

         <EditCar carId = {car.id}  />
        </div>
      </Card>

      {/* Rejection Details Modal */}
      <RejectionDetailsModal
        carId={car.id}
        carTitle={carTitle}
        rejectionReason={car.rejectionReason}
        adminFeedback={car.adminFeedback}
        rejectedAt={car.rejectedAt}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
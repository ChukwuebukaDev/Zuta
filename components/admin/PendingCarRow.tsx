"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye } from "lucide-react";
import { ApproveButton } from "./ApproveButton";
import { RejectButton } from "./RejectButton";
import { VehicleReviewModal } from "./VehicleReviewModal";

interface CarImage {
  id?: string;
  url?: string;
  createdAt?: string;
  carId?: string;
  angle?: string;
}

export function PendingCarRow({ car }: { car: any }) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const carTitle = `${car.year ? `${car.year} ` : ""}${car.brand} ${car.model}`;


  const extraImages = (car.carImages || [])
    .map((img: CarImage) => img?.url)
    .filter(Boolean) as string[];

  const galleryImages = [car.thumbnail, ...extraImages].filter(Boolean);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-slate-900/50 border border-slate-800 rounded-2xl backdrop-blur-sm">
        
        {/* Thumbnail Preview */}
        <div 
          onClick={() => setIsPreviewOpen(true)}
          className="relative w-full sm:w-32 h-24 sm:h-20 rounded-xl overflow-hidden border border-slate-800 shrink-0 cursor-pointer group"
        >
          <Image 
            src={car.thumbnail} 
            alt={car.model} 
            fill 
            className="object-cover group-hover:scale-105 transition-transform" 
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
            <Eye size={16} className="text-white" />
          </div>
        </div>
        
        {/* Basic Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white uppercase tracking-tight truncate">
            {carTitle}
          </h3>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1 truncate">
            Seller: {car.sellerName || car.user?.name || "Private Owner"}
          </p>
          <p className="text-[10px] text-amber-500/80 font-medium truncate">
            {car.sellerEmail || car.user?.email}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex gap-2 items-center shrink-0">
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-[10px] font-black uppercase tracking-wider text-slate-300 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg transition cursor-pointer"
          >
            <Eye size={13} />
            <span>Inspect</span>
          </button>

          <ApproveButton carId={car.id} />
          <RejectButton carId={car.id} carTitle={carTitle} />
        </div>
      </div>

      {/* Detail Review Modal */}
      <VehicleReviewModal
        car={car}
        galleryImages={galleryImages}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </>
  );
}
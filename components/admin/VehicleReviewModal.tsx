"use client";

import { useState } from "react";
import { 
  X, MapPin, Mail, User 
} from "lucide-react";
import { ApproveButton } from "@/components/admin/ApproveButton"
import { RejectButton } from "@/components/admin/RejectButton";
import { formatPrice } from "@/utilities/currency";
import CarImageSlider from "../ui/Wrapper/CarImageSlider";

interface VehicleReviewModalProps {
  car: any; // Full Prisma Car object with user details
  isOpen: boolean;
  galleryImages:string[];
  onClose: () => void;
}


export function VehicleReviewModal({ car, isOpen, onClose,galleryImages }: VehicleReviewModalProps) {
  if (!isOpen) return null;
  const carTitle = `${car.year ? `${car.year} ` : ""}${car.brand} ${car.model}`;
  console.log('images',galleryImages);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-4xl bg-zinc-950 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl text-white my-auto max-h-[90vh] flex flex-col">
        
        {/* --- HEADER --- */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/50 shrink-0">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase tracking-wider">
              Pending Verification
            </span>
            <h2 className="text-lg font-black uppercase tracking-tight text-white">
              {carTitle}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* --- MODAL BODY (SCROLLABLE) --- */}
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar flex-1">
          
          {/* GALLERY & PREVIEW MATRIX */}
          <div className="space-y-3">
            <section className="rounded-[2.5rem] overflow-hidden border border-white bg-white shadow-[0_30px_80px_rgba(0,0,0,0.06)]">
                    <CarImageSlider images={galleryImages} model={car.model} />
                  </section>
          </div>

          {/* KEY SPECS MATRIX */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-neutral-900/40 p-4 rounded-2xl border border-neutral-800/80">
            <div>
              <p className="text-[9px] font-bold uppercase text-neutral-500 tracking-wider">Price</p>
              <p className="text-base font-black text-amber-400">{formatPrice(car.price)}</p>
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase text-neutral-500 tracking-wider">Mileage</p>
              <p className="text-sm font-bold text-neutral-200">{car.mileage?.toLocaleString()} km</p>
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase text-neutral-500 tracking-wider">Transmission</p>
              <p className="text-sm font-bold text-neutral-200 uppercase">{car.transmission}</p>
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase text-neutral-500 tracking-wider">Condition</p>
              <p className="text-sm font-bold text-neutral-200 uppercase">{car.condition}</p>
            </div>
          </div>

          {/* EXTENDED TECHNICAL BREAKDOWN */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs border-t border-neutral-800 pt-4">
            <div>
              <span className="text-neutral-500 block text-[10px] uppercase font-bold">Trim Level</span>
              <span className="font-semibold text-white">{car.trim || "Standard"}</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px] uppercase font-bold">Engine Displacement</span>
              <span className="font-semibold text-white">{car.engineSize || "N/A"}</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px] uppercase font-bold">Body Style</span>
              <span className="font-semibold text-white uppercase">{car.bodyType || "N/A"}</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px] uppercase font-bold">Color</span>
              <span className="font-semibold text-white capitalize">{car.color || "N/A"}</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px] uppercase font-bold">Fuel Type</span>
              <span className="font-semibold text-white uppercase">{car.fuelType}</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px] uppercase font-bold">Negotiable</span>
              <span className="font-semibold text-white">{car.negotiable ? "Yes" : "Fixed"}</span>
            </div>
          </div>

          {/* SELLER CONTACT BLOCK */}
          <div className="bg-neutral-900/60 p-4 rounded-2xl border border-neutral-800 space-y-2">
            <p className="text-[10px] font-bold uppercase text-neutral-400 tracking-widest flex items-center gap-1.5">
              <User size={13} className="text-amber-400" />
              Seller Profile Details
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="flex items-center gap-2 text-neutral-300">
                <span className="font-bold text-white">{car.sellerName || car.user?.name}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-400">
                <Mail size={13} className="text-neutral-500" />
                <span className="truncate">{car.sellerEmail || car.user?.email}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-400">
                <MapPin size={13} className="text-amber-500" />
                <span>{car.city}, {car.state}</span>
              </div>
            </div>
          </div>

        </div>

        {/* --- FOOTER DECISION ACTIONS --- */}
        <div className="p-4 px-6 border-t border-neutral-800 bg-neutral-900/80 flex items-center justify-between gap-4 shrink-0">
          <p className="text-xs text-neutral-400">
            Verify photo quality and pricing accuracy before making a decision.
          </p>

          <div className="flex items-center gap-3">
            <RejectButton carId={car.id} carTitle={carTitle} />
            <ApproveButton carId={car.id} />
          </div>
        </div>

      </div>
    </div>
  );
}
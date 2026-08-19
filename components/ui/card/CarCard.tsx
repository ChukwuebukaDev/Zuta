"use client";

import Link from "next/link";
import Image from "next/image";
import { UserCheck, Landmark, MapPin, Gauge, Fuel, Settings } from "lucide-react";
import { Car } from "@/types/car/cars.types";
import { formatPrice } from "@/utilities/currency";

type CarsListProps = {
  cars: Car[];
};

export default function CarCard({ cars }: CarsListProps) {
  const availableCars = cars.filter(
    (car) => car.status === "AVAILABLE" || car.status === "PENDING"
  );

  return (
    <>
      {availableCars.map((car) => {
        const isPrivate = car.sellerType === "PRIVATE";

        return (
          <Link
            key={car.id}
            href={`/cars/${car.slug}`}
            className="group block h-full focus:outline-none"
          >
            <div className="h-full flex flex-col rounded-2xl bg-white border border-slate-200 hover:border-amber-400/60 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden relative">
              
              {/* --- YOUR PERFECTLY WORKING IMAGE CONTAINER --- */}
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100 shrink-0">
                
                {/* Condition Badge */}
                <span
                  className={`absolute top-3 left-3 z-10 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full backdrop-blur-md border shadow-sm ${
                    car.condition === "CERTIFIED"
                      ? "bg-emerald-600/90 text-white border-emerald-500/30"
                      : car.condition === "USED"
                      ? "bg-amber-400/95 text-slate-950 border-amber-300/50"
                      : "bg-blue-600/90 text-white border-blue-500/30"
                  }`}
                >
                  {car.condition?.replace("-", " ")}
                </span>

                {/* Seller Type Badge */}
                <span
                  className={`absolute top-3 right-3 z-10 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full backdrop-blur-md border shadow-sm ${
                    isPrivate
                      ? "bg-slate-900/90 text-slate-100 border-slate-700/50"
                      : "bg-white/95 text-amber-700 border-amber-200/50"
                  }`}
                >
                  {isPrivate ? (
                    <>
                      <UserCheck size={12} className="text-slate-300 shrink-0" />
                      <span>Private</span>
                    </>
                  ) : (
                    <>
                      <Landmark size={12} className="text-amber-500 shrink-0" />
                      <span>Dealer</span>
                    </>
                  )}
                </span>

                {/* Main Vehicle Image */}
                
 <Image
                  src={car.thumbnail}
                  alt={`${car.brand} ${car.model}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  priority={false}
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />


                {/* Bottom Image Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-80" />
              </div>

              {/* --- POLISHED CONTENT SECTION (No more squished text) --- */}
              <div className="p-4 sm:p-5 flex flex-col flex-1 gap-4">
                
                {/* Title & Trim Line */}
                <div>
                  <h3 className="font-black text-base sm:text-lg text-slate-900 tracking-tight line-clamp-1 group-hover:text-amber-600 transition-colors">
                    {car.year} {car.brand} {car.model}
                  </h3>

                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {car.trim && (
                      <span className="inline-block text-[10px] font-black uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                        {car.trim}
                      </span>
                    )}

                    {car.engineSize && (
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                        {car.engineSize}
                      </span>
                    )}
                  </div>
                </div>

                {/* Clean Inline Spec Row */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-3 text-xs font-bold text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Gauge size={14} className="text-slate-400 shrink-0" />
                    <span>{car.mileage?.toLocaleString()} km</span>
                  </div>
                  
                  <div className="w-1 h-1 rounded-full bg-slate-300" />
                  
                  <div className="flex items-center gap-1.5">
                    <Settings size={14} className="text-slate-400 shrink-0" />
                    <span className="uppercase">{car.transmission}</span>
                  </div>

                  <div className="w-1 h-1 rounded-full bg-slate-300" />

                  <div className="flex items-center gap-1.5">
                    <Fuel size={14} className="text-slate-400 shrink-0" />
                    <span className="uppercase">{car.fuelType}</span>
                  </div>
                </div>

                {/* Bottom Row: Price & Location */}
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-0.5">
                      Target Price
                    </p>
                    <p className="text-lg sm:text-xl font-black text-slate-900 tracking-tight truncate">
                      {formatPrice(car.price)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-slate-500 shrink-0">
                    <MapPin size={12} className="text-amber-500 shrink-0" />
                    <span className="truncate max-w-[100px] sm:max-w-[120px]">{car.city}</span>
                  </div>
                </div>

              </div>
            </div>
          </Link>
        );
      })}
    </>
  );
}






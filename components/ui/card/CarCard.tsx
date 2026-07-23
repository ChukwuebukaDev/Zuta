"use client";

import Link from "next/link";
import Image from "next/image";
import { UserCheck, Landmark, MapPin, Gauge, Fuel,Settings } from "lucide-react";
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
            <div className="h-full flex flex-col rounded-2xl bg-white border border-slate-200/80 hover:border-amber-500/50 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden relative">
              
              {/* --- IMAGE CONTAINER --- */}
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-slate-100 shrink-0">
                
                {/* Condition Badge */}
                <span
                  className={`absolute top-2 left-2 sm:top-3 sm:left-3 z-10 text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full backdrop-blur-md border shadow-sm ${
                    car.condition === "CERTIFIED"
                      ? "bg-emerald-600/90 text-white border-emerald-500/30"
                      : car.condition === "USED"
                      ? "bg-amber-500/90 text-slate-950 border-amber-400/30"
                      : "bg-blue-600/90 text-white border-blue-500/30"
                  }`}
                >
                  {car.condition?.replace("-", " ")}
                </span>

                {/* Seller Type Badge */}
                <span
                  className={`absolute top-2 right-2 sm:top-3 sm:right-3 z-10 flex items-center gap-1 text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full backdrop-blur-md border shadow-sm ${
                    isPrivate
                      ? "bg-slate-900/80 text-slate-100 border-slate-700/50"
                      : "bg-amber-950/80 text-amber-200 border-amber-500/30"
                  }`}
                >
                  {isPrivate ? (
                    <>
                      <UserCheck size={10} className="text-slate-300 shrink-0" />
                      <span className="hidden sm:inline">Private</span>
                    </>
                  ) : (
                    <>
                      <Landmark size={10} className="text-amber-400 shrink-0" />
                      <span className="hidden sm:inline">Dealer</span>
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
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent opacity-60" />
              </div>

              {/* --- CONTENT SECTION --- */}
              <div className="p-2.5 sm:p-4 md:p-5 flex flex-col flex-1 justify-between gap-2 sm:gap-3">
                
                {/* Title & Trim Line */}
              <div>
  <h3 className="font-black text-xs sm:text-base text-slate-900 tracking-tight line-clamp-1 group-hover:text-amber-600 transition-colors">
    {car.year} {car.brand} {car.model}
  </h3>

  <div className="flex items-center gap-1.5 mt-1 flex-wrap min-h-[18px]">
    {car.trim && (
      <span className="inline-block text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded">
        {car.trim}
      </span>
    )}

    {car.engineSize && (
      <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wide truncate">
        {car.engineSize}
      </span>
    )}
  </div>
</div>
                {/* Quick Spec Matrix */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-[10px] sm:text-[11px] font-semibold text-slate-600 py-1.5 sm:py-2 border-y border-slate-100">
                  <div className="flex items-center gap-1 truncate">
                    <Gauge size={12} className="text-slate-400 shrink-0" />
                    <span className="truncate">{car.mileage?.toLocaleString()} km</span>
                  </div>
                  <div className="flex items-center gap-1 sm:justify-end truncate">
                    <Settings size={12} className="text-slate-400 shrink-0" />
                    <span className="truncate uppercase text-[9px] sm:text-[10px]">{car.transmission}</span>
                  </div>
                </div>

                {/* Price & Location Row */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1 pt-0.5">
                  <div className="min-w-0">
                    <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-slate-400 hidden sm:block">
                      Price
                    </p>
                    <p className="text-xs sm:text-base md:text-lg font-black text-slate-900 tracking-tight truncate">
                      {formatPrice(car.price)}
                    </p>
                  </div>

                  <div className="flex items-center gap-0.5 text-[9px] sm:text-[11px] font-bold text-slate-500 truncate">
                    <MapPin size={11} className="text-amber-500 shrink-0" />
                    <span className="truncate">{car.city}</span>
                  </div>
                </div>

                {/* Footer Tag */}
                <div className="flex items-center justify-between text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 pt-1.5 border-t border-slate-100">
                  <span className="truncate text-slate-500 flex gap-0.5">{car.bodyType}</span>
                  <span className="truncate text-slate-500 flex items-center gap-0.5"><Fuel size={10}/> {car.fuelType}</span>
                  <span className="truncate text-slate-500 flex items-center gap-0.5">{car.color}</span>
                </div>

              </div>
            </div>
          </Link>
        );
      })}
    </>
  );
}
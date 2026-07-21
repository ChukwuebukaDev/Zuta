import Link from "next/link";
import { UserCheck, Landmark } from "lucide-react";
import { Car } from "@/types/car/cars.types";
import { formatPrice } from "@/utilities/currency";
import { MapPin } from "lucide-react";

type CarsListProps = {
  cars: Car[];
};

export default function CarCard({ cars }: CarsListProps) {
  const availableCars = cars.filter((car) => car.status === "AVAILABLE" || car.status === "PENDING");
  return (
    <>
      {availableCars.map((car) => {
        const isPrivate = car.sellerType === "PRIVATE";

        return (
          <Link
            key={car.id}
            href={`/cars/${car.slug}`}
            className="group block h-full"
          >
            <div className="h-full flex flex-col rounded-2xl bg-white border border-slate-100/80 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
              {/* Image Section */}
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-50 shrink-0">
                {/* Condition Badge */}
                <span
                  className={`absolute top-2 left-2 md:top-3 md:left-3 z-10 text-[9px] md:text-[11px] font-bold uppercase tracking-wider px-2 md:px-3 py-0.5 md:py-1 rounded-full backdrop-blur-sm border ${
                    car.condition === "CERTIFIED"
                      ? "bg-emerald-500/70 text-emerald-50 border-emerald-400/20"
                      : car.condition === "USED"
                        ? "bg-amber-500/70 text-amber-50 border-amber-400/20"
                        : "bg-blue-500/70 text-blue-50 border-blue-400/20"
                  }`}
                >
                  {car.condition?.replace("-", " ")}
                </span>

                {/* Seller Type Badge */}
                <span
                  className={`absolute top-2 right-2 md:top-3 md:right-3 z-10 flex items-center gap-0.5 md:gap-1 text-[9px] md:text-[10px] font-bold uppercase tracking-wider px-2 md:px-2.5 py-0.5 md:py-1 rounded-full backdrop-blur-sm border ${
                    isPrivate
                      ? "bg-slate-900/60 text-slate-200 border-slate-700/30"
                      : "bg-indigo-950/60 text-indigo-200 border-indigo-500/30"
                  }`}
                >
                  {isPrivate ? (
                    <>
                      <UserCheck
                        size={10}
                        className="text-slate-300 shrink-0"
                      />
                      <span>Private</span>
                    </>
                  ) : (
                    <>
                      <Landmark
                        size={10}
                        className="text-indigo-300 shrink-0"
                      />
                      <span>Dealer</span>
                    </>
                  )}
                </span>

                <img
                  loading="lazy"
                  src={car.thumbnail}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-103"
                />
              </div>

              {/* Content Section */}
              <div className="p-3.5 md:p-5 flex flex-col flex-1">
                {/* 🛠️ Fixed Minimum Height Block for Text Alignment */}
                <div className="min-h-[2.25rem] sm:min-h-[2.5rem] flex flex-col justify-start">
                  <h4 className="font-bold text-xs sm:text-sm md:text-base text-slate-900 leading-tight tracking-tight whitespace-normal break-words group-hover:text-blue-600 transition-colors">
                    {car.year} {car.brand} {car.model} <span className={`text-[6px] md:text-[10px] ${car.trim ? "bg-emerald-400 text-white rounded p-1" : ""}`}>{car.trim ? `${car.trim}` : ""}</span>
                  </h4>
                </div>

                {/* Transmission Info Tracker */}
                <div className="mt-1 flex-col items-center justify-between">
                  <p className="text-[9px] md:text-[10px] font-bold tracking-wide uppercase text-slate-400">
                    {car.transmission}
                  </p>
                  <p className="justify-self-end  text-[10px] font-bold tracking-wide uppercase text-slate-400">
                    <MapPin size={12} className="text-emerald-400" />{car.city}     
                  </p>
                </div>

                {/* Price Display */}
                <div className="mt-2 mb-3">
                  <p className="text-sm sm:text-base md:text-xl font-black text-slate-900 tracking-tight antialiased">
                    {formatPrice(car.price)}
                  </p>
                </div>

                {/* Extra Technical Specification Meta Details Footer */}
                <div className="mt-auto flex items-center justify-between text-[10px] md:text-xs font-semibold uppercase tracking-wider text-slate-400 pt-2.5 border-t border-slate-100">
                  <span className="truncate max-w-[50%]">{car.color}</span>
                  <span
                    className={`md:inline-flex items-center text-[9px] md:text-[10px] hidden font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md backdrop-blur-sm border max-w-[50%] truncate transition-all duration-300 ${
                      car.status === "AVAILABLE"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.05)]"
                        : car.status === "PENDING"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.05)]"
                          : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                    }`}
                  >
                    {car.status?.toLowerCase().replace("_", " ")}
                  </span>
                  <span className="truncate max-w-[50%] text-right font-medium text-slate-500">
                    {car.bodyType}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </>
  );
}

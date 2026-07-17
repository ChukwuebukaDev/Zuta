import Link from "next/link";
import { UserCheck, Landmark } from "lucide-react"; // Imported clean indicators
import { Car } from "@/types/car/cars.types";

type CarsListProps = {
  cars: Car[];
};

export default function CarCard({ cars }: CarsListProps) {
  return (
    <>
      {cars.map((car) => {
        // Handle database casing or custom fallbacks safely
        const isPrivate = car.sellerType === "PRIVATE";

        return (
          <Link key={car.id} href={`/cars/${car.slug}`} className="group block">
            <div className="h-full flex flex-col rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              
              {/* Image Section */}
              <div className="relative w-full aspect-4/3 overflow-hidden">
                
                {/* Condition Badge (Top-Left) */}
                <span
                  className={`absolute top-3 left-3 z-10 text-[11px] font-medium px-3 py-1 rounded-full backdrop-blur-md ${
                    car.condition === "CERTIFIED"
                      ? "bg-emerald-500/90 text-white"
                      : car.condition === "USED"
                        ? "bg-amber-500/90 text-white"
                        : "bg-blue-500/90 text-white"
                  }`}
                >
                  {car.condition?.replace("-", " ")}
                </span>

                {/* 🌟 NEW: Seller Type Badge (Top-Right) */}
                <span
                  className={`absolute top-3 right-3 z-10 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-md border ${
                    isPrivate
                      ? "bg-slate-900/80 text-slate-100 border-slate-700/30"
                      : "bg-indigo-950/80 text-indigo-300 border-indigo-500/20"
                  }`}
                >
                  {isPrivate ? (
                    <>
                      <UserCheck size={11} className="text-slate-400" />
                      Private
                    </>
                  ) : (
                    <>
                      <Landmark size={11} className="text-indigo-400" />
                      Dealer
                    </>
                  )}
                </span>

                <img
                  loading="lazy"
                  src={car.thumbnail}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Content Section */}
              <div className="p-5 space-y-3 flex flex-col flex-1">
                {/* Title */}
                <div>
                  <p className="font-semibold text-sm md:text-base leading-tight line-clamp-2 md:line-clamp-1">
                    {car.year} {car.brand} {car.model}
                  </p>
                  <span className="text-xs text-gray-500">
                    {car.transmission}
                  </span>
                </div>

                {/* Price (Dominant) */}
                <p className="text-sm md:text-xl font-bold text-gray-900">
                  ₦{car.price.toLocaleString()}
                </p>

                {/* Extra meta row */}
                <div className="mt-auto flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                  <span>{car.color}</span>
                  <span className="capitalize">{car.bodyType}</span>
                </div>
              </div>

            </div>
          </Link>
        );
      })}
    </>
  );
}
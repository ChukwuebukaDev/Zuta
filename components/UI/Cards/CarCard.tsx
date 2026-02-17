import Link from "next/link";
import Image from "next/image";
import { Car } from "@/types/car/cars.types";

type CarsListProps = {
  cars: Car[];
};

export default function CarCard({ cars }: CarsListProps) {
  return (
    <>
      {cars.map((car) => (
        <Link key={car.id} href={`/cars/${car.slug}`} className="group block">
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            {/* Image Section */}
            <div className="relative w-full h-52 md:h-60 lg:h-64 overflow-hidden">
              {/* Condition Badge */}
              <span
                className={`absolute top-3 left-3 z-10 text-[11px] font-medium px-3 py-1 rounded-full backdrop-blur-md ${
                  car.condition === "foreign-used"
                    ? "bg-emerald-500/90 text-white"
                    : car.condition === "nigeria-used"
                      ? "bg-amber-500/90 text-white"
                      : "bg-blue-500/90 text-white"
                }`}
              >
                {car.condition.replace("-", " ")}
              </span>

              <Image
                src={car.thumbnail}
                alt={`${car.brand} ${car.model}`}
                fill
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Content Section */}
            <div className="p-5 space-y-3">
              {/* Title */}
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-lg leading-tight line-clamp-1">
                  {car.brand} {car.model}
                </h3>

                <span className="text-xs text-gray-500">
                  {car.transmission}
                </span>
              </div>

              {/* Price (Dominant) */}
              <p className="text-xl font-bold text-gray-900">
                ₦{car.price.toLocaleString()}
              </p>

              {/* Extra meta row */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                <span>{car.year}</span>
                <span className="capitalize">{car.bodyType}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}

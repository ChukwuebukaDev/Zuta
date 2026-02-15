import Link from "next/link";
import Image from "next/image";
import { Car } from "@/types/car/cars.types";

type CarsListProps = {
  cars: Car[];
};

export default function CarCard({ cars }: CarsListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cars.map((car) => (
        <Link key={car.id} href={`/cars/${car.slug}`}>
          <div className="rounded-xl bg-white shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden">
            {/* Image wrapper */}
            <div className="relative w-full h-48 md:h-56 lg:h-64">
              <Image
                src={car.thumbnail}
                alt={car.slug}
                fill
                className="object-cover object-center"
              />
            </div>

            <div className="p-4">
              <div className="flex justify-between">
                <h3 className="font-semibold text-lg line-clamp-1">
                  {car.brand} {car.model}
                </h3>
                <p className="text-xs">{car.transmission}⚙️</p>
              </div>
              <p className="text-gray-600">₦{car.price.toLocaleString()}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

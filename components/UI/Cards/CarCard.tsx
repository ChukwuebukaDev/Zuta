import Link from "next/link";
import { Car } from "@/types/car/cars.types";

type CarsListProps = {
  cars: Car[];
};

export default function CarCard({ cars }: CarsListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cars.map((car) => (
        <Link key={car.id} href={`/cars/${car.id}`}>
          <div className="rounded-xl bg-white shadow-sm p-4 hover:shadow-md transition cursor-pointer">
            <div className="h-40 bg-gray-200 rounded-lg mb-4 flex items-center justify-center text-gray-400">
              Image
            </div>
            <h3 className="font-semibold text-lg">{car.slug}</h3>
            <p className="text-gray-600">{car.price}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

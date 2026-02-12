"use client";

import { Car } from "@/types/car/cars.types";

type CarsListProps = {
  cars: Car[];
};

export default function CarsList({ cars }: CarsListProps) {
  if (cars.length === 0) {
    return <p className="text-gray-500">No cars available.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cars.map((car) => (
        <div
          key={car.id}
          className="border rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col"
        >
          {/* Thumbnail */}
          <img
            src={car.thumbnail}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-48 object-cover rounded-md mb-4"
          />

          {/* Car Info */}
          <div className="flex flex-col flex-1">
            <h2 className="text-xl font-semibold">
              {car.brand} {car.model}
            </h2>
            <p className="text-gray-600">{car.year}</p>
            <p className="text-lg font-bold mt-2">
              ₦{car.price.toLocaleString()}
            </p>

            {/* Featured Badge */}
            {car.featured && (
              <span className="inline-block bg-yellow-400 text-black text-xs font-semibold mt-2 px-2 py-1 rounded">
                Featured
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

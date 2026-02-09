import CarCard from "@/components/UI/Cards/CarCard";
import { cars } from "@/lib/cars";

export default function CarsPage() {
  return (
    <section className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Vehicles in Nigeria</h1>
          <p className="text-gray-600">
            Explore available cars from trusted sellers
          </p>
        </div>

        {/* Cars grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <CarCard key={car.id} {...car} />
          ))}
        </div>
      </div>
    </section>
  );
}

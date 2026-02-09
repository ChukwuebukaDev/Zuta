import { Suspense } from "react";
import CarGridSkeleton from "@/components/UI/Wrapper/CarGridSkeleton";
import CarsList from "./CarServer";

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

        <Suspense fallback={<CarGridSkeleton />}>
          <CarsList />
        </Suspense>
      </div>
    </section>
  );
}

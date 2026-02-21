"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCarBySlug } from "@/lib/engine/marketplace";
import { getSavedCars, removeSavedCar } from "@/lib/utils/saveCar";

type Car = Awaited<ReturnType<typeof getCarBySlug>>;

export default function SavedCarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCars = async () => {
      const slugs = getSavedCars();

      const carData = await Promise.all(
        slugs.map((slug) => getCarBySlug(slug)),
      );

      setCars(carData.filter(Boolean) as Car[]);
      setLoading(false);
    };

    loadCars();
  }, []);

  const handleRemove = (slug: string) => {
    removeSavedCar(slug);
    setCars((prev) => prev.filter((car) => car?.slug !== slug));
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading saved cars...
      </div>
    );
  }

  if (!cars.length) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center space-y-4">
        <h1 className="text-2xl font-semibold">No saved cars yet</h1>
        <p className="text-gray-500">
          When you save cars, they’ll appear here.
        </p>
        <Link
          href="/cars"
          className="px-6 py-3 rounded-full bg-black text-white"
        >
          Browse Cars
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
        <h1 className="text-4xl font-semibold tracking-tight">Saved Cars</h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car) => (
            <div
              key={car?.slug}
              className="rounded-3xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-[0_10px_40px_rgba(0,0,0,0.05)] overflow-hidden"
            >
              {/* Image */}
              <div className="h-48 bg-slate-100">
                <img
                  src={car?.images?.[0]}
                  alt={car?.model}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <h2 className="text-lg font-semibold">
                  {car?.brand} {car?.model}
                </h2>

                <p className="text-gray-600">₦{car?.price?.toLocaleString()}</p>

                <div className="flex justify-between items-center pt-4">
                  <Link
                    href={`/cars/${car?.slug}`}
                    className="text-sm underline"
                  >
                    View Details
                  </Link>

                  <button
                    onClick={() => handleRemove(car!.slug)}
                    className="text-sm text-gray-500 hover:text-black transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

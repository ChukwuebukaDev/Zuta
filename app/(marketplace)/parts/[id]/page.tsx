"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMarketplace } from "@/context/MarketplaceEngine";

export default function PartsDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const { getItemsById } = useMarketplace();
  const part = getItemsById(id);

  if (!part) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold">Part not found</h1>
        <Link href="/parts" className="mt-6 inline-block underline">
          Back to Parts
        </Link>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <Link href="/parts" className="text-sm underline">
          ← Back to Parts
        </Link>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="h-80 bg-gray-300 rounded-xl flex items-center justify-center">
            Part Image
          </div>

          <div>
            <h1 className="text-3xl font-bold">{part.name}</h1>
            <p className="mt-2 text-xl font-semibold">{part.price}</p>

            <button className="mt-8 px-6 py-3 bg-black text-white rounded-lg">
              Contact Seller
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

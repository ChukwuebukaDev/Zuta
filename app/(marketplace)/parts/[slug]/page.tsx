import { getPartBySlug } from "@/lib/engine/PartsEngine";
import Image from "next/image";
import Link from "next/link";

type PartDetailsPageProps = {
  params: Promise<{ slug: string }>; // Next.js App Router requires this
};

export default async function PartDetailsPage({
  params,
}: PartDetailsPageProps) {
  const { slug } = await params;

  const part = await getPartBySlug(slug);

  if (!part) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Part Not Found</h1>
        <Link href="/parts" className="underline">
          Back To Parts
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold">{part.name}</h1>
        <p className="text-gray-500">
          ₦{part.price.toLocaleString()} {part.negotiable && "(Negotiable)"}
        </p>
        <p className="text-sm text-gray-400">
          Brand: {part.brand} | Category: {part.category} | Condition:{" "}
          {part.condition}
        </p>
      </div>

      {/* Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {part.images.map((img, i) => (
          <div key={i} className="relative w-full h-80">
            <Image
              src={img}
              alt={`${part.name}-${i}`}
              fill
              className="object-cover rounded-xl"
            />
          </div>
        ))}
      </div>

      {/* Compatibility */}
      <div className="border rounded-xl p-6 bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Compatible Cars</h2>
        <ul className="list-disc list-inside">
          {part.compatibleCars.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>

      {/* Seller Info */}
      <div className="border rounded-xl p-6 bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Seller Information</h2>
        <p>Seller ID: {part.sellerId}</p>
        <p>Views: {part.views}</p>
        <p>Status: {part.status}</p>
      </div>
    </div>
  );
}

import { getPartBySlug } from "@/lib/engine/PartsEngine";
import Link from "next/link";
import CarImageSlider from "@/components/ui/Wrapper/CarImageSlider";

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
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-14">
        {/* Back */}
        <Link
          href="/parts"
          className="text-sm text-gray-500 hover:text-black transition-colors"
        >
          ← Back to parts
        </Link>

        {/* Header */}
        <div className="space-y-5">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            {part.name}
          </h1>

          <div className="flex items-center gap-4">
            <p className="text-3xl font-bold text-gray-900">
              ₦{part.price.toLocaleString()}
            </p>

            {part.negotiable && (
              <span className="text-xs px-3 py-1 rounded-full bg-black/5 border border-black/10">
                Negotiable
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-gray-500">
            <span className="px-3 py-1 rounded-full bg-white/60 backdrop-blur-md border border-white/40">
              Brand: {part.brand}
            </span>

            <span className="px-3 py-1 rounded-full bg-white/60 backdrop-blur-md border border-white/40">
              Category: {part.category}
            </span>

            <span className="px-3 py-1 rounded-full bg-white/60 backdrop-blur-md border border-white/40 capitalize">
              Condition: {part.condition}
            </span>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          <CarImageSlider images={part.images} model={part.name} />
        </div>

        {/* Compatibility Section */}
        <div className="rounded-3xl p-8 bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
          <h2 className="text-xl font-semibold mb-6">Compatible Vehicles</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {part.compatibleCars.map((c, i) => (
              <div
                key={i}
                className="px-4 py-3 rounded-xl bg-white/60 border border-white/40 text-sm text-gray-700"
              >
                {c}
              </div>
            ))}
          </div>
        </div>

        {/* Seller Section */}
        <div className="rounded-3xl p-8 bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_10px_40px_rgba(0,0,0,0.05)] flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-3">Seller Information</h2>

            <p className="text-gray-600">Seller ID: {part.sellerId}</p>
            <p className="text-gray-600">Views: {part.views}</p>
            <p className="text-gray-600 capitalize">Status: {part.status}</p>
          </div>

          <div className="flex gap-4">
            <button className="px-6 py-3 rounded-full bg-black text-white font-medium hover:bg-gray-800 transition">
              Contact Seller
            </button>

            <button className="px-6 py-3 rounded-full border border-black/20 hover:bg-black/5 transition">
              Save Part
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

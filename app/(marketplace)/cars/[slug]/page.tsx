import { getCarBySlug } from "@/lib/engine/marketplace";
import Link from "next/link";
import { Metadata } from "next";
import CarImageSlider from "@/components/UI/Wrapper/CarImageSlider";
import SaveCarButton from "@/components/SaveCar/SaveCarButton";

type Props = {
  params: { slug: string };
};
export default async function CarDetailsPage({ params }: Props) {
  const { slug } = await params;
  const car = await getCarBySlug(slug);

  if (!car) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Car Not Found</h1>
        <Link className="underline" href="/cars">
          Back To Cars
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-2">
        {/* Back Link */}
        <Link
          href="/cars"
          className="text-sm text-gray-500 hover:text-black transition-colors"
        >
          ← Back to cars
        </Link>

        <div className="w-2  h-2 border rounded-full border-black animate-spin border-t-transparent" />

        {/* Header Section */}
        <div className="space-y-4 shadow-2xl rounded-2xl p-2">
          <h1 className="text-2xl md:text-5xl font-semibold tracking-tight">
            {car.brand} {car.model} {car.year}
          </h1>

          <div className="flex justify-between items-center gap-4">
            <p className="text-2xl font-bold text-gray-900">
              ₦{car.price.toLocaleString()}
            </p>

            <span className="text-xs px-3 py-1 rounded-full bg-black/5 border border-black/10">
              {car.negotiable ? "Negotiable" : "Fixed Price"}
            </span>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          <CarImageSlider images={car.images} model={car.model} />
        </div>

        {/* Specifications */}
        <div className="rounded-3xl p-8 bg-white/60 backdrop-blur-xl border border-white/40 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
          <h2 className="text-xl font-semibold mb-8">Specifications</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <Spec label="Body Type" value={car.bodyType} />
            <Spec label="Transmission" value={car.transmission} />
            <Spec label="Fuel Type" value={car.fuelType} />
            <Spec
              label="Mileage"
              value={`${car.mileage.toLocaleString()} km`}
            />
            <Spec label="Condition" value={car.condition} />
            <Spec label="Drivetrain" value={car.drivetrain} />
          </div>
        </div>

        {/* Seller Section */}
        <div className="rounded-3xl p-8 bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_10px_40px_rgba(0,0,0,0.05)] flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-3">Seller Information</h2>
            <p className="text-gray-600">Seller ID: 1122</p>
            <p className="text-gray-600">Views: {car.views}</p>
            <p className="text-gray-600 capitalize">Status: {car.status}</p>
          </div>

          <div className="flex gap-4">
            <button className="px-6 py-3 rounded-full bg-black text-white font-medium hover:bg-gray-800 transition">
              Contact Seller
            </button>

            <SaveCarButton slug={slug} />
          </div>
        </div>
      </div>
      <Link href="#seller" className="fixed bottom-8 right-8 z-50">
        <div className="px-7 py-4 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-black font-medium shadow-[0_20px_60px_rgba(0,0,0,0.2)] hover:bg-white/20 transition">
          Get More Details →
        </div>
      </Link>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium capitalize">{value}</p>
    </div>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const car = await getCarBySlug(slug);
  if (!car) {
    return {
      title: "Car Not Found | Zuta",
      description: "This car listing is no longer available on Zuta.",
    };
  }
  const title = `${car.year} ${car.brand} ${car.model} – ₦${car.price.toLocaleString()} | Zuta`;

  const description = `${car.year} ${car.brand} ${car.model} with ${car.mileage.toLocaleString()}km available in Nigeria. ${car.transmission} transmission. Buy now on Zuta.`;
  return {
    title,
    description,
  };
}

import { notFound } from "next/navigation";
import { getCarById } from "@/lib/engine/marketplace";
import Image from "next/image";

type CarDetailsPageProps = {
  params: {
    id: string;
  };
};

export default async function CarDetailsPage({ params }: CarDetailsPageProps) {
  const car = await getCarById(params.id);

  if (!car) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold">
          {car.brand} {car.model} {car.year}
        </h1>
        <p className="text-gray-500">
          ₦{car.price.toLocaleString()} {car.negotiable && "(Negotiable)"}
        </p>
      </div>

      {/* Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {car.images.map((img, index) => (
          <div key={index} className="relative w-full h-80">
            <Image
              src={img}
              alt={`${car.model}-${index}`}
              fill
              className="object-cover rounded-xl"
            />
          </div>
        ))}
      </div>

      {/* Specifications */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 border rounded-xl p-6 bg-white shadow-sm">
        <Spec label="Body Type" value={car.bodyType} />
        <Spec label="Transmission" value={car.transmission} />
        <Spec label="Fuel Type" value={car.fuelType} />
        <Spec label="Mileage" value={`${car.mileage.toLocaleString()} km`} />
        <Spec label="Condition" value={car.condition} />
        <Spec label="Drivetrain" value={car.drivetrain} />
      </div>

      {/* Seller Info */}
      <div className="border rounded-xl p-6 bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Seller Information</h2>
        <p>Seller ID: {car.sellerId}</p>
        <p>Views: {car.views}</p>
        <p>Status: {car.status}</p>
      </div>
    </div>
  );
}

/* Small reusable spec component */
function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium capitalize">{value}</p>
    </div>
  );
}

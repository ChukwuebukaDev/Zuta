import Link from "next/link";
import { MarketplaceItem } from "@/types/Marketplace-types";

export default function CarCard({ id, name, price, image }: MarketplaceItem) {
  return (
    <Link href={`/cars/${id}`}>
      <div className="rounded-xl bg-white shadow-sm p-4 hover:shadow-md transition cursor-pointer">
        <div className="h-40 bg-gray-200 rounded-lg mb-4 flex items-center justify-center text-gray-400">
          Image
        </div>
        <h3 className="font-semibold text-lg">{name}</h3>
        <p className="text-gray-600">{price}</p>
      </div>
    </Link>
  );
}

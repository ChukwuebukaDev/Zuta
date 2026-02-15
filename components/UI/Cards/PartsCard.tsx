"use client";
import Link from "next/link";
import Image from "next/image";
import { Part } from "@/types/parts/part";

type PartCardProps = {
  part: Part;
};

export default function PartCard({ part }: PartCardProps) {
  const mainImage = part.images[0] || part.thumbnail || "";

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Image Section */}
      <div className="relative w-full h-48 bg-gray-100">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={part.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            No Image Available
          </div>
        )}

        {/* Condition Badge */}
        {part.condition && (
          <span
            className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full shadow-sm
              ${
                part.condition.toLowerCase() === "new"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
          >
            {part.condition.toUpperCase()}
          </span>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-2">
        {/* Name */}
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
          {part.name}
        </h3>

        {/* Brand & Compatible Cars */}
        {part.brand || part.compatibleCars?.length > 0 ? (
          <p className="text-sm text-gray-500 line-clamp-1">
            {part.brand}{" "}
            {part.compatibleCars && `• ${part.compatibleCars.join(", ")}`}
          </p>
        ) : null}

        {/* Price */}
        <p className="text-xl font-bold text-black">
          ₦{part.price.toLocaleString()} {part.negotiable && "(Negotiable)"}
        </p>

        {/* Action Button */}
        <Link href={`/parts/${part.slug}`}>
          <button className="mt-3 w-full bg-black text-white py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors duration-200">
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
}

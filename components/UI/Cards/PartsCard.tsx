"use client";
import Link from "next/link";
import Image from "next/image";

type PartCardProps = {
  id: string;
  name: string;
  price: string | number;
  image?: string;
  description?: string;
  location?: string;
  condition?: string;
  brand?: string;
  compatibleModel?: string;
};

export default function PartCard({
  name,
  price,
  image,
  description,
  location,
  condition,
  brand,
  compatibleModel,
  id,
}: PartCardProps) {
  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Image Section */}
      <div className="relative w-full h-48 bg-gray-100">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            No Image Available
          </div>
        )}

        {/* Condition Badge */}
        {condition && (
          <span
            className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full shadow-sm
              ${
                condition.toLowerCase() === "new"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
          >
            {condition.toUpperCase()}
          </span>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-2">
        {/* Name */}
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
          {name}
        </h3>

        {/* Brand & Model */}
        {(brand || compatibleModel) && (
          <p className="text-sm text-gray-500">
            {brand} {compatibleModel && `• ${compatibleModel}`}
          </p>
        )}

        {/* Price */}
        <p className="text-xl font-bold text-black">
          ₦{Number(price).toLocaleString()}
        </p>

        {/* Location */}
        {location && <p className="text-sm text-gray-500">📍 {location}</p>}

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        )}

        {/* Action Button */}
        <Link href={`/parts/${id}`}>
          {" "}
          <button className="mt-3 w-full bg-black text-white py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors duration-200">
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
}

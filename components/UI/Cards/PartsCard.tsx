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
    <div className="group relative rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2">
      {/* Glass Background */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-xl border border-white/30 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)] transition-all duration-500" />

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col">
        {/* Image Section */}
        <div className="relative w-full h-52 bg-gray-100 overflow-hidden rounded-t-3xl">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={part.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              No Image Available
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />

          {/* Condition Badge */}
          {part.condition && (
            <span
              className={`absolute top-4 left-4 px-4 py-1.5 text-xs font-semibold rounded-full backdrop-blur-md border border-white/40
                ${
                  part.condition.toLowerCase() === "new"
                    ? "bg-green-500/80 text-white"
                    : "bg-amber-500/80 text-white"
                }`}
            >
              {part.condition.toUpperCase()}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-3">
          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 tracking-tight line-clamp-1">
            {part.name}
          </h3>

          {/* Brand + Compatibility */}
          {(part.brand || part.compatibleCars?.length > 0) && (
            <p className="text-sm text-gray-500 line-clamp-1">
              {part.brand}
              {part.compatibleCars?.length > 0 &&
                ` • ${part.compatibleCars.slice(0, 2).join(", ")}`}
            </p>
          )}

          {/* Price */}
          <div className="flex items-center justify-between pt-2">
            <p className="text-2xl font-bold text-gray-900">
              ₦{part.price.toLocaleString()}
            </p>

            {part.negotiable && (
              <span className="text-xs text-gray-500 bg-gray-200/50 px-2 py-1 rounded-full">
                Negotiable
              </span>
            )}
          </div>

          {/* Button */}
          <Link href={`/parts/${part.slug}`}>
            <button
              className="mt-4 w-full py-3 rounded-2xl font-medium text-sm 
              bg-black text-white 
              transition-all duration-300
              hover:bg-gray-900 hover:shadow-lg active:scale-[0.98]"
            >
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

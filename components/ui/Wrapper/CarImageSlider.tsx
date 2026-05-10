"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CarImageSliderProps = {
  images: string[];
  model: string;
};

export default function CarImageSlider({
  images,
  model,
}: CarImageSliderProps) {
  const [mainIndex, setMainIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="w-full h-80 bg-gray-200 rounded-xl flex items-center justify-center text-gray-400">
        No Images Available
      </div>
    );
  }

  const prevImage = () => {
    setMainIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setMainIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="space-y-4">
      
      {/* Main Image */}
      <div className="relative w-full md:w-1/2 md:mx-auto h-80 md:h-96 rounded-xl overflow-hidden">

        <Image
          src={images[mainIndex]}
          alt={`${model}-${mainIndex}`}
          fill
          priority
          sizes="(max-width:768px) 100vw, 50vw"
          className="object-cover object-center transition-all duration-300"
        />

        {/* Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={nextImage}
              className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setMainIndex(idx)}
              className={`relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 ${
                idx === mainIndex
                  ? "border-black"
                  : "border-gray-200"
              }`}
            >
              <Image
                src={img}
                alt={`${model}-${idx}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
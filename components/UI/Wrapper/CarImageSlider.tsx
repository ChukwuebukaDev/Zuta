"use client";
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react"; // optional icons library

type CarImageSliderProps = {
  images: string[];
  model: string;
};

export default function CarImageSlider({ images, model }: CarImageSliderProps) {
  const [mainIndex, setMainIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="relative w-full h-80 bg-gray-200 flex items-center justify-center text-gray-400 rounded-xl">
        No Images Available
      </div>
    );
  }

  const prevImage = () => {
    setMainIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setMainIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4 relative">
      {/* Main Image */}
      <div className="relative w-full md:w-1/2 md:m-auto h-80 md:h-96 rounded-xl overflow-hidden">
        <img
          src={images[mainIndex]}
          alt={`${model}-${mainIndex}`}
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover object-center transition-all duration-300"
        />

        {/* Left / Right Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute top-1/2 left-2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextImage}
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto">
          {images.map((img, idx) => (
            <div
              key={idx}
              className={`relative w-20 h-20 shrink-0 rounded-lg overflow-hidden cursor-pointer border-2 ${
                idx === mainIndex ? "border-black" : "border-gray-200"
              }`}
              onClick={() => setMainIndex(idx)}
            >
              <img
                src={img}
                alt={`${model}-${idx}`}
                className="object-cover object-center"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import Image from "next/image";
import { useMemo } from "react";

type Props = {
  thumbnail: File | null;
  images: File[];

  onChange: <K extends "thumbnail" | "images">(
    field: K,
    value: K extends "thumbnail" ? File | null : File[],
  ) => void;
};
export default function PhotoUploader({ thumbnail, images, onChange }: Props) {
  const mainPreview = useMemo(() => {
    if (!thumbnail) return null;
    return URL.createObjectURL(thumbnail);
  }, [thumbnail]);

  const galleryPreviews = useMemo(() => {
    return images.map((img) => URL.createObjectURL(img));
  }, [images]);

  return (
    <div className="space-y-8">
      {/* Main Image */}
      <div>
        <label className="block mb-2 text-sm text-gray-300">Main Image</label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => onChange("thumbnail", e.target.files?.[0] || null)}
          className="text-gray-200"
        />

        {mainPreview && (
          <div className="mt-4 relative w-full h-64 rounded-lg overflow-hidden border border-gray-800">
            <Image
              src={mainPreview}
              alt="Main Preview"
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>

      {/* Gallery Images */}
      <div>
        <label className="block mb-2 text-sm text-gray-300">
          Gallery Images
        </label>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) =>
            onChange("images", e.target.files ? Array.from(e.target.files) : [])
          }
          className="text-gray-200"
        />

        {galleryPreviews.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mt-4">
            {galleryPreviews.map((src, i) => (
              <div
                key={i}
                className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-800"
              >
                <Image
                  src={src}
                  alt={`Gallery ${i}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

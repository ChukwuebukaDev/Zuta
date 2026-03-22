"use client";

import Image from "next/image";
import { useMemo, useEffect, useState } from "react";

type Props = {
  thumbnail: File | null;
  images: File[];
  onChange: <K extends "thumbnail" | "images">(
    field: K,
    value: K extends "thumbnail" ? File | null : File[],
  ) => void;
};

export default function PhotoUploader({ thumbnail, images, onChange }: Props) {
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  // Main image preview
  const mainPreview = useMemo(() => {
    if (!thumbnail) return null;
    return URL.createObjectURL(thumbnail);
  }, [thumbnail]);

  // Update gallery previews whenever images change
  useEffect(() => {
    const urls = images.map((img) => URL.createObjectURL(img));
    setGalleryPreviews(urls);

    // Clean up object URLs on unmount or when images change
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  // Handle adding new gallery files without overwriting
  const handleGalleryChange = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    onChange("images", [...images, ...newFiles]); // append instead of replace
  };

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
          onChange={(e) => handleGalleryChange(e.target.files)}
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

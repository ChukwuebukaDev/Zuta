"use client";

type Props = {
  mainImage: File | null;
  galleryImages: File[];
  onChange: (
    field: "mainImage" | "galleryImages",
    value: File | File[],
  ) => void;
};

export default function PhotoUploader({
  mainImage,
  galleryImages,
  onChange,
}: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <label className="flex flex-col">
        Main Image
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onChange("mainImage", e.target.files?.[0] || null)}
          className="mt-2 text-gray-200"
          required
        />
      </label>

      <label className="flex flex-col">
        Gallery Images
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) =>
            onChange(
              "galleryImages",
              e.target.files ? Array.from(e.target.files) : [],
            )
          }
          className="mt-2 text-gray-200"
        />
      </label>
    </div>
  );
}

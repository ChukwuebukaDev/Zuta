"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Save,
  Loader2,
  ArrowLeft,
  AlertCircle,
  Sparkles,
  UploadCloud,
  RefreshCw,
  CheckCircle2,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

// Mandatory blueprint angles required for Zuta verification
const MANDATORY_ANGLES = [
  { key: "FRONT", label: "Front Exterior" },
  { key: "REAR", label: "Rear Exterior" },
  { key: "SIDE_LEFT", label: "Driver Side" },
  { key: "SIDE_RIGHT", label: "Passenger Side" },
  { key: "INTERIOR", label: "Dashboard / Cabin" },
  { key: "ENGINE", label: "Engine Bay" },
];

export default function EditCarForm({ car }: { car: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hydrate initial gallery images from car.carImages
  const initialGallery = (car.carImages || []).reduce(
    (acc: Record<string, string>, img: any) => {
      if (img.angle && img.url) acc[img.angle] = img.url;
      return acc;
    },
    {}
  );

  const [thumbnailUrl, setThumbnailUrl] = useState<string>(car.thumbnail || "");
  const [angleImages, setAngleImages] = useState<Record<string, string>>(initialGallery);

  const [formData, setFormData] = useState({
    brand: car.brand || "",
    model: car.model || "",
    year: car.year || new Date().getFullYear(),
    price: car.price || "",
    mileage: car.mileage || "",
    trim: car.trim || "",
    doors: car.doors || "",
    engineSize: car.engineSize || "",
    transmission: car.transmission || "AUTOMATIC",
    fuelType: car.fuelType || "PETROL",
    condition: car.condition || "USED",
    city: car.city || "",
    state: car.state || "",
    negotiable: Boolean(car.negotiable),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  // Upload/Replace Handler for angle photos
  const handleImageReplace = async (angleKey: string, file: File) => {
    const toastId = toast.loading(`Uploading ${angleKey} photo...`);
    try {
      const uploadData = new FormData();
      uploadData.append("file", file);

      // Call your existing image upload API route
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();

      // Update local state
      setAngleImages((prev) => ({ ...prev, [angleKey]: url }));

      // Automatically sync Front angle with primary thumbnail
      if (angleKey === "FRONT" || !thumbnailUrl) {
        setThumbnailUrl(url);
      }

      toast.success(`${angleKey} photo updated!`, { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image. Please try again.", { id: toastId });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Format relational angle images array
    const formattedCarImages = Object.entries(angleImages).map(
      ([angle, url]) => ({
        angle,
        url,
      })
    );

    try {
      const response = await fetch(`/api/cars/${car.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          year: Number(formData.year),
          price: Number(formData.price),
          mileage: Number(formData.mileage),
          doors: formData.doors ? Number(formData.doors) : undefined,
          thumbnail: thumbnailUrl,
          carImages: formattedCarImages,
          // Re-trigger review pipeline whenever listing is modified
          listingStatus: "PENDING",
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Mutation rejected by database engine");
      }

      toast.success("Listing updated successfully!", {
        description: "Your adjustments and updated photos were submitted for review.",
      });

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      console.error("[EDIT_CAR_ERR]:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to sync listing adjustments."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 bg-neutral-950/80 p-8 rounded-3xl border border-neutral-800 shadow-2xl relative overflow-hidden"
    >
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Admin Review Alert Banner */}
      <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-300 text-xs font-medium leading-relaxed">
        <AlertCircle size={18} className="shrink-0 text-amber-400 mt-0.5" />
        <div>
          <strong className="block text-amber-400 font-bold uppercase tracking-wider text-[10px]">
            Re-verification Notice
          </strong>
          Saving changes will place your listing back into{" "}
          <span className="font-bold underline">Under Review</span> status so Zuta moderators can verify the updated photos and specifications.
        </div>
      </div>

      {/* --- SECTION 1: 6-ANGLE INSPECTION GALLERY MODIFIER --- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <ImageIcon size={18} className="text-amber-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Inspection Photo Gallery
            </h3>
          </div>
          <span className="text-[10px] text-neutral-500 font-mono">
            {Object.keys(angleImages).length} / 6 Angles Uploaded
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {MANDATORY_ANGLES.map(({ key, label }) => {
            const currentImg = angleImages[key];

            return (
              <div
                key={key}
                className="relative bg-neutral-900 border border-neutral-800 rounded-2xl p-3 flex flex-col justify-between overflow-hidden group"
              >
                {/* Photo Preview Box */}
                <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800/80">
                  {currentImg ? (
                    <>
                      <Image
                        src={currentImg}
                        alt={label}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 bg-emerald-500 text-slate-950 p-1 rounded-full shadow">
                        <CheckCircle2 size={12} />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-neutral-600 space-y-1">
                      <UploadCloud size={20} />
                      <span className="text-[9px] font-bold uppercase tracking-wider">
                        Missing
                      </span>
                    </div>
                  )}

                  {/* Replace Trigger Overlay */}
                  <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1.5 transition cursor-pointer backdrop-blur-[2px]">
                    <RefreshCw size={18} className="text-amber-400" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-white">
                      Replace Photo
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageReplace(key, file);
                      }}
                    />
                  </label>
                </div>

                {/* Angle Label */}
                <div className="mt-2.5 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-300">
                    {label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- SECTION 2: SPECIFICATION INPUTS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-800">
        {/* Brand Name */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-2">
            Brand Name
          </label>
          <input
            type="text"
            name="brand"
            required
            value={formData.brand}
            onChange={handleChange}
            placeholder="e.g. Toyota"
            className="w-full bg-neutral-900 border border-neutral-800 focus:border-amber-500/50 rounded-xl py-3.5 px-4 text-sm text-white placeholder:text-neutral-600 outline-none transition"
          />
        </div>

        {/* Model Version */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-2">
            Model Version
          </label>
          <input
            type="text"
            name="model"
            required
            value={formData.model}
            onChange={handleChange}
            placeholder="e.g. Camry"
            className="w-full bg-neutral-900 border border-neutral-800 focus:border-amber-500/50 rounded-xl py-3.5 px-4 text-sm text-white placeholder:text-neutral-600 outline-none transition"
          />
        </div>

        {/* Trim Package */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-2">
            Trim Package
          </label>
          <input
            type="text"
            name="trim"
            value={formData.trim}
            onChange={handleChange}
            placeholder="e.g. XLE, SE, Sport, AMG"
            className="w-full bg-neutral-900 border border-neutral-800 focus:border-amber-500/50 rounded-xl py-3.5 px-4 text-sm text-white placeholder:text-neutral-600 outline-none transition"
          />
        </div>

        {/* Production Year */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-2">
            Production Year
          </label>
          <input
            type="number"
            name="year"
            required
            value={formData.year}
            onChange={handleChange}
            placeholder="2022"
            className="w-full bg-neutral-900 border border-neutral-800 focus:border-amber-500/50 rounded-xl py-3.5 px-4 text-sm text-white placeholder:text-neutral-600 outline-none transition"
          />
        </div>

        {/* Ask Price */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-2">
            Ask Price (₦)
          </label>
          <input
            type="number"
            name="price"
            required
            value={formData.price}
            onChange={handleChange}
            placeholder="15000000"
            className="w-full bg-neutral-900 border border-neutral-800 focus:border-amber-500/50 rounded-xl py-3.5 px-4 text-sm text-white placeholder:text-neutral-600 outline-none transition"
          />
        </div>

        {/* Mileage */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-2">
            Mileage Run (km)
          </label>
          <input
            type="number"
            name="mileage"
            required
            value={formData.mileage}
            onChange={handleChange}
            placeholder="45000"
            className="w-full bg-neutral-900 border border-neutral-800 focus:border-amber-500/50 rounded-xl py-3.5 px-4 text-sm text-white placeholder:text-neutral-600 outline-none transition"
          />
        </div>

        {/* Engine Size */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-2">
            Engine Displacement
          </label>
          <input
            type="text"
            name="engineSize"
            value={formData.engineSize}
            onChange={handleChange}
            placeholder="e.g. 2.5L, 3.5L V6"
            className="w-full bg-neutral-900 border border-neutral-800 focus:border-amber-500/50 rounded-xl py-3.5 px-4 text-sm text-white placeholder:text-neutral-600 outline-none transition"
          />
        </div>

        {/* Door Count */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-2">
            Door Options
          </label>
          <select
            name="doors"
            value={formData.doors}
            onChange={handleChange}
            className="w-full bg-neutral-900 border border-neutral-800 focus:border-amber-500/50 rounded-xl py-3.5 px-4 text-sm text-white outline-none transition"
          >
            <option value="">Select Doors</option>
            <option value="2">2 Doors (Coupe / Convertible)</option>
            <option value="4">4 Doors (Sedan / SUV)</option>
            <option value="5">5 Doors (Hatchback)</option>
          </select>
        </div>

        {/* Transmission */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-2">
            Transmission Type
          </label>
          <select
            name="transmission"
            value={formData.transmission}
            onChange={handleChange}
            className="w-full bg-neutral-900 border border-neutral-800 focus:border-amber-500/50 rounded-xl py-3.5 px-4 text-sm text-white outline-none transition"
          >
            <option value="AUTOMATIC">Automatic</option>
            <option value="MANUAL">Manual</option>
          </select>
        </div>

        {/* Fuel Type */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-2">
            Fuel Type
          </label>
          <select
            name="fuelType"
            value={formData.fuelType}
            onChange={handleChange}
            className="w-full bg-neutral-900 border border-neutral-800 focus:border-amber-500/50 rounded-xl py-3.5 px-4 text-sm text-white outline-none transition"
          >
            <option value="PETROL">Petrol</option>
            <option value="DIESEL">Diesel</option>
            <option value="HYBRID">Hybrid</option>
            <option value="ELECTRIC">Electric</option>
          </select>
        </div>

        {/* City */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-2">
            City Location
          </label>
          <input
            type="text"
            name="city"
            required
            value={formData.city}
            onChange={handleChange}
            placeholder="e.g. Ikeja"
            className="w-full bg-neutral-900 border border-neutral-800 focus:border-amber-500/50 rounded-xl py-3.5 px-4 text-sm text-white placeholder:text-neutral-600 outline-none transition"
          />
        </div>

        {/* State */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-2">
            State Location
          </label>
          <input
            type="text"
            name="state"
            required
            value={formData.state}
            onChange={handleChange}
            placeholder="e.g. Lagos State"
            className="w-full bg-neutral-900 border border-neutral-800 focus:border-amber-500/50 rounded-xl py-3.5 px-4 text-sm text-white placeholder:text-neutral-600 outline-none transition"
          />
        </div>
      </div>

      {/* Checkbox: Price Negotiable */}
      <div className="flex items-center gap-3 pt-2">
        <input
          type="checkbox"
          id="negotiable"
          name="negotiable"
          checked={formData.negotiable}
          onChange={handleChange}
          className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
        />
        <label
          htmlFor="negotiable"
          className="text-xs font-medium text-neutral-300 cursor-pointer select-none"
        >
          Price is open to reasonable negotiations
        </label>
      </div>

      {/* Action Footer */}
      <div className="flex justify-between items-center pt-6 border-t border-neutral-900">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-white transition"
        >
          <ArrowLeft size={14} /> Cancel
        </Link>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black uppercase tracking-wider text-xs px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/10 active:scale-95 cursor-pointer disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <Loader2 size={16} className="animate-spin text-slate-950" />
          ) : (
            <>
              <Sparkles size={14} />
              <span>Submit for Verification</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
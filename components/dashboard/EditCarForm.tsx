"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Save, Loader2, ArrowLeft, AlertCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function EditCarForm({ car }: { car: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

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
          // Re-trigger review pipeline whenever critical specs are modified
          listingStatus: "PENDING",
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Mutation rejected by database engine");
      }

      toast.success("Listing updated successfully!", {
        description: "Your adjustments have been submitted for admin review.",
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
          <span className="font-bold underline">Under Review</span> status so Zuta moderators can verify the updated specs.
        </div>
      </div>

      {/* Form Fields Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        {/* Year */}
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
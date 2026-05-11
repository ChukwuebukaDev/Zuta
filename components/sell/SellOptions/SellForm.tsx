"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/controls/Button";
import { toast } from "sonner";
import { Loader2, Mail, MapPin } from "lucide-react";

import VehicleIdentity from "../FormData/VehicleIdentity";
import VehicleSpecs from "../FormData/VehicleSpecs";
import PriceSection from "../FormData/PriceSection";
import PhotoUploader from "../FormData/PhotoUploader";
import SellerSection from "../FormData/SellerSection";

import { CarFormData } from "@/types/car/CarFormData";
import { uploadImage } from "@/utilities/uploadImage";

interface SellFormProps {
  defaultEmail: string;
  defaultName: string;
}

const normalizeTransmission = (v?: string) =>
  v === "automatic" ? "AUTOMATIC" : "MANUAL";

const normalizeFuel = (v?: string) => {
  const map: Record<string, string> = {
    petrol: "PETROL",
    diesel: "DIESEL",
    electric: "ELECTRIC",
    hybrid: "HYBRID",
  };
  return map[v || ""] || "PETROL";
};

export default function SellForm({ defaultEmail, defaultName }: SellFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialState: CarFormData = {
    brand: "",
    model: "",
    color: "",
    year: new Date().getFullYear(),
    mileage: 0,
    transmission: "automatic",
    fuelType: "petrol",
    price: 0,
    negotiable: false,
    thumbnail: null,
    images: [],
    sellerName: defaultName,
    sellerEmail: defaultEmail,
    sellerPhone: "",
    location: "", // We will split this in the payload
    drivetrain: undefined,
    bodyType: undefined,
    condition: undefined,
    accidentHistory: false,
    serviceHistory: false,
    currency: "NGN",
  };

  const [formData, setFormData] = useState<CarFormData>(initialState);

  const handleChange = <K extends keyof CarFormData>(
    key: K,
    value: CarFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // --- Validation ---
    if (!formData.thumbnail || formData.images.length === 0) {
      return toast.error("Please upload the required media.");
    }

    if (!formData.location.includes(",")) {
      return toast.error("Please enter location as 'City, State' (e.g. Lekki, Lagos)");
    }

    try {
      setIsSubmitting(true);
      const loadingToast = toast.loading("Uploading luxury assets...");

      // 1. Concurrent Image Uploads
      const [thumbnailUrl, ...imageUrls] = await Promise.all([
        uploadImage(formData.thumbnail),
        ...formData.images.map(uploadImage),
      ]);

      // 2. Format Payload for Option 1 API
      const payload = {
        brand: formData.brand,
        model: formData.model,
        year: formData.year,
        color: formData.color,
        mileage: formData.mileage,
        price: formData.price,
        negotiable: formData.negotiable,
        bodyType: formData.bodyType,
        drivetrain: formData.drivetrain,
        accidentHistory: formData.accidentHistory,
        serviceHistory: formData.serviceHistory,
        sellerName: formData.sellerName,
        sellerPhone: formData.sellerPhone,
        sellerEmail: formData.sellerEmail,
        location: formData.location, // API will handle the split into City/State
        thumbnail: thumbnailUrl,
        images: imageUrls,
        transmission: normalizeTransmission(formData.transmission),
        fuelType: normalizeFuel(formData.fuelType),
        condition: formData.condition?.toUpperCase(),
      };

      // 3. API Request
      const res = await fetch("/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      toast.dismiss(loadingToast);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Submission failed");
      }

      toast.success("Listing published successfully!");
      router.push("/dashboard");
      router.refresh();

    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-[#050505] text-white py-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-4 uppercase">
            Create <span className="text-blue-600 font-outline-2">Listing</span>
          </h2>
          <p className="text-slate-500 max-w-md mx-auto">
            Provide accurate details to ensure your vehicle stands out in the Zuta premium marketplace.
          </p>
        </header>

        {/* High-End Loading State */}
        {isSubmitting && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl">
            <div className="text-center">
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-6" />
              <p className="text-2xl font-bold tracking-[0.2em] uppercase animate-pulse">
                Synchronizing Data
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-12 pb-20">
          {/* Section: Identity */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-transparent rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative bg-slate-900/40 p-8 rounded-[2rem] border border-slate-800/50 backdrop-blur-md">
              <VehicleIdentity
                brand={formData.brand}
                model={formData.model}
                year={formData.year}
                color={formData.color}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Section: Performance & Specs */}
          <div className="bg-slate-900/40 p-8 rounded-[2rem] border border-slate-800/50 backdrop-blur-md">
            <VehicleSpecs
              mileage={formData.mileage}
              transmission={formData.transmission}
              fuelType={formData.fuelType}
              drivetrain={formData.drivetrain}
              bodyType={formData.bodyType}
              condition={formData.condition}
              accidentHistory={formData.accidentHistory}
              serviceHistory={formData.serviceHistory}
              onChange={handleChange}
            />
          </div>

          {/* Section: Pricing */}
          <div className="bg-slate-900/40 p-8 rounded-[2rem] border border-slate-800/50 backdrop-blur-md">
            <PriceSection
              price={formData.price}
              negotiable={formData.negotiable}
              onChange={handleChange}
            />
          </div>

          {/* Section: Visuals */}
          <PhotoUploader
            thumbnail={formData.thumbnail}
            images={formData.images}
            onChange={(field, value) => handleChange(field as keyof CarFormData, value)}
          />

          {/* Section: Seller Verification */}
          <div className="bg-slate-900/40 p-8 rounded-[2rem] border border-slate-800/50 backdrop-blur-md space-y-8">
            <SellerSection
              sellerName={formData.sellerName}
              sellerPhone={formData.sellerPhone}
              location={formData.location} // Expecting "City, State"
              onChange={handleChange}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Read-Only Verified Email */}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                <input
                  type="email"
                  readOnly
                  value={formData.sellerEmail || ""}
                  className="w-full p-4 pl-12 rounded-2xl bg-black/60 border border-slate-800 text-slate-500 cursor-not-allowed text-sm italic"
                />
              </div>

              {/* Location Format Hint */}
              <div className="flex items-center gap-3 text-slate-500 text-xs px-4">
                <MapPin size={14} className="text-blue-500" />
                <span>Format: <strong>Lekki, Lagos</strong></span>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-10 text-2xl font-black uppercase tracking-[0.3em] bg-blue-700 hover:bg-blue-600 rounded-[2rem] transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-2xl shadow-blue-900/20"
          >
            {isSubmitting ? "Processing..." : "Publish to Showroom"}
          </Button>
        </form>
      </div>
    </section>
  );
}
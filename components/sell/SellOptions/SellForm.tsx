"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/controls/Button";
import { toast } from "sonner";
import { Loader2, ShieldCheck, Info } from "lucide-react";

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
  defaultPhone: string;
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

export default function SellForm({ defaultEmail, defaultName, defaultPhone }: SellFormProps) {
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
    // Integrated Location Fields
    country: "Nigeria", 
    state: "",
    city: "",
    // Specs
    drivetrain: undefined,
    bodyType: undefined,
    condition: undefined,
    accidentHistory: false,
    serviceHistory: false,
    currency: "NGN",
    // Immutable Identity Props
    sellerName: defaultName,
    sellerEmail: defaultEmail,
    sellerPhone: defaultPhone,
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

    // --- Strict Validation ---
    if (!formData.thumbnail || formData.images.length === 0) {
      return toast.error("Please upload the required vehicle media.");
    }

    if (!formData.city || !formData.state) {
      return toast.error("Please select a complete showroom location.");
    }

    try {
      setIsSubmitting(true);
      const loadingToast = toast.loading("Uploading high-resolution assets...");

      // 1. Concurrent Image Uploads
      const [thumbnailUrl, ...imageUrls] = await Promise.all([
        uploadImage(formData.thumbnail),
        ...formData.images.map(uploadImage),
      ]);

      // 2. Build Payload
      const payload = {
        ...formData,
        // Ensure identity is pulled from verified props, not state
        sellerName: defaultName,
        sellerPhone: defaultPhone,
        sellerEmail: defaultEmail,
        thumbnail: thumbnailUrl,
        images: imageUrls,
        transmission: normalizeTransmission(formData.transmission),
        fuelType: normalizeFuel(formData.fuelType),
        condition: formData.condition?.toUpperCase(),
      };

      // 3. API Transaction
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
      
      // 4. Reset and Navigation
      setFormData(initialState);
      router.push("/dashboard");
      router.refresh();

    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-[#050505] text-white py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Verified Dealer Branding */}
        <header className="mb-12 space-y-2">
          <div className="flex items-center gap-2 text-blue-500 font-bold tracking-widest text-[10px] uppercase">
            <ShieldCheck size={14} />
            Official Zuta Dealer Network
          </div>
          <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase">
            List <span className="text-blue-600">Vehicle</span>
          </h2>
          <p className="text-slate-500 text-sm md:text-base max-w-lg">
            Showcase your premium inventory. Your verified contact details will be automatically linked to this listing.
          </p>
        </header>

        {/* Cinematic Loading Overlay */}
        {isSubmitting && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-3xl">
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 border-2 border-blue-600/10 rounded-full"></div>
                <div className="absolute inset-0 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-xl font-black tracking-[0.5em] uppercase animate-pulse">Publishing</p>
              <p className="text-slate-600 text-[10px] uppercase mt-2 tracking-widest">Encrypting Media Assets</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* Section: Basic Identity */}
          <div className="bg-slate-900/30 p-6 md:p-10 rounded-[2.5rem] border border-slate-800/50 backdrop-blur-sm">
             <VehicleIdentity
                brand={formData.brand}
                model={formData.model}
                year={formData.year}
                color={formData.color}
                onChange={handleChange}
              />
          </div>

          {/* Section: Technical Specs */}
          <div className="bg-slate-900/30 p-6 md:p-10 rounded-[2.5rem] border border-slate-800/50 backdrop-blur-sm">
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

          {/* Section: Visual Media */}
          <PhotoUploader
            thumbnail={formData.thumbnail}
            images={formData.images}
            onChange={(field, value) => handleChange(field as keyof CarFormData, value)}
          />

          {/* Section: Value & Price */}
          <div className="bg-slate-900/30 p-6 md:p-10 rounded-[2.5rem] border border-slate-800/50 backdrop-blur-sm">
            <PriceSection
              price={formData.price}
              negotiable={formData.negotiable}
              onChange={handleChange}
            />
          </div>

          {/* Section: Automated Location & Seller Info */}
          <div className="bg-slate-900/30 p-6 md:p-10 rounded-[2.5rem] border border-slate-800/50 backdrop-blur-sm space-y-8">
            <SellerSection
              country={formData.country}
              state={formData.state}
              city={formData.city}
              onChange={handleChange}
            />
            
            <div className="pt-6 border-t border-slate-800/40 flex flex-col md:flex-row gap-6 md:items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Verified Listing Agent</span>
                <p className="text-sm text-slate-200 font-medium">{defaultName}</p>
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-[11px] bg-black/40 px-4 py-2 rounded-full border border-slate-800/50">
                <Info size={14} className="text-blue-500" />
                Your registered phone ({defaultPhone}) will be visible to buyers.
              </div>
            </div>
          </div>

          {/* Final Action */}
          <div className="pt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-10 text-2xl font-black uppercase tracking-[0.4em] bg-blue-700 hover:bg-blue-600 rounded-[2rem] transition-all transform hover:scale-[1.01] active:scale-95 shadow-2xl shadow-blue-900/20 border border-blue-400/20"
            >
              {isSubmitting ? "Finalizing..." : "Launch Listing"}
            </Button>
            <p className="text-center text-slate-600 text-[9px] uppercase mt-8 tracking-[0.3em] font-medium opacity-50">
              Zuta Luxury Marketplace • Secure Encryption Active
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/controls/Button";
import { toast } from "sonner";
import { Loader2, Mail, MapPin, ShieldCheck } from "lucide-react";
import { optimizeImage } from "@/utilities/imageOptimzer";
// Form Sections
import VehicleIdentity from "../FormData/VehicleIdentity";
import VehicleSpecs from "../FormData/VehicleSpecs";
import PriceSection from "../FormData/PriceSection";
import PhotoUploader from "../FormData/PhotoUploader";
import SellerSection from "../FormData/SellerSection";

// Utilities & Types
import { CarFormData } from "@/types/car/CarFormData";
import { useUploadThing } from "@/utilities/uploadthing";

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

export default function SellForm({
  defaultEmail,
  defaultName,
  defaultPhone,
}: SellFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Initialize UploadThing hooks for our specific routes
  const { startUpload: uploadThumb } = useUploadThing("carThumbnail");
  const { startUpload: uploadGallery } = useUploadThing("carGallery");

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
    country: "Nigeria",
    state: "",
    city: "",
    drivetrain: undefined,
    bodyType: undefined,
    condition: undefined,
    accidentHistory: false,
    serviceHistory: false,
    currency: "NGN",
    sellerName: defaultName || "",
    sellerPhone: defaultPhone || "08087561986",
    sellerEmail: defaultEmail || "",
  };

  const [formData, setFormData] = useState<CarFormData>(initialState);

  const handleChange = <K extends keyof CarFormData>(
    key: K,
    value: CarFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // --- Validation ---
    if (!formData.thumbnail || formData.images.length === 0) {
      return toast.error("Please upload the required vehicle media.");
    }
    if (!formData.city || !formData.state) {
      return toast.error("Please select a complete showroom location.");
    }

    try {
      setIsSubmitting(true);
      const loadingToast = toast.loading("Syncing assets with Zuta Cloud...");

      const compressedThumb = await optimizeImage(formData.thumbnail!);
      const compressedGallery = await Promise.all(
        formData.images.map((file) => optimizeImage(file)),
      );
      const [thumbRes, galleryRes] = await Promise.all([
        uploadThumb([compressedThumb]),
        uploadGallery(compressedGallery),
      ]);

      const thumbnailUrl = thumbRes?.[0]?.url;
      const imageUrls = galleryRes?.map((file) => file.url) || [];

      if (!thumbnailUrl)
        throw new Error("Thumbnail upload failed. Please try again.");

      const payload = {
        ...formData,

        year: Number(formData.year),
        mileage: Number(formData.mileage),
        price: Number(formData.price),
        transmission: normalizeTransmission(formData.transmission),
        fuelType: normalizeFuel(formData.fuelType),
        condition: formData.condition?.toUpperCase(),
        thumbnail: thumbnailUrl,
        images: imageUrls,
        sellerName: defaultName || "Verified Dealer",
        sellerPhone: defaultPhone || formData.sellerPhone || "08087561986",
        sellerEmail: defaultEmail || "",
      };

      // 4. API Request
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
  useEffect(() => {
    if (isSubmitting) {
      const timer = setTimeout(() => {
        if (isSubmitting) {
          setIsSubmitting(false);
          toast.error(
            "Request timed out. Check your internet or DB connection.",
          );
        }
      }, 30000); // 30 second safety valve
      return () => clearTimeout(timer);
    }
  }, [isSubmitting]);
  return (
    <section className="bg-[#050505] text-white py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-blue-500 font-bold tracking-widest text-[10px] uppercase">
            <ShieldCheck size={14} />
            Official Zuta Dealer Network
          </div>
          <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase">
            List <span className="text-blue-600 font-outline-2">Vehicle</span>
          </h2>
        </header>

        {isSubmitting && (
          <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 backdrop-blur-3xl">
            <div className="text-center">
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-6" />
              <p className="text-2xl font-black tracking-[0.4em] uppercase animate-pulse">
                Publishing
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10 pb-20">
          {/* Identity Section */}
          <div className="bg-slate-900/30 p-8 rounded-[2.5rem] border border-slate-800/50 backdrop-blur-sm relative z-40">
            <VehicleIdentity
              brand={formData.brand}
              model={formData.model}
              year={formData.year}
              color={formData.color}
              onChange={handleChange}
            />
          </div>

          {/* Specs Section */}
          <div className="bg-slate-900/30 p-8 rounded-[2.5rem] border border-slate-800/50 backdrop-blur-sm relative z-30">
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

          <div className="bg-slate-900/30 p-8 rounded-[2.5rem] border border-slate-800/50 backdrop-blur-sm relative z-20">
            <PriceSection
              price={formData.price}
              negotiable={formData.negotiable}
              onChange={handleChange}
            />
          </div>

          <PhotoUploader
            thumbnail={formData.thumbnail}
            images={formData.images}
            onChange={(field, value) =>
              handleChange(field as keyof CarFormData, value)
            }
          />

          <div className="bg-slate-900/30 p-8 rounded-[2.5rem] border border-slate-800/50 backdrop-blur-sm relative z-10">
            <SellerSection
              country={formData.country}
              state={formData.state}
              city={formData.city}
              onChange={handleChange}
            />

            <div className="mt-8 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between gap-6">
              <div className="flex items-center gap-3 bg-black/40 px-6 py-4 rounded-2xl border border-slate-800">
                <Mail className="text-blue-500" size={18} />
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-widest text-slate-500">
                    Verified Contact
                  </span>
                  <span className="text-sm font-medium">{defaultEmail}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-[10px] uppercase tracking-widest px-4">
                <MapPin size={14} className="text-blue-500" />
                Showroom auto-assigned based on location
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-10 text-2xl font-black uppercase tracking-[0.4em] bg-blue-700 hover:bg-blue-600 rounded-[2rem] transition-all transform active:scale-95 shadow-2xl shadow-blue-900/20"
          >
            {isSubmitting ? "Syncing..." : "Launch Listing"}
          </Button>
        </form>
      </div>
    </section>
  );
}

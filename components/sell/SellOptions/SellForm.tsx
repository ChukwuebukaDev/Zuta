"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/controls/Button";
import { toast } from "sonner";
import { Loader2, Mail, MapPin, ShieldCheck, UserCheck } from "lucide-react";
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
  isPrivateUser?: boolean;      // Added
  listingsRemaining?: number;   // Added
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
  isPrivateUser = false,      // Default value
  listingsRemaining = 0,      // Default value
}: SellFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize UploadThing hooks
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
    images: [], // Structurally tracked via positions 0-5
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
    sellerPhone: defaultPhone || "",
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


    if (!formData.thumbnail) {
      return toast.error("Please upload a Main Showroom Cover Image.");
    }

    const mandatoryAngles = ["Front", "Rear", "Left Side", "Right Side", "Interior", "Underneath"];
    for (let i = 0; i < 6; i++) {
      if (!formData.images[i]) {
        return toast.error(`Inspection Blueprint incomplete: Missing your "${mandatoryAngles[i]}" photo.`);
      }
    }

    if (!formData.city || !formData.state) {
      return toast.error("Please select a complete showroom location.");
    }
    let loadingToastId: string | number | null = null;

    try {
      setIsSubmitting(true);
      loadingToastId = toast.loading("Syncing inspection assets with Zuta Cloud...");

      const compressedThumb = await optimizeImage(formData.thumbnail!);
      
      const compressedGallery = await Promise.all(
        formData.images.map(async (file) => {
          if (!file) return null;
          return await optimizeImage(file);
        })
      );

      const activeGalleryFiles = compressedGallery.filter((file): file is File => file !== null);

      // Execute upload parallel batches
      const [thumbRes, galleryRes] = await Promise.all([
        uploadThumb([compressedThumb]),
        uploadGallery(activeGalleryFiles),
      ]);

      const thumbnailUrl = thumbRes?.[0]?.url;
      const imageUrls = galleryRes?.map((file) => file.url) || [];

      if (!thumbnailUrl) {
        throw new Error("Thumbnail upload failed. Connection timed out.");
      }

      // 3. Construct Data Payload matching Zod API boundaries
      const payload = {
        brand: formData.brand,
        model: formData.model,
        color: formData.color,
        year: Number(formData.year),
        mileage: Number(formData.mileage),
        price: Number(formData.price),
        bodyType: formData.bodyType,
        drivetrain: formData.drivetrain,
        transmission: normalizeTransmission(formData.transmission),
        fuelType: normalizeFuel(formData.fuelType),
        condition: formData.condition?.toUpperCase() || "USED",
        accidentHistory: Boolean(formData.accidentHistory),
        serviceHistory: Boolean(formData.serviceHistory),
        negotiable: Boolean(formData.negotiable),
        thumbnail: thumbnailUrl,
        images: imageUrls, // Order is safely maintained 0 through 5
        sellerName: formData.sellerName || (isPrivateUser ? "Private Seller" : "Verified Dealer"),
        sellerPhone: formData.sellerPhone,
        sellerEmail: formData.sellerEmail || null,
        city: formData.city,
        state: formData.state,
        country: formData.country,
      };

      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => {
          reject(new Error("Request timed out. Check your internet connection."));
        }, 30000),
      );

      const res: Response = await Promise.race([
        fetch("/api/cars", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
        timeout,
      ]);

      if (res.ok) {
        toast.success("Listing submitted for review!", {
          description: isPrivateUser 
            ? "Your private listing is live! Slot limit has been updated."
            : "Zuta administrators will verify inspection logs within 24 hours.",
          duration: 5000,
        });
        
        router.push(isPrivateUser ? "/profile" : "/dashboard");
        router.refresh();
      } else {
        const errData = await res.json().catch(() => ({}));
        const errText = errData.error || await res.text();
        throw new Error(errText || "Database rejected form payload data properties.");
      }
    } catch (error) {
      console.error("FORM_SUBMIT_ERROR:", error);
      const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
      toast.error(errorMessage);
    } finally {

      if (loadingToastId !== null) {
        toast.dismiss(loadingToastId);
      }
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-[#050505] text-white py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 space-y-2 text-center md:text-left">
          {/* UPDATED: Dynamic visual header badge depending on seller type */}
          {isPrivateUser ? (
            <div className="flex items-center justify-center md:justify-start gap-2 text-amber-500 font-bold tracking-widest text-[10px] uppercase">
              <UserCheck size={14} />
              Private Seller Marketplace Profile
            </div>
          ) : (
            <div className="flex items-center justify-center md:justify-start gap-2 text-blue-500 font-bold tracking-widest text-[10px] uppercase">
              <ShieldCheck size={14} />
              Official Zuta Dealer Network
            </div>
          )}
          
          <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase">
            List <span className={isPrivateUser ? "text-amber-500" : "text-blue-600 font-outline-2"}>Vehicle</span>
          </h2>
        </header>

        {isSubmitting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-3xl">
            <div className="text-center">
              <Loader2 className={`w-16 h-16 animate-spin mx-auto mb-6 ${isPrivateUser ? "text-amber-500" : "text-blue-600"}`} />
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

          {/* Price Section */}
          <div className="bg-slate-900/30 p-8 rounded-[2.5rem] border border-slate-800/50 backdrop-blur-sm relative z-20">
            <PriceSection
              price={formData.price}
              negotiable={formData.negotiable}
              onChange={handleChange}
            />
          </div>

          {/* Core Structured Media Perspective Matrix Component Slot */}
          <PhotoUploader
            thumbnail={formData.thumbnail}
            images={formData.images}
            onChange={(field, value) =>
              handleChange(field as keyof CarFormData, value)
            }
          />

          {/* Seller Data Info Block */}
          <div className="bg-slate-900/30 p-8 rounded-[2.5rem] border border-slate-800/50 backdrop-blur-sm relative z-10">
            <SellerSection
              country={formData.country}
              state={formData.state}
              city={formData.city}
              onChange={handleChange}
            />

            <div className="mt-8 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between gap-6">
              <div className="flex items-center gap-3 bg-black/40 px-6 py-4 rounded-2xl border border-slate-800">
                <Mail className={isPrivateUser ? "text-amber-500" : "text-blue-500"} size={18} />
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-widest text-slate-500">
                    Verified Contact
                  </span>
                  <span className="text-sm font-medium">{defaultEmail}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-[10px] uppercase tracking-widest px-4">
                <MapPin size={14} className={isPrivateUser ? "text-amber-500" : "text-blue-500"} />
                Showroom auto-assigned based on location
              </div>
            </div>
          </div>

          {/* Dynamic Action Trigger Button */}
          <div className="space-y-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-10 text-2xl font-black uppercase tracking-[0.4em] rounded-[2rem] transition-all transform active:scale-95 shadow-2xl ${
                isPrivateUser 
                  ? "bg-amber-500 hover:bg-amber-600 text-black shadow-amber-900/10" 
                  : "bg-blue-700 hover:bg-blue-600  shadow-blue-900/20"
              }`}
            >
              {isSubmitting ? "Syncing..." : "Launch Listing"}
            </Button>
            
            {/* UPDATED: Private seller remaining slot alert */}
            {isPrivateUser && (
              <p className="text-center text-xs text-neutral-500 font-medium tracking-wide">
                Publishing this vehicle will use <span className="text-amber-500 font-bold">1</span> of your <span className="text-white font-semibold">{listingsRemaining} remaining</span> free private listing slots.
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
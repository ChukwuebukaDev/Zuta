"use client";

import { useState } from "react";
import { Button } from "@/components/ui/controls/Button";
import { toast } from "sonner";

import VehicleIdentity from "../FormData/VehicleIdentity";
import VehicleSpecs from "../FormData/VehicleSpecs";
import PriceSection from "../FormData/PriceSection";
import PhotoUploader from "../FormData/PhotoUploader";
import SellerSection from "../FormData/SellerSection";

import { CarFormData } from "@/types/car/CarFormData";
import {uploadImage} from "@/utilities/uploadImage";
import { color } from "framer-motion";

const normalizeTransmission = (v?: string) =>
  v === "automatic" ? "AUTOMATIC" : "MANUAL";

const normalizeFuel = (v?: string) => {
  switch (v) {
    case "petrol":
      return "PETROL";
    case "diesel":
      return "DIESEL";
    case "electric":
      return "ELECTRIC";
    case "hybrid":
      return "HYBRID";
    default:
      return undefined;
  }
};

export default function SellForm() {
  const initialState: CarFormData = {
    brand: "",
    model: "",
    color: "",
    year: 0,
    mileage: 0,
    transmission: "automatic",
    fuelType: "petrol",
    price: 0,
    negotiable: false,
    thumbnail: null,
    images: [],
    sellerName: "",
    sellerPhone: "",
    location: "",
    drivetrain: undefined,
    bodyType: undefined,
    condition: undefined,
    accidentHistory: undefined,
    serviceHistory: undefined,
    currency: "NGN",
    sellerEmail: undefined,
  };

  const [formData, setFormData] = useState<CarFormData>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = <K extends keyof CarFormData>(
    key: K,
    value: CarFormData[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.thumbnail || formData.images.length === 0) {
      toast.error("Please upload images");
      return;
    }

    if (!formData.bodyType || !formData.drivetrain || !formData.condition) {
      toast.error("Please complete all vehicle specifications");
      return;
    }

    try {
      setIsSubmitting(true);

      const snapshot = { ...formData };

      const thumbnailUrl = await uploadImage(formData.thumbnail);
      const imageUrls = await Promise.all(formData.images.map(uploadImage));
      
      const payload = {
        brand: snapshot.brand,
        model: snapshot.model,
        year: snapshot.year,
        color: snapshot.color,
        mileage: snapshot.mileage,

        transmission: normalizeTransmission(snapshot.transmission),
        fuelType: normalizeFuel(snapshot.fuelType),
        condition: snapshot.condition?.toUpperCase(),

        bodyType: snapshot.bodyType,
        drivetrain: snapshot.drivetrain,

        price: snapshot.price,
        negotiable: snapshot.negotiable,

        thumbnail: thumbnailUrl,
        images: imageUrls,

        sellerName: snapshot.sellerName,
        sellerPhone: snapshot.sellerPhone,
        sellerEmail: snapshot.sellerEmail,
        location: snapshot.location,

        accidentHistory: snapshot.accidentHistory,
        serviceHistory: snapshot.serviceHistory,
       
      };
      const res = await fetch("/api/cars", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok) {
        console.error("SERVER STATUS:", res.status);
        console.error("SERVER RESPONSE:", data);
        throw new Error(data.error || "Failed to create listing");
      }

      toast.success("Car listed successfully!");
      setFormData(initialState);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }

  };

  return (
    <section className="bg-[#0f0f0f] text-white py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
          Start Your Listing
        </h2>

        {isSubmitting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
              <p className="text-lg font-medium">Uploading your car...</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <VehicleIdentity
            brand={formData.brand}
            model={formData.model}
            year={formData.year}
            color={formData.color}
            onChange={handleChange}
          />

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

          <PriceSection
            price={formData.price}
            negotiable={formData.negotiable}
            onChange={handleChange}
          />

          <PhotoUploader
            thumbnail={formData.thumbnail}
            images={formData.images}
            onChange={(field, value) =>
              setFormData((prev) => ({
                ...prev,
                [field]: value,
              }))
            }
          />

          <SellerSection
            sellerName={formData.sellerName}
            sellerPhone={formData.sellerPhone}
            location={formData.location}
            onChange={handleChange}
          />

          <input
            type="email"
            placeholder="Seller Email (optional)"
            value={formData.sellerEmail || ""}
            onChange={(e) =>
              handleChange("sellerEmail", e.target.value || undefined)
            }
            className="w-full p-4 rounded-lg bg-[#1a1a1a] border border-gray-800"
          />

          <Button
            type="submit"
            disabled={isSubmitting}       
            className="w-full py-6 text-lg mt-6"
          >
            {isSubmitting ? "Uploading..." : "Submit Listing"}
          </Button>
        </form>
      </div>
    </section>
  );
}
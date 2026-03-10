"use client";

import { useState } from "react";
import { Button } from "@/components/UI/Controls/Button";
import { toast } from "sonner";

import VehicleIdentity from "../FormData/VehicleIdentity";
import VehicleSpecs from "../FormData/VehicleSpecs";
import PriceSection from "../FormData/PriceSection";
import PhotoUploader from "../FormData/PhotoUploader";
import SellerSection from "../FormData/SellerSection";

export type CarFormData = {
  brand: string;
  model: string;
  year: string;
  mileage: string;
  transmission: string;
  fuelType: string;
  price: string;
  negotiable: boolean;
  mainImage: File | null;
  galleryImages: File[];
  sellerName: string;
  sellerPhone: string;
  location: string;
};

export default function SellForm() {
  const [formData, setFormData] = useState<CarFormData>({
    brand: "",
    model: "",
    year: "",
    mileage: "",
    transmission: "",
    fuelType: "",
    price: "",
    negotiable: false,
    mainImage: null,
    galleryImages: [],
    sellerName: "",
    sellerPhone: "",
    location: "",
  });

  // Generic field updater for all components
  const handleChange = <K extends keyof CarFormData>(
    key: K,
    value: CarFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }

      toast.success("Car listed successfully!");
      setFormData({
        brand: "",
        model: "",
        year: "",
        mileage: "",
        transmission: "",
        fuelType: "",
        price: "",
        negotiable: false,
        mainImage: null,
        galleryImages: [],
        sellerName: "",
        sellerPhone: "",
        location: "",
      });
    } catch (error: any) {
      toast.error("Error: " + error.message);
    }
  };

  return (
    <section id="sell-form" className="bg-[#0f0f0f] text-white py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
          Start Your Listing
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Vehicle Identity */}
          <VehicleIdentity
            brand={formData.brand}
            model={formData.model}
            year={formData.year}
            onChange={handleChange}
          />

          {/* Vehicle Specs */}
          <VehicleSpecs
            mileage={formData.mileage}
            transmission={formData.transmission}
            fuelType={formData.fuelType}
            onChange={handleChange}
          />

          {/* Pricing */}
          <PriceSection
            price={formData.price}
            negotiable={formData.negotiable}
            onChange={handleChange}
          />

          {/* Photos */}
          <PhotoUploader
            mainImage={formData.mainImage}
            galleryImages={formData.galleryImages}
            onChange={handleChange}
          />

          {/* Seller Info */}
          <SellerSection
            sellerName={formData.sellerName}
            sellerPhone={formData.sellerPhone}
            location={formData.location}
            onChange={handleChange}
          />

          <Button type="submit" className="w-full py-6 text-lg mt-6">
            Submit Listing
          </Button>
        </form>
      </div>
    </section>
  );
}

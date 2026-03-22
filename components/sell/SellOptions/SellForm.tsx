"use client";

import { useState } from "react";
import { Button } from "@/components/UI/Controls/Button";
import { toast } from "sonner";

import VehicleIdentity from "../FormData/VehicleIdentity";
import VehicleSpecs from "../FormData/VehicleSpecs";
import PriceSection from "../FormData/PriceSection";
import PhotoUploader from "../FormData/PhotoUploader";
import SellerSection from "../FormData/SellerSection";
import { CarFormData } from "@/types/car/CarFormData";
import { uploadImage } from "@/utilities/uploadImage";

export default function SellForm() {
  const [formData, setFormData] = useState<CarFormData>({
    brand: "",
    model: "",
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
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = <K extends keyof CarFormData>(
    key: K,
    value: CarFormData[K] | string | null,
  ) => {
    // Convert "Yes"/"No" to boolean for boolean fields
    const booleanKeys: (keyof CarFormData)[] = [
      "serviceHistory",
      "accidentHistory",
    ];
    if (booleanKeys.includes(key)) {
      setFormData((prev) => ({
        ...prev,
        [key]: value === "Yes" ? true : value === "No" ? false : undefined,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.thumbnail || formData.images.length === 0) {
      toast.error("Please upload images");
      return;
    }

    // ✅ SNAPSHOT DATA
    const currentData = { ...formData };

    try {
      setIsSubmitting(true);

      const thumbnailFile = currentData.thumbnail as File;
      const images = currentData.images;

      const thumbnailUrl = await uploadImage(thumbnailFile);
      const imagesUrls = await Promise.all(
        images.map((file) => uploadImage(file)),
      );

      const payload = {
        ...currentData,
        thumbnail: thumbnailUrl,
        images: imagesUrls,
      };

      const res = await fetch("/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      console.log("payload", payload);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }

      toast.success("Car listed successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
    setFormData({
      brand: "",
      model: "",
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
    });
  };

  return (
    <section id="sell-form" className="bg-[#0f0f0f] text-white py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
          Start Your Listing
        </h2>
        {isSubmitting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
              {/* Spinner */}
              <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />

              {/* Text */}
              <p className="text-white text-lg font-medium">
                Uploading your car...
              </p>
            </div>
          </div>
        )}
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
            drivetrain={formData.drivetrain}
            bodyType={formData.bodyType}
            condition={formData.condition}
            accidentHistory={formData.accidentHistory}
            serviceHistory={formData.serviceHistory}
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
            thumbnail={formData.thumbnail}
            images={formData.images}
            onChange={(field, value) =>
              setFormData((prev) => ({
                ...prev,
                [field]: value,
              }))
            }
          />

          {/* Seller Info */}
          <SellerSection
            sellerName={formData.sellerName}
            sellerPhone={formData.sellerPhone}
            location={formData.location}
            onChange={handleChange}
          />
          <div className="grid md:grid-cols-1 gap-6">
            <input
              type="email"
              placeholder="Seller Email (optional)"
              value={formData.sellerEmail || ""}
              onChange={(e) => handleChange("sellerEmail", e.target.value)}
              className="p-4 rounded-lg bg-[#1a1a1a] border border-gray-800 text-white"
            />
          </div>
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

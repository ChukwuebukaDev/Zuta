"use client";

import { useState } from "react";
import { Button } from "../UI/Controls/Button";

type CarFormData = {
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

  const handleChange = (key: keyof CarFormData, value: any) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit to /api/cars
    console.log(formData);
    alert("Form submitted! (API integration coming next)");
  };

  return (
    <section className="bg-[#0f0f0f] text-white py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
          Start Your Listing
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Car Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Brand"
              value={formData.brand}
              onChange={(e) => handleChange("brand", e.target.value)}
              className="p-4 rounded-lg bg-[#1a1a1a] border border-gray-800 text-white"
              required
            />
            <input
              type="text"
              placeholder="Model"
              value={formData.model}
              onChange={(e) => handleChange("model", e.target.value)}
              className="p-4 rounded-lg bg-[#1a1a1a] border border-gray-800 text-white"
              required
            />
            <input
              type="number"
              placeholder="Year"
              value={formData.year}
              onChange={(e) => handleChange("year", e.target.value)}
              className="p-4 rounded-lg bg-[#1a1a1a] border border-gray-800 text-white"
              required
            />
            <input
              type="text"
              placeholder="Mileage"
              value={formData.mileage}
              onChange={(e) => handleChange("mileage", e.target.value)}
              className="p-4 rounded-lg bg-[#1a1a1a] border border-gray-800 text-white"
            />
            <input
              type="text"
              placeholder="Transmission"
              value={formData.transmission}
              onChange={(e) => handleChange("transmission", e.target.value)}
              className="p-4 rounded-lg bg-[#1a1a1a] border border-gray-800 text-white"
            />
            <input
              type="text"
              placeholder="Fuel Type"
              value={formData.fuelType}
              onChange={(e) => handleChange("fuelType", e.target.value)}
              className="p-4 rounded-lg bg-[#1a1a1a] border border-gray-800 text-white"
            />
          </div>

          {/* Pricing */}
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <input
              type="number"
              placeholder="Price (₦)"
              value={formData.price}
              onChange={(e) => handleChange("price", e.target.value)}
              className="p-4 rounded-lg bg-[#1a1a1a] border border-gray-800 text-white"
              required
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.negotiable}
                onChange={(e) => handleChange("negotiable", e.target.checked)}
              />
              Negotiable
            </label>
          </div>

          {/* Media Upload */}
          <div className="grid md:grid-cols-2 gap-6">
            <label className="flex flex-col">
              Main Image
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleChange("mainImage", e.target.files?.[0] || null)
                }
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
                  handleChange(
                    "galleryImages",
                    e.target.files ? Array.from(e.target.files) : []
                  )
                }
                className="mt-2 text-gray-200"
              />
            </label>
          </div>

          {/* Seller Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Your Name"
              value={formData.sellerName}
              onChange={(e) => handleChange("sellerName", e.target.value)}
              className="p-4 rounded-lg bg-[#1a1a1a] border border-gray-800 text-white"
              required
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={formData.sellerPhone}
              onChange={(e) => handleChange("sellerPhone", e.target.value)}
              className="p-4 rounded-lg bg-[#1a1a1a] border border-gray-800 text-white"
              required
            />
            <input
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className="p-4 rounded-lg bg-[#1a1a1a] border border-gray-800 text-white"
              required
            />
          </div>

          <Button type="submit" className="w-full py-6 text-lg mt-6">
            Submit Listing
          </Button>
        </form>
      </div>
    </section>
  );
}
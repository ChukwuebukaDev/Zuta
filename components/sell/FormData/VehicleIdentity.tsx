// components/sell/FormData/VehicleIdentity.tsx
"use client";

import { CarFront } from "lucide-react";
import BrandSelect from "@/components/ui/Filter/cars/BrandSelect";
import ModelSelect from "@/components/ui/Filter/cars/ModelSelect";
import Dropdown from "@/utilities/Dropdown";
import { CarFormData } from "@/types/car/CarFormData";

// We define the props to match exactly what the SellForm has in its state
export interface VehicleIdentityProps {
  brand: string;
  model: string;
  year: number;
  color: string;
  // This signature must match the SellForm's handleChange
  onChange: <K extends keyof CarFormData>(
    field: K,
    value: CarFormData[K],
  ) => void;
}

export default function VehicleIdentity({
  brand,
  model,
  year,
  color,
  onChange,
}: VehicleIdentityProps) {
  const handleBrandChange = (value: string) => {
    onChange("brand", value);
    onChange("model", "");
  };

  const years = Array.from(
    { length: new Date().getFullYear() - 1990 + 1 },
    (_, i) => (new Date().getFullYear() - i).toString(),
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 mb-2 text-blue-500">
        <CarFront size={18} />
        <span className="text-sm font-bold uppercase tracking-widest">
          Vehicle Identity
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <BrandSelect value={brand} onChange={handleBrandChange} />

        <ModelSelect
          brand={brand}
          value={model}
          onChange={(value) => onChange("model", value)}
        />

        <Dropdown
          options={years}
          value={year ? String(year) : ""}
          placeholder="Year"
          onChange={(val) => onChange("year", Number(val))}
        />

        <Dropdown
          options={["Black", "White", "Silver", "Gray", "Blue", "Red"]}
          value={color}
          placeholder="Color"
          onChange={(val) => onChange("color", val)}
        />
      </div>
    </div>
  );
}

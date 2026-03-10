"use client";

type Props = {
  mileage: string;
  transmission: string;
  fuelType: string;
  onChange: (
    field: "mileage" | "transmission" | "fuelType",
    value: string,
  ) => void;
};

export default function VehicleSpecs({
  mileage,
  transmission,
  fuelType,
  onChange,
}: Props) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <input
        type="text"
        placeholder="Mileage"
        value={mileage}
        onChange={(e) => onChange("mileage", e.target.value)}
        className="p-4 rounded-lg bg-[#1a1a1a] border border-gray-800 text-white"
      />
      <select
        value={transmission}
        onChange={(e) => onChange("transmission", e.target.value)}
        className="p-4 rounded-lg bg-[#1a1a1a] border border-gray-800 text-white"
        required
      >
        <option value="">Transmission</option>
        <option value="Automatic">Automatic</option>
        <option value="Manual">Manual</option>
      </select>
      <select
        value={fuelType}
        onChange={(e) => onChange("fuelType", e.target.value)}
        className="p-4 rounded-lg bg-[#1a1a1a] border border-gray-800 text-white"
        required
      >
        <option value="">Fuel Type</option>
        <option value="Petrol">Petrol</option>
        <option value="Diesel">Diesel</option>
        <option value="Hybrid">Hybrid</option>
        <option value="Electric">Electric</option>
      </select>
    </div>
  );
}

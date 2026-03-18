"use client";
import Dropdown from "@/utilities/Dropdown";

type Props = {
  mileage: number;
  transmission: string;
  fuelType: string;
  drivetrain?: string;
  bodyType?: string;
  condition?: string;
  accidentHistory?: boolean;
  serviceHistory?: boolean;
  onChange: (
    field:
      | "mileage"
      | "transmission"
      | "fuelType"
      | "condition"
      | "drivetrain"
      | "bodyType"
      | "accidentHistory"
      | "serviceHistory",
    value: number | string,
  ) => void;
};

export default function VehicleSpecs({
  mileage,
  transmission,
  fuelType,
  drivetrain,
  bodyType,
  condition,
  accidentHistory,
  serviceHistory,
  onChange,
}: Props) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Mileage input */}
      <input
        type="number"
        placeholder="Mileage"
        value={mileage}
        onChange={(e) => onChange("mileage", Number(e.target.value))}
        className="p-4 rounded-lg bg-[#1a1a1a] border border-gray-800 text-white"
      />

      {/* Transmission dropdown */}
      <Dropdown
        options={["automatic", "manual"]}
        value={transmission}
        placeholder="Transmission"
        onChange={(val) => onChange("transmission", val)}
      />

      {/* Fuel type dropdown */}
      <Dropdown
        options={["petrol", "diesel", "electric", "hybrid"]}
        value={fuelType}
        placeholder="Fuel Type"
        onChange={(val) => onChange("fuelType", val)}
      />

      {/* Drivetrain */}
      <Dropdown
        options={["FWD", "RWD", "AWD"]}
        value={drivetrain || ""}
        placeholder="Drivetrain"
        onChange={(val) => onChange("drivetrain", val)}
      />

      {/* Body Type */}
      <Dropdown
        options={["Sedan", "SUV", "Hatchback", "Coupe", "Truck"]}
        value={bodyType || ""}
        placeholder="Body Type"
        onChange={(val) => onChange("bodyType", val)}
      />

      {/* Condition */}
      <Dropdown
        options={["New", "Used", "Certified"]}
        value={condition || ""}
        placeholder="Condition"
        onChange={(val) => onChange("condition", val)}
      />

      {/* Accident History */}
      <Dropdown
        options={["Yes", "No"]}
        value={
          accidentHistory === undefined ? "" : accidentHistory ? "Yes" : "No"
        }
        placeholder="Accident History"
        onChange={(val) => onChange("accidentHistory", val)}
      />

      {/* Service History */}
      <Dropdown
        options={["Yes", "No"]}
        value={
          serviceHistory === undefined ? "" : serviceHistory ? "Yes" : "No"
        }
        placeholder="Service History"
        onChange={(val) => onChange("serviceHistory", val)}
      />
    </div>
  );
}

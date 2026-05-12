"use client";

import { Gauge, Settings2, Fuel, Drill, Car, History, Activity } from "lucide-react";
import Dropdown from "@/utilities/Dropdown";
import { CarFormData } from "@/types/car/CarFormData";
import {
  Transmission,
  FuelType,
  Drivetrain,
  BodyType,
  CarCondition,
} from "@/types/car/car.enums";

type Props = {
  mileage: number;
  transmission: Transmission;
  fuelType: FuelType;
  drivetrain?: Drivetrain;
  bodyType?: BodyType;
  condition?: CarCondition;
  accidentHistory?: boolean;
  serviceHistory?: boolean;
  onChange: <K extends keyof CarFormData>(field: K, value: CarFormData[K]) => void;
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
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-2 text-blue-500">
        <Settings2 size={18} />
        <span className="text-sm font-bold uppercase tracking-widest">Technical Specifications</span>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Mileage Input */}
        <div className="relative group">
          <Gauge className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input
            type="number"
            placeholder="Mileage (km)"
            value={mileage || ""} // Prevents uncontrolled warning
            onChange={(e) => onChange("mileage", Number(e.target.value))}
            className="w-full p-4 pl-12 rounded-xl bg-black border border-slate-800 focus:border-blue-500/50 outline-none text-white transition-all appearance-none"
          />
        </div>

        {/* Transmission */}
        <div className="relative">
          <Dropdown
            options={["automatic", "manual"]}
            value={transmission}
            placeholder="Transmission"
            onChange={(val) => onChange("transmission", val as Transmission)}
          />
        </div>

        {/* Fuel Type */}
        <div className="relative">
          <Dropdown
            options={["petrol", "diesel", "electric", "hybrid"]}
            value={fuelType}
            placeholder="Fuel Type"
            onChange={(val) => onChange("fuelType", val as FuelType)}
          />
        </div>

        {/* Drivetrain */}
        <div className="relative">
          <Dropdown
            options={["FWD", "RWD", "AWD"]}
            value={drivetrain || ""}
            placeholder="Drivetrain"
            onChange={(val) => onChange("drivetrain", val as Drivetrain)}
          />
        </div>

        {/* Body Type */}
        <div className="relative">
          <Dropdown
            options={["Sedan", "SUV", "Hatchback", "Coupe", "Truck"]}
            value={bodyType || ""}
            placeholder="Body Type"
            onChange={(val) => onChange("bodyType", val as BodyType)}
          />
        </div>

        {/* Condition */}
        <div className="relative">
          <Dropdown
            options={["New", "Used", "Certified"]}
            value={condition || ""}
            placeholder="Condition"
            onChange={(val) => onChange("condition", val as CarCondition)}
          />
        </div>

        {/* Accident History */}
        <div className="relative">
          <Dropdown
            options={["Yes", "No"]}
            value={accidentHistory === undefined ? "" : accidentHistory ? "Yes" : "No"}
            placeholder="Accident History"
            onChange={(val) => onChange("accidentHistory", val === 'Yes')}
          />
        </div>

        {/* Service History */}
        <div className="relative">
          <Dropdown
            options={["Yes", "No"]}
            value={serviceHistory === undefined ? "" : serviceHistory ? "Yes" : "No"}
            placeholder="Service History"
            onChange={(val) => onChange("serviceHistory", val === 'Yes')}
          />
        </div>
      </div>
      
      {/* Small design hint for the dealer */}
      <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-tighter px-2">
        <Activity size={12} className="text-blue-500" />
        Ensure all technical data is verified via the vehicle's logbook.
      </div>
    </div>
  );
}
"use client";

import { Gauge, Settings2, Activity } from "lucide-react";
import Dropdown from "@/utilities/Dropdown";
import { CarFormData } from "@/types/car/CarFormData";
import { useEffect,useState } from "react";
import {
  Transmission,
  FuelType,
  BodyType,
  Condition,
  DriveTrain
} from "@prisma/client";
import {getCommonTrims,DOOR_OPTIONS,ENGINE_SIZES,getEngineCode,FUEL_TYPES,DrivetrainOptions,TRANSMISSION_TYPES} from "@/constants/carspecs";

type Props = {
  vehicleSpecsDetails: {
   brand: string;
  mileage: number;
  transmission: Transmission;
  engineSize?: string;
  doorOptions?: number | null;
  fuelType: FuelType;
  trim?: string;
  engineCode?:string;
  drivetrain?: DriveTrain
  bodyType?: BodyType;
  condition?: Condition;
  accidentHistory?: boolean;
  serviceHistory?: boolean;
  onChange: <K extends keyof CarFormData>(field: K, value: CarFormData[K]) => void;
  }
};


export default function VehicleSpecs({
  vehicleSpecsDetails
}: Props) {
  const {
    brand,
    mileage,
    transmission,
    engineSize,
    doorOptions,
    fuelType,
    trim,
    engineCode,
    drivetrain,
    bodyType,
    condition,
    accidentHistory,
    serviceHistory,
    onChange,
  } = vehicleSpecsDetails;

  const [availableTrims, setAvailableTrims] = useState<string[]>([]);
  const [availableEngineCodes, setAvailableEngneCodes] = useState<string[]>([]);
useEffect(()=>{
  const trims = getCommonTrims(brand);
  const engineCodes = getEngineCode(brand);
  setTimeout(()=>{
    setAvailableTrims(trims);
    setAvailableEngneCodes(engineCodes);
  },0)
},[brand])
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
            value={mileage || ""} 
            onChange={(e) => onChange("mileage", Number(e.target.value))}
            className="w-full p-4 pl-12 h-14 rounded-xl bg-black border border-slate-800 focus:border-blue-500/50 outline-none text-white transition-all appearance-none text-sm"
          />
        </div>

        {/* Transmission */}
        <div className="relative">
          <Dropdown
            options={TRANSMISSION_TYPES}
            value={transmission}
            placeholder="Transmission"
            onChange={(val) => onChange("transmission", val as Transmission)}
          />
        </div>

        {/* Fuel Type */}
        <div className="relative">
          <Dropdown
            options={FUEL_TYPES}
            value={fuelType}
            placeholder="Fuel Type"
            onChange={(val) => onChange("fuelType", val as FuelType)}
          />
        </div>

        {/* Drivetrain */}
        <div className="relative">
          <Dropdown
            options={DrivetrainOptions}
            value={drivetrain || ""}
            placeholder="Drivetrain"
            onChange={(val) => onChange("drivetrain", val as "FWD" | "RWD" | "AWD" | "FOUR_WD")}
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
            options={["New", "Local Used", "Foreign Used"]}
            value={condition || ""}
            placeholder="Condition"
            onChange={(val) => onChange("condition", val as Condition)}
          />
        </div>
        <div className="relative">
          <Dropdown
            options={availableTrims}
            value={trim || ""}
            placeholder="Trim Level"
            onChange={(val) => onChange("trim", val as string)}
          />
        </div>
        <div className="relative">
          <Dropdown
            options={availableEngineCodes}
            value={engineCode || ""}
            placeholder="Engine Code"
            onChange={(val) => onChange("engineCode", val as string)}
          />
        </div>
        <div className="relative">
          <Dropdown
            options={DOOR_OPTIONS.map(String)}
            value={doorOptions || ''}
            placeholder="Door Options"
            onChange={(val) => onChange("doorOptions", Number(val))}
          />
        </div>
        <div className="relative">
          <Dropdown
            options={ENGINE_SIZES}
            value={engineSize || ""}
            placeholder="Engine Size"
            onChange={(val) => onChange("engineSize", val as string)}
          />
        </div>

      </div>

      {/* Binary Choice Grid Section */}
      <div className="grid md:grid-cols-2 gap-6 pt-2">
        {/* Accident History Choice Card */}
        <div className="space-y-3">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">
            Has this vehicle been in any documented accidents?
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onChange("accidentHistory", true)}
              className={`h-14 rounded-xl font-bold uppercase tracking-wider text-xs border transition-all ${
                accidentHistory === true
                  ? "border-red-500/40 bg-red-500/10 text-red-400 shadow-lg"
                  : "border-slate-800 bg-black/40 text-slate-400 hover:border-slate-700"
              }`}
            >
              Yes, it has history
            </button>
            <button
              type="button"
              onClick={() => onChange("accidentHistory", false)}
              className={`h-14 rounded-xl font-bold uppercase tracking-wider text-xs border transition-all ${
                accidentHistory === false
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 shadow-lg"
                  : "border-slate-800 bg-black/40 text-slate-400 hover:border-slate-700"
              }`}
            >
              No, entirely clean
            </button>
          </div>
        </div>

        {/* Service History Choice Card */}
        <div className="space-y-3">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">
            Is the vehicle&apos;s full service history available?
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onChange("serviceHistory", true)}
              className={`h-14 rounded-xl font-bold uppercase tracking-wider text-xs border transition-all ${
                serviceHistory === true
                  ? "border-blue-500/40 bg-blue-500/10 text-blue-400 shadow-lg"
                  : "border-slate-800 bg-black/40 text-slate-400 hover:border-slate-700"
              }`}
            >
              Yes, fully logged
            </button>
            <button
              type="button"
              onClick={() => onChange("serviceHistory", false)}
              className={`h-14 rounded-xl font-bold uppercase tracking-wider text-xs border transition-all ${
                serviceHistory === false
                  ? "border-amber-500/40 bg-amber-500/10 text-amber-400 shadow-lg"
                  : "border-slate-800 bg-black/40 text-slate-400 hover:border-slate-700"
              }`}
            >
              No, incomplete
            </button>
          </div>
        </div>
      </div>
      
      {/* Small design hint for the dealer */}
      <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-tighter px-2 pt-2">
        <Activity size={12} className="text-blue-500" />
        Ensure all technical data is verified via the vehicle&apos;s logbook.
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { Sliders, Activity, Gauge, Disc, HelpCircle } from "lucide-react";
import SelectMenu from "@/utilities/SelectMenu";
import BrandSelect from "@/components/ui/Filter/cars/BrandSelect";
import ModelSelect from "@/components/ui/Filter/cars/ModelSelect";

export default function SpecLookupWidget() {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [displaySpecs, setDisplaySpecs] = useState<any | null>(null);

  const currentYear = new Date().getFullYear();
  const yearsList = Array.from({ length: currentYear - 1999 }, (_, i) => String(currentYear - i));

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    setSelectedModel("");
    setDisplaySpecs(null);
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    if (selectedBrand && model && selectedYear) {
      compileVehicleMetadata(selectedBrand, model, selectedYear);
    }
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    if (selectedBrand && selectedModel && year) {
      compileVehicleMetadata(selectedBrand, selectedModel, year);
    }
  };

  const compileVehicleMetadata = (brand: string, model: string, year: string) => {
    const normalizedBrand = brand.toUpperCase();
    const normalizedModel = model.toUpperCase();

    let bodyType = "Premium Sedan";
    let driveType = "FWD / Layout Matrix";
    let engineProfile = "2.0L Inline-4 Engine";
    let fuelType = "Gasoline / Petrol";

    if (normalizedBrand.includes("BMW") || normalizedBrand.includes("MERCEDES") || normalizedBrand.includes("LEXUS")) {
      driveType = "RWD / Performance Tuned";
      bodyType = "Luxury Sport Segment";
    }

    if (normalizedModel.includes("PRADO") || normalizedModel.includes("CRUISER") || normalizedModel.includes("ROVER") || normalizedModel.includes("WRANGLER") || normalizedModel.includes("G-WAGON")) {
      driveType = "4WD / Heavy Duty Locker";
      bodyType = "Full-Size Utility SUV";
      engineProfile = "3.5L V6 Twin-Turbo";
    }

    if (normalizedModel.includes("TESLA") || normalizedModel.includes("E-TRON") || normalizedModel.includes("TAYCAN") || normalizedModel.includes("IONIQ")) {
      fuelType = "EV / Pure Electric Matrix";
      engineProfile = "Dual Permanent Magnet Motors";
    } else if (normalizedModel.includes("HYBRID") || normalizedModel.includes("PRIUS") || normalizedBrand.includes("BYD")) {
      fuelType = "HEV / Plug-In Hybrid";
      engineProfile = "1.5L Atkinson-Cycle Hybrid";
    }

    if (normalizedModel.includes("AMG") || normalizedModel.includes("M3") || normalizedModel.includes("M4") || normalizedModel.includes("M5") || normalizedModel.includes("CORVETTE") || normalizedModel.includes("MUSTANG")) {
      driveType = "RWD / Track Calibrated";
      engineProfile = "4.0L Twin-Turbo V8";
      bodyType = "High-Performance Coupe";
    }

    setDisplaySpecs({
      make: brand,
      model,
      year,
      bodyType,
      driveType,
      engineProfile,
      fuelType,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-16 p-6 md:p-8 bg-zinc-900/30 border border-slate-800/60 rounded-[2.5rem] backdrop-blur-md shadow-2xl relative overflow-hidden group">
      
      {/* Visual Accent Ambient Glows */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/10 blur-[100px] rounded-full" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/5 blur-[100px] rounded-full" />

      {/* 🚀 UPGRADED: High-Contrast Premium Header Section */}
      <div className="mb-8 flex justify-between items-start gap-4 relative z-10">
        <div className="space-y-2">
          {/* Main Accent Badge / Title Combo */}
          <div className="flex items-center gap-3">
            <span className="h-4 w-1 bg-blue-600 rounded-full shadow-[0_0_12px_rgba(37,99,235,0.8)]" />
            <h3 className="text-sm md:text-base font-black tracking-[0.25em] uppercase bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent italic drop-shadow-sm">
              Zuta Catalog Spec Desk
            </h3>
          </div>
          
          {/* Sharp High-Contrast Sub-Header */}
          <p className="text-xs md:text-sm font-semibold text-slate-200 max-w-2xl leading-relaxed antialiased">
            Verify architecture records, mechanical displacement setups, and manufacturing configurations across our secure regional database pipelines.
          </p>
        </div>
        
        <div className="p-2.5 rounded-xl bg-zinc-950 border border-slate-800 text-slate-400 hover:text-white transition duration-300 cursor-help hidden sm:block shadow-md">
          <HelpCircle size={16} />
        </div>
      </div>

      {/* 🛠️ Dropdown Selection Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-zinc-950/90 rounded-2xl border border-slate-900 shadow-inner relative z-10">
        <div className="w-full bg-zinc-900/60 hover:bg-zinc-900 transition rounded-xl px-1 border border-slate-800/30 focus-within:border-slate-700">
          <BrandSelect value={selectedBrand} onChange={handleBrandChange} />
        </div>

        <div className="w-full bg-zinc-900/60 hover:bg-zinc-900 transition rounded-xl px-1 border border-slate-800/30 focus-within:border-slate-700">
          <ModelSelect brand={selectedBrand} value={selectedModel} onChange={handleModelChange} />
        </div>

        <div className="w-full bg-zinc-900/60 hover:bg-zinc-900 transition rounded-xl px-1 border border-slate-800/30 focus-within:border-slate-700">
          <SelectMenu options={yearsList} value={selectedYear} placeholder="Select Year" onChange={handleYearChange} />
        </div>
      </div>

      {/* 📊 Premium Showroom Spec Sheet Panels */}
      {displaySpecs ? (
        <div className="mt-6 p-5 bg-zinc-950/40 border border-slate-900 rounded-2xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300 relative z-10">
          
          <div className="flex gap-3 items-center p-3.5 bg-gradient-to-br from-zinc-900/40 to-zinc-900/10 rounded-xl border border-slate-900/60 hover:border-slate-800/80 transition-all duration-300">
            <div className="p-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg shrink-0">
              <Sliders size={15} />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] uppercase font-bold tracking-wider text-slate-500">Classification</p>
              <p className="text-xs font-bold text-slate-200 truncate mt-0.5">{displaySpecs.year} {displaySpecs.make}</p>
            </div>
          </div>

          <div className="flex gap-3 items-center p-3.5 bg-gradient-to-br from-zinc-900/40 to-zinc-900/10 rounded-xl border border-slate-900/60 hover:border-slate-800/80 transition-all duration-300">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg shrink-0">
              <Activity size={15} />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] uppercase font-bold tracking-wider text-slate-500">Segment Profile</p>
              <p className="text-xs font-bold text-slate-200 truncate mt-0.5">{displaySpecs.bodyType}</p>
            </div>
          </div>

          <div className="flex gap-3 items-center p-3.5 bg-gradient-to-br from-zinc-900/40 to-zinc-900/10 rounded-xl border border-slate-900/60 hover:border-slate-800/80 transition-all duration-300">
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg shrink-0">
              <Gauge size={15} />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] uppercase font-bold tracking-wider text-slate-500">Engine / Output</p>
              <p className="text-xs font-bold text-slate-300 truncate mt-0.5">{displaySpecs.engineProfile}</p>
            </div>
          </div>

          <div className="flex gap-3 items-center p-3.5 bg-gradient-to-br from-zinc-900/40 to-zinc-900/10 rounded-xl border border-slate-900/60 hover:border-slate-800/80 transition-all duration-300">
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg shrink-0">
              <Disc size={15} />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] uppercase font-bold tracking-wider text-slate-500">Drivetrain System</p>
              <p className="text-xs font-bold text-slate-300 truncate mt-0.5">{displaySpecs.driveType.split(" ")[0]} Layout</p>
            </div>
          </div>

        </div>
      ) : (
        <div className="mt-4 p-6 bg-zinc-950/20 border border-dashed border-slate-900/80 rounded-2xl flex flex-col items-center justify-center text-center group">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-600 group-hover:text-slate-500 transition-colors duration-300">
            Awaiting Dropdown Execution
          </p>
          <p className="text-[11px] text-slate-500/80 mt-1 max-w-xs">
            Complete the Brand, Model, and Production Year parameters to display operational metrics.
          </p>
        </div>
      )}
    </div>
  );
}
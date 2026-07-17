"use client";

import { useState } from "react";
import { calculateValuation } from "@/app/api/valuation/action";
import { toast } from "sonner";
import { Loader2, Calculator, BadgeCheck, Sparkles, RefreshCw } from "lucide-react";
import SellerSection from "@/components/sell/FormData/SellerSection";

export default function CarValuator() {
  const [isPending, setIsPending] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    mileage: "",
    transmission: "AUTOMATIC" as "AUTOMATIC" | "MANUAL",
    fuelType: "PETROL" as "PETROL" | "DIESEL" | "ELECTRIC" | "HYBRID",
    condition: "USED" as "USED" | "NEW" | "CERTIFIED",
    country: "Nigeria",
    state: "",
    city: "",
  });

  const handleLocationChange = (field: "city" | "state" | "country", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.state || !formData.city) {
      return toast.error("Please select a complete showroom state and city.");
    }

    try {
      setIsPending(true);
      const res = await calculateValuation({
        ...formData,
        year: Number(formData.year),
        mileage: Number(formData.mileage),
      });

      if (res.error) {
        toast.error(res.error);
      } else if (res.success) {
        setResult(res.data);
        toast.success("Valuation computed successfully!");
      }
    } catch (err) {
      toast.error("An error occurred calculation market metrics.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-6">
      {!result ? (
        <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900/40 border border-slate-900 p-8 rounded-[2.5rem] relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Brand / Make</label>
              <input
                required
                name="brand"
                placeholder="e.g. Toyota, Lexus"
                value={formData.brand}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-zinc-950 border border-slate-900 rounded-xl text-white outline-none text-sm font-medium focus:border-blue-500/40 transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Model Name</label>
              <input
                required
                name="model"
                placeholder="e.g. Corolla, ES350"
                value={formData.model}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-zinc-950 border border-slate-900 rounded-xl text-white outline-none text-sm font-medium focus:border-blue-500/40 transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Year</label>
              <input
                required
                type="number"
                name="year"
                min={1990}
                max={new Date().getFullYear()}
                value={formData.year}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-zinc-950 border border-slate-900 rounded-xl text-white outline-none text-sm font-medium focus:border-blue-500/40 transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Mileage (KM)</label>
              <input
                required
                type="number"
                name="mileage"
                placeholder="e.g. 85000"
                value={formData.mileage}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-zinc-950 border border-slate-900 rounded-xl text-white outline-none text-sm font-medium focus:border-blue-500/40 transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Transmission</label>
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-zinc-950 border border-slate-900 rounded-xl text-white outline-none text-sm font-medium focus:border-blue-500/40 transition"
              >
                <option value="AUTOMATIC">Automatic</option>
                <option value="MANUAL">Manual</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Condition</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-zinc-950 border border-slate-900 rounded-xl text-white outline-none text-sm font-medium focus:border-blue-500/40 transition"
              >
                <option value="USED">Used (Tokunbo / Locally Used)</option>
                <option value="CERTIFIED">Certified Pre-Owned</option>
                <option value="NEW">Brand New</option>
              </select>
            </div>
          </div>

          <SellerSection
            country={formData.country}
            state={formData.state}
            city={formData.city}
            onChange={handleLocationChange}
          />

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-4 bg-blue-700 hover:bg-blue-600 disabled:bg-blue-900 text-xs font-black uppercase tracking-widest rounded-xl transition cursor-pointer flex items-center justify-center gap-2 text-white"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Calculator size={14} /> Calculate Est. Valuation
              </>
            )}
          </button>
        </form>
      ) : (
        /* Valuation Output Dashboard card */
        <div className="bg-zinc-900/40 border border-slate-900 p-8 rounded-[2.5rem] relative overflow-hidden space-y-8 text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <BadgeCheck size={12} /> Estimated Market Worth
            </span>
            <h2 className="text-3xl font-black italic uppercase text-white mt-2">
              {result.year} {result.brand} {result.model}
            </h2>
          </div>

          {/* Pricing Spectrum Display */}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="p-4 rounded-2xl bg-zinc-950 border border-slate-900">
              <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Minimum Price</span>
              <p className="text-xl font-black text-white mt-1">₦{Number(result.estimatedMin).toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-950 border border-slate-900">
              <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Maximum Price</span>
              <p className="text-xl font-black text-emerald-400 mt-1">₦{Number(result.estimatedMax).toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-zinc-950/60 p-4 rounded-2xl border border-slate-900 max-w-sm mx-auto flex items-center gap-3 text-left">
            <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500 shrink-0">
              <Sparkles size={16} />
            </div>
            <div>
              <p className="text-xs text-white font-bold">Confidence Rating: {result.confidence}%</p>
              <p className="text-[10px] text-slate-500 font-medium">Based on condition, wear models and localized state listing statistics.</p>
            </div>
          </div>

          <button
            onClick={() => setResult(null)}
            className="px-6 py-3 bg-zinc-950 hover:bg-zinc-900 border border-slate-900 rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition cursor-pointer inline-flex items-center gap-2"
          >
            <RefreshCw size={12} /> Estimate Another Vehicle
          </button>
        </div>
      )}
    </div>
  );
}
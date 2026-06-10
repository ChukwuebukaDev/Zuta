"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditCarForm({ car }: { car: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    brand: car.brand || "",
    model: car.model || "",
    year: car.year || "",
    price: car.price || "",
    mileage: car.mileage || "",
    transmission: car.transmission || "AUTOMATIC",
    fuelType: car.fuelType || "PETROL",
    condition: car.condition || "USED",
    location: car.location || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
console.log(car.id);
    try {
      const response = await fetch(`/api/cars/${car.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Mutation rejected by database engine");

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to sync listing adjustments.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900/20 p-8 rounded-2xl border border-slate-900">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">Brand Name</label>
          <input
            type="text"
            required
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            className="w-full bg-zinc-950 border border-slate-800 focus:border-blue-500 rounded-xl py-3 px-4 text-sm text-white outline-none transition"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">Model Version</label>
          <input
            type="text"
            required
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            className="w-full bg-zinc-950 border border-slate-800 focus:border-blue-500 rounded-xl py-3 px-4 text-sm text-white outline-none transition"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">Ask Price (₦)</label>
          <input
            type="number"
            required
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full bg-zinc-950 border border-slate-800 focus:border-blue-500 rounded-xl py-3 px-4 text-sm text-white outline-none transition"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">Mileage Run (km)</label>
          <input
            type="number"
            required
            value={formData.mileage}
            onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
            className="w-full bg-zinc-950 border border-slate-800 focus:border-blue-500 rounded-xl py-3 px-4 text-sm text-white outline-none transition"
          />
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-slate-900">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-white transition">
          <ArrowLeft size={14} /> Cancel
        </Link>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 gap-2 font-bold px-6 rounded-xl min-w-35"
        >
          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save Changes
        </Button>
      </div>
    </form>
  );
}
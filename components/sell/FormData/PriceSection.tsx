"use client";

import { Banknote, HandCoins, Info } from "lucide-react";

type Props = {
  price: number;
  negotiable: boolean;
  onChange: (field: "price" | "negotiable", value: number | boolean) => void;
};

export default function PriceSection({ price, negotiable, onChange }: Props) {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-2 text-blue-500">
        <Banknote size={18} />
        <span className="text-sm font-bold uppercase tracking-widest text-blue-500">
          Valuation & Pricing
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Price Input */}
        <div className="relative group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 font-bold text-lg">
            ₦
          </span>
          <input
            type="number"
            placeholder="Asking Price"
            value={price || ""} // Prevents uncontrolled component warning
            onChange={(e) => onChange("price", Number(e.target.value))}
            className="w-full p-5 pl-12 rounded-2xl bg-black border border-slate-800 focus:border-blue-500/50 outline-none text-white text-xl font-bold transition-all placeholder:text-slate-700 placeholder:font-normal"
            required
          />
        </div>

        {/* Negotiable Toggle */}
        <div 
          onClick={() => onChange("negotiable", !negotiable)}
          className="flex items-center justify-between p-5 rounded-2xl bg-black/40 border border-slate-800 cursor-pointer hover:border-slate-700 transition-all group"
        >
          <div className="flex items-center gap-3">
            <HandCoins className={`transition-colors ${negotiable ? 'text-blue-500' : 'text-slate-500'}`} size={20} />
            <span className={`font-medium transition-colors ${negotiable ? 'text-white' : 'text-slate-500'}`}>
              Negotiable
            </span>
          </div>
          
          {/* Custom Toggle Switch */}
          <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${negotiable ? 'bg-blue-600' : 'bg-slate-800'}`}>
            <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 transform ${negotiable ? 'translate-x-6' : 'translate-x-0'}`} />
          </div>
        </div>
      </div>

      {/* Pricing Note */}
      <div className="flex items-start gap-2 text-[10px] text-slate-600 uppercase tracking-widest px-2">
        <Info size={12} className="text-blue-500 mt-0.5" />
        <p>Set a competitive price based on current market trends in {new Date().getFullYear()}.</p>
      </div>
    </div>
  );
}
"use client";

import { Banknote, HandCoins, Info, ArrowUpRight } from "lucide-react";

type Props = {
  price: number;
  negotiable: boolean;
  onChange: (field: "price" | "negotiable", value: number | boolean) => void;
};

// Clean numeric parser to convert Naira values into words dynamically
function convertNumberToNairaWords(num: number): string {
  if (num === 0) return "";
  if (num > 999999999999) return "Amount too high";

  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const scales = ["", "Thousand", "Million", "Billion"];

  function convertLessThanOneThousand(n: number): string {
    let str = "";
    if (n >= 100) {
      str += ones[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }
    if (n >= 10 && n <= 19) {
      str += teens[n - 10] + " ";
    } else if (n >= 20) {
      str += tens[Math.floor(n / 10)] + " ";
      n %= 10;
    }
    if (n > 0 && n <= 9) {
      str += ones[n] + " ";
    }
    return str.trim();
  }

  let wordResult = "";
  let scaleIndex = 0;

  let remainingIdx = num;
  while (remainingIdx > 0) {
    const chunk = remainingIdx % 1000;
    if (chunk > 0) {
      const chunkStr = convertLessThanOneThousand(chunk);
      wordResult = chunkStr + (scales[scaleIndex] ? " " + scales[scaleIndex] : "") + " " + wordResult;
    }
    remainingIdx = Math.floor(remainingIdx / 1000);
    scaleIndex++;
  }

  return `${wordResult.trim()} Naira Only`;
}

export default function PriceSection({ price, negotiable, onChange }: Props) {
  const priceInWords = price > 0 ? convertNumberToNairaWords(price) : "";

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-2 text-blue-500">
        <Banknote size={18} />
        <span className="text-sm font-bold uppercase tracking-widest text-blue-500">
          Valuation & Pricing
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Price Input Wrapper */}
        <div className="space-y-2">
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 font-bold text-lg">
              ₦
            </span>
            <input
              type="number"
              placeholder="Asking Price"
              value={price || ""} 
              onChange={(e) => {
                const val = e.target.value === "" ? 0 : Number(e.target.value);
                onChange("price", val);
              }}
              className="w-full p-5 pl-12 h-[66px] rounded-2xl bg-black border border-slate-800 focus:border-blue-500/50 outline-none text-white text-xl font-bold transition-all placeholder:text-slate-700 placeholder:font-normal appearance-none"
              required
            />
          </div>

          {/* Dynamic Numeric Valuation Readout */}
          {priceInWords && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/5 border border-blue-500/10 text-blue-400/90 text-xs font-semibold tracking-wide animate-fade-in">
              <ArrowUpRight size={14} className="shrink-0 text-cyan-400" />
              <span>{priceInWords}</span>
            </div>
          )}
        </div>

        {/* Negotiable Toggle */}
        <div 
          onClick={() => onChange("negotiable", !negotiable)}
          className="flex items-center justify-between p-5 h-[66px] rounded-2xl bg-black/40 border border-slate-800 cursor-pointer hover:border-slate-700 transition-all group"
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
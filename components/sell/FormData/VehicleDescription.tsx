"use client";

import { FileText, Sparkles, AlertCircle, Info } from "lucide-react";
import { CarFormData } from "@/types/car/CarFormData";

type Props = {
  descriptionDetails: {
    description?: string ;
    onChange: <K extends keyof CarFormData>(
      field: K,
      value: CarFormData[K]
    ) => void;
  };
};

const SUGGESTED_TEMPLATES = [
  "Pristine condition, single owner with full dealer service record.",
  "Custom spec with upgraded sound system, performance exhaust, and ceramic coating.",
  "Highway mileage only. Meticulously maintained and garage-stored.",
  "Ideal daily driver or executive commuter with exceptional fuel efficiency.",
];

export default function VehicleDescription({ descriptionDetails }: Props) {
  const { description, onChange } = descriptionDetails;

  const minLength = 50;
  const maxLength = 2000;
  const currentLength = description?.length || 0;
  const isTooShort = currentLength > 0 && currentLength < minLength;

  const handleTemplateClick = (template: string) => {
    if (!description) {
      onChange("description", template);
      return;
    }
    // Append template if text already exists
    const updated = description.endsWith(".")
      ? `${description} ${template}`
      : `${description}. ${template}`;
    onChange("description", updated);
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-2 text-blue-500">
        <FileText size={18} />
        <span className="text-sm font-bold uppercase tracking-widest">
          Vehicle Overview & Story
        </span>
      </div>

      {/* Description Textarea Card */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">
            Detailed Description
          </label>
          <span
            className={`text-xs font-mono font-medium ${
              isTooShort
                ? "text-amber-400"
                : currentLength > maxLength
                ? "text-red-400"
                : "text-slate-500"
            }`}
          >
            {currentLength} / {maxLength} chars
          </span>
        </div>

        <div className="relative group">
          <textarea
            rows={6}
            placeholder="Highlight unique features, maintenance history, modifications, or reason for selling..."
            value={description || ""}
            onChange={(e) => onChange("description", e.target.value)}
            maxLength={maxLength}
            className="w-full p-4 rounded-xl bg-black border border-slate-800 focus:border-blue-500/50 outline-none text-white transition-all text-sm resize-none leading-relaxed focus:ring-1 focus:ring-blue-500/20"
          />
        </div>

        {/* Validation hint */}
        {isTooShort && (
          <div className="flex items-center gap-1.5 text-amber-400 text-xs mt-1 font-medium">
            <AlertCircle size={14} />
            <span>
              A detailed description improves search visibility. Aim for at least {minLength} characters.
            </span>
          </div>
        )}
      </div>

      {/* Dealer Quick-Start Prompts */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
          <Sparkles size={14} className="text-blue-500" />
          <span>Quick Highlights (Click to Insert)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SUGGESTED_TEMPLATES.map((template, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleTemplateClick(template)}
              className="text-left p-3 rounded-xl border border-slate-800 bg-black/40 hover:bg-blue-500/10 hover:border-blue-500/40 text-slate-400 hover:text-white transition-all text-xs leading-snug group"
            >
              <span className="text-blue-500/60 group-hover:text-blue-400 font-bold mr-1">
                +
              </span>{" "}
              {template}
            </button>
          ))}
        </div>
      </div>

      {/* Small Design Hint */}
      <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-tighter px-2 pt-2">
        <Info size={12} className="text-blue-500" />
        Transparent descriptions build trust and reduce inquiries from uncommitted buyers.
      </div>
    </div>
  );
}
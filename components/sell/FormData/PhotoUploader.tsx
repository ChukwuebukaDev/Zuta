"use client";

import Image from "next/image";
import { useMemo, useEffect, useState, useRef } from "react";
import { Camera, Plus, X, Image as ImageIcon, Trash2, Check, AlertCircle } from "lucide-react";

type Props = {
  thumbnail: File | null;
  images: File[];
  onChange: <K extends "thumbnail" | "images">(
    field: K,
    value: K extends "thumbnail" ? File | null : File[],
  ) => void;
};

interface MandatorySlot {
  index: number;
  key: string;
  label: string;
  description: string;
}

export default function PhotoUploader({ thumbnail, images, onChange }: Props) {
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const slotInputRef = useRef<HTMLInputElement>(null);
  const optionalInputRef = useRef<HTMLInputElement>(null);

  // Active tracking state to tell which slot slot-input is currently handling
  const [activeSlotIdx, setActiveSlotIdx] = useState<number | null>(null);

  // 1. Map explicit array indexes to mandatory structural vehicle perspectives
  const mandatorySlots: MandatorySlot[] = [
    { index: 0, key: "front", label: "Front Profile", description: "Straight-on head shot, grill clear" },
    { index: 1, key: "rear", label: "Rear Profile", description: "Tailgates, exhaust, and badges visible" },
    { index: 2, key: "left", label: "Left Side View", description: "Full profile front-to-back wheels" },
    { index: 3, key: "right", label: "Right Side View", description: "Full profile back-to-front wheels" },
    { index: 4, key: "interior", label: "Interior Cabin", description: "Dashboard, steering wheel, front cockpit" },
    { index: 5, key: "underneath", label: "Underneath", description: "Suspension rails, exhaust line, rust check" },
  ];

  const mainPreview = useMemo(() => {
    if (!thumbnail) return null;
    return URL.createObjectURL(thumbnail);
  }, [thumbnail]);

  useEffect(() => {
    const urls = images.map((img) => (img ? URL.createObjectURL(img) : ""));
    setGalleryPreviews(urls);
    return () => urls.forEach((url) => { if (url) URL.revokeObjectURL(url); });
  }, [images]);

  // Trigger file manager viewport for specific slots
  const triggerSlotUpload = (index: number) => {
    setActiveSlotIdx(index);
    slotInputRef.current?.click();
  };

  const handleSlotFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || activeSlotIdx === null) return;

    const updatedImages = [...images];
    // Pad the array if needed to maintain deterministic positional slots
    while (updatedImages.length <= activeSlotIdx) {
      updatedImages.push(null as unknown as File); 
    }
    updatedImages[activeSlotIdx] = file;
    
    onChange("images", updatedImages);
    e.target.value = ""; // Reset file path stream
  };

  const handleOptionalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    
    // Slice off or pad mandatory items to ensure optional photos sit at index 6+
    const coreMandatory = [...images];
    while (coreMandatory.length < 6) {
      coreMandatory.push(null as unknown as File);
    }
    
    onChange("images", [...coreMandatory, ...newFiles]);
    e.target.value = "";
  };

  const removeImageSlot = (index: number) => {
    const updatedImages = [...images];
    if (index < 6) {
      // For required items, set back to empty to keep indexes valid
      updatedImages[index] = null as unknown as File;
    } else {
      // For optional items, cut them out completely
      updatedImages.splice(index, 1);
    }
    onChange("images", updatedImages);
  };

  // Check if all 6 structural perspectives are complete
  const isInspectionBlueprintValid = useMemo(() => {
    return mandatorySlots.every(slot => !!images[slot.index]);
  }, [images, mandatorySlots]);

  return (
    <div className="space-y-12">
      {/* Hidden input managers */}
      <input ref={slotInputRef} type="file" accept="image/*" className="hidden" onChange={handleSlotFileChange} />
      <input ref={optionalInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleOptionalChange} />

      {/* --- Main Cover Image Showroom Cover --- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-500">
            <Camera size={18} />
            <span className="text-sm font-bold uppercase tracking-widest">Main Showroom Cover</span>
          </div>
          {thumbnail && (
            <button 
              type="button"
              onClick={() => onChange("thumbnail", null)}
              className="text-xs text-red-500 flex items-center gap-1 hover:underline font-bold"
            >
              <Trash2 size={12} /> Replace
            </button>
          )}
        </div>

        <div 
          onClick={() => thumbInputRef.current?.click()}
          className={`relative group cursor-pointer overflow-hidden rounded-[2.5rem] border-2 border-dashed transition-all duration-500 h-80 flex items-center justify-center
            ${mainPreview ? 'border-transparent' : 'border-slate-800 hover:border-blue-500/50 bg-slate-900/20'}`}
        >
          <input ref={thumbInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => onChange("thumbnail", e.target.files?.[0] || null)} />
          {mainPreview ? (
            <Image src={mainPreview} alt="Preview" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto group-hover:bg-blue-600 transition-colors">
                <Plus className="text-white" size={24} />
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Upload Showroom Hero</p>
            </div>
          )}
        </div>
      </div>

      {/* --- Required Structural Matrix Layout Grid --- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-500">
            <ImageIcon size={18} />
            <span className="text-sm font-bold uppercase tracking-widest">Mandatory Inspection Blueprint</span>
          </div>
          {!isInspectionBlueprintValid && (
            <span className="text-[10px] text-yellow-500 font-bold uppercase tracking-wider flex items-center gap-1.5 animate-pulse bg-yellow-500/5 border border-yellow-500/10 px-3 py-1 rounded-full">
              <AlertCircle size={12} /> All {mandatorySlots.length} Perspective Angles Required
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mandatorySlots.map((slot) => {
            const previewUrl = galleryPreviews[slot.index];
            const hasFile = !!images[slot.index];

            return (
              <div 
                key={slot.key}
                className={`p-5 rounded-2xl border flex flex-col justify-between h-56 transition-all duration-300 ${
                  hasFile ? "bg-slate-900/40 border-emerald-500/30" : "bg-slate-900/10 border-slate-800/80"
                }`}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                      {slot.label} <span className="text-red-500">*</span>
                    </span>
                    {hasFile ? (
                      <span className="p-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Check size={10} strokeWidth={3} />
                      </span>
                    ) : (
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Required</span>
                    )}
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5 tracking-tight">{slot.description}</p>
                </div>

                <div className="mt-4 relative flex-1 rounded-xl overflow-hidden bg-black/40 border border-slate-900 flex items-center justify-center group">
                  {hasFile && previewUrl ? (
                    <>
                      <Image src={previewUrl} alt={slot.label} fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          type="button" 
                          onClick={() => removeImageSlot(slot.index)}
                          className="p-2.5 bg-red-600 rounded-xl text-white hover:bg-red-700 transition transform hover:scale-105 shadow-md"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => triggerSlotUpload(slot.index)}
                      className="w-full h-full flex flex-col items-center justify-center gap-1.5 hover:bg-slate-900/40 text-slate-500 hover:text-blue-400 transition"
                    >
                      <Camera size={18} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Add Perspective</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- Optional Supplementary Media Gallery --- */}
      <div className="space-y-4 pt-4 border-t border-slate-900">
        <div className="flex flex-col">
          <span className="text-sm font-bold uppercase tracking-widest text-slate-400">Additional Media Gallery (Optional)</span>
          <p className="text-slate-500 text-xs tracking-tight mt-0.5">Add extra detailed shots of custom features, wheel profiles, engine trim, or cabin technology specs.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {/* Render extra items resting outside the mandatory 6 boundaries */}
          {galleryPreviews.slice(6).map((src, idx) => {
            const targetIndex = idx + 6;
            if (!src) return null;

            return (
              <div key={targetIndex} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-800 bg-zinc-950">
                <Image src={src} alt="Optional view" fill className="object-cover" />
                <button 
                  type="button"
                  onClick={() => removeImageSlot(targetIndex)}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow"
                >
                  <X size={12} />
                </button>
              </div>
            );
          })}

          {/* Optional trigger slot */}
          <button
            type="button"
            onClick={() => optionalInputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center hover:border-blue-500/50 hover:bg-slate-900/20 transition-all text-slate-600 hover:text-blue-500"
          >
            <Plus size={20} className="mb-0.5" />
            <span className="text-[9px] font-black uppercase tracking-widest">Add Extra</span>
          </button>
        </div>
      </div>
    </div>
  );
}
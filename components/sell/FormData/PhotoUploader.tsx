"use client";

import Image from "next/image";
import { useMemo, useEffect, useState, useRef } from "react";
import { Camera, Plus, X, Image as ImageIcon, Trash2 } from "lucide-react";

type Props = {
  thumbnail: File | null;
  images: File[];
  onChange: <K extends "thumbnail" | "images">(
    field: K,
    value: K extends "thumbnail" ? File | null : File[],
  ) => void;
};

export default function PhotoUploader({ thumbnail, images, onChange }: Props) {
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const mainPreview = useMemo(() => {
    if (!thumbnail) return null;
    return URL.createObjectURL(thumbnail);
  }, [thumbnail]);

  useEffect(() => {
    const urls = images.map((img) => URL.createObjectURL(img));
    setGalleryPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [images]);

  const handleGalleryChange = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    onChange("images", [...images, ...newFiles]);
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    onChange("images", updatedImages);
  };

  return (
    <div className="space-y-10">
      {/* --- Main Cover Image --- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-500">
            <Camera size={18} />
            <span className="text-sm font-bold uppercase tracking-widest">Main Showroom Cover</span>
          </div>
          {thumbnail && (
            <button 
              onClick={() => onChange("thumbnail", null)}
              className="text-xs text-red-500 flex items-center gap-1 hover:underline"
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
          <input
            ref={thumbInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onChange("thumbnail", e.target.files?.[0] || null)}
          />

          {mainPreview ? (
            <Image src={mainPreview} alt="Preview" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto group-hover:bg-blue-600 transition-colors">
                <Plus className="text-white" size={24} />
              </div>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-tighter">Upload Hero Image</p>
            </div>
          )}
        </div>
      </div>

      {/* --- Gallery Grid --- */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-blue-500">
          <ImageIcon size={18} />
          <span className="text-sm font-bold uppercase tracking-widest">Full Gallery Detail</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Previews */}
          {galleryPreviews.map((src, i) => (
            <div key={i} className="relative group aspect-square rounded-2xl overflow-hidden border border-slate-800">
              <Image src={src} alt={`Gallery ${i}`} fill className="object-cover" />
              <button 
                onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X size={14} />
              </button>
            </div>
          ))}

          {/* Upload Trigger */}
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            className="aspect-square rounded-2xl border-2 border-dashed border-slate-800 flex items-center justify-center hover:border-blue-500/50 hover:bg-slate-900/20 transition-all text-slate-500 hover:text-blue-500"
          >
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleGalleryChange(e.target.files)}
            />
            <div className="text-center">
              <Plus size={24} className="mx-auto mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-tighter">Add Photo</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
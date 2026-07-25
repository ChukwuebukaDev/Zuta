"use client";

import { X, ShieldAlert, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

interface RejectionDetailsModalProps {
  carId: string;
  carTitle: string;
  rejectionReason?: string | null;
  adminFeedback?: string | null;
  rejectedAt?: string | Date | null;
  isOpen: boolean;
  onClose: () => void;
}

const REJECTION_LABELS: Record<string, { label: string; tip: string }> = {
  POOR_IMAGES: {
    label: "Image Quality / Missing Angles",
    tip: "Ensure all 6 mandatory angles (Front, Rear, Sides, Interior, Underneath) are clear and well-lit.",
  },
  SUSPICIOUS_PRICE: {
    label: "Unrealistic or Invalid Price",
    tip: "Verify that your price accurately reflects current market valuation in NGN.",
  },
  INCORRECT_SPECS: {
    label: "Mismatched Vehicle Specifications",
    tip: "Double-check engine size, trim level (e.g. SE, XLE), or fuel capacity details.",
  },
  INCOMPLETE_INFO: {
    label: "Invalid Phone Number or Location",
    tip: "Provide a reachable phone number and a complete showroom city/state location.",
  },
  DUPLICATE: {
    label: "Duplicate Listing Detected",
    tip: "A similar vehicle listing already exists under your account profile.",
  },
  OTHER: {
    label: "Administrative Policy Requirement",
    tip: "Review admin notes below and update your submission accordingly.",
  },
};

export function RejectionDetailsModal({
  carId,
  carTitle,
  rejectionReason,
  adminFeedback,
  rejectedAt,
  isOpen,
  onClose,
}: RejectionDetailsModalProps) {
  if (!isOpen) return null;

  const reasonInfo = REJECTION_LABELS[rejectionReason || "OTHER"] || {
    label: rejectionReason ? rejectionReason.replace(/_/g, " ") : "Policy Review Required",
    tip: "Please make the requested adjustments and re-submit your vehicle for approval.",
  };

  const formattedDate = rejectedAt
    ? new Date(rejectedAt).toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-3xl p-6 shadow-2xl text-white relative overflow-hidden">
        
        {/* Amber Glow Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* --- HEADER --- */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2 text-amber-500 text-xs font-black uppercase tracking-widest">
            <ShieldAlert size={16} />
            <span>Listing Update Required</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-xl transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* --- BODY --- */}
        <div className="mt-5 space-y-5">
          <div>
            <h3 className="text-lg font-black uppercase tracking-tight text-white">
              {carTitle}
            </h3>
            {formattedDate && (
              <p className="text-[10px] text-neutral-500 font-medium mt-0.5">
                Reviewed on {formattedDate}
              </p>
            )}
          </div>

          {/* Primary Reason Badge */}
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl">
            <p className="text-[9px] font-bold uppercase tracking-widest text-red-400">
              Primary Reason
            </p>
            <p className="text-sm font-bold text-red-200 mt-1">
              {reasonInfo.label}
            </p>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              {reasonInfo.tip}
            </p>
          </div>

          {/* Admin Custom Feedback Notes */}
          {adminFeedback ? (
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-1">
                <Sparkles size={11} className="text-amber-400" />
                <span>Admin Inspector Notes</span>
              </label>
              <div className="bg-neutral-900/80 border border-neutral-800 p-4 rounded-2xl text-xs text-neutral-200 font-sans leading-relaxed">
                "{adminFeedback}"
              </div>
            </div>
          ) : (
            <div className="bg-neutral-900/40 border border-neutral-800/60 p-3 rounded-xl text-xs text-neutral-500 italic">
              No extra notes provided by reviewer. Please address the primary reason listed above.
            </div>
          )}
        </div>

        {/* --- FOOTER / ACTIONS --- */}
        <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-3 rounded-xl border border-neutral-800 text-xs font-bold text-neutral-400 hover:text-white hover:bg-neutral-900 transition cursor-pointer"
          >
            Close
          </button>

          <Link
            href={`/dashboard/inventory/${carId}/edit`}
            className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/10 active:scale-95 cursor-pointer"
          >
            <span>Fix & Re-submit</span>
            <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </div>
  );
}
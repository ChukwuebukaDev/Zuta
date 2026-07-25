"use client";

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

const REJECTION_REASONS = [
  { id: "POOR_IMAGES", label: "Image Quality / Missing Angles" },
  { id: "SUSPICIOUS_PRICE", label: "Unrealistic or Invalid Price" },
  { id: "INCORRECT_SPECS", label: "Mismatched Vehicle Specs (Trim, Year, Engine)" },
  { id: "INCOMPLETE_INFO", label: "Invalid Phone Number or Location" },
  { id: "DUPLICATE", label: "Duplicate Listing" },
  {id:'INCOMPATIBILITY',label:"Car Photos dosen't match Car Makes"},
  { id: "OTHER", label: "Other Reason" },
];

interface RejectModalProps {
  carId: string;
  carTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { reason: string; feedback: string }) => Promise<void>;
}

export function RejectListingModal({
  carTitle,
  isOpen,
  onClose,
  onSubmit,
}: RejectModalProps) {
  const [reason, setReason] = useState(REJECTION_REASONS[0].id);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit({ reason, feedback });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-2xl p-6 shadow-2xl text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
            <AlertTriangle size={18} />
            <span>Reject Vehicle Listing</span>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <p className="text-xs text-neutral-400 mt-3">
          Rejecting <strong className="text-white">{carTitle}</strong>. Provide clear feedback so the seller can fix and re-submit their listing.
        </p>

        <form onSubmit={handleReject} className="mt-5 space-y-4">
          {/* Reason Category Select */}
          <div>
            <label className="text-[10px] font-bold uppercase text-neutral-400">
              Primary Reason
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full mt-1.5 p-3 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white outline-none focus:border-red-500/50"
            >
              {REJECTION_REASONS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Detailed Feedback Textarea */}
          <div>
            <label className="text-[10px] font-bold uppercase text-neutral-400">
              Admin Notes / Actionable Guidance
            </label>
            <textarea
              required
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="e.g., Please re-upload a clearer image of the front bumper and verify the engine size..."
              className="w-full mt-1.5 p-3 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white placeholder:text-neutral-600 outline-none focus:border-red-500/50"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-neutral-800 text-xs font-bold text-neutral-400 hover:bg-neutral-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider transition"
            >
              {isSubmitting ? "Processing..." : "Confirm Rejection"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
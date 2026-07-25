"use client";

import { useState } from "react";
import { RejectListingModal } from "@/components/admin/RejectionModal";
import { rejectCarListing } from "@/app/_actions/admin";
import { toast } from "sonner";

interface RejectButtonProps {
  carId: string;
  carTitle: string;
}

export function RejectButton({ carId, carTitle }: RejectButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleRejectSubmit = async (data: { reason: string; feedback: string }) => {
    const res = await rejectCarListing(carId, data);

    if (res.success) {
      toast.success("Listing rejected and seller feedback recorded.");
    } else {
      toast.error(res.message || "Failed to reject listing.");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 text-[10px] font-black bg-red-600 uppercase tracking-widest text-white hover:bg-red-500 border border-transparent hover:border-red-500/20 rounded-lg transition-all cursor-pointer"
      >
        Reject
      </button>

      <RejectListingModal
        carId={carId}
        carTitle={carTitle}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleRejectSubmit}
      />
    </>
  );
}
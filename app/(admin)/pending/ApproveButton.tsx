"use client";

import { useState } from "react";
import { approveCarListing } from "@/app/_actions/admin";
import { toast } from "sonner";
import { Loader2, Check } from "lucide-react";

export function ApproveButton({ carId }: { carId: string }) {
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    const result = await approveCarListing(carId);
    
    if (result.success) {
      toast.success("Listing Approved");
    } else {
      toast.error(result.message || "Error");
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleApprove}
      disabled={loading}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 disabled:opacity-50 transition-all"
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
      Approve
    </button>
  );
}
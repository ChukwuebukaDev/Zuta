import Link from "next/link";
import { Pencil } from "lucide-react";

type EditCarProps = {
  carId: string;
  mode?: "NORMAL" | "PROFILE" | "CARD";
};

export default function EditCar({ carId, mode = "NORMAL" }: EditCarProps) {
  
  const renderButton = () => {
    switch (mode) {
      case "CARD":
        // Compact, icon-only button suited for small inventory cards
        return (
          <button 
            title="Edit Spec"
            className="inline-flex items-center justify-center p-2 bg-zinc-900 border border-slate-800 hover:bg-zinc-800 hover:border-slate-600 text-slate-400 hover:text-white rounded-lg transition duration-150 active:scale-95 cursor-pointer"
          >
            <Pencil size={14} />
          </button>
        );

      case "PROFILE":
        // Prominent, full-width button suited for a detailed profile sidebar
        return (
          <button className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border cursor-pointer bg-emerald-500/10 hover:bg-emerald-400/20 text-slate-700 border-slate-500/20">
            Modify
          </button>
        );

      case "NORMAL":
      default:
        // Your original button
        return (
          <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-900 border border-slate-800 hover:border-slate-600 text-[11px] font-bold uppercase tracking-wider text-slate-300 hover:text-white rounded-xl transition duration-150 active:scale-95 cursor-pointer">
            <Pencil size={12} className="text-slate-400" />
            Edit Spec
          </button>
        );
    }
  };

  return (
    <Link href={`/dashboard/inventory/${carId}/edit`}>
      {renderButton()}
    </Link>
  );
}
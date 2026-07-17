import { toast } from "sonner";
import { Sparkles, User, Store, ArrowRight } from "lucide-react";

interface PromptProps {
  onChoosePrivate: () => void;
  onChooseDealer: () => void;
  listingsRemaining: number;
}

export const showListingPromptToast = ({
  onChoosePrivate,
  onChooseDealer,
  listingsRemaining,
}: PromptProps) => {
  toast.custom(
    (t) => {
      
      const handleOutsideClick = (e: MouseEvent) => {
        const toastElement = document.getElementById(`toast-${t}`);
        
        // If click is outside our custom toast container, dismiss it!
        if (toastElement && !toastElement.contains(e.target as Node)) {
          toast.dismiss(t);
          cleanup();
        }
      };

      const cleanup = () => {
        document.removeEventListener("click", handleOutsideClick);
      };

      // Register the event listener after the execution thread finishes rendering the DOM
      setTimeout(() => {
        document.addEventListener("click", handleOutsideClick);
      }, 50);

      return (
        <div 
          id={`toast-${t}`} // Unique ID mapping so the contains check functions accurately
          className="w-full max-w-md bg-zinc-950/95 border border-zinc-800 rounded-3xl p-6 shadow-2xl shadow-black/80 backdrop-blur-md space-y-4 text-white"
        >
          {/* Header */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
              <Sparkles size={20} />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-black uppercase tracking-wider italic">
                Choose Listing Type
              </h4>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                Would you like to list this vehicle using your free private profile slots, or register as a verified dealership?
              </p>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-2">
            {/* Option A: Private Seller */}
            <button
              onClick={() => {
                cleanup();
                toast.dismiss(t);
                onChoosePrivate();
              }}
              className="w-full group p-3.5 rounded-2xl bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-900 hover:border-slate-800 transition text-left flex items-center justify-between gap-4 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                  <User size={16} />
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-wide">
                    Use Private Slot
                  </div>
                  <div className="text-[10px] text-slate-500 font-bold">
                    {listingsRemaining} of 2 free listings remaining
                  </div>
                </div>
              </div>
              <ArrowRight size={14} className="text-slate-600 group-hover:text-white transition group-hover:translate-x-1" />
            </button>

            {/* Option B: Dealer Upgrade */}
            <button
              onClick={() => {
                cleanup();
                toast.dismiss(t);
                onChooseDealer();
              }}
              className="w-full group p-3.5 rounded-2xl bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-900 hover:border-slate-800 transition text-left flex items-center justify-between gap-4 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                  <Store size={16} />
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-wide">
                    Register as Dealer
                  </div>
                  <div className="text-[10px] text-slate-500 font-bold">
                    Unlimited uploads, storefront page & ratings
                  </div>
                </div>
              </div>
              <ArrowRight size={14} className="text-slate-600 group-hover:text-white transition group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      );
    },
    {
      duration: Infinity,
      position: "top-center",
    }
  );
};
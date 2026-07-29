"use client";

import CarImageSlider from "@/components/ui/Wrapper/CarImageSlider";
import { X, ShieldAlert, Sparkles } from "lucide-react";

interface ListingsDetails {
  car: {
    id: string;
    brand: string;
    model: string;
    year: number;
    price: number;
    thumbnail: string;
    slug: string;
    mileage: number;
    transmission: string;
    status?: string;
    sellerType?: "PRIVATE" | "DEALER";
    listingStatus?: string;
    rejectionReason?: string | null;
    adminFeedback?: string | null;
    rejectedAt?: string | Date | null;
    carImages?: {
      url: string;
    }[];
  };
  openModal: boolean;
  closeModal: () => void;
}

export function ListingDetails({
  car,
  openModal,
  closeModal,
}: ListingsDetails) {
  if (!openModal) return null;

  // Keys to exclude from the automatic detail grid
  const excludedKeys: Array<keyof typeof car> = [
    "id",
    "carImages",
    "thumbnail",
    "slug",
    "adminFeedback",
    "rejectionReason",
    "rejectedAt",
  ];

  const extraImages = (car.carImages || [])
    .map((img) => img?.url)
    .filter(Boolean) as string[];

  const galleryImages = [car.thumbnail, ...extraImages].filter(Boolean);
  const isRejected = car.listingStatus === "REJECTED";

  return (
    <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-md animate-in fade-in duration-200 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-3xl max-h-[90vh] bg-neutral-950 border border-neutral-800 rounded-3xl p-6 shadow-2xl text-white relative flex flex-col overflow-hidden">
        
        {/* --- HEADER BAR --- */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800 shrink-0">
          <div>
            <h2 className="text-lg font-black uppercase tracking-tight text-white">
              {car.year} {car.brand} {car.model}
            </h2>
            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mt-0.5">
              Vehicle Inspection Spec
            </p>
          </div>

          <button
            type="button"
            onClick={closeModal}
            className="p-2 text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* --- SCROLLABLE CONTENT --- */}
        <div className="p-1 space-y-6 overflow-y-auto custom-scrollbar flex-1 mt-4">
          
          {/* IMAGE SLIDER */}
          <div className="rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900">
            <CarImageSlider images={galleryImages} model={`${car.brand} ${car.model}`} />
          </div>

          {/* REJECTION FEEDBACK BANNER */}
          {isRejected && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider">
                <ShieldAlert size={16} />
                <span>Listing Review Notes</span>
              </div>
              <div className="flex items-start gap-1.5 text-xs text-neutral-200">
                <Sparkles size={14} className="text-amber-400 shrink-0 mt-0.5" />
                <p className="italic">
                  {car.adminFeedback ? `"${car.adminFeedback}"` : "Please review the rejection reason and update your vehicle details accordingly."}
                </p>
              </div>
            </div>
          )}

          {/* QUICK DETAILS GRID */}
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(Object.keys(car) as Array<keyof typeof car>)
              .filter((key) => !excludedKeys.includes(key))
              .map((key) => {
                const rawValue = car[key];
                let displayValue = String(rawValue ?? "-");

                // Format price to NGN
                if (key === "price" && typeof rawValue === "number") {
                  displayValue = new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                    minimumFractionDigits: 0,
                  }).format(rawValue);
                }

                // Format mileage
                if (key === "mileage" && typeof rawValue === "number") {
                  displayValue = `${rawValue.toLocaleString()} km`;
                }

                return (
                  <QuickDetail
                    key={key}
                    label={key}
                    value={displayValue}
                  />
                );
              })}
          </section>

        </div>

      </div>
    </div>
  );
}

function QuickDetail({ value, label }: { value: string; label: string }) {
  // Convert camelCase string to clean Title Case (e.g. "sellerType" -> "Seller Type")
  const formattedLabel = label
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());

  return (
    <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800/80 space-y-1">
      <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest">
        {formattedLabel}
      </p>
      <p className="text-xs font-bold uppercase text-neutral-200 truncate">
        {value}
      </p>
    </div>
  );
}
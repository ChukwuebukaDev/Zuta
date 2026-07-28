import CarImageSlider from "@/components/ui/Wrapper/CarImageSlider";
import { X } from "lucide-react";

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
  const excludedKeys: Array<keyof typeof car> = ["carImages", "thumbnail","slug","adminFeedback"];
  const extraImages = (car.carImages || [])
    .map((img) => img?.url)
    .filter(Boolean) as string[];

  const galleryImages = [car.thumbnail, ...extraImages].filter(Boolean);

  return (
    <>
      {openModal && (
        <div className="fixed inset-0 z-2000 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="h-screen overflow-scroll">
            <div className="w-full max-w-md m-auto bg-neutral-950 border border-neutral-800 rounded-3xl p-6 shadow-2xl text-white relative">
              <button
                className="absolute right-0 top-0 bg-red-800/40 hover:bg-red-800/60 transition-colors duration-200 text-slate-200 p-2 rounded-4xl"
                onClick={closeModal}
              >
                <X size={24} color="red" />
              </button>
              <CarImageSlider images={galleryImages} model={car.model} />
            </div>

            <section className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
              {(Object.keys(car) as Array<keyof typeof car>)
                .filter((key) => !excludedKeys.includes(key))
                .map((key, idx) => (
                  <QuickDetail
                    key={idx}
                    label={key}
                    value={String(car[key] ?? "-")}
                  />
                ))}
            </section>
          </div>
        </div>
      )}
    </>
  );
}
function QuickDetail({ value, label }: { value: string; label: string }) {
  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
      <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">
        {label}
      </p>
      <p className="text-[11px] font-black uppercase  text-black">{value}</p>
    </div>
  );
}

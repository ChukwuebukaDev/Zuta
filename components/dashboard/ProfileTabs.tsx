"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, MessageSquare, ArrowUpRight, Gauge, Settings2, Trash2 } from "lucide-react";
interface DisplayCar {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  thumbnail: string;
  slug: string;
  mileage: number;
  transmission: string;
  status?: string; // 💡 Optional field for dealer inventory status
}


interface ConversationItem {
  id: string;
  carId: string;
  buyerId: string;
  sellerId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  car: {
    id: string;
    brand: string;
    model: string;
    year: number;
    price: number;
    thumbnail: string;
  };
}

interface ProfileTabsProps {
  displayCars: DisplayCar[];
  activeChats: ConversationItem[]; 
   userRole: "BUYER" | "DEALER" | "ADMIN";
}

export default function ProfileTabs({ displayCars, activeChats }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<"saved" | "negotiations">("saved");
  const [savedItems, setSavedItems] = useState<DisplayCar[]>(displayCars);

  const removeSavedItem = async (carId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setSavedItems((prev) => prev.filter((car) => car.id !== carId));
    
    try {
      await fetch("/api/cars/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carId, action: "UNSAVE" }),
      });
    } catch (err) {
      console.error("Failed to update user garage bookmark data:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation Headers */}
      <div className="flex border-b border-slate-900">
        <button
          onClick={() => setActiveTab("saved")}
          className={`px-6 py-3 font-black uppercase tracking-widest text-xs border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "saved"
              ? "border-blue-600 text-white"
              : "border-transparent text-slate-500 hover:text-slate-300"
          }`}
        >
          <Heart size={14} /> My Garage ({savedItems.length})
        </button>
        <button
          onClick={() => setActiveTab("negotiations")}
          className={`px-6 py-3 font-black uppercase tracking-widest text-xs border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "negotiations"
              ? "border-blue-600 text-white"
              : "border-transparent text-slate-500 hover:text-slate-300"
          }`}
        >
          <MessageSquare size={14} /> Active Negotiations ({activeChats.length})
        </button>
      </div>

      {/* --- BOX 1: SAVED GARAGE LISTINGS --- */}
      {activeTab === "saved" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedItems.length === 0 ? (
            <div className="col-span-full py-16 text-center border border-dashed border-slate-900 rounded-3xl text-slate-500">
              <p className="text-sm font-bold uppercase tracking-wider">Your showroom is empty</p>
              <p className="text-xs text-slate-600 mt-1">Bookmark vehicles across the platform to monitor details here.</p>
            </div>
          ) : (
            savedItems.map((car) => (
              <div key={car.id} className="group relative rounded-3xl bg-zinc-900/20 border border-slate-900 overflow-hidden hover:border-slate-800/80 transition duration-200 flex flex-col sm:flex-row gap-4 p-4">
                <div className="relative w-full sm:w-40 h-28 rounded-2xl overflow-hidden bg-zinc-800 border border-slate-800 shrink-0">
                  {car.thumbnail && (
                    <Image 
                      src={car.thumbnail} 
                      alt={car.model} 
                      fill 
                      className="object-cover group-hover:scale-105 transition duration-300" 
                    />
                  )}
                </div>
                
                <div className="flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-sm font-black uppercase italic tracking-tight text-white line-clamp-1">
                        {car.year} {car.brand} {car.model}
                      </h3>
                      <button 
                        onClick={(e) => removeSavedItem(car.id, e)}
                        className="p-1.5 text-slate-600 hover:text-red-400 bg-zinc-950 rounded-lg border border-slate-900 transition-colors animate-none"
                        title="Remove Bookmark"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="text-sm font-black text-blue-400 mt-0.5">₦{car.price.toLocaleString()}</p>
                  </div>

                  <div className="flex gap-4 text-[10px] uppercase font-black tracking-wider text-slate-500">
                    <span className="flex items-center gap-1"><Gauge size={12} /> {car.mileage.toLocaleString()} KM</span>
                    <span className="flex items-center gap-1"><Settings2 size={12} /> {car.transmission}</span>
                  </div>

                  <Link href={`/cars/${car.slug}`} className="text-[10px] uppercase font-black tracking-widest text-slate-400 hover:text-white flex items-center gap-1 self-start transition-colors pt-1">
                    View Vehicle details <ArrowUpRight size={12} />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* --- BOX 2: OPEN DEALS --- */}
      {activeTab === "negotiations" && (
        <div className="space-y-4">
          {activeChats.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-slate-900 rounded-3xl text-slate-500">
              <p className="text-sm font-bold uppercase tracking-wider">No Active Negotiations</p>
              <p className="text-xs text-slate-600 mt-1">Chat threads opened with dealerships appear here.</p>
            </div>
          ) : (
            activeChats.map((chat) => (
              <div key={chat.id} className="p-4 rounded-2xl bg-zinc-900/20 border border-slate-900 hover:border-slate-800 transition duration-150 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-xl bg-zinc-800 overflow-hidden border border-slate-800 shrink-0">
                    {chat.car?.thumbnail && (
                      <Image 
                        src={chat.car.thumbnail} 
                        alt={chat.car.model} 
                        fill 
                        className="object-cover" 
                      />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                      {chat.car?.year} {chat.car?.brand} {chat.car?.model}
                    </h4>
                    <p className="text-sm font-bold text-white mt-0.5 line-clamp-1">
                      Target Valuation: <span className="text-emerald-400 font-black italic">₦{chat.car?.price?.toLocaleString()}</span>
                    </p>
                  </div>
                </div>

                <Link
                  href={`/dashboard/messages/${chat.id}`}
                  className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-black uppercase tracking-widest border border-slate-800 flex items-center gap-2 transition duration-150"
                >
                  Negotiation Desk <ArrowUpRight size={14} />
                </Link>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
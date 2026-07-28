"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  MessageSquare,
  ArrowUpRight,
  Gauge,
  Settings2,
  Trash2,
  Store,
  UserCheck,
  Edit3,
  EyeOff,
} from "lucide-react";
import { formatPrice } from "@/utilities/currency";
import { RejectionDetailsModal } from "../seller/RejectionDetailModal";
import { ListingDetails } from "../seller/ListingDetails";

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
  status?: string;
  sellerType?: "PRIVATE" | "DEALER";
  listingStatus?: string;
  rejectionReason?: string | null;
  adminFeedback?: string | null;
  rejectedAt?: string | Date | null;
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
  userRole: "USER" | "DEALER" | "ADMIN";
}

export default function ProfileTabs({
  displayCars,
  activeChats,
  userRole,
}: ProfileTabsProps) {
  const isDealer = userRole === "DEALER";
const [isModalOpen, setIsModalOpen] = useState(false);
const [openListDetails, setOpenListDetails] = useState(false);

  // A standard 'USER' who has uploaded inventory functions as a Private Seller
  const isPrivateSeller =
    userRole === "USER" &&
    displayCars.some((car) => car.sellerType === "PRIVATE");

  const [activeTab, setActiveTab] = useState<"inventory" | "negotiations">(
    "inventory",
  );
  const [itemsList, setItemsList] = useState<DisplayCar[]>(displayCars);

  useEffect(() => {
    setTimeout(() => setItemsList(displayCars), 0);
  }, [displayCars]);

  const removeSavedItem = async (carId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setItemsList((prev) => prev.filter((car) => car.id !== carId));

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

  // 🛠️ Action Handler for Private Sellers updating status flags natively
  const toggleListingVisibility = async (
    carId: string,
    currentStatus: string | undefined,
    e: React.MouseEvent,
  ) => {
    e.preventDefault();
    const nextStatus = currentStatus === "AVAILABLE" ? "ARCHIVED" : "AVAILABLE";

    setItemsList((prev) =>
      prev.map((car) =>
        car.id === carId ? { ...car, status: nextStatus } : car,
      ),
    );

    try {
      await fetch(`/api/cars/${carId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
    } catch (err) {
      console.error("Failed to toggle listing active visibility bounds:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation Tabs Header */}
      <div className="flex border-b border-slate-900 bg-zinc-950/40 backdrop-blur-md rounded-t-xl overflow-hidden">
        <button
          onClick={() => setActiveTab("inventory")}
          className={`px-6 py-4 font-black uppercase tracking-widest text-xs border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "inventory"
              ? "border-blue-600 text-white bg-zinc-900/30"
              : "border-transparent text-slate-500 hover:text-slate-300"
          }`}
        >
          {isDealer ? (
            <>
              <Store size={14} className="text-blue-400" /> My Showroom (
              {itemsList.length})
            </>
          ) : isPrivateSeller ? (
            <>
              <UserCheck size={14} className="text-indigo-400" /> My Postings (
              {itemsList.length})
            </>
          ) : (
            <>
              <Heart size={14} className="text-pink-500" /> My Garage (
              {itemsList.length})
            </>
          )}
        </button>

        <button
          onClick={() => setActiveTab("negotiations")}
          className={`px-6 py-4 font-black uppercase tracking-widest text-xs border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "negotiations"
              ? "border-blue-600 text-white bg-zinc-900/30"
              : "border-transparent text-slate-500 hover:text-slate-300"
          }`}
        >
          <MessageSquare size={14} className="text-emerald-400" />
          {isDealer ? "Client Leads" : "Active Negotiations"} (
          {activeChats.length})
        </button>
      </div>

      {/* --- TAB 1: SHOWROOM / POSTINGS / GARAGE GRID --- */}
      {activeTab === "inventory" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {itemsList.length === 0 ? (
            <div className="col-span-full py-16 text-center border border-dashed border-slate-900 rounded-3xl text-slate-500 bg-zinc-950/10">
              <p className="text-sm font-bold uppercase tracking-wider">
                {isDealer
                  ? "Your showroom inventory is empty"
                  : isPrivateSeller
                    ? "You haven't posted any vehicles"
                    : "Your garage is empty"}
              </p>
              <p className="text-xs text-slate-600 mt-1.5 max-w-sm mx-auto leading-relaxed">
                {isDealer || isPrivateSeller
                  ? "Launch and register vehicles using the secure Zuta Sell Desk to begin receiving offers."
                  : "Bookmark vehicles across the marketplace to track performance metrics here."}
              </p>
            </div>
          ) : (
            itemsList.map((car) => (
              <div
                key={car.id}
                className="group relative rounded-3xl bg-zinc-900/10 border border-slate-900 overflow-hidden hover:border-slate-800/80 transition-all duration-300 flex flex-col sm:flex-row gap-4 p-4"
              >
                {/* Thumbnail Frame */}
                <div className="relative w-full sm:w-40 h-28 rounded-2xl overflow-hidden bg-zinc-800 border border-slate-800 shrink-0">
                  {car.listingStatus === "REJECTED" && (<div className="absolute inset-0 z-2000 bg-black/10 backdrop-blur-md animate-in fade-in duration-200">
                      <div className="flex justify-center items-center h-full">
                       <Image
                      src='/images/rejected.png'
                      alt='listing rejected'
                      fill
                      className="object-cover group-hover:scale-103 transition duration-500"
                    />
                      </div>
                  </div>)}
                  {car.thumbnail && (
                    <Image
                      src={car.thumbnail}
                      alt={car.model}
                      fill
                      className="object-cover group-hover:scale-103 transition duration-500"
                    />
                  )}
                </div>

                {/* Information Segment */}
                <div className="flex-1 flex flex-col justify-between space-y-3 min-w-0">
                  <div>
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="text-xs sm:text-sm font-black uppercase italic tracking-tight text-white truncate">
                        {car.year} {car.brand} {car.model}
                      </h3>

                      {/* Trash Icon: Only visible for regular users reading bookmarked items */}
                      {!isDealer && !isPrivateSeller && (
                        <button
                          onClick={(e) => removeSavedItem(car.id, e)}
                          className="p-1.5 text-slate-600 hover:text-red-400 bg-zinc-950 rounded-lg border border-slate-900 transition-colors cursor-pointer shrink-0"
                          title="Remove Bookmark"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                    {/* Integrated Official Currency Formatting Utility */}
                    <p className="text-sm font-black text-blue-400 mt-0.5 antialiased">
                      {formatPrice(car.price)}
                    </p>
                  </div>

                  <div className="flex gap-4 text-[10px] uppercase font-bold tracking-wider text-slate-500">
                    <span className="flex items-center gap-1">
                      <Gauge size={12} className="text-slate-600" />{" "}
                      {car.mileage.toLocaleString()} KM
                    </span>
                    <span className="flex items-center gap-1">
                      <Settings2 size={12} className="text-slate-600" />{" "}
                      {car.transmission}
                    </span>
                  </div>

                  {/* Operational Controls Footer Footer */}
                  <div className="flex justify-between items-center pt-1.5 border-t border-slate-900/60 mt-auto">
                    <button
                      onClick={()=>setOpenListDetails(true)}
                      className="text-[10px] uppercase font-black tracking-widest text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      View details <ArrowUpRight size={12} />
                    </button>

                    {/* 🛠️ PRESENTATION UPGRADE: Modification Management suite for Sellers */}
                    {isDealer || isPrivateSeller ? (
                      <div className="flex items-center gap-2">
                        {/* Toggle Active Status Button */}
                        <button
                          onClick={(e) =>
                            toggleListingVisibility(car.id, car.status, e)
                          }
                          className="p-1.5 rounded-lg bg-zinc-950 border border-slate-900 text-slate-400 hover:text-white transition cursor-pointer"
                          title={
                            car.status === "AVAILABLE"
                              ? "Archive Listing"
                              : "Activate Listing"
                          }
                        >
                          {car.status === "AVAILABLE" ? (
                            <EyeOff size={12} />
                          ) : (
                            <ArrowUpRight size={12} />
                          )}
                        </button>

                        {/* Direct Navigation Route to Edit Matrix */}
                        <Link
                          href={`/dashboard/inventory/${car.id}/edit`}
                          className="p-1.5 rounded-lg bg-zinc-950 border border-slate-900 text-blue-400 hover:text-blue-300 transition flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2"
                        >
                          <Edit3 size={11} />
                          <span>Modify</span>
                        </Link>

                        {/* Status Pin Indicator */}
                        {car.status && car.listingStatus === "APPROVED" && (
                          <span
                            className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                              car.status === "AVAILABLE"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : "bg-slate-800 text-slate-400 border-slate-700"
                            }`}
                          >
                            {car.status}
                          </span>
                        )}

                        {car.listingStatus === "REJECTED" ? (
                          <button onClick={()=>setIsModalOpen(true)} className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border bg-red-700/80 hover:bg-red-700 border-emerald-500/20">
                            {car.listingStatus + ", Why?"}
                          </button>
                        ) : (
                          <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border bg-yellow-500/50  border-emerald-500/20">
                            {car.listingStatus}
                          </span>
                        )}
                      </div>
                    ) : (
                      /* Standard Layout Fallback Badge for Buyers viewing bookmark cards */
                      car.status && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border bg-zinc-950 border-slate-900 text-slate-400">
                          {car.status}
                        </span>
                      )
                    )}
                    <RejectionDetailsModal
                      carId={car.id}
                      carTitle={`${car.year} ${car.brand} ${car.model}`}
                      rejectionReason={car.rejectionReason}
                      adminFeedback={car.adminFeedback}
                      rejectedAt={car.rejectedAt}
                      isOpen={isModalOpen}
                      onClose={() => setIsModalOpen(false)}
                    />
                    <ListingDetails car={car} openModal={openListDetails} closeModal={() => setOpenListDetails(false)}/>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* --- TAB 2: ACTIVE DISKS NEGOTIATIONS --- */}
      {activeTab === "negotiations" && (
        <div className="space-y-4">
          {activeChats.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-slate-900 rounded-3xl text-slate-500 bg-zinc-950/10">
              <p className="text-sm font-bold uppercase tracking-wider">
                No Active Conversations
              </p>
              <p className="text-xs text-slate-600 mt-1.5">
                {isDealer || isPrivateSeller
                  ? "Incoming offers from potential vehicle buyers will appear here."
                  : "Chat threads opened with vehicle sellers appear here."}
              </p>
            </div>
          ) : (
            activeChats.map((chat) => (
              <div
                key={chat.id}
                className="p-4 rounded-2xl bg-zinc-900/10 border border-slate-900 hover:border-slate-800 transition duration-150 flex items-center justify-between gap-4"
              >
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
                    <p className="text-xs font-semibold text-slate-300 mt-0.5">
                      Target Valuation:{" "}
                      <span className="text-emerald-400 font-black italic">
                        {formatPrice(chat.car?.price)}
                      </span>
                    </p>
                  </div>
                </div>

                <Link
                  href={`/dashboard/messages/${chat.id}`}
                  className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-black uppercase tracking-widest border border-slate-800 flex items-center gap-2 transition duration-150 shrink-0"
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

"use client";

import { useState, useRef, useEffect } from "react";
import { Star, ShieldCheck, MapPin, Calendar, Phone, Send, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SellerProfile, MessageItem, MiniListingCard } from "@/types/seller/contact.types";

interface ContactSellerProps {
  seller: SellerProfile;
  otherListings: MiniListingCard[];
  currentUserId?: string;
}

export default function ContactSellerSection({ seller, otherListings, currentUserId = "user_guest" }: ContactSellerProps) {
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: "init_1",
      senderId: seller.id,
      text: `Hello! Thanks for your interest in this vehicle. Let me know if you want to schedule an inspection or ask any questions!`,
      timestamp: "Just now",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat box to latest sent message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage: MessageItem = {
      id: `msg_${Date.now()}`,
      senderId: currentUserId,
      text: inputMessage,
      timestamp: "1 min ago",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");

    // Mock auto-reply simulate conversation experience
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `reply_${Date.now()}`,
          senderId: seller.id,
          text: "Received! Let me check the availability with the lot supervisor and get back to you immediately.",
          timestamp: "Just now",
        },
      ]);
    }, 1500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 bg-zinc-950 text-slate-100 min-h-2/3">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Premium Chat Box Interaction Framework */}
        <div className="lg:col-span-2 flex flex-col h-86 bg-zinc-900/60 border border-slate-800 rounded-2xl overflow-hidden">
          {/* Chat Box Header Context */}
          <div className="p-4 border-b border-slate-800/80 bg-zinc-900 flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                Direct Message with {seller.name}
              </h3>
              <p className="text-xs text-slate-400">Typically responds within 15 minutes</p>
            </div>
          </div>

          {/* Interactive Message Feed Panel */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-zinc-950/20">
            {messages.map((msg) => {
              const isMe = msg.senderId === currentUserId;
              return (
                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${
                    isMe 
                      ? "bg-blue-600 text-white rounded-br-none" 
                      : "bg-slate-900 text-slate-200 border border-slate-800/60 rounded-bl-none"
                  }`}>
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    <span className="text-[10px] block mt-1 opacity-60 text-right">{msg.timestamp}</span>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Submission Form Input Wrapper */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800/80 bg-zinc-900">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Ask about availability, location, or negotiable price..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="w-full bg-zinc-950 border border-slate-800 focus:border-blue-500/80 rounded-xl py-3 pl-4 pr-12 text-sm text-white outline-none placeholder:text-slate-500 transition duration-150"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="absolute right-2 p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 transition duration-150"
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: Seller Credentials Profile Card & Listings */}
        <div className="space-y-6">
          {/* Main Verified Card Segment */}
          <div className="bg-zinc-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border border-slate-700 bg-zinc-800">
                <Image
                  src={seller.avatarUrl || "/placeholder-avatar.png"}
                  alt={seller.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold text-white text-base flex items-center gap-1.5">
                  {seller.name}
                  {seller.listingStatus && <ShieldCheck size={16} className="text-blue-400 fill-blue-400/10" />}
                </h4>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <span className="text-xs font-medium text-slate-200">{seller.rating}</span>
                  <span className="text-xs text-slate-500">({seller.totalReviews} reviews)</span>
                </div>
              </div>
            </div>

            <hr className="border-slate-800/80" />

            {/* Quick Context Lines */}
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-slate-500" />
                <span>{seller.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-slate-500" />
                <span>Dealer since {seller.joinedDate}</span>
              </div>
            </div>

            {/* Direct Phone Reveal Trigger Action */}
            <a
              href={`tel:${seller.phoneNumber}`}
              className="flex items-center justify-center gap-2 w-full h-11 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 transition duration-150"
            >
              <Phone size={14} />
              <span>Call Seller ({seller.phoneNumber})</span>
            </a>
          </div>

          {/* Mini Portfolio Subgrid - "Other Listings by Dealership" */}
          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <h5 className="text-xs font-bold text-slate-400 tracking-wider uppercase">Other Inventory</h5>
              <Link href={`/dealers/${seller.id}`} className="text-xs text-blue-400 hover:underline flex items-center gap-1">
                View All <ExternalLink size={10} />
              </Link>
            </div>

            <div className="space-y-2">
              {otherListings.map((listing) => (
                <Link
                  key={listing.slug}
                  href={`/cars/${listing.slug}`}
                  className="flex gap-3 p-2 bg-zinc-900/40 hover:bg-zinc-900 border border-slate-800/40 hover:border-slate-800 rounded-xl transition duration-150 group"
                >
                  <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-zinc-800 shrink-0">
                    <Image
                      src={listing.thumbnail}
                      alt={listing.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <h6 className="text-xs font-medium text-slate-200 group-hover:text-blue-400 truncate transition-colors">
                      {listing.year} {listing.title}
                    </h6>
                    <p className="text-xs font-semibold text-white tracking-tight">
                      {listing.price}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
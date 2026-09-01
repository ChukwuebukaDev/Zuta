"use client";

import { useState, useRef, useEffect } from "react";
import { Star, ShieldCheck, MapPin, Phone, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  SellerProfile,
  MessageItem,
  MiniListingCard,
} from "@/types/seller/contact.types";
import CandidateBadge from "@/utilities/CandidateBadge";



interface ContactSellerProps {
  seller: SellerProfile;
  otherListings: MiniListingCard[];
  currentUserId: string;
  carId: string;
}

interface PrismaMessageIncoming {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string | Date;
}

export default function ContactSellerSection({
  seller,
  otherListings,
  currentUserId,
  carId,
}: ContactSellerProps) {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [canMessage, setCanMessage] = useState(true);
  const [whoseTurn, setWhoseTurn] = useState<"YOU" | "THEM">("YOU");
  const [consecutiveCount, setConsecutiveCount] = useState(0);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const activeConversationIdRef = useRef<string | null>(null);
  const lastCheckedRef = useRef<string>(new Date().toISOString());

  const hasConversation = messages.length > 1;
  const router = useRouter();

  const isDealer = seller.role === "DEALER" && seller.role;

  useEffect(() => {
    let isMounted = true;

    // Flush active states cleanly without causing state race conditions
    activeConversationIdRef.current = null;
    lastCheckedRef.current = new Date().toISOString();

    setTimeout(() => {
      setMessages([
        {
          id: "init_1",
          senderId: seller.id,
          text: `Hello! Thanks for your interest in this vehicle. Let me know if you want to schedule an inspection or ask any questions!`,
          timestamp: "Just now",
        },
      ]);
    }, 0);
    const checkExistingConversation = async () => {
      if (!currentUserId || currentUserId === "user_guest") return;

      try {
        const response = await fetch(`/api/messages/${carId}`);
        if (!response.ok) return;

        const data = await response.json();

        if (isMounted && data.exists) {
          activeConversationIdRef.current = data.conversationId;
          setCanMessage(data.canMessage ?? true);
          setWhoseTurn(data.whoseTurn ?? "YOU");
          setConsecutiveCount(data.consecutiveCount ?? 0);

          const parsedMessages = data.messages.map(
            (msg: PrismaMessageIncoming) => ({
              id: msg.id,
              senderId: msg.senderId,
              text: msg.text,
              timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            }),
          );

          setMessages((prev) => [prev[0], ...parsedMessages]);
        }
      } catch (err) {
        console.error("Fetch error restoring session window:", err);
      }
    };

    checkExistingConversation();

    return () => {
      isMounted = false;
    };
  }, [carId, currentUserId, seller.id]);

  // Polling Streamer Framework (Decoupled from dependency chains to prevent memory leaks)
  useEffect(() => {
    const pollForCounterOffers = async () => {
      if (!activeConversationIdRef.current) return;

      try {
        const queryParams = `?conversationId=${activeConversationIdRef.current}&lastChecked=${encodeURIComponent(lastCheckedRef.current)}`;
        const response = await fetch(`/api/messages/poll${queryParams}`);
        if (!response.ok) return;

        const rawData: unknown = await response.json();

        if (Array.isArray(rawData) && rawData.length > 0) {
          const typedMessages = rawData as PrismaMessageIncoming[];
          lastCheckedRef.current = new Date(
            typedMessages[typedMessages.length - 1].createdAt,
          ).toISOString();

          const incomingPackets: MessageItem[] = typedMessages.map((msg) => ({
            id: msg.id,
            senderId: msg.senderId,
            text: msg.text,
            timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          }));

          setMessages((prev) => {
            const existingIds = new Set(prev.map((m) => m.id));
            const uniqueIncoming = incomingPackets.filter(
              (m) => !existingIds.has(m.id),
            );
            return [...prev, ...uniqueIncoming];
          });

          // Fetch fresh contextual thread states following external payloads
          const stateCheck = await fetch(`/api/messages/${carId}`);
          if (stateCheck.ok) {
            const freshData = await stateCheck.json();
            setCanMessage(freshData.canMessage);
            setWhoseTurn(freshData.whoseTurn);
            setConsecutiveCount(freshData.consecutiveCount);
          }
        }
      } catch (err) {
        console.warn("Public polling interval skipped temporarily:", err);
      }
    };

    const syncHeartbeat = setInterval(pollForCounterOffers, 4000);
    return () => clearInterval(syncHeartbeat);
  }, [carId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isSending || !canMessage) return;

    const temporaryText = inputMessage;
    setInputMessage("");
    setIsSending(true);

    const optimisticMessage: MessageItem = {
      id: `temp_${Date.now()}`,
      senderId: currentUserId,
      text: temporaryText,
      timestamp: "Sending...",
    };
    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      const response = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carId,
          sellerId: seller.id,
          text: temporaryText,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          toast(
            "You need to be signed in to send messages. Would you like to sign in now?",
            {
              duration: 60000,
              action: {
                label: "Yes, Sign Me In",
                onClick: () => router.push("/sign-in"),
              },
              cancel: {
                label: "Cancel",
                onClick: () => toast.error("Canceled"),
              },
            },
          );
          return;
        }
        if (response.status === 403 || response.status === 429) {
          toast.warning(data.error || "Action restricted.");

          const refresh = await fetch(`/api/messages/${carId}`);
          if (refresh.ok) {
            const status = await refresh.json();
            setCanMessage(status.canMessage);
            setWhoseTurn(status.whoseTurn);
          }
          setMessages((prev) =>
            prev.filter((m) => m.id !== optimisticMessage.id),
          );
          setInputMessage(temporaryText);
          return;
        }
        throw new Error(data.error || "Failed to send message.");
      }

      if (data.conversationId)
        activeConversationIdRef.current = data.conversationId;

      setMessages((prev) =>
        prev.map((m) =>
          m.id === optimisticMessage.id
            ? {
                ...m,
                id: data.id,
                timestamp: new Date(data.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              }
            : m,
        ),
      );

      lastCheckedRef.current = new Date(data.createdAt).toISOString();

      const postCheck = await fetch(`/api/messages/${carId}`);
      if (postCheck.ok) {
        const p = await postCheck.json();
        setCanMessage(p.canMessage);
        setWhoseTurn(p.whoseTurn);
      }
    } catch (err) {
      console.error("Message Routing Error:", err);
      toast.error(err instanceof Error ? err.message : "Connection failed.");
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMessage.id));
      setInputMessage(temporaryText);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full p-4 lg:p-8 bg-zinc-950 text-slate-100 rounded-[2.5rem]">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT PANEL: Chat Window */}
        <div className="lg:col-span-2 flex flex-col h-[500px] bg-zinc-900/60 border border-slate-800/80 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-800/80 bg-zinc-900 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Zuta Secure Escrow Brokerage Desk with {seller.name}
              </h3>
            </div>

            {hasConversation && (
              <div className="text-[10px] uppercase font-black tracking-wider flex items-center gap-3">
                <span
                  className={
                    whoseTurn === "YOU" ? "text-amber-400" : "text-slate-400"
                  }
                >
                  {whoseTurn === "YOU" ? "● Your Turn" : "○ Awaiting Reply"}
                </span>
                {consecutiveCount > 0 && (
                  <span className="text-slate-500 border-l border-slate-800 pl-3">
                    Unreplied: {consecutiveCount}/3
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-zinc-950/20">
            {messages.map((msg) => {
              const isMe = msg.senderId === currentUserId;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 text-sm ${
                      isMe
                        ? "bg-blue-600 text-white rounded-br-none font-medium"
                        : "bg-slate-900 text-slate-200 border border-slate-800/60 rounded-bl-none"
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </p>
                    <span className="text-[9px] block mt-1 opacity-50 text-right uppercase tracking-tighter">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-slate-800/80 bg-zinc-900"
          >
            <div className="relative flex items-center">
              <input
                type="text"
                disabled={isSending || !canMessage}
                placeholder={
                  canMessage
                    ? "Type your protective encrypted counter-offer here..."
                    : "Input locked. Wait for the seller to reply to unlock thread slots."
                }
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="w-full bg-zinc-950 border border-slate-800 focus:border-blue-500 rounded-xl py-3 pl-4 pr-12 text-sm text-white outline-none transition duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isSending || !canMessage}
                className="absolute right-2 p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 transition duration-150"
              >
                <Send size={14} />
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT PANEL: Sidebar Profile Specifications */}
        <div className="space-y-6">
          <div className="bg-zinc-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-700 bg-zinc-800">
                {seller.avatarUrl ? (
                  <Image
                    src={seller.avatarUrl}
                    alt={seller.name || "Seller Avatar"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-slate-400 bg-zinc-800">
                    {seller.name ? seller.name[0] : "S"}
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-bold text-white text-sm flex items-center gap-1.5 uppercase italic tracking-tight">
                  {seller.name}
                  {seller.listingStatus && (
                    <ShieldCheck
                      size={14}
                      className="text-blue-400 fill-blue-400/10"
                    />
                  )}
                </h4>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star size={12} className="text-amber-400 fill-amber-400" />
                  <span className="text-xs font-bold text-slate-300">
                    {seller.rating}
                  </span>
                </div>
              </div>
            </div>

            <hr className="border-slate-800/60" />

            <div className="space-y-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin size={12} /> <span>{seller.location}</span>
              </div>
              <div className="flex items-center gap-2">
                {isDealer ? <>
                <CandidateBadge role = 'DEALER'/> 
                <span>Verified Dealer</span>
                </> : <span>Private Seller</span>}
              </div>
            </div>

            <a
              href={`tel:${seller.phoneNumber}`}
              className="flex items-center justify-center gap-2 w-full h-12 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl text-xs font-black uppercase tracking-widest text-slate-200 transition"
            >
              <Phone size={12} />
              <span>Call Via Proxy Line</span>
            </a>
          </div>

          {/* Sub-portfolio mapping */}
          <div className="space-y-2">
            <h5 className="text-[10px] font-black tracking-widest text-slate-500 uppercase px-1">
              Other Sibling Stock
            </h5>
            {otherListings.map((listing) => (
              <Link
                key={listing.slug}
                href={`/cars/${listing.slug}`}
                className="flex gap-3 p-2 bg-zinc-900/30 border border-slate-900 hover:border-slate-800 rounded-xl transition group"
              >
                <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-zinc-800 shrink-0">
                  {listing.thumbnail && (
                    <Image
                      src={listing.thumbnail}
                      alt={listing.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h6 className="text-xs font-bold text-slate-300 truncate group-hover:text-blue-400 transition-colors uppercase italic">
                    {listing.title}
                  </h6>
                  <p className="text-xs font-black text-white mt-0.5">
                    {listing.price.toLocaleString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

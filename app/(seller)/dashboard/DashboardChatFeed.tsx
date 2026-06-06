"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

interface DashboardChatFeedProps {
  initialMessages: ChatMessage[];
  conversationId: string;
  currentUserId: string;
  carId: string;
  sellerId: string;
}

export default function DashboardChatFeed({
  initialMessages,
  conversationId,
  currentUserId,
  carId,
  sellerId,
}: DashboardChatFeedProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isSending) return;

    const temporaryText = inputMessage;
    setInputMessage("");
    setIsSending(true);

    const optimisticMsg: ChatMessage = {
      id: `dash_temp_${Date.now()}`,
      senderId: currentUserId,
      text: temporaryText,
      timestamp: "Sending...",
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      const response = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carId,
          sellerId,
          text: temporaryText,
        }),
      });

      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();

      setMessages((prev) =>
        prev.map((m) =>
          m.id === optimisticMsg.id
            ? {
                id: data.id,
                senderId: currentUserId,
                text: data.text,
                timestamp: new Date(data.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              }
            : m
        )
      );
    } catch (err) {
      console.error("Dashboard router trace failed:", err);
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
      setInputMessage(temporaryText);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[550px]">
      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-2xl p-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  isMe
                    ? "bg-blue-600 text-white rounded-br-none font-medium"
                    : "bg-slate-900 text-slate-200 border border-slate-800/80 rounded-bl-none"
                }`}
              >
                <p>{msg.text}</p>
                <span className="text-[9px] block mt-1 opacity-50 text-right uppercase tracking-tighter">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* Input Action Form */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-900 bg-zinc-900/60">
        <div className="relative flex items-center">
          <input
            type="text"
            disabled={isSending}
            placeholder="Write your protective counter offer response..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="w-full bg-zinc-950 border border-slate-800 focus:border-blue-500 text-slate-100 rounded-xl py-3 pl-4 pr-12 text-sm outline-none transition duration-150 placeholder:text-slate-500"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isSending}
            className="absolute right-2 p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 transition duration-150"
          >
            <Send size={14} />
          </button>
        </div>
      </form>
    </div>
  );
}
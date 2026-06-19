"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  rawCreatedAt?: string;
}

interface DashboardChatFeedProps {
  initialMessages: ChatMessage[];
  conversationId: string;
  currentUserId: string;
  carId: string;
  recipientId: string;
}

interface PrismaMessagePayload {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string | Date;
}

export default function DashboardChatFeed({
  initialMessages,
  conversationId,
  currentUserId,
  carId,
  recipientId,
}: DashboardChatFeedProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const lastCheckedRef = useRef<string>("");




  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  useEffect(() => {
    if (!conversationId) return;
    
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const pollForNewMessages = async () => {
      try {
        const params = new URLSearchParams({
          conversationId: conversationId,
          lastChecked: lastCheckedRef.current
        });

        const response = await fetch(`/api/messages/poll?${params.toString()}`);
        if (!response.ok || !isMounted) return;

        const rawData: unknown = await response.json();
        
        // Final guard verifying user hasn't skipped to another chat during network call
        if (Array.isArray(rawData) && isMounted) {
          const typedMessages = rawData as PrismaMessagePayload[];
          
          if (typedMessages.length > 0) {
            const incomingPackets: ChatMessage[] = typedMessages.map((msg) => ({
              id: msg.id,
              senderId: msg.senderId,
              text: msg.text,
              rawCreatedAt: new Date(msg.createdAt).toISOString(),
              timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            }));

            setMessages((prev) => {
              const existingIds = new Set(prev.map((m) => m.id));
              const uniqueIncoming = incomingPackets.filter((m) => !existingIds.has(m.id));
              return [...prev, ...uniqueIncoming];
            });

            const finalRecord = typedMessages[typedMessages.length - 1];
            lastCheckedRef.current = new Date(finalRecord.createdAt).toISOString();
          }
        }
      } catch (err) {
        console.warn("Polling interval skipped temporarily:", err);
      } finally {
        // Schedule next poll execution recursively only if still on this active screen
        if (isMounted) {
          timeoutId = setTimeout(pollForNewMessages, 4000);
        }
      }
    };

    // Kickstart sequence
    timeoutId = setTimeout(pollForNewMessages, 4000);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [conversationId]);



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
        conversationId, 
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
              rawCreatedAt: new Date(data.createdAt).toISOString(),
              timestamp: new Date(data.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            }
          : m
      )
    );

    lastCheckedRef.current = new Date(data.createdAt).toISOString();
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
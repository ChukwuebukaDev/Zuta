import { createClient } from "@/supabase/server";
import { redirect, notFound } from "next/navigation";
import { prisma as db } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ArrowUpRight } from "lucide-react";
import DashboardChatFeed from "../../dashboard/DashboardChatFeed"

interface MessageDetailsPageProps {
  params: Promise<{ conversationId: string }> | { conversationId: string };
}

export default async function MessageDetailsPage({ params }: MessageDetailsPageProps) {
  // 1. Initialize Supabase Server client instance and fetch active browser session context
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  
  if (!authUser) redirect("/login");

  const resolvedParams = await params;
  const { conversationId } = resolvedParams;

  // 2. Query conversation details directly from your database
  const conversation = await db.conversation.findUnique({
    where: { id: conversationId },
    include: {
      car: {
        select: {
          id: true,
          brand: true,
          model: true,
          year: true,
          price: true,
          thumbnail: true,
          slug: true,
        },
      },
      buyer: { 
        select: { 
          id: true, 
          name: true 
        } 
      },
      seller: { 
        select: { 
          id: true, 
          name: true 
        } 
      },
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  // Verify conversation exists and the active user is a legitimate participant
  if (!conversation) notFound();
  if (conversation.buyerId !== authUser.id && conversation.sellerId !== authUser.id) {
    redirect("/dashboard/messages");
  }

  // Determine who the conversational counterpart is
  const isUserBuyer = conversation.buyerId === authUser.id;
  const chatPartner = isUserBuyer ? conversation.seller : conversation.buyer;

  const formattedMessages = conversation.messages.map((msg) => ({
    id: msg.id,
    senderId: msg.senderId,
    text: msg.text,
    rawCreatedAt: new Date(msg.createdAt).toISOString(),
    timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-5xl mx-auto bg-zinc-950 min-h-screen text-slate-100 rounded-3xl border border-slate-900">
      {/* Top Breadcrumb Context Line */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/messages"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={16} /> Back to Messages
        </Link>
      </div>

      {/* Embedded Context Header: Vehicle Metadata + Chat Partner Profile */}
      <div className="p-4 rounded-2xl bg-zinc-900/40 border border-slate-900 flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-zinc-800 border border-slate-800 shrink-0">
            {conversation.car.thumbnail && (
              <Image
                src={conversation.car.thumbnail}
                alt={conversation.car.model}
                fill
                className="object-cover"
              />
            )}
          </div>
          <div>
            <h1 className="text-sm font-black uppercase italic tracking-tight text-white">
              {conversation.car.year} {conversation.car.brand} {conversation.car.model}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              Negotiation Desk with <span className="text-blue-400 font-bold">{chatPartner?.name || "Verified Dealer"}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 self-end sm:self-center">
          <div className="text-right">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Listing Value</p>
            <p className="text-base font-black text-white italic tracking-tighter">
              ₦{conversation.car.price.toLocaleString()}
            </p>
          </div>
          <Link
            href={`/cars/${conversation.car.slug}`}
            className="p-3 bg-zinc-900 hover:bg-zinc-800 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white rounded-xl transition duration-150"
            title="View original vehicle listing detail page"
          >
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      {/* Main Interactive Client Component Chat Window */}
      <div className="rounded-2xl overflow-hidden border border-slate-900 bg-zinc-900/20">
        <DashboardChatFeed
          key={conversation.id} 
          initialMessages={formattedMessages}
          conversationId={conversation.id}
          currentUserId={authUser.id}
          carId={conversation.car.id}
          recipientId={chatPartner?.id || ""}
        />
      </div>
    </div>
  );
}
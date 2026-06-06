import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export default async function MailboxPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  // Fetch all conversations where the logged-in user is either the buyer OR the seller
  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [
        { buyerId: user.id },
        { sellerId: user.id }
      ]
    },
    include: {
      car: {
        select: {
          brand: true,
          model: true,
          year: true,
          thumbnail: true,
          price: true
        }
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1
      }
    },
    orderBy: { updatedAt: "desc" }
  });

  return (
    <div className="p-6 bg-zinc-950 min-h-screen text-slate-100 rounded-3xl border border-slate-900">
      <h1 className="text-2xl font-black uppercase italic tracking-tighter mb-6">
        Secure <span className="text-slate-400">Message Box</span>
      </h1>

      {conversations.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-zinc-900/20">
          <p className="text-sm text-slate-400">No active negotiations or messages found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 max-w-4xl">
          {conversations.map((convo) => {
            const lastMessage = convo.messages[0]?.text || "Conversation started...";
            
            return (
              <Link
                key={convo.id}
                href={`/dashboard/messages/${convo.id}`}
                className="flex items-center gap-4 p-4 bg-zinc-900/40 hover:bg-zinc-900 border border-slate-900 hover:border-slate-800 rounded-2xl transition duration-150 group"
              >
                {/* Vehicle Aspect Mini Thumbnail */}
                <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-zinc-800 shrink-0">
                  {convo.car.thumbnail && (
                    <Image
                      src={convo.car.thumbnail}
                      alt={convo.car.model}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>

                {/* Meta details preview text line */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h2 className="text-sm font-bold text-slate-200 group-hover:text-blue-400 transition-colors truncate uppercase italic">
                      {convo.car.year} {convo.car.brand} {convo.car.model}
                    </h2>
                    <span className="text-[10px] font-black text-slate-500 tracking-tight">
                      ₦{convo.car.price.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate tracking-tight">
                    {lastMessage}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
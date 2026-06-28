import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import { prisma as db } from "@/lib/prisma";
import { MapPin, Calendar, Heart, MessageSquare, ShieldCheck, Store } from "lucide-react";
import ProfileTabs from "@/components/dashboard/ProfileTabs";
import Link from "next/link";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  
  if (!authUser) redirect("/login");

  // 2. Fetch complete user profile along with relational hooks for BOTH roles
  let user = await db.user.findUnique({
    where: { id: authUser.id },
    include: {
      dealerProfile: true, // Used to read dealership parameters if seller
      buyerConversations: {
        include: {
          car: {
            select: {
              id: true,
              brand: true,
              model: true,
              year: true,
              price: true,
              thumbnail: true,
            },
          },
        },
        orderBy: { updatedAt: "desc" },
      },
      sellerConversations: { // Used to read inbound client conversations for sellers
        include: {
          car: {
            select: {
              id: true,
              brand: true,
              model: true,
              year: true,
              price: true,
              thumbnail: true,
            },
          },
        },
        orderBy: { updatedAt: "desc" },
      },
    },
  });

  // 3. Fallback database sync layer for newly authorized entries
  if (!user) {
    user = await db.user.create({
      data: {
        id: authUser.id,
        name: authUser.user_metadata?.name || "Verified User",
        email: authUser.email || "",
        role: "BUYER",
        onboardingComplete: false,
        savedCarIds: [],
      },
      include: {
        dealerProfile: true,
        buyerConversations: {
          include: { car: { select: { id: true, brand: true, model: true, year: true, price: true, thumbnail: true } } },
          orderBy: { updatedAt: "desc" },
        },
        sellerConversations: {
          include: { car: { select: { id: true, brand: true, model: true, year: true, price: true, thumbnail: true } } },
          orderBy: { updatedAt: "desc" },
        },
      },
    });
  }

  const isSeller = user.role === "DEALER";

  // 4. Fetch inventory or bookmarks based on dynamic user context
  let displayCars = [];
  if (isSeller) {
    // Fetch cars belonging to this specific user/dealer listing pipeline
    displayCars = await db.car.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        brand: true,
        model: true,
        year: true,
        price: true,
        thumbnail: true,
        slug: true,
        mileage: true,
        transmission: true,
        status: true, // Let sellers see AVAILABLE/SOLD context badges
      },
      orderBy: { createdAt: "desc" },
    });
  } else {
    // Fetch standard buyer scalar bookmarks selection block
    displayCars = user.savedCarIds.length > 0
      ? await db.car.findMany({
          where: { id: { in: user.savedCarIds } },
          select: {
            id: true,
            brand: true,
            model: true,
            year: true,
            price: true,
            thumbnail: true,
            slug: true,
            mileage: true,
            transmission: true,
          },
        })
      : [];
  }

  // 5. Configure layout content based on target profile type
  const profileData = {
    name: isSeller && user.dealerProfile?.businessName ? user.dealerProfile.businessName : (user.name || "Verified User"),
    email: user.email || "",
    avatarUrl: isSeller && user.dealerProfile?.logo ? user.dealerProfile.logo : null, // Clean database pathing fallback
    joinedDate: new Date(user.createdAt).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }),
    location: "Nigeria",
    isVerified: user.isVerified,
    tagline: isSeller ? user.dealerProfile?.tagline : null,
  };

  // Funnel incoming/outgoing interaction streams based on active profile context
  const activeChats = isSeller ? user.sellerConversations : user.buyerConversations;

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-100 p-4 lg:p-8 max-w-6xl mx-auto space-y-8">
      
      {/* Dynamic Profile Identity Panel */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-zinc-900/40 border border-slate-900 p-6 md:p-10 flex flex-col md:flex-row items-center gap-6 justify-between shadow-xl">
        <div className={`absolute top-0 right-0 w-96 h-96 ${isSeller ? 'bg-emerald-600/5' : 'bg-blue-600/5'} rounded-full blur-[120px] pointer-events-none`} />
        
        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <div className="relative w-28 h-28 rounded-3xl overflow-hidden border-2 border-slate-800 bg-zinc-950 shrink-0 flex items-center justify-center text-zinc-700">
            {profileData.avatarUrl ? (
              <img
                src={profileData.avatarUrl}
                alt={profileData.name}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="font-black italic text-3xl text-zinc-800 uppercase">
                {profileData.name.substring(0, 2)}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h1 className="text-2xl md:text-3xl font-black uppercase italic tracking-tight text-white">
                {profileData.name}
              </h1>
              
              <span className={`inline-flex items-center gap-1 border px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                isSeller 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
              }`}>
                {isSeller ? <Store size={12} /> : <ShieldCheck size={12} />}
                {isSeller ? "Authorized Dealer" : "Verified Buyer"}
              </span>
            </div>
            
            {profileData.tagline ? (
              <p className="text-xs text-slate-400 font-bold italic">&quot;{profileData.tagline}&quot;</p>
            ) : (
              <p className="text-sm text-slate-400 font-medium">{profileData.email}</p>
            )}
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs text-slate-500 font-semibold">
              <span className="flex items-center gap-1"><MapPin size={14} /> {profileData.location}</span>
              <span className="flex items-center gap-1"><Calendar size={14} /> Member since {profileData.joinedDate}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Metric Display Panels */}
        <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0">
          <div className="p-4 rounded-2xl bg-zinc-950 border border-slate-900 text-center min-w-[110px]">
            {isSeller ? (
              <Store className="mx-auto text-emerald-500 mb-1" size={18} />
            ) : (
              <Heart className="mx-auto text-rose-500 mb-1" size={18} />
            )}
            <span className="block text-xl font-black italic tracking-tight">{displayCars.length}</span>
            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-black">
              {isSeller ? "My Inventory" : "Saved Cars"}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-950 border border-slate-900 text-center min-w-[110px]">
            <MessageSquare className="mx-auto text-blue-500 mb-1" size={18} />
            <span className="block text-xl font-black italic tracking-tight">{activeChats.length}</span>
            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-black">
              {isSeller ? "Client Leads" : "Open Desks"}
            </span>
          </div>
        </div>
      </div>

      {!isSeller && (
        <div className="p-4 rounded-2xl bg-zinc-900/40 hover:bg-zinc-800 border border-slate-900 text-center text-sm text-slate-400 font-medium italic">
          <Link className="block" href='/sell'>Become a Dealer</Link>
        </div>
      )}

      {/* Interactive Tabs Layout Area */}
      <ProfileTabs 
        displayCars={displayCars} 
        activeChats={activeChats} 
        userRole={user.role} 
      />
    </div>
  );
}
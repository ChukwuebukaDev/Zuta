import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import { prisma as db } from "@/lib/prisma";
import { MapPin, Calendar, Heart, MessageSquare, ShieldCheck, Store, PlusCircle,Settings2 } from "lucide-react";
import ProfileTabs from "@/components/dashboard/ProfileTabs";
import Link from "next/link";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  
  if (!authUser) redirect("/login");

  // 1. Fetch user including relational nested favourites and conversation streams
  let user = await db.user.findUnique({
    where: { id: authUser.id },
    include: {
      dealerProfile: true, 
      favourites: {
        include: {
          car: {
            select: {
              id: true,
              brand: true,
              model: true,
              year: true,
              price: true, // Prisma Decimal
              thumbnail: true,
              slug: true,
              mileage: true,
              transmission: true,
            }
          }
        }
      },
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
      sellerConversations: { 
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

  // Fallback database sync layer if user doesn't exist locally
  if (!user) {
    user = await db.user.create({
      data: {
        id: authUser.id,
        name: authUser.user_metadata?.name || "Verified User",
        email: authUser.email || "",
        role: "USER",
        onboardingComplete: false,
      },
      include: {
        dealerProfile: true,
        favourites: {
          include: {
            car: { select: { id: true, brand: true, model: true, year: true, price: true, thumbnail: true, slug: true, mileage: true, transmission: true } }
          }
        },
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

  const isDealer = user.role === "DEALER";

  // 2. Fetch User's Created Listings (Works for both DEALER and USER roles)
  const rawListings = await db.car.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      brand: true,
      model: true,
      year: true,
      price: true, // Decimal
      thumbnail: true,
      slug: true,
      mileage: true,
      transmission: true,
      status: true, 
    },
    orderBy: { createdAt: "desc" },
  });

  // 👇 Fix 1: Map raw listings to convert Decimal prices to standard numbers
  const myListings = rawListings.map(listing => ({
    ...listing,
    price: Number(listing.price), // Converts Decimal class to standard JS number
  }));

  // 👇 Fix 2: Flatten favorites and convert nested Decimal prices to standard numbers
  const savedCars = (user.favourites?.map((fav) => {
    if (!fav.car) return null;
    return {
      ...fav.car,
      price: Number(fav.car.price), // Converts Decimal class to standard JS number
    };
  }).filter(Boolean) || []) as any[];

  // 3. Configure layout display details
  const profileData = {
    name: isDealer && user.dealerProfile?.businessName ? user.dealerProfile.businessName : (user.name || "Verified User"),
    email: user.email || "",
    avatarUrl: isDealer && user.dealerProfile?.logo ? user.dealerProfile.logo : null, 
    joinedDate: new Date(user.createdAt).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }),
    location: "Nigeria",
    isVerified: user.isVerified,
    tagline: isDealer ? user.dealerProfile?.tagline : null,
  };

  // 4. Map display values strictly to match your client-side interface signatures
  // - If they are a dealer, display their posted inventory listings and inbound client leads.
  // - If they are a regular user, display their active bookmarks (savedCars) and outbound negotiations.
  const displayCars = isDealer ? myListings : savedCars;
  
  const activeChats = isDealer 
    ? user.sellerConversations 
    : user.buyerConversations;

  // Re-map active chat Nested Decimal types to numbers so we don't cause hydration warnings 
  const serializedChats = activeChats.map(chat => ({
    ...chat,
    createdAt: chat.createdAt.toISOString(),
    updatedAt: chat.updatedAt.toISOString(),
    car: {
      ...chat.car,
      price: Number(chat.car.price),
    }
  }));

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-100 p-4 lg:p-8 max-w-6xl mx-auto space-y-8">
      
      {/* Dynamic Profile Identity Panel */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-zinc-900/40 border border-slate-900 p-6 md:p-10 flex flex-col md:flex-row items-center gap-6 justify-between shadow-xl">
        <div className={`absolute top-0 right-0 w-96 h-96 ${isDealer ? 'bg-emerald-600/5' : 'bg-amber-600/5'} rounded-full blur-[120px] pointer-events-none`} />
        
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
                isDealer 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}>
                {isDealer ? <Store size={12} /> : <ShieldCheck size={12} />}
                {isDealer ? "Authorized Dealer" : "Private Seller"}
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
        <div className="grid grid-cols-3 gap-3 w-full md:w-auto shrink-0">
          <div className="p-4 rounded-2xl bg-zinc-950 border border-slate-900 text-center min-w-[100px]">
            <Store className="mx-auto text-amber-500 mb-1" size={18} />
            <span className="block text-xl font-black italic tracking-tight text-white">{myListings.length}</span>
            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-black">
              My Cars
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950 border border-slate-900 text-center min-w-[100px]">
            <Heart className="mx-auto text-rose-500 mb-1" size={18} />
            <span className="block text-xl font-black italic tracking-tight text-white">{savedCars.length}</span>
            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-black">
              Bookmarks
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950 border border-slate-900 text-center min-w-[100px]">
            <MessageSquare className="mx-auto text-blue-500 mb-1" size={18} />
            <span className="block text-xl font-black italic tracking-tight text-white font-sans">
              {serializedChats.length}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-black">
              Messages
            </span>
          </div>

            <Link className="p-4 rounded-2xl bg-zinc-950 border border-slate-900 text-center min-w-[100px]" href="/settings">
            <Settings2 className="mx-auto text-amber-500 mb-1" size={18} />
          
            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-black">
              Settings
            </span>
          </Link>
        </div>
      </div>

      {/* Upgrade Call To Action */}
      {!isDealer && (
        <div className="p-4 rounded-2xl bg-linear-to-r from-zinc-900/60 to-amber-950/20 hover:from-zinc-900 hover:to-amber-950/30 border border-zinc-900 text-center text-sm text-slate-400 font-medium transition-colors">
          <Link className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-amber-400 font-bold" href='/onboarding'>
            Scale Up: Register an Official Dealership Profile <PlusCircle size={14} />
          </Link>
        </div>
      )}

      {/* 👇 FIXED PROP CALLOUT: Matches the clean parameters ProfileTabs expects! */}
      <ProfileTabs 
        displayCars={displayCars} 
        activeChats={serializedChats} 
        userRole={user.role} 
      />
    </div>
  );
}
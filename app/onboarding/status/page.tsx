import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma as db } from "@/lib/prisma";
import { Clock, ShieldCheck, Car, ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function OnboardingStatusPage() {
  const cookieStore = await cookies();

  // 1. Initialize the official Supabase SSR Server Client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Next.js server mutation fallback safety block
          }
        },
      },
    }
  );

  // 2. Authenticate the session via Supabase SSR
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const supabaseUser = session.user;

  // 3. Fetch the latest status from the database using the Supabase UUID string
  const user = await db.user.findUnique({
    where: { id: supabaseUser.id },
    select: {
      name: true,              
      onboardingComplete: true,
      dealerProfile: {          
        select: {
          businessName: true,
        }
      }
    },
  });

  if (!user) return null;
  
  if (user.dealerProfile) {
    redirect("/dashboard");
  }


  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-8">
        
        {/* Animated Icon Section */}
        <div className="relative flex justify-center">
          <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
          <div className="relative bg-slate-900 border border-slate-800 p-6 rounded-3xl">
            <Clock className="w-12 h-12 text-blue-400 animate-pulse" />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter italic">
            ZUTA<span className="text-blue-500">.</span>
          </h1>
          <h2 className="text-2xl font-semibold">Verification in Progress</h2>
          <p className="text-slate-400 leading-relaxed">
            Hello, <span className="text-white font-medium">{user?.name}</span>. 
            Our team is currently reviewing your dealer credentials. This usually takes 
            less than 24 hours.
          </p>
        </div>

        {/* Status Steps */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-left space-y-4">
          <div className="flex items-center gap-4 text-emerald-500">
            <div className="bg-emerald-500/10 p-2 rounded-full">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-sm font-bold">Documents Received</p>
              <p className="text-xs text-slate-500">Identity and Business Card uploaded</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-blue-400">
            <div className="bg-blue-500/10 p-2 rounded-full">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-sm font-bold">Pending Review</p>
              <p className="text-xs text-slate-500">Our admins are verifying your details</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-600">
            <div className="bg-slate-800 p-2 rounded-full">
              <Car size={20} />
            </div>
            <div>
              <p className="text-sm font-bold">Marketplace Access</p>
              <p className="text-xs text-slate-500">Unlock your showroom after approval</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 space-y-4">
          <Link 
            href="/" 
            className="text-slate-400 hover:text-white text-sm flex items-center justify-center gap-2 transition-colors"
          >
            Return to Home <ChevronRight size={16} />
          </Link>
          
          <div className="text-[10px] uppercase tracking-widest text-slate-700">
            Zuta Luxury Motors • Secure Portal
          </div>
        </div>
      </div>
    </div>
  );
}
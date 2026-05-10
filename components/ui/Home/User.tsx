"use client";

import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export function AuthButtons() {
  const { isLoaded, isSignedIn } = useUser();

  // 1. Loading State (Prevents layout shift)
  if (!isLoaded) {
    return <Loader2 className="w-5 h-5 animate-spin text-slate-500" />;
  }

  // 2. Authenticated State
  if (isSignedIn) {
    return (
      <div className="flex items-center gap-4">
        {/* We can still keep a link to a custom profile page if we want */}
        <Link 
          href="/dashboard" 
          className="hidden md:block text-sm font-medium text-slate-400 hover:text-white transition"
        >
          Dashboard
        </Link>
        
        {/* Clerk's managed profile dropdown */}
        <UserButton 
           
          appearance={{
            elements: {
              avatarBox: "w-9 h-9 border border-slate-700 hover:scale-105 transition",
              userButtonPopoverCard: "bg-slate-900 border border-slate-800",
              userButtonOuterIdentifier: "text-white font-medium"
            }
          }}
          showName={false} // Set to true if you want the name next to the bubble
        />
      </div>
    );
  }

  // 3. Unauthenticated State
  return (
    <div className="flex flex-col md:flex-row items-stretch gap-3">
      <Link 
        className="px-5 py-2 rounded-xl border border-slate-800 text-sm font-semibold text-center text-white hover:bg-slate-900 transition" 
        href="/sign-in"
      >
        Sign In
      </Link>

      <Link 
        className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold text-center hover:bg-blue-700 transition shadow-lg shadow-blue-900/20" 
        href="/sign-up"
      >
        Register
      </Link>
    </div>
  );
}
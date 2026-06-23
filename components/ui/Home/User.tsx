"use client";

import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export function AuthButtons() {
  const { isLoaded, isSignedIn, user } = useUser();
  if (!isLoaded) {
    return <Loader2 className="w-5 h-5 animate-spin text-slate-500" />;
  }

  if (isSignedIn) {

    const userRole = (user?.publicMetadata?.role as string | undefined)?.toLowerCase();
    
    const isSeller = userRole === "dealer" || userRole === "seller";
    const admin = userRole === "admin" || userRole === "superadmin";

    return (
      <div className="flex items-center gap-4">

        {admin &&  <Link 
            href="/admin-dashboard" 
            className="hidden md:block text-sm font-medium text-slate-400 hover:text-slate-200 transition"
          >
            Admin Dashboard
          </Link>}
        {isSeller && !admin && (
          <Link 
            href="/dashboard" 
            className="hidden md:block text-sm font-medium text-slate-400 hover:text-slate-200 transition"
          >
            Seller Dashboard
          </Link>
        )}

        {!isSeller && !admin && (
          <Link 
            href="/dashboard/profile" 
            className="hidden md:block text-sm font-medium text-slate-400 hover:text-slate-200 transition"
          >
            My Profile
          </Link>
        )}

        
        
        <UserButton 
          appearance={{
            elements: {
              avatarBox: "w-9 h-9 border border-slate-700 hover:scale-105 transition",
              userButtonPopoverCard: "bg-slate-900 border border-slate-800 text-white",
              userButtonOuterIdentifier: "text-white font-medium"
            }
          }}
          showName={false}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-stretch gap-3">
      <Link 
        className="px-5 py-2 rounded-xl border border-slate-800 text-sm font-semibold text-center text-slate-400 hover:bg-slate-900 hover:text-white transition" 
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
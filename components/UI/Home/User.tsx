"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Loader2, LogOut, User, ChevronRight } from "lucide-react";

export function AuthButtons() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Loader2 className="w-5 h-5 animate-spin text-gray-400" />;
  }

  if (status === "authenticated") {
    return (
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
        <Link 
          href="/profile" 
          className="flex items-center justify-between md:justify-start gap-3 p-2 md:p-0 rounded-xl bg-gray-50 md:bg-transparent border border-gray-100 md:border-0"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-8 md:h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs">
              {session.user?.name?.charAt(0) || <User size={16} />}
            </div>
            <div className="flex flex-col md:block">
              <span className="text-sm font-bold text-black md:font-medium md:text-gray-700">
                {session.user?.name?.split(' ')[0] || "Account"}
              </span>
              <span className="text-xs text-gray-500 md:hidden">View Profile</span>
            </div>
          </div>
          <ChevronRight size={16} className="md:hidden text-gray-400" />
        </Link>
        
        <button
          onClick={() => signOut()}
          className="flex items-center justify-center gap-2 px-4 py-3 md:py-2 text-sm font-medium text-red-600 bg-red-50 md:bg-transparent rounded-xl hover:bg-red-100 transition-colors"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-stretch gap-3">
      <Link 
        className="px-6 py-3 md:py-2 rounded-xl border border-gray-200 text-sm font-semibold text-center hover:bg-gray-50 transition" 
        href="/auth"
      >
        Sign In
      </Link>

      <Link 
        className="px-6 py-3 md:py-2 rounded-xl bg-black text-white text-sm font-semibold text-center hover:bg-black/90 transition shadow-lg shadow-black/10" 
        href="/auth"
      >
        Register
      </Link>
    </div>
  );
}
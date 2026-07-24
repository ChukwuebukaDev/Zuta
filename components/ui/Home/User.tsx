"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { createClient } from "@/supabase/client";
import { useSearchParams } from "next/navigation";
import { logout } from "@/app/(auth)/action";
import { Loader2, LogOut, User, Sparkles } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export function AuthButtons() {
  // Stable client reference across renders
  const supabase = useMemo(() => createClient(), []);
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || "";
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [dbRole, setDbRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchUserRole = async (userId: string) => {
      try {
        const res = await fetch(`/api/user/role?id=${userId}`);
        if (res.ok && isMounted) {
          const data = await res.json();
          setDbRole(data.role?.toLowerCase() || "user");
        }
      } catch (err) {
        console.error("[FETCH_ROLE_ERR]:", err);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;

        if (session?.user) {
          setUser(session.user);
          await fetchUserRole(session.user.id);
        } else {
          setUser(null);
          setDbRole(null);
        }
        
        if (isMounted) setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  if (loading) {
    return <Loader2 className="w-5 h-5 animate-spin text-amber-500" />;
  }

  if (user) {
    const isSeller = dbRole === "dealer" || dbRole === "seller";
    const isAdmin = dbRole === "admin" || dbRole === "superadmin";

    return (
      <div className="flex items-center gap-3">
        {/* User Role Tag */}
        <span className="hidden sm:inline-block text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-amber-400">
          {isAdmin ? "Admin" : isSeller ? "Dealer" : "Member"}
        </span>

        {/* Dashboard Profile Trigger */}
        <div className="flex items-center gap-2 pl-2 border-l border-neutral-800">
          <Link
            href={isAdmin ? "/admin-dashboard" : isSeller ? "/dashboard" : "/profile"}
            className="w-10 h-10 flex items-center justify-center bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 hover:border-amber-500/40 text-neutral-300 hover:text-amber-400 rounded-xl transition-all duration-200 shadow-md group cursor-pointer"
            title={user.email}
          >
            <User size={17} className="group-hover:scale-110 transition-transform" />
          </Link>

          {/* Logout Button */}
          <button
            onClick={() => logout()}
            className="w-10 h-10 flex items-center justify-center text-neutral-400 hover:text-red-400 bg-neutral-950 hover:bg-red-500/10 border border-neutral-800 hover:border-red-500/20 rounded-xl transition-all duration-200 cursor-pointer"
            title="Disconnect Session"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5">
      {/* Sign In Button */}
      <Link 
        href="/login"
        className="px-4 py-2 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-950/80 hover:bg-neutral-900 text-xs font-bold text-neutral-300 hover:text-white transition duration-200"
      >
        Sign In
      </Link>

      {/* Register / Get Started CTA */}
      <Link 
        href="/sign-up"
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider transition duration-200 shadow-md shadow-amber-500/10 active:scale-95"
      >
        <Sparkles size={13} className="fill-slate-950 shrink-0" />
        <span>Register</span>
      </Link>
    </div>
  );
}
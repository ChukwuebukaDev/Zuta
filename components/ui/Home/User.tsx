"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/supabase/client";
import { logout } from "@/app/(auth)/action";
import { Loader2, LogOut, User } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export function AuthButtons() {
  const supabase = createClient();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [dbRole, setDbRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch current authenticating credentials on initialization mount
    const bootstrapAuthContext = async () => {
      try {
        const { data: { user: sessionUser } } = await supabase.auth.getUser();
        setUser(sessionUser);

        if (sessionUser) {
          // Fetch user profile metadata role from our Prisma PostgreSQL instance
          const res = await fetch(`/api/user/role?id=${sessionUser.id}`);
          if (res.ok) {
            const data = await res.json();
            setDbRole(data.role?.toLowerCase() || "user");
          }
        }
      } catch (err) {
        console.error("[AUTH_BUTTONS_ERR]:", err);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuthContext();

    // 2. Continuous real-time subscription anchor to catch session drop/sign-ins
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          const res = await fetch(`/api/user/role?id=${session.user.id}`);
          if (res.ok) {
            const data = await res.json();
            setDbRole(data.role?.toLowerCase() || "user");
          }
        } else {
          setUser(null);
          setDbRole(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);
useEffect(()=>{console.log(user)},[user])
  if (loading) {
    return <Loader2 className="w-5 h-5 animate-spin text-slate-500" />;
  }

  if (user) {
    const isSeller = dbRole === "dealer" || dbRole === "seller";
    const isAdmin = dbRole === "admin" || dbRole === "superadmin";

    return (
      <div className="flex items-center gap-4">
       
        {/* 🎬 Premium Dashboard Session Controller Mini-Menu */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-9 h-9 flex items-center justify-center bg-slate-900 border border-slate-800 text-slate-300 rounded-xl font-medium text-xs uppercase" title={user.email}>
            <Link href = {isAdmin ? "/admin-dashboard" : isSeller ? "/dashboard" : "/profile"} >
            <User size={16} />
            </Link>
          </div>
          
          <button
            onClick={() => logout()}
            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/5 border border-transparent hover:border-red-500/10 rounded-xl transition-all"
            title="Disconnect Session"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-stretch gap-3">
      <Link 
        className="px-5 py-2 rounded-xl border border-slate-800 text-sm font-semibold text-center text-slate-400 hover:bg-slate-900 hover:text-white transition" 
        href="/login"
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
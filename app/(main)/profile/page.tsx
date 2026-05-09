"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { User, Mail, Phone, Palette, ShieldCheck, Camera } from "lucide-react";
import { redirect } from "next/navigation";

// Define our "Feels" / Themes
const THEMES = {
  luxury: "bg-white from-gold-100/20 to-transparent",
  stealth: "bg-[#0a0a0a] text-white",
  classic: "bg-[#f5f4f0] text-black",
  modern: "bg-blue-50 text-slate-900"
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [activeTheme, setActiveTheme] = useState<keyof typeof THEMES>("classic");

  // Protect the route
  if (status === "unauthenticated") redirect("/auth");

  if (status === "loading") return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className={`min-h-screen transition-colors duration-500 ${THEMES[activeTheme]}`}>
      {/* Dynamic Background Gradient */}
      <div className={`absolute inset-0 opacity-40 pointer-events-none bg-gradient-to-br ${
        activeTheme === 'stealth' ? 'from-gray-900 to-black' : 'from-gray-200 to-transparent'
      }`} />

      <main className="relative max-w-4xl mx-auto pt-24 pb-12 px-4">
        
        {/* HEADER SECTION */}
        <section className="flex flex-col md:flex-row items-center gap-8 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-200 flex items-center justify-center">
              {session?.user?.image ? (
                <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={48} className="text-gray-400" />
              )}
            </div>
            <button className="absolute bottom-1 right-1 p-2 bg-black text-white rounded-full shadow-lg hover:scale-110 transition cursor-pointer">
              <Camera size={16} />
            </button>
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              {session?.user?.name || "Member"}
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-2 text-sm opacity-60">
              <ShieldCheck size={16} className="text-green-500" />
              <span>Verified Seller Account</span>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* THEME CUSTOMIZER SIDEBAR */}
          <aside className="space-y-6">
            <div className="p-6 rounded-3xl border border-gray-200/50 bg-white/10 backdrop-blur-md shadow-sm">
              <h3 className="flex items-center gap-2 font-bold mb-4">
                <Palette size={18} />
                Background Feel
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.keys(THEMES).map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTheme(t as keyof typeof THEMES)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium capitalize border transition-all ${
                      activeTheme === t 
                        ? "bg-black text-white border-black" 
                        : "bg-white text-black border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* MAIN ACCOUNT INFO */}
          <div className="md:col-span-2 space-y-6">
            <div className="p-8 rounded-3xl bg-white/40 backdrop-blur-xl border border-white/20 shadow-sm space-y-6">
              <h2 className="text-xl font-bold mb-4">Account Details</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/50 border border-gray-100">
                  <Mail size={20} className="text-gray-400" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400">Email Address</p>
                    <p className="font-medium">{session?.user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/50 border border-gray-100">
                  <Phone size={20} className="text-gray-400" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400">Phone Number</p>
                    <p className="font-medium text-gray-400 italic">Not added yet</p>
                  </div>
                </div>
              </div>

              <button className="w-full py-4 bg-black text-white rounded-2xl font-bold hover:opacity-90 transition-opacity">
                Edit Profile
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
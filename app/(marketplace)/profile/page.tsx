"use client";

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { 
  Loader2, Camera, Mail, Share2, MessageSquare, 
  PhoneCall, CheckCircle2, MapPin, Star, Calendar, 
  Gauge, Settings, LayoutGrid, Heart, ShieldCheck, 
  Plus, Trash2, Edit3, ExternalLink, Palette
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Theme {
  id: string;
  label: string;
  bg: string;
  card: string;
  cardBorder: string;
  accent: string;
  accentSoft: string;
  text: string;
  textMuted: string;
  statBg: string;
  headerOverlay: string;
  noise: boolean;
  isDark: boolean;
}

interface Listing {
  id: string;
  title: string;
  price: number;
  year: number;
  mileage: number;
  image: string;
  status: "Active" | "Sold" | "Pending";
}

// ─── Adaptive Themes ──────────────────────────────────────────────────────────

const themes: Theme[] = [
  {
    id: "obsidian",
    label: "Obsidian Glass",
    bg: "radial-gradient(circle at 50% 0%, #1a1a1a 0%, #050505 100%)",
    card: "rgba(15, 15, 15, 0.7)",
    cardBorder: "rgba(255, 255, 255, 0.08)",
    accent: "#f59e0b", 
    accentSoft: "rgba(245, 158, 11, 0.1)",
    text: "#ffffff",
    textMuted: "#a1a1aa",
    statBg: "rgba(255, 255, 255, 0.03)",
    headerOverlay: "linear-gradient(180deg, rgba(0,0,0,0) 0%, #050505 100%)",
    noise: true,
    isDark: true
  },
  {
    id: "arctic",
    label: "Arctic Alabaster",
    bg: "#f8fafc",
    card: "rgba(255, 255, 255, 0.9)",
    cardBorder: "rgba(0, 0, 0, 0.05)",
    accent: "#0f172a",
    accentSoft: "rgba(15, 23, 42, 0.05)",
    text: "#0f172a",
    textMuted: "#64748b",
    statBg: "#ffffff",
    headerOverlay: "linear-gradient(180deg, rgba(255,255,255,0) 0%, #f8fafc 100%)",
    noise: false,
    isDark: false
  }
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CarUserProfile() {
  const { data: session, status } = useSession();
  const [theme, setTheme] = useState<Theme>(themes[0]);
  const [activeTab, setActiveTab] = useState<"listings" | "saved" | "reviews">("listings");
  const [showAppearance, setShowAppearance] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Mock Data
  const [userListings] = useState<Listing[]>([
    { id: '1', title: '2022 Porsche 911 Turbo S', price: 185000, year: 2022, mileage: 8500, image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80', status: "Active" },
    { id: '2', title: '2023 Mercedes-AMG GT', price: 142000, year: 2023, mileage: 3200, image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80', status: "Pending" },
  ]);

  // ─── System Theme Detection & Persistence ───
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('zuta-theme-pref');
    
    if (savedTheme) {
      const found = themes.find(t => t.id === savedTheme);
      if (found) setTheme(found);
    } else {
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      setTheme(mql.matches ? themes[0] : themes[1]);
      
      const handler = (e: MediaQueryListEvent) => setTheme(e.matches ? themes[0] : themes[1]);
      mql.addEventListener('change', handler);
      return () => mql.removeEventListener('change', handler);
    }
  }, []);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('zuta-theme-pref', newTheme.id);
  };

  useEffect(() => {
    if (status === "unauthenticated") redirect("/auth");
  }, [status]);

  if (!mounted || status === "loading") {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#050505]">
        <Loader2 className="animate-spin text-amber-500" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full transition-all duration-700" style={{ background: theme.bg }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=Sora:wght@300;400;500;600;700&display=swap');
        .glass-panel { 
          background: ${theme.card}; 
          border: 1px solid ${theme.cardBorder}; 
          backdrop-filter: blur(24px);
          box-shadow: ${theme.isDark ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : '0 10px 30px -5px rgba(0, 0, 0, 0.04)'};
        }
        .font-bebas { font-family: 'Bebas Neue', sans-serif; }
        .font-mono { font-family: 'DM Mono', monospace; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Hero Cover */}
      <div className="h-50 md:h-60 w-full relative">
        <div className="absolute inset-0 opacity-20 transition-all duration-1000" style={{ background: `linear-gradient(135deg, ${theme.accent}, transparent)` }} />
        <div className="absolute inset-0 transition-all duration-1000" style={{ background: theme.headerOverlay }} />
        {theme.noise && <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />}
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
        <div className="relative -mt-32 flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="w-full lg:w-[340px] shrink-0 lg:sticky lg:top-24 space-y-6">
            <div className="glass-panel rounded-[2.5rem] p-8">
              <div className="flex flex-col items-center lg:items-start">
                <div className="relative mb-6">
                  <div className="w-32 h-32 rounded-full border-4 overflow-hidden bg-zinc-400" style={{ borderColor: theme.cardBorder }}>
                    {session?.user?.image ? (
                      <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl font-bebas" style={{ color: theme.accent, background: theme.accentSoft }}>
                        {session?.user?.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <button className="absolute bottom-1 right-1 p-2.5 rounded-full shadow-xl hover:scale-110 transition bg-black text-white border border-white/20">
                    <Camera size={18} />
                  </button>
                </div>

                <h1 className="text-3xl font-bold tracking-tight mb-1" style={{ color: theme.text }}>{session?.user?.name}</h1>
                <p className="font-mono text-[10px] opacity-40 uppercase tracking-[0.2em] mb-6">Professional Dealer</p>
                
                <div className="flex flex-wrap gap-2 mb-8 justify-center lg:justify-start">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/5 border border-white/10" style={{ color: theme.textMuted }}>
                    <MapPin size={12} /> Lagos, NG
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    <ShieldCheck size={12} /> VERIFIED
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <button className="w-full flex items-center justify-between px-5 py-4 rounded-2xl bg-black/5 hover:bg-black/10 transition group text-[13px] font-medium" style={{ color: theme.text }}>
                  Settings <Settings size={18} className="opacity-30 group-hover:opacity-100" />
                </button>
                <button 
                  onClick={() => setShowAppearance(!showAppearance)}
                  className="w-full flex items-center justify-between px-5 py-4 rounded-2xl bg-black/5 hover:bg-black/10 transition group text-[13px] font-medium" 
                  style={{ color: theme.text }}
                >
                  Theme Mode <Palette size={18} className="opacity-30 group-hover:opacity-100" />
                </button>
                
                {showAppearance && (
                  <div className="grid grid-cols-2 gap-2 p-2 animate-in fade-in slide-in-from-top-2">
                    {themes.map(t => (
                      <button 
                        key={t.id} 
                        onClick={() => handleThemeChange(t)}
                        className={`h-12 rounded-xl border-2 transition-all ${theme.id === t.id ? "border-amber-500 scale-105" : "border-transparent opacity-40 hover:opacity-100"}`}
                        style={{ background: t.bg.includes('gradient') ? t.accent : t.bg }}
                        title={t.label}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Main Dashboard */}
          <div className="flex-1 w-full space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Active', val: userListings.length, icon: LayoutGrid },
                { label: 'Sold', val: '142', icon: CheckCircle2 },
                { label: 'Rating', val: '4.9', icon: Star },
                { label: 'Watching', val: '28', icon: Heart }
              ].map(stat => (
                <div key={stat.label} className="glass-panel p-6 rounded-[2rem] group hover:scale-[1.02] transition-all">
                  <stat.icon size={20} className="mb-4 opacity-20" style={{ color: theme.accent }} />
                  <div className="text-4xl font-bebas tracking-wider" style={{ color: theme.text }}>{stat.val}</div>
                  <div className="text-[10px] uppercase font-mono tracking-widest opacity-30">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="glass-panel rounded-[2.5rem] overflow-hidden min-h-[600px]">
              <div className="flex px-6 border-b no-scrollbar overflow-x-auto" style={{ borderColor: theme.cardBorder }}>
                {['listings', 'saved', 'reviews'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`py-6 px-6 text-[11px] font-bold uppercase tracking-[0.2em] relative transition-opacity ${activeTab === tab ? "" : "opacity-30 hover:opacity-100"}`}
                    style={{ color: activeTab === tab ? theme.accent : theme.text }}
                  >
                    {tab}
                    {activeTab === tab && <div className="absolute bottom-0 left-6 right-6 h-1 rounded-t-full" style={{ background: theme.accent }} />}
                  </button>
                ))}
              </div>

              <div className="p-8">
                {activeTab === 'listings' && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bebas tracking-wide" style={{ color: theme.text }}>Showroom Inventory</h2>
                      <button className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl transition-transform hover:scale-105"
                              style={{ background: theme.accent, color: theme.isDark ? '#000' : '#fff' }}>
                        <Plus size={18} /> New Entry
                      </button>
                    </div>

                    {userListings.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {userListings.map(car => (
                          <div key={car.id} className="group glass-panel rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500">
                            <div className="relative h-52 overflow-hidden">
                              <img src={car.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={car.title} />
                              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest bg-black/50 backdrop-blur-md border border-white/10" style={{ color: theme.accent }}>
                                ${car.price.toLocaleString()}
                              </div>
                            </div>
                            <div className="p-6">
                              <h3 className="font-bold text-lg leading-tight mb-2" style={{ color: theme.text }}>{car.title}</h3>
                              <div className="flex items-center gap-4 text-[10px] font-mono opacity-40 uppercase mb-6">
                                <span className="flex items-center gap-1.5"><Gauge size={14}/> {car.mileage.toLocaleString()} KM</span>
                                <span className="flex items-center gap-1.5"><Calendar size={14}/> {car.year}</span>
                              </div>
                              <div className="flex gap-2">
                                <button className="flex-1 py-3 rounded-xl border border-black/5 bg-black/5 text-[10px] font-bold uppercase tracking-widest hover:bg-black/10 transition" style={{ color: theme.text }}>Edit</button>
                                <button className="px-4 rounded-xl border border-black/5 bg-black/5 hover:bg-black/10 transition" style={{ color: theme.textMuted }}><ExternalLink size={16}/></button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-24 text-center opacity-30">
                        <LayoutGrid size={48} className="mb-4" />
                        <h3 className="text-xl font-bold mb-2">No active listings</h3>
                        <p className="text-sm font-mono uppercase tracking-widest">Showroom is currently empty</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
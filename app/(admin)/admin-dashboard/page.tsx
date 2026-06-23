import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma as db } from "@/lib/prisma";
import Link from "next/link";
import { ShieldCheck, Car, Users, FileText, ArrowUpRight } from "lucide-react";

// Explicit typing for Clerk session public metadata mapping layout
interface ClerkCustomMetadata {
  role?: "BUYER" | "DEALER" | "ADMIN";
}

export default async function AdminDashboardPage() {
  const { userId, sessionClaims } = await auth();

  // Safely extract metadata using our strict structural mapping schema
  const metadata = (sessionClaims?.metadata || {}) as ClerkCustomMetadata;
  const isAdmin = metadata.role === "ADMIN".toLocaleLowerCase();
console.log("Admin Dashboard Access Attempt:", { userId, metadata });
  // Guardrail: Restrict view exclusively to system admins
  if (!userId || !isAdmin) {
    redirect("/");
  }

  // Aggregate global operational metrics concurrently
  const [
    totalUsers,
    pendingCarsCount,
    activeDealersCount,
    pendingVerifications,
  ] = await Promise.all([
    db.user.count(),
    db.car.count({ where: { listingStatus: "PENDING" } }),
    db.user.count({ where: { role: "DEALER" } }),
    db.verificationRequest.count({ where: { status: "SUBMITTED" } }),
  ]);

  const internalModules = [
    {
      title: "Onboarding Applications",
      count: pendingVerifications,
      desc: "Review legal dealer profiles, business cards, and CAC registration documents.",
      href: "/admin-onboarding",
      icon: FileText,
      colorClass: "text-cyan-400 border-cyan-500/10 bg-cyan-500/5",
    },
    {
      title: "Inventory Approvals",
      count: pendingCarsCount,
      desc: "Audit new marketplace car listings, 360-degree angles, pricing tags, and specifications.",
      href: "/admin-pending",
      icon: Car,
      colorClass: "text-amber-400 border-amber-500/10 bg-amber-500/5",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 space-y-10">
      
      {/* Top Deck Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-6">
        <div>
          <div className="flex items-center gap-2 text-blue-500 text-xs font-bold uppercase tracking-widest mb-1">
            <ShieldCheck size={14} />
            Central Control Center
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">System Operations</h1>
        </div>
        <div className="text-xs font-mono text-slate-500 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
          Sync Status: <span className="text-emerald-400">Live Connection</span>
        </div>
      </div>

      {/* Numerical Aggregate Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl space-y-2">
          <div className="text-slate-500"><Users size={20} /></div>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Users</p>
          <h3 className="text-2xl md:text-3xl font-black text-white">{totalUsers}</h3>
        </div>
        <div className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl space-y-2">
          <div className="text-amber-500"><Car size={20} /></div>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Cars Pending</p>
          <h3 className="text-2xl md:text-3xl font-black text-white">{pendingCarsCount}</h3>
        </div>
        <div className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl space-y-2">
          <div className="text-blue-500"><ShieldCheck size={20} /></div>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Verified Dealers</p>
          <h3 className="text-2xl md:text-3xl font-black text-white">{activeDealersCount}</h3>
        </div>
        <div className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl space-y-2">
          <div className="text-cyan-500"><FileText size={20} /></div>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Open Verification Requests</p>
          <h3 className="text-2xl md:text-3xl font-black text-white">{pendingVerifications}</h3>
        </div>
      </div>

      {/* Operational Work Desk Portals */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Management Modules
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {internalModules.map((module, idx) => {
            const Icon = module.icon;
            return (
              <Link 
                key={idx} 
                href={module.href}
                className="group relative block p-6 bg-slate-900/40 border border-slate-800 rounded-2xl hover:border-blue-500/30 transition-all duration-300 overflow-hidden"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl border ${module.colorClass}`}>
                      <Icon size={16} />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {module.count} Pending
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                        {module.title}
                      </h3>
                      <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">
                        {module.desc}
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-2 bg-slate-950 border border-slate-800 group-hover:border-blue-500/30 text-slate-500 group-hover:text-blue-400 rounded-xl transition-all shrink-0">
                    <ArrowUpRight size={18} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
}
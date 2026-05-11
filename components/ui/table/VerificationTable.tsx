"use client";

import { useState } from "react";
import { verifyUser } from "@/app/_actions/admin";
import { toast } from "sonner";
import { Check, X, ExternalLink, ShieldCheck, ShieldAlert } from "lucide-react";

export function VerificationTable({ users }: { users: any[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleToggleVerify = async (userId: string, currentStatus: boolean) => {
    setLoadingId(userId);
    const result = await verifyUser(userId, !currentStatus);
    if (result.success) {
      toast.success("User status updated");
    } else {
      toast.error("Failed to update status");
    }
    setLoadingId(null);
  };

  return (
    <div className="rounded-md border border-slate-800 bg-slate-950 overflow-hidden">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-slate-900 text-slate-400">
          <tr>
            <th className="px-6 py-4">Legal Name</th>
            <th className="px-6 py-4">Documents</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-slate-900/50 transition-colors">
              <td className="px-6 py-4 font-medium text-white">
                {user.legalName}
              </td>
              <td className="px-6 py-4 space-x-3">
                <a 
                  href={user.idUrl} 
                  target="_blank" 
                  className="inline-flex items-center gap-1 text-blue-400 hover:underline"
                >
                  Gov ID <ExternalLink size={14} />
                </a>
                <a 
                  href={user.cardUrl} 
                  target="_blank" 
                  className="inline-flex items-center gap-1 text-blue-400 hover:underline"
                >
                  Card <ExternalLink size={14} />
                </a>
              </td>
              <td className="px-6 py-4">
                {user.isVerified ? (
                  <span className="flex items-center gap-1 text-emerald-500 font-bold">
                    <ShieldCheck size={16} /> Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-amber-500 font-bold">
                    <ShieldAlert size={16} /> Pending
                  </span>
                )}
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => handleToggleVerify(user.id, user.isVerified)}
                  disabled={loadingId === user.id}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    user.isVerified 
                      ? "bg-red-500/10 text-red-500 hover:bg-red-500/20" 
                      : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                  }`}
                >
                  {loadingId === user.id ? "..." : user.isVerified ? "Revoke" : "Approve"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
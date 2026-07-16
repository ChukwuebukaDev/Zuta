"use client";

import { useState, useTransition } from "react";
import { updateProfile, deleteAccount } from "./action";
import { createClient } from "@/supabase/client"; // Dynamic client wrapper
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ShieldAlert, Trash2, User, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/controls/Button";

interface SettingsFormProps {
  initialData: {
    name: string;
    email: string;
    phone: string;
  };
}

export default function SettingsForm({ initialData }: SettingsFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Profile update submit handler
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateProfile(formData);
      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        toast.success(result.success);
        router.refresh();
      }
    });
  };

  // Safe Account Deletion handler
  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") {
      return toast.error("Please type 'DELETE' to confirm deletion.");
    }

    try {
      setIsDeleting(true);
      const res = await deleteAccount(deleteConfirmation);

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Account purged. Redirecting...");
        
        // Log user out of Supabase cleanly
        const supabase = createClient();
        await supabase.auth.signOut();
        
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      toast.error("An unexpected error occurred during account deletion.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* ================= EDIT DETAILS FORM ================= */}
      <form onSubmit={handleUpdate} className="space-y-6 bg-zinc-900/40 border border-slate-900 p-8 rounded-[2rem] relative overflow-hidden">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1">
              <User size={12} /> Legal Name / Display Name
            </label>
            <input 
              name="name" 
              required
              defaultValue={initialData.name} 
              className="w-full px-4 py-3.5 bg-zinc-950 border border-slate-900 rounded-xl text-white outline-none text-sm focus:border-blue-500/40 transition font-medium" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1">
              <Mail size={12} /> Email Address (Immutable)
            </label>
            <input 
              type="email" 
              disabled 
              value={initialData.email} 
              className="w-full px-4 py-3.5 bg-zinc-950/40 border border-slate-900/40 rounded-xl text-slate-500 outline-none text-sm font-medium cursor-not-allowed" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1">
              <Phone size={12} /> Mobile Line
            </label>
            <input 
              name="phone" 
              defaultValue={initialData.phone} 
              placeholder="+234"
              className="w-full px-4 py-3.5 bg-zinc-950 border border-slate-900 rounded-xl text-white outline-none text-sm focus:border-blue-500/40 transition font-medium" 
            />
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={isPending}
          className="w-full py-4 bg-blue-700 hover:bg-blue-600 disabled:bg-blue-900 text-xs font-black uppercase tracking-widest rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : "Save Profile Details"}
        </Button>
      </form>

      {/* ================= DANGER ZONE BLOCK ================= */}
      <div className="border border-red-950 bg-red-950/5 p-8 rounded-[2rem] space-y-4">
        <div>
          <h3 className="text-lg font-black uppercase italic text-red-500 tracking-tight">Danger Zone</h3>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Deleting your account will permanently purge your dealership credentials, vehicles, chat records, and active bids. This action is completely irreversible.
          </p>
        </div>

        <button 
          onClick={() => setShowDeleteModal(true)}
          className="w-full py-4 bg-red-950/30 hover:bg-red-600 border border-red-900/50 hover:border-red-600 text-red-400 hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition cursor-pointer flex items-center justify-center gap-2"
        >
          <Trash2 size={14} /> Purge Account Securely
        </button>
      </div>

      {/* ================= SAFEGUARD DELETION MODAL ================= */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4">
          <div className="bg-zinc-950 border border-red-950 p-6 md:p-8 rounded-[2.5rem] max-w-md w-full space-y-6 shadow-2xl relative">
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                <ShieldAlert size={24} />
              </div>
              <h2 className="text-xl font-black uppercase italic text-white tracking-tight">Confirm Hard Deletion</h2>
              <p className="text-xs text-slate-400 font-medium">
                To confirm you wish to completely wipe your Zuta records, please type <span className="text-red-500 font-bold">DELETE</span> in the input field below.
              </p>
            </div>

            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Type 'DELETE' to confirm" 
                value={deleteConfirmation} 
                onChange={(e) => setDeleteConfirmation(e.target.value)} 
                className="w-full px-4 py-3 bg-zinc-900 border border-slate-800 rounded-xl text-white outline-none text-sm text-center font-bold tracking-wider focus:border-red-500/40 transition" 
              />

              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmation("");
                  }} 
                  className="flex-1 py-3 bg-zinc-900 hover:bg-zinc-800 border border-slate-800 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-400 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  disabled={isDeleting || deleteConfirmation !== "DELETE"}
                  onClick={handleDeleteAccount}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-950 text-white disabled:text-red-800 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center"
                >
                  {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Purge Now"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
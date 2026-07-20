import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import { prisma as db } from "@/lib/prisma";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/login");
  }

  const dbUser = await db.user.findUnique({
    where: { id: authUser.id },
    select: {
      name: true,
      email: true,
      phone: true,
    },
  });

  if (!dbUser) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-slate-100 p-4 lg:p-8 space-y-8 pt-24">
      <div>
        <h1 className="text-3xl font-black uppercase italic tracking-tight text-white">
          Account Settings
        </h1>
        <p className="text-xs text-slate-500 uppercase tracking-widest font-black mt-1">
          Manage your personal identifiers and system access
        </p>
      </div>

      <SettingsForm 
        initialData={{
          name: dbUser.name || "",
          email: dbUser.email || "",
          phone: dbUser.phone || "",
        }}
      />
    </main>
  );
}
"use server";

import { createClient } from "@/supabase/server";
import { prisma as db } from "@/lib/prisma";
import { redirect } from "next/navigation";
export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  const dbUser = await db.user.findUnique({
    where: { email },
    select: { role: true },
  });

  // Return destination instructions back to the client cleanly
  return { 
    success: true, 
    redirectTo: dbUser?.role === "ADMIN" ? "/admin-dashboard" : "/cars" 
  };
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  if (!email || !password || !name || !phone) {
    return { error: "All fields are required to complete registration." };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, phone },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    try {
      await db.user.upsert({
        where: { id: data.user.id },
        update: { email, name, phone },
        create: {
          id: data.user.id,
          email,
          name,
          phone,
          role: "USER",
          privateListingLimit: 2,
        },
      });
    } catch (err) {
      console.error("Prisma local postgres sync failed:", err);
      return { 
        error: "Account created in Supabase, but local database profile setup failed." 
      };
    }
  }

  return { success: true, redirectTo: "/cars" };
}
export async function loginWithGoogle() {
  const supabase = await createClient();
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/"); 
}
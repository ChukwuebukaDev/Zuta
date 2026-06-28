"use server";

import { createClient } from "@/supabase/server";
import { prisma as db } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  const dbUser = await db.user.findUnique({
    where: { email },
    select: { role: true }
  });

  if (dbUser?.role === "ADMIN") {
    redirect("/admin/dashboard");
  }
  
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;

  if (!email || !password || !name || !phone) {
    return redirect(`/signup?error=${encodeURIComponent("All fields are required.")}`);
  }

  const { error } = await supabase.auth.signUp({ 
    email, 
    password,
    options: {
      data: {
        name: name,
        phone: phone, 
      }
    }
  });

  if (error) {
    return redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/onboarding");
}

/**
 * Initiates the Google OAuth login/signup handshake process
 */
export async function loginWithGoogle() {
  const supabase = await createClient();
  
  // Dynamically derive the platform origin URL for environment shifting
  const origin = typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      // Points to your application's auth callback route pathing layer
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
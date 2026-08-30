"use server";

import { createClient } from "@/supabase/server";
import { prisma as db } from "@/lib/prisma";
import { redirect } from "next/navigation";

// Helper function to validate redirect paths safely
function getSafeRedirectUrl(param: unknown, fallback: string): string {
  const target = String(param ?? "").trim();

  if (target.startsWith("/") && !target.startsWith("//")) {
    return target;
  }
  return fallback;
}
export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectParam = String(formData.get("redirect") ?? "").trim();
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

const defaultRoute = dbUser?.role === "ADMIN" ? "/admin-dashboard" : "/home";
  const finalDestination = getSafeRedirectUrl(redirectParam, defaultRoute);
  return { 
    success: true, 
    redirectTo: finalDestination
  };
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const redirectParam = String(formData.get("redirect") ?? "").trim();

  // 1. Basic field validation
  if (!email || !password || !name || !phone) {
    return { error: "All fields are required to complete registration." };
  }

  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Invalid email format." };
  }
  // 2. Enforce minimum password strength

if (password.length < 8) {
  return { error: "Password must be at least 8 characters long." };
}

if(!/[A-Z]/.test(password)) {
  return { error: "Password must contain at least one uppercase letter." };
}

if (!/[0-9]/.test(password)) {
  return { error: "Password must contain at least one number." };
}

if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]/;'`~+=]/.test(password)) {
  return { error: "Password must contain at least one special character." };
}


  // 3. Register user in Supabase
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

  // 4. Sync profile metadata to local Prisma DB
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
        },
      });
    } catch (err) {
      console.error("Prisma local db sync failed:", err);
      return {
        error: "Account created, but database profile setup failed. Please contact support.",
      };
    }
  }

  // ⚡ 5. Check if Supabase issued an active session or requires email confirmation
  if (!data.session) {
    // Confirmation is ON (or email verification is required)
    return {
      success: true,
      requiresConfirmation: true,
      message: "Registration successful! Please check your email inbox to confirm your account before signing in.",
    };
  }

  // Confirmation is OFF (Active session created immediately)
  const defaultRoute = "/home";
  const finalDestination = getSafeRedirectUrl(redirectParam, defaultRoute);

  return {
    success: true,
    requiresConfirmation: false,
    redirectTo: finalDestination,
  };
}
export async function loginWithGoogle(redirectPath?: string) {
  const supabase = await createClient();
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // Build the callback URL with the return path embedded
  const callbackUrl = redirectPath 
    ? `${origin}/auth/callback?redirect=${encodeURIComponent(redirectPath)}`
    : `${origin}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: callbackUrl,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function logout(redirectPath?:string) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(redirectPath || '/'); 
}

export async function resetPasswordRequest(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email") ?? "").trim();
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  if (!email) {
    return { success: false, error: "Email address is required." };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/reset-password`,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return {
    success: true,
    message: "Password reset instructions sent to your email.",
  };
}
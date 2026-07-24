"use server";

import { createClient } from "@/supabase/server";
import { prisma as db } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {Role} from "@prisma/client";

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
          role: Role.USER,
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
const defaultRoute = "/home";
const finalDestination = getSafeRedirectUrl(redirectParam, defaultRoute);
  return { success: true, redirectTo: finalDestination };
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
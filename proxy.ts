import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { prisma as db } from "@/lib/prisma";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 1. Initialize the Supabase Client inside the Middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set({ name, value, ...options })
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set({ name, value, ...options })
          );
        },
      },
    }
  );

  // 2. Fetch the current authenticated user session safely
  const { data: { user } } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();
  const path = url.pathname;

  // Define public accessibility paths
  const isAuthPage = path.startsWith("/login") || path.startsWith("/signup");
  const isPublicApi = path.startsWith("/api/uploadthing") || path.startsWith("/api/messages/send");
  const isStaticPublic = path === "/" || path.startsWith("/cars");

  const isPublicRoute = isAuthPage || isPublicApi || isStaticPublic;
  const isAdminRoute = path.startsWith("/admin");

  // 🛡️ Guardrail 1: Protect Administrative Routes via direct DB verification
  if (isAdminRoute) {
    if (!user) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    // Read the role straight from your database row
    const dbUser = await db.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });

    if (dbUser?.role !== "ADMIN") {
      console.warn(`[UNAUTHORIZED_ADMIN_ACCESS_ATTEMPT]: User ${user.id} tried accessing ${path}`);
      url.pathname = "/cars";
      return NextResponse.redirect(url);
    }
  }

  // 🔒 Guardrail 2: Standard Private Route Gatekeeper
  if (!user && !isPublicRoute) {
    url.pathname = "/login";
    // Pass the target route forward as a return parameter
    url.searchParams.set("redirect_url", path);
    return NextResponse.redirect(url);
  }

  // 🔄 Guardrail 3: Bounce logged-in users away from auth pages
  if (user && isAuthPage) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    // Process all internal application operations smoothly
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Initialize the Supabase SSR client for the Edge Runtime
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set({
              name,
              value,
              ...options,
            });
          });

          // Recreate the response while preserving the request headers
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set({
              name,
              value,
              ...options,
            });
          });
        },
      },
    }
  );

  // Always validate the authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();
  const path = url.pathname;

  // -----------------------------
  // Route Definitions
  // -----------------------------

  const isAuthPage =
    path.startsWith("/login") ||
    path.startsWith("/signup");

  const isPublicApi =
    path.startsWith("/api/uploadthing") ||
    path.startsWith("/api/messages/send") ||
    path.startsWith("/api/onboarding");

  const isStaticPublic =
    path === "/" ||
    path.startsWith("/cars") ||
    path.startsWith("/parts") ||
    path.startsWith("/services") ||
    path.startsWith("/marketplace/search") ||
    path.startsWith("/profile") ||
    path.startsWith("/about") ||
    path.startsWith("/home");

  const isDashboardRoute =
    path.startsWith("/dashboard");

  const isPublicRoute =
    isAuthPage ||
    isPublicApi ||
    isStaticPublic;

  // -----------------------------
  // Guardrail 1
  // Protect private routes
  // -----------------------------

  if (!user && !isPublicRoute) {
    url.pathname = "/login";
    url.searchParams.set("redirect_url", path);

    return NextResponse.redirect(url);
  }

  // -----------------------------
  // Guardrail 2
  // Prevent authenticated users
  // from revisiting login/signup
  // -----------------------------

  if (user && isAuthPage) {
    url.pathname = "/";

    return NextResponse.redirect(url);
  }

  // -----------------------------
  // Guardrail 3
  // Dealer Dashboard Protection
  // -----------------------------

  if (user && isDashboardRoute) {
    console.log("[DASHBOARD_ACCESS_ATTEMPT]:", user);
    const role =
      user.user_metadata?.role
        ?.toString()
        .toUpperCase();

    const allowedRoles = new Set([
      "DEALER",
      "ADMIN",
    ]);

    if (!allowedRoles.has(role ?? "")) {
      console.warn(
        `[UNAUTHORIZED_DASHBOARD_ACCESS] User=${user.id} Role=${role}`
      );

      url.pathname = "/profile";

      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|webp|ico|ttf|woff2?|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
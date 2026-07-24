import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

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

  // Refresh the session and get the authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // =====================================================
  // Route Classification
  // =====================================================

  const isApiRoute = pathname.startsWith("/api");

  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup");

  const isPublicApi =
    pathname.startsWith("/api/uploadthing") ||
    pathname.startsWith("/api/messages/send") ||
    pathname.startsWith("/api/onboarding");

  const isPublicPage =
    pathname === "/" ||
    pathname.startsWith("/home") ||
    pathname.startsWith("/cars") ||
    pathname.startsWith("/parts") ||
    pathname.startsWith("/services") ||
    pathname.startsWith("/marketplace/search") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/about");

  const isDashboardRoute =
    pathname.startsWith("/dashboard");

  const isPublicRoute =
    isAuthPage ||
    isPublicApi ||
    isPublicPage;

  // =====================================================
  // Guard 1
  // Require authentication
  // =====================================================

  if (!user && !isPublicRoute) {
    // APIs should return 401 instead of redirecting
    if (isApiRoute) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const redirectPath =
      request.nextUrl.pathname +
      request.nextUrl.search;

    url.pathname = "/login";
    url.searchParams.set("redirect", redirectPath);

    return NextResponse.redirect(url);
  }

  // =====================================================
  // Guard 2
  // Prevent authenticated users from revisiting auth pages
  // =====================================================

  if (user && isAuthPage) {
    url.pathname = "/";

    return NextResponse.redirect(url);
  }

  // =====================================================
  // Guard 3
  // Dealer/Admin dashboard protection
  // =====================================================

  if (user && isDashboardRoute) {
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
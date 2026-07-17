import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 1. Initialize Supabase SSR Client cleanly for Edge Runtime
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

  // 2. ALWAYS use getUser() in middleware for security verification
  const { data: { user } } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();
  const path = url.pathname;

  // Define route rules
  const isAuthPage = path.startsWith("/login") || path.startsWith("/signup");
  const isPublicApi = path.startsWith("/api/uploadthing") || path.startsWith("/api/messages/send") || path.startsWith("/api/onboarding");
  const isStaticPublic = path === "/" || path.startsWith("/cars");
  const isDashboardRoute = path.startsWith("/dashboard");

  const isPublicRoute = isAuthPage || isPublicApi || isStaticPublic;

  // 🔒 Guardrail 1: Standard Private Route Gatekeeper
  if (!user && !isPublicRoute) {
    url.pathname = "/login";
    url.searchParams.set("redirect_url", path);
    return NextResponse.redirect(url);
  }

  // 🔄 Guardrail 2: Bounce authenticated traffic away from auth entry doors
  if (user && isAuthPage) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // 🛡️ Guardrail 3: Secure Dealer Dashboard from standard buyers (Role-Based Access)
  if (isDashboardRoute) {
    if (!user) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    // Read the role string directly from the encrypted Supabase JWT user_metadata
    // This runs completely on the edge without making slow Prisma DB roundtrips!
    const role = user.user_metadata?.role;

    if (role !== "DEALER" && role !== "ADMIN") {
      console.warn(`[UNAUTHORIZED_DASHBOARD_ACCESS]: User ${user.id} tried accessing dealer console with role: ${role}`);
      
      // Send standard buyers to their personal garage/profile page instead of the dealer panel
      url.pathname = "/profile"; 
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
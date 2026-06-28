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

  // 2. Refresh session and get the user token context safely
  // ALWAYS use getUser() in middleware for security verification
  const { data: { user } } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();
  const path = url.pathname;

  // Define route rules
  const isAuthPage = path.startsWith("/login") || path.startsWith("/signup");
  const isPublicApi = path.startsWith("/api/uploadthing") || path.startsWith("/api/messages/send");
  const isStaticPublic = path === "/" || path.startsWith("/cars");

  const isPublicRoute = isAuthPage || isPublicApi || isStaticPublic;

  // 🔒 Guardrail 1: Standard Private Route Gatekeeper (Handles your profile page!)
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

  return response;
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
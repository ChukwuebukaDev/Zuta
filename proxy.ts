import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define all layout routes that are publicly open to non-authenticated visitors
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)', 
  '/sign-up(.*)',
  '/',
  '/cars',
  '/cars/(.*)',
  '/api/uploadthing(.*)',
  '/api/messages/send'
]);

// Explicitly target your isolated administration dashboard routes
const isAdminRoute = createRouteMatcher([
  '/admin(.*)'
]);

export default clerkMiddleware(async (auth, request) => {
  const { userId, sessionClaims } = await auth();

  // 🛡️ 1. Enforce strict role validation for administration dashboards
  if (isAdminRoute(request)) {
    // Access the public metadata layer safely from the session claim token payload
    const metadata = sessionClaims?.metadata as { role?: string } | undefined;
    const role = metadata?.role;

    // Security Gate: Reject if not authenticated or if role configuration string fails validation
    if (!userId || role !== "admin") {
      console.warn(`[UNAUTHORIZED_ADMIN_ACCESS_ATTEMPT]: User ${userId} tried accessing ${request.nextUrl.pathname} with role: ${role}`);
      
      // Bounce unauthorized requests back to the clean vehicle listings index
      const bounceUrl = new URL("/cars", request.url);
      return NextResponse.redirect(bounceUrl);
    }
  }

  // 🔒 2. General application safety rule: Protection gate for standard private routes
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
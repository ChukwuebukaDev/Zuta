import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// landing page and sign-in/up to be public.
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)', 
  '/sign-up(.*)',
  '/',
  '/api/uploadthing(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
//   const { userId, sessionClaims } = await auth();
//   // private routes
//   if (request.nextUrl.pathname.startsWith("/admin")) {
//   const role = sessionClaims?.metadata?.role;
// console.log("--- MIDDLEWARE AUTH CHECK ---");
//   console.log("Path:", request.nextUrl.pathname);
//   console.log("Detected Role:", role);
//   console.log("Full Metadata:", JSON.stringify(sessionClaims?.metadata));
//     if (role !== "admin") {
//       const url = new URL("/", request.url);
//       return NextResponse.redirect(url);
//     }
//   }
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

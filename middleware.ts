import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose'; 

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token && request.nextUrl.pathname.startsWith('/cars')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    if (token) {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);
      
      if (request.nextUrl.pathname === '/login') {
        return NextResponse.redirect(new URL('/cars', request.url));
      }
    }
  } catch (error) {
    // Token is invalid or expired
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// 4. Only run middleware on these paths
export const config = {
  matcher: ['/cars/:path*', '/login'],
};
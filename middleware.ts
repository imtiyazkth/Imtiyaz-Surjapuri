import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/session";
import { SESSION_COOKIE_NAME } from "@/lib/constants";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes (not /admin/login itself)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const decoded = await verifySession(sessionCookie);
    if (!decoded) {
      const response = NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
      // Clear the invalid cookie
      response.cookies.delete(SESSION_COOKIE_NAME);
      return response;
    }

    // Valid session — add user info to headers for downstream use
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-uid", decoded.uid);
    requestHeaders.set("x-user-email", decoded.email ?? "");

    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    // Exclude static files from middleware
    "/((?!_next/static|_next/image|favicon.ico|icons).*)",
  ],
};

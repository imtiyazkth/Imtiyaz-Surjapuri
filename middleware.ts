import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin/* routes except login page
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const session = request.cookies.get("session")?.value;

    if (!session) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      const res = NextResponse.redirect(loginUrl);
      // Clear any stale session cookie
      res.cookies.delete("session");
      return res;
    }

    // Cookie exists — full verification happens inside each server component
    // (middleware runs on Edge Runtime — no Firebase Admin SDK here)
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  // Only run middleware on admin routes — nothing else
  matcher: ["/admin/:path*"],
};

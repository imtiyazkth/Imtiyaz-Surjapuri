import { NextRequest, NextResponse } from "next/server";

// Next.js 16: proxy.ts replaces middleware.ts
// Function MUST be named "proxy" (not "middleware")
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin/* except the login page itself
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const session = request.cookies.get("session")?.value;
    if (!session) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete("session");
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

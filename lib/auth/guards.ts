import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";

const SESSION_COOKIE = "session";

/**
 * Verify admin session for API routes.
 * Returns null if authenticated, or a 401/403 Response to return immediately.
 */
export async function requireAdmin(
  request: NextRequest
): Promise<NextResponse | null> {
  const sessionCookie = request.cookies.get(SESSION_COOKIE)?.value;

  if (!sessionCookie) {
    return NextResponse.json(
      { error: "Unauthorised — no session" },
      { status: 401 }
    );
  }

  try {
    await adminAuth.verifySessionCookie(sessionCookie, true);
    return null; // authenticated
  } catch {
    const res = NextResponse.json(
      { error: "Session expired — please login again" },
      { status: 401 }
    );
    res.cookies.delete(SESSION_COOKIE);
    return res;
  }
}

import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "./session";
import { SESSION_COOKIE_NAME } from "@/lib/constants";

/**
 * Use this at the top of any admin API route handler.
 * Returns null if authenticated, or a 401 Response to return immediately.
 *
 * Usage:
 *   const authError = await requireAdmin(request);
 *   if (authError) return authError;
 */
export async function requireAdmin(
  request: NextRequest
): Promise<NextResponse | null> {
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const decoded = await verifySession(sessionCookie);
  if (!decoded) {
    return NextResponse.json({ error: "Session expired" }, { status: 401 });
  }

  return null; // authenticated — proceed
}

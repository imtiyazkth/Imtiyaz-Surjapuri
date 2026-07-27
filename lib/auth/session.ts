import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";
import {
  SESSION_COOKIE_NAME,
  SESSION_DURATION_MS,
} from "@/lib/constants";

/**
 * Create a session cookie from a Firebase ID token.
 * Called from the /api/auth/login route after credential verification.
 */
export async function createSessionCookie(idToken: string): Promise<string> {
  return adminAuth.createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION_MS,
  });
}

/**
 * Verify the session cookie and return the decoded claims.
 * Returns null if invalid or expired.
 */
export async function verifySession(sessionCookie: string) {
  try {
    return await adminAuth.verifySessionCookie(sessionCookie, true);
  } catch {
    return null;
  }
}

/**
 * Read and verify the current request's session cookie.
 * Use this in Server Components and API routes.
 */
export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!session) return null;
  return verifySession(session);
}

/**
 * Check if the current request is authenticated.
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}

export { SESSION_COOKIE_NAME, SESSION_DURATION_MS };

import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { createSessionCookie, SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { SESSION_DURATION_MS } from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    const { idToken, securityToken } = await request.json();

    // ── Security token check ───────────────────────────────────
    // Must have passed security questions first
    if (!securityToken) {
      return NextResponse.json(
        { error: "Security verification required" },
        { status: 403 }
      );
    }

    // Decode and verify the security token (base64: "verified:timestamp")
    let tokenAge: number;
    try {
      const decoded = Buffer.from(securityToken, "base64").toString("utf-8");
      if (!decoded.startsWith("verified:")) throw new Error("invalid");
      const ts = parseInt(decoded.split(":")[1], 10);
      tokenAge = Date.now() - ts;
    } catch {
      return NextResponse.json({ error: "Invalid security token" }, { status: 403 });
    }

    // Token must be used within 5 minutes
    if (tokenAge > 5 * 60 * 1000) {
      return NextResponse.json(
        { error: "Security verification expired. Please verify again." },
        { status: 403 }
      );
    }

    // ── Firebase ID token verification ─────────────────────────
    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json({ error: "ID token required" }, { status: 400 });
    }

    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(idToken);
    } catch {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // ── Firestore role check ───────────────────────────────────
    const userDoc = await adminDb.collection("users").doc(decodedToken.uid).get();

    if (!userDoc.exists) {
      return NextResponse.json(
        { error: "Access denied — not registered as admin" },
        { status: 403 }
      );
    }

    const userData = userDoc.data();
    if (userData?.role !== "admin" && userData?.role !== "editor") {
      return NextResponse.json(
        { error: "Access denied — insufficient role" },
        { status: 403 }
      );
    }

    // ── Create session cookie ──────────────────────────────────
    const sessionCookie = await createSessionCookie(idToken);

    await adminDb.collection("users").doc(decodedToken.uid).update({
      lastLogin: new Date().toISOString(),
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge:   SESSION_DURATION_MS / 1000,
      path:     "/",
    });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

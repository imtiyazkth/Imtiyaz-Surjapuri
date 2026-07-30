import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { createHmac, timingSafeEqual } from "crypto";
import { SESSION_COOKIE_NAME } from "@/lib/constants";

const SESSION_DURATION_MS = 14 * 24 * 60 * 60 * 1000; // 14 days
const TOKEN_VALID_MS      = 5 * 60 * 1000;              // 5 minutes

function verifySecurityToken(token: string): boolean {
  try {
    const secret  = process.env.ADMIN_TOKEN_SECRET ?? "change-me-in-vercel";
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    // Format: "verified:{timestamp}:{sig}"
    const parts   = decoded.split(":");
    if (parts.length !== 3 || parts[0] !== "verified") return false;

    const timestamp = parseInt(parts[1], 10);
    const sig       = parts[2];
    const payload   = `verified:${timestamp}`;

    // Check token age (max 5 minutes)
    if (Date.now() - timestamp > TOKEN_VALID_MS) return false;

    // Verify HMAC signature
    const expected = createHmac("sha256", secret).update(payload).digest("hex");
    const expBuf   = Buffer.from(expected);
    const sigBuf   = Buffer.from(sig);

    if (expBuf.length !== sigBuf.length) return false;
    return timingSafeEqual(expBuf, sigBuf);
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body?.idToken || !body?.securityToken) {
      return NextResponse.json(
        { error: "ID token and security verification required" },
        { status: 400 }
      );
    }

    const { idToken, securityToken } = body as {
      idToken: string;
      securityToken: string;
    };

    // ── 1. Verify HMAC security token ─────────────────────────
    if (!verifySecurityToken(securityToken)) {
      return NextResponse.json(
        { error: "Security verification invalid or expired. Please verify again." },
        { status: 403 }
      );
    }

    // ── 2. Verify Firebase ID token ───────────────────────────
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(idToken, true);
    } catch {
      return NextResponse.json(
        { error: "Invalid Firebase credentials" },
        { status: 401 }
      );
    }

    // ── 3. Check Firestore role ────────────────────────────────
    const userDoc = await adminDb
      .collection("users")
      .doc(decodedToken.uid)
      .get();

    if (!userDoc.exists) {
      return NextResponse.json(
        { error: "Access denied — account not registered" },
        { status: 403 }
      );
    }

    const role = userDoc.data()?.role;
    if (role !== "admin" && role !== "editor") {
      return NextResponse.json(
        { error: "Access denied — insufficient permissions" },
        { status: 403 }
      );
    }

    // ── 4. Create HTTP-only session cookie ────────────────────
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_DURATION_MS,
    });

    await adminDb.collection("users").doc(decodedToken.uid).update({
      lastLogin: new Date().toISOString(),
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "strict", // upgraded from lax for CSRF protection
      maxAge:   SESSION_DURATION_MS / 1000,
      path:     "/",
    });

    return response;
  } catch (err: unknown) {
    console.error("[POST /api/auth/login]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

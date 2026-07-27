import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { createSessionCookie, SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { SESSION_DURATION_MS } from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json(
        { error: "ID token is required" },
        { status: 400 }
      );
    }

    // Verify the ID token with Firebase Admin
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(idToken);
    } catch {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check the user has an admin role in Firestore
    const userDoc = await adminDb
      .collection("users")
      .doc(decodedToken.uid)
      .get();

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

    // Create session cookie
    const sessionCookie = await createSessionCookie(idToken);

    // Update last login
    await adminDb.collection("users").doc(decodedToken.uid).update({
      lastLogin: new Date().toISOString(),
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_DURATION_MS / 1000,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

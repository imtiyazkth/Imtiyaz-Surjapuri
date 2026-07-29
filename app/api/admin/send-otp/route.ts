import { NextResponse } from "next/server";

// OTP email system disabled.
// Admin login uses: Firebase Auth + Security Questions (2-step).
// No OTP / no 123456 bypass allowed.
export async function POST() {
  return NextResponse.json(
    { error: "OTP system is disabled. Use the standard admin login." },
    { status: 410 }
  );
}

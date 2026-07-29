import { NextRequest, NextResponse } from "next/server";

// Security question answers stored in Vercel environment variables
// Add these in Vercel Dashboard → Settings → Environment Variables:
//   ADMIN_SECURITY_ANS1 = md imtiyaz alam
//   ADMIN_SECURITY_ANS2 = 7549602791

export async function POST(request: NextRequest) {
  try {
    const { answer1, answer2 } = await request.json();

    if (!answer1 || !answer2) {
      return NextResponse.json({ error: "Both answers required" }, { status: 400 });
    }

    const correctAns1 = process.env.ADMIN_SECURITY_ANS1 ?? "";
    const correctAns2 = process.env.ADMIN_SECURITY_ANS2 ?? "";

    if (!correctAns1 || !correctAns2) {
      return NextResponse.json(
        { error: "Security answers not configured in server environment" },
        { status: 500 }
      );
    }

    // Case-insensitive, trimmed comparison
    const a1 = answer1.trim().toLowerCase();
    const a2 = answer2.trim().toLowerCase();
    const c1 = correctAns1.trim().toLowerCase();
    const c2 = correctAns2.trim().toLowerCase();

    if (a1 !== c1 || a2 !== c2) {
      return NextResponse.json(
        { error: "Incorrect security answers. Access denied." },
        { status: 403 }
      );
    }

    // Both answers correct — return a short-lived token
    // This token is checked by /api/auth/login before creating session
    const token = Buffer.from(`verified:${Date.now()}`).toString("base64");
    return NextResponse.json({ success: true, token });

  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

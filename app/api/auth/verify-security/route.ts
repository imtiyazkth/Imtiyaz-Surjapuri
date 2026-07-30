import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

// Rate limit store (in-memory — resets on cold start)
// For production scale, replace with Redis / KV store
const attempts = new Map<string, { count: number; resetAt: number }>();

const MAX_ATTEMPTS  = 5;   // max tries per IP per window
const WINDOW_MS     = 15 * 60 * 1000; // 15 minutes

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now  = Date.now();
  const data = attempts.get(ip);

  if (!data || now > data.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1 };
  }

  if (data.count >= MAX_ATTEMPTS) {
    return { allowed: false, remaining: 0 };
  }

  data.count++;
  return { allowed: true, remaining: MAX_ATTEMPTS - data.count };
}

function generateToken(): string {
  // HMAC-SHA256 signed token: "verified:{timestamp}" signed with ADMIN_TOKEN_SECRET
  const secret    = process.env.ADMIN_TOKEN_SECRET ?? "change-me-in-vercel";
  const timestamp = Date.now().toString();
  const payload   = `verified:${timestamp}`;
  const sig       = createHmac("sha256", secret).update(payload).digest("hex");
  return Buffer.from(`${payload}:${sig}`).toString("base64");
}

export async function POST(request: NextRequest) {
  // ── Rate limiting ─────────────────────────────────────────────
  const ip = getClientIp(request);
  const rl = checkRateLimit(ip);

  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait 15 minutes." },
      {
        status: 429,
        headers: {
          "Retry-After":            String(WINDOW_MS / 1000),
          "X-RateLimit-Remaining":  "0",
        },
      }
    );
  }

  try {
    const body = await request.json().catch(() => null);
    if (!body?.answer1 || !body?.answer2) {
      return NextResponse.json(
        { error: "Both security answers are required" },
        { status: 400 }
      );
    }

    const { answer1, answer2 } = body as { answer1: string; answer2: string };

    // Validate input length
    if (answer1.length > 200 || answer2.length > 100) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const correctAns1 = process.env.ADMIN_SECURITY_ANS1 ?? "";
    const correctAns2 = process.env.ADMIN_SECURITY_ANS2 ?? "";

    if (!correctAns1 || !correctAns2) {
      console.error("[verify-security] ADMIN_SECURITY_ANS1/2 not set in environment");
      return NextResponse.json(
        { error: "Security not configured. Contact the administrator." },
        { status: 503 }
      );
    }

    // Timing-safe comparison (prevents timing attacks)
    const a1 = Buffer.from(answer1.trim().toLowerCase().padEnd(200));
    const a2 = Buffer.from(answer2.trim().toLowerCase().padEnd(100));
    const c1 = Buffer.from(correctAns1.trim().toLowerCase().padEnd(200));
    const c2 = Buffer.from(correctAns2.trim().toLowerCase().padEnd(100));

    const match1 = timingSafeEqual(a1, c1);
    const match2 = timingSafeEqual(a2, c2);

    if (!match1 || !match2) {
      return NextResponse.json(
        {
          error:     "Incorrect security answers.",
          remaining: rl.remaining,
        },
        { status: 403 }
      );
    }

    // Clear rate limit on success
    attempts.delete(ip);

    // Issue a signed, time-limited token (valid 5 minutes)
    const token = generateToken();

    return NextResponse.json({ success: true, token });
  } catch (e: unknown) {
    console.error("[verify-security] Error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";

// File upload via Firebase Storage is disabled.
// All media uses external URLs (Unsplash, Cloudinary, Imgur, etc.)
// This route exists as a documented no-op to prevent confusion.
export async function POST(request: NextRequest) {
  // Still require admin auth even though upload is disabled
  const authErr = await requireAdmin(request);
  if (authErr) return authErr;

  return NextResponse.json(
    {
      error:  "Direct file upload is disabled.",
      hint:   "Paste an external image URL in the Cover Image field.",
      sources: ["https://unsplash.com", "https://cloudinary.com", "https://imgur.com"],
    },
    { status: 410 }
  );
}

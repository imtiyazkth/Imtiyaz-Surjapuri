import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/auth/guards";
import { FieldValue } from "firebase-admin/firestore";

interface Params {
  params: Promise<{ id: string }>;
}

// ── GET — public (for article detail page) ────────────────────
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const doc = await adminDb.collection("articles").doc(id).get();
    if (!doc.exists) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ article: { id: doc.id, ...doc.data() } });
  } catch (e: unknown) {
    console.error("[GET /api/articles/[id]]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ── PUT — admin only ───────────────────────────────────────────
export async function PUT(request: NextRequest, { params }: Params) {
  const authErr = await requireAdmin(request);
  if (authErr) return authErr;

  try {
    const { id } = await params;
    const body   = await request.json();

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    // Prevent overwriting system fields
    const { id: _id, viewCount: _vc, likeCount: _lc, createdAt: _ca, ...safeBody } = body;
    void _id; void _vc; void _lc; void _ca;

    await adminDb.collection("articles").doc(id).update({
      ...safeBody,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    console.error("[PUT /api/articles/[id]]", e);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// ── DELETE — admin only ────────────────────────────────────────
export async function DELETE(request: NextRequest, { params }: Params) {
  const authErr = await requireAdmin(request);
  if (authErr) return authErr;

  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await adminDb.collection("articles").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    console.error("[DELETE /api/articles/[id]]", e);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import {
  getArticleById,
  updateArticle,
  deleteArticle,
} from "@/lib/db/articles";

interface Params {
  params: Promise<{ id: string }>;
}

// GET /api/articles/[id] — admin only
export async function GET(request: NextRequest, { params }: Params) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  const { id } = await params;
  const article = await getArticleById(id);
  if (!article) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ article });
}

// PUT /api/articles/[id] — update (admin only)
export async function PUT(request: NextRequest, { params }: Params) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  const { id } = await params;
  try {
    const body = await request.json();
    await updateArticle(id, body);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PUT /api/articles/[id] error:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// DELETE /api/articles/[id] — delete (admin only)
export async function DELETE(request: NextRequest, { params }: Params) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  const { id } = await params;
  try {
    await deleteArticle(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/articles/[id] error:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

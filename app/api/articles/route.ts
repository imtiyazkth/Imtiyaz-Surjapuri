import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import {
  getPublishedArticles,
  getAllArticlesAdmin,
  createArticle,
  searchArticles,
} from "@/lib/db/articles";
import { POSTS_PER_PAGE } from "@/lib/constants";

// GET /api/articles — public paginated list OR admin full list
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const q = searchParams.get("q");
    const category = searchParams.get("category") ?? undefined;
    const tag = searchParams.get("tag") ?? undefined;
    const limit = Math.min(
      parseInt(searchParams.get("limit") ?? String(POSTS_PER_PAGE)),
      50
    );
    const admin = searchParams.get("admin") === "1";

    if (admin) {
      const authError = await requireAdmin(request);
      if (authError) return authError;
      const status = searchParams.get("status") ?? undefined;
      const articles = await getAllArticlesAdmin({ status, limit });
      return NextResponse.json({ articles });
    }

    if (q) {
      const results = await searchArticles(q, limit);
      return NextResponse.json({ articles: results });
    }

    const articles = await getPublishedArticles({ limit, category, tag });
    return NextResponse.json({ articles });
  } catch (err) {
    console.error("GET /api/articles error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST /api/articles — create (admin only)
export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();

    // Basic validation
    if (!body.title || !body.contentHtml) {
      return NextResponse.json(
        { error: "title and contentHtml are required" },
        { status: 400 }
      );
    }

    const { id, slug } = await createArticle(body);
    return NextResponse.json({ id, slug }, { status: 201 });
  } catch (err) {
    console.error("POST /api/articles error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

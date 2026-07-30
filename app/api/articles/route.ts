import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/auth/guards";
import { FieldValue } from "firebase-admin/firestore";

// ── Field normalizer ──────────────────────────────────────────
function normalize(id: string, data: Record<string, unknown>) {
  const raw = (data.contentHtml ?? data.content ?? "") as string;
  const excerpt =
    (data.excerpt as string) ||
    raw
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 200);

  return {
    id,
    slug:            (data.slug            as string) ?? `article-${id}`,
    title:           (data.title           as string) ?? "Untitled",
    excerpt,
    contentHtml:     raw,
    coverImage:      (data.coverImage      as string) ?? "",
    coverImageAlt:   (data.coverImageAlt   as string) ?? "",
    primaryCategory: (data.primaryCategory ?? data.category ?? "General") as string,
    catColor:        (data.catColor        as string) ?? "#C41C1C",
    categories:      (data.categories      as string[]) ?? [(data.category ?? "general") as string],
    tags:            (data.tags            as string[]) ?? [],
    author:          (data.author          as string) ?? "Imtiyaz Surjapuri",
    readTime:        (data.readTime        as string) ?? "2 min",
    status:          (data.status          as string) ?? "published",
    featured:        Boolean(data.featured  ?? data.isFeatured  ?? false),
    breaking:        Boolean(data.breaking  ?? data.isBreaking  ?? false),
    trending:        Boolean(data.trending  ?? data.isTrending  ?? false),
    viewCount:       Number(data.viewCount  ?? 0),
    likeCount:       Number(data.likeCount  ?? 0),
    youtubeLinks:    (data.youtubeLinks ?? data.youtubeUrls ?? []) as string[],
    socialLinks:     (data.socialLinks  ?? {}) as Record<string, string>,
    publishedAt:     (data.publishedAt  ?? data.createdAt ?? null) as string | null,
    createdAt:       (data.createdAt    ?? new Date().toISOString()) as string,
    updatedAt:       (data.updatedAt    ?? new Date().toISOString()) as string,
  };
}

// ── GET — public read ──────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const limitN   = Math.min(parseInt(searchParams.get("limit") ?? "18"), 100);
    const category = searchParams.get("category") ?? "";
    const q        = searchParams.get("q") ?? "";
    const tag      = searchParams.get("tag") ?? "";
    const isAdmin  = searchParams.get("admin") === "1";

    // Admin requests must be authenticated
    if (isAdmin) {
      const authErr = await requireAdmin(request);
      if (authErr) return authErr;
    }

    const snapshot = await adminDb
      .collection("articles")
      .orderBy("createdAt", "desc")
      .limit(isAdmin ? 200 : 200)
      .get();

    let articles = snapshot.docs.map((d) =>
      normalize(d.id, d.data() as Record<string, unknown>)
    );

    // Public: only show published
    if (!isAdmin) {
      articles = articles.filter(
        (a) => !a.status || a.status === "published"
      );
    }

    // Deduplicate by slug
    const seen = new Set<string>();
    articles = articles.filter((a) => {
      if (seen.has(a.slug)) return false;
      seen.add(a.slug);
      return true;
    });

    // Category filter
    if (category) {
      const cat = category.toLowerCase();
      articles = articles.filter(
        (a) =>
          a.primaryCategory?.toLowerCase().replace(/\s+/g, "-") === cat ||
          a.primaryCategory?.toLowerCase() === cat.replace(/-/g, " ") ||
          a.categories?.some(
            (c) =>
              c === cat ||
              c.toLowerCase().replace(/\s+/g, "-") === cat
          )
      );
    }

    // Tag filter
    if (tag) {
      articles = articles.filter((a) =>
        a.tags?.some((t) => t === tag)
      );
    }

    // Search filter
    if (q) {
      const ql = q.toLowerCase().trim();
      articles = articles.filter(
        (a) =>
          a.title?.toLowerCase().includes(ql) ||
          a.excerpt?.toLowerCase().includes(ql) ||
          a.primaryCategory?.toLowerCase().includes(ql) ||
          a.tags?.some((t) => t.toLowerCase().includes(ql)) ||
          a.author?.toLowerCase().includes(ql)
      );
    }

    return NextResponse.json({
      success: true,
      articles: articles.slice(0, limitN),
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("[GET /api/articles]", msg);
    return NextResponse.json(
      { success: false, articles: [], error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

// ── POST — admin only ──────────────────────────────────────────
export async function POST(request: NextRequest) {
  const authErr = await requireAdmin(request);
  if (authErr) return authErr;

  try {
    const body = await request.json();

    if (!body?.title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const now  = new Date().toISOString();
    const slug =
      String(body.slug || "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") ||
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 80) +
        "-" +
        Date.now().toString(36);

    const data = {
      slug,
      title:           String(body.title).trim(),
      excerpt:         String(body.excerpt ?? "").trim(),
      contentHtml:     String(body.contentHtml ?? body.content ?? ""),
      coverImage:      String(body.coverImage ?? ""),
      coverImageAlt:   String(body.coverImageAlt ?? body.title ?? ""),
      primaryCategory: String(body.primaryCategory ?? body.category ?? "General"),
      catColor:        String(body.catColor ?? "#C41C1C"),
      categories:      Array.isArray(body.categories) ? body.categories : [body.category ?? "general"],
      tags:            Array.isArray(body.tags) ? body.tags : [],
      author:          String(body.author ?? "Imtiyaz Surjapuri"),
      readTime:        String(body.readTime ?? "2 min"),
      status:          String(body.status ?? "published"),
      featured:        Boolean(body.featured  ?? false),
      breaking:        Boolean(body.breaking  ?? false),
      trending:        Boolean(body.trending  ?? false),
      youtubeLinks:    Array.isArray(body.youtubeLinks) ? body.youtubeLinks : [],
      socialLinks:     body.socialLinks ?? {},
      viewCount:       0,
      likeCount:       0,
      publishedAt:     body.status === "published" ? now : null,
      createdAt:       now,
      updatedAt:       now,
    };

    const ref = await adminDb.collection("articles").add(data);
    return NextResponse.json({ success: true, id: ref.id, slug }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("[POST /api/articles]", msg);
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    );
  }
}

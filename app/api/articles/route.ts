import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

function normalize(id: string, data: Record<string, unknown>) {
  const rawContent = (data.contentHtml ?? data.content ?? "") as string;
  const excerpt = (data.excerpt as string) ||
    rawContent.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 200);

  return {
    id,
    slug:            (data.slug as string)            ?? `article-${id}`,
    title:           (data.title as string)           ?? "Untitled",
    excerpt,
    contentHtml:     rawContent,
    coverImage:      (data.coverImage as string)      ?? "",
    coverImageAlt:   (data.coverImageAlt as string)   ?? (data.title as string) ?? "",
    primaryCategory: (data.primaryCategory ?? data.category ?? "General") as string,
    catColor:        (data.catColor as string)        ?? "#C41C1C",
    categories:      (data.categories as string[])    ?? [(data.category ?? "general") as string],
    tags:            (data.tags as string[])           ?? [],
    author:          (data.author as string)           ?? "Imtiyaz Surjapuri",
    readTime:        (data.readTime as string)         ?? "2 min",
    status:          (data.status as string)           ?? "published",
    featured:        Boolean(data.featured  ?? data.isFeatured  ?? false),
    breaking:        Boolean(data.breaking  ?? data.isBreaking  ?? false),
    trending:        Boolean(data.trending  ?? data.isTrending  ?? false),
    viewCount:       Number(data.viewCount  ?? 0),
    likeCount:       Number(data.likeCount  ?? 0),
    youtubeLinks:    (data.youtubeLinks ?? data.youtubeUrls ?? []) as string[],
    socialLinks:     (data.socialLinks ?? {}) as Record<string, string>,
    publishedAt:     (data.publishedAt ?? data.createdAt ?? null) as string | null,
    createdAt:       (data.createdAt ?? new Date().toISOString()) as string,
    updatedAt:       (data.updatedAt ?? new Date().toISOString()) as string,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const limitN   = Math.min(parseInt(searchParams.get("limit") ?? "18"), 50);
    const category = searchParams.get("category") ?? "";
    const q        = searchParams.get("q") ?? "";
    const tag      = searchParams.get("tag") ?? "";
    const admin    = searchParams.get("admin") === "1";

    // Fetch all articles (no status filter in query — some docs may lack status field)
    const snapshot = await adminDb
      .collection("articles")
      .orderBy("createdAt", "desc")
      .limit(admin ? 100 : 200)
      .get();

    let articles = snapshot.docs.map((d) =>
      normalize(d.id, d.data() as Record<string, unknown>)
    );

    // Only show published for public requests
    if (!admin) {
      articles = articles.filter(
        (a) => a.status === "published" || a.status === undefined || a.status === ""
      );
    }

    // Deduplicate by slug
    const seen = new Set<string>();
    articles = articles.filter((a) => {
      if (seen.has(a.slug)) return false;
      seen.add(a.slug);
      return true;
    });

    // Filter by category
    if (category) {
      articles = articles.filter((a) =>
        a.primaryCategory?.toLowerCase().replace(/\s+/g, "-") === category ||
        a.primaryCategory?.toLowerCase() === category.replace(/-/g, " ") ||
        a.categories?.some((c) => c === category || c.toLowerCase().replace(/\s+/g,"-") === category)
      );
    }

    // Filter by tag
    if (tag) {
      articles = articles.filter((a) =>
        a.tags?.some((t) => t === tag)
      );
    }

    // Search filter
    if (q) {
      const ql = q.toLowerCase();
      articles = articles.filter((a) =>
        a.title?.toLowerCase().includes(ql) ||
        a.excerpt?.toLowerCase().includes(ql) ||
        a.primaryCategory?.toLowerCase().includes(ql) ||
        a.tags?.some((t) => t.toLowerCase().includes(ql)) ||
        a.author?.toLowerCase().includes(ql)
      );
    }

    // Apply limit after all filters
    articles = articles.slice(0, limitN);

    return NextResponse.json({ success: true, articles });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("GET /api/articles error:", msg);
    return NextResponse.json(
      { success: false, articles: [], error: msg },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const now  = new Date().toISOString();
    const slug = (body.slug as string) ||
      body.title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        + "-" + Date.now().toString(36);

    const articleData = {
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
      featured:        Boolean(body.featured  ?? body.isFeatured  ?? false),
      breaking:        Boolean(body.breaking  ?? body.isBreaking  ?? false),
      trending:        Boolean(body.trending  ?? body.isTrending  ?? false),
      youtubeLinks:    Array.isArray(body.youtubeLinks) ? body.youtubeLinks : [],
      socialLinks:     body.socialLinks ?? {},
      viewCount:       0,
      likeCount:       0,
      publishedAt:     body.status === "published" ? now : null,
      createdAt:       now,
      updatedAt:       now,
    };

    const ref = await adminDb.collection("articles").add(articleData);
    return NextResponse.json({ success: true, id: ref.id, slug }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("POST /api/articles error:", msg);
    return NextResponse.json(
      { success: false, error: "Failed to save article", details: msg },
      { status: 500 }
    );
  }
}

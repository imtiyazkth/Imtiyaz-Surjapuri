import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Sanitize YouTube URLs array (ignore invalid or non-YouTube image links)
    const rawYoutubeUrls = body.youtubeUrls || [];
    const validYoutubeUrls = Array.isArray(rawYoutubeUrls)
      ? rawYoutubeUrls.filter((url: string) => typeof url === "string" && url.includes("youtube.com") || url.includes("youtu.be"))
      : [];

    const articleData = {
      title: body.title || "Untitled Article",
      slug: body.slug || `article-${Date.now()}`,
      content: body.content || "",
      coverImage: body.coverImage || "",
      excerpt: body.excerpt || "",
      category: body.category || "General",
      status: body.status || "published",
      isFeatured: Boolean(body.isFeatured),
      isBreaking: Boolean(body.isBreaking),
      isTrending: Boolean(body.isTrending),
      youtubeUrls: validYoutubeUrls,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to Firestore Collection
    const docRef = await db.collection("articles").add(articleData);

    return NextResponse.json({
      success: true,
      id: docRef.id,
      message: "Article published successfully to Firestore!",
    });
  } catch (error: any) {
    console.error("Firestore Publish Error:", error);
    return NextResponse.json(
      { error: "Failed to publish article", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}

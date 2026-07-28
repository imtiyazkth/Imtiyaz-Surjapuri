import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/admin";

export async function GET() {
  try {
    const snapshot = await db.collection("articles").orderBy("createdAt", "desc").get();
    const articles = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, articles });
  } catch (error: any) {
    console.error("Error fetching articles:", error);
    // Return empty array instead of throwing 500 error page
    return NextResponse.json({ success: false, articles: [], error: error?.message }, { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const rawYoutubeUrls = body.youtubeUrls || [];
    const validYoutubeUrls = Array.isArray(rawYoutubeUrls)
      ? rawYoutubeUrls.filter((url: string) => typeof url === "string" && (url.includes("youtube.com") || url.includes("youtu.be")))
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

    const docRef = await db.collection("articles").add(articleData);

    return NextResponse.json({
      success: true,
      id: docRef.id,
      slug: articleData.slug,
      message: "Article saved to Firestore successfully!",
    });
  } catch (error: any) {
    console.error("Firestore Save Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to publish article", details: error?.message },
      { status: 500 }
    );
  }
}

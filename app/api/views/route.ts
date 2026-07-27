import { NextRequest, NextResponse } from "next/server";
import { incrementViewCount, getArticleById } from "@/lib/db/articles";

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Article ID required" }, { status: 400 });
    }
    await incrementViewCount(id);
    const article = await getArticleById(id);
    return NextResponse.json({ views: article?.viewCount ?? 0 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

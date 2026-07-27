import { NextRequest, NextResponse } from "next/server";
import { incrementLikeCount, getArticleById } from "@/lib/db/articles";

export async function POST(request: NextRequest) {
  try {
    const { id, delta } = await request.json();

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Article ID required" }, { status: 400 });
    }

    if (delta !== 1 && delta !== -1) {
      return NextResponse.json({ error: "delta must be 1 or -1" }, { status: 400 });
    }

    await incrementLikeCount(id, delta as 1 | -1);
    const article = await getArticleById(id);
    return NextResponse.json({ likes: article?.likeCount ?? 0 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

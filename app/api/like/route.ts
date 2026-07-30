import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: NextRequest) {
  try {
    const { id, delta } = await request.json();

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }
    if (delta !== 1 && delta !== -1) {
      return NextResponse.json({ error: "delta must be 1 or -1" }, { status: 400 });
    }

    const ref  = adminDb.collection("articles").doc(id);
    const snap = await ref.get();

    if (!snap.exists) {
      return NextResponse.json({ likes: 0 });
    }

    await ref.update({ likeCount: FieldValue.increment(delta) });

    // Prevent negative likes
    const updated  = await ref.get();
    let likes      = Number(updated.data()?.likeCount ?? 0);
    if (likes < 0) {
      await ref.update({ likeCount: 0 });
      likes = 0;
    }

    return NextResponse.json({ success: true, likes });
  } catch (e: unknown) {
    console.error("Like error:", e);
    return NextResponse.json({ likes: 0 });
  }
}

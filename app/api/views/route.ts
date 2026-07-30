import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const ref  = adminDb.collection("articles").doc(id);
    const snap = await ref.get();

    if (!snap.exists) {
      return NextResponse.json({ views: 0 });
    }

    await ref.update({ viewCount: FieldValue.increment(1) });
    const updated = await ref.get();
    const views   = Number(updated.data()?.viewCount ?? 1);

    return NextResponse.json({ success: true, views });
  } catch (e: unknown) {
    console.error("Views error:", e);
    return NextResponse.json({ views: 0 });
  }
}

/**
 * deduplicate-articles.ts
 * Removes duplicate articles from Firestore (same slug = duplicate).
 * Keeps the FIRST document, deletes the rest.
 *
 * Run from project root:
 *   npx tsx scripts/deduplicate-articles.ts
 */
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId:   process.env.FIREBASE_ADMIN_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
      privateKey:  process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();

async function deduplicate() {
  console.log("🔍 Fetching all articles…");
  const snap = await db.collection("articles").orderBy("createdAt", "asc").get();
  console.log(`   Found ${snap.docs.length} total documents`);

  const seen    = new Map<string, string>(); // slug → first doc ID
  const toDelete: string[] = [];

  for (const doc of snap.docs) {
    const slug = doc.data().slug as string;
    if (!slug) continue;
    if (seen.has(slug)) {
      toDelete.push(doc.id);
      console.log(`   Duplicate: "${slug}" → will delete ${doc.id}`);
    } else {
      seen.set(slug, doc.id);
    }
  }

  if (toDelete.length === 0) {
    console.log("✅ No duplicates found. Database is clean.");
    return;
  }

  console.log(`\n🗑  Deleting ${toDelete.length} duplicate(s)…`);
  for (const id of toDelete) {
    await db.collection("articles").doc(id).delete();
    console.log(`   Deleted ${id}`);
  }

  console.log(`\n✅ Done. Kept ${seen.size} unique articles, deleted ${toDelete.length} duplicates.`);
}

deduplicate()
  .then(() => process.exit(0))
  .catch((err) => { console.error("❌ Error:", err); process.exit(1); });

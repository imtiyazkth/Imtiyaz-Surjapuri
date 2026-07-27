/**
 * migrate-from-sheet.ts
 *
 * One-time migration: reads DEMO_ARTICLES data and inserts into Firestore.
 *
 * Usage (run from project root in Termux):
 *   npx tsx scripts/migrate-from-sheet.ts
 *
 * Prerequisites:
 *   - .env.local must have FIREBASE_ADMIN_* variables set
 *   - npm install must be completed
 */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { slugify } from "../lib/slug";

// ── Firebase Admin init ────────────────────────────────────
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();

// ── Article data from your index.html (paste yours here) ──
const DEMO_ARTICLES = [
  {
    title: "The Silent Crisis: India's Delimitation Challenge",
    category: "Analysis",
    cat_color: "#0f766e",
    author: "Imtiyaz Surjapuri",
    readTime: "8 min",
    summary:
      "India faces a looming constitutional challenge as the delimitation exercise threatens to reshape political representation across states.",
    bodyText:
      "<p>The delimitation exercise, set to reshape India's electoral map, carries profound implications for political representation. Southern states, which have successfully controlled population growth through better education and healthcare access, now face the paradox of being penalized for their progress.</p><p>The constitutional provision that ties parliamentary representation to population could see states like Tamil Nadu, Kerala, and Karnataka lose seats while northern states gain them. This demographic shift in political power has sparked significant debate about federalism and equal representation.</p>",
    imageUrl: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800",
    featured: true,
    breaking: false,
    trending: true,
    tags: ["delimitation", "india", "politics", "constitution", "elections"],
    youtubeUrl: "",
  },
  {
    title: "Qatar Labour Reform: Progress and Pending Challenges",
    category: "Social Issues",
    cat_color: "#be185d",
    author: "Imtiyaz Surjapuri",
    readTime: "6 min",
    summary:
      "Qatar's labour reforms following 2022 FIFA World Cup scrutiny have improved conditions, but significant challenges remain for migrant workers.",
    bodyText:
      "<p>Following intense international scrutiny ahead of the 2022 FIFA World Cup, Qatar implemented sweeping labour reforms. The kafala sponsorship system underwent significant changes, allowing workers greater freedom of movement between employers.</p><p>However, implementation gaps persist. Many workers remain unaware of their rights, and enforcement mechanisms need strengthening. The promised minimum wage, while a positive step, requires better enforcement to be effective.</p>",
    imageUrl: "https://images.unsplash.com/photo-1559311745-f3a7bbaaa71f?w=800",
    featured: false,
    breaking: false,
    trending: false,
    tags: ["qatar", "labour", "migrant workers", "reform", "kafala"],
    youtubeUrl: "",
  },
  {
    title: "AI and the Future of Journalism in South Asia",
    category: "Technology",
    cat_color: "#0369a1",
    author: "Imtiyaz Surjapuri",
    readTime: "5 min",
    summary:
      "Artificial intelligence tools are transforming news production, but raise questions about accuracy, bias, and the future of human journalists.",
    bodyText:
      "<p>Newsrooms across South Asia are experimenting with AI tools for everything from translation to fact-checking. Regional language AI models are becoming increasingly capable, opening new possibilities for journalism in Hindi, Urdu, Tamil, and other languages.</p><p>However, concerns about misinformation amplification, algorithmic bias, and job displacement require careful consideration. The key lies in using AI as a tool that enhances human journalism rather than replacing it.</p>",
    imageUrl: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800",
    featured: true,
    breaking: false,
    trending: true,
    tags: ["ai", "journalism", "technology", "south asia", "media"],
    youtubeUrl: "",
  },
];

// ── Seed categories ────────────────────────────────────────
const CATEGORIES = [
  { name: "Analysis",      slug: "analysis",      color: "#0f766e", order: 1, visible: true },
  { name: "Breaking News", slug: "breaking-news", color: "#C41C1C", order: 2, visible: true },
  { name: "Opinion",       slug: "opinion",       color: "#b45309", order: 3, visible: true },
  { name: "Politics",      slug: "politics",      color: "#7c3aed", order: 4, visible: true },
  { name: "Economy",       slug: "economy",       color: "#15803d", order: 5, visible: true },
  { name: "Technology",    slug: "technology",    color: "#0369a1", order: 6, visible: true },
  { name: "Education",     slug: "education",     color: "#9333ea", order: 7, visible: true },
  { name: "Social Issues", slug: "social-issues", color: "#be185d", order: 8, visible: true },
  { name: "World",         slug: "world",         color: "#b45309", order: 9, visible: true },
  { name: "Blog",          slug: "blog",          color: "#6366f1", order: 10, visible: true },
  { name: "Video",         slug: "video",         color: "#dc2626", order: 11, visible: true },
  { name: "Photos",        slug: "photos",        color: "#d97706", order: 12, visible: true },
];

function wordCount(html: string): number {
  return html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
}

function readTimeStr(html: string): string {
  return `${Math.max(1, Math.ceil(wordCount(html) / 238))} min`;
}

async function migrateCategories() {
  console.log("📁 Seeding categories…");
  const batch = db.batch();

  for (const cat of CATEGORIES) {
    const ref = db.collection("categories").doc();
    batch.set(ref, { ...cat, count: 0 });
  }

  await batch.commit();
  console.log(`✅ ${CATEGORIES.length} categories created.`);
}

async function migrateArticles() {
  console.log("📝 Migrating articles…");

  for (const raw of DEMO_ARTICLES) {
    const slug = slugify(raw.title);
    const catSlug = slugify(raw.category);
    const readTime = readTimeStr(raw.bodyText);

    const doc = {
      slug,
      title: raw.title,
      excerpt: raw.summary,
      contentHtml: raw.bodyText,
      primaryCategory: raw.category,
      catColor: raw.cat_color,
      categories: [catSlug],
      tags: raw.tags,
      author: raw.author,
      status: "published",
      featured: raw.featured,
      breaking: raw.breaking,
      trending: raw.trending,
      coverImage: raw.imageUrl,
      coverImageAlt: raw.title,
      youtubeLinks: raw.youtubeUrl ? [raw.youtubeUrl] : [],
      viewCount: 0,
      likeCount: 0,
      readTime,
      seoTitle: "",
      seoDescription: raw.summary,
      socialLinks: {},
      sourceLinks: [],
      publishedAt: Timestamp.now(),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const ref = await db.collection("articles").add(doc);
    console.log(`  ✓ "${raw.title}" → ${ref.id} (${slug})`);
  }

  console.log(`✅ ${DEMO_ARTICLES.length} articles migrated.`);
}

async function createAdminUser() {
  // Creates a user record in Firestore for the admin
  // You must FIRST create the Firebase Auth user via Firebase Console
  // or via: firebase auth:import
  //
  // Replace YOUR_FIREBASE_AUTH_UID with the UID from Firebase Console
  const UID = "REPLACE_WITH_YOUR_FIREBASE_AUTH_UID";

  if (UID === "REPLACE_WITH_YOUR_FIREBASE_AUTH_UID") {
    console.log(
      "⚠️  Skipping admin user creation — set the UID in the script first."
    );
    return;
  }

  await db.collection("users").doc(UID).set({
    uid: UID,
    email: "admin@imtiyazsurjapuri.com",
    displayName: "Imtiyaz Surjapuri",
    role: "admin",
    createdAt: new Date().toISOString(),
    lastLogin: null,
  });

  console.log(`✅ Admin user document created for UID: ${UID}`);
}

async function main() {
  console.log("\n🚀 Starting migration…\n");
  await migrateCategories();
  await migrateArticles();
  await createAdminUser();
  console.log("\n🎉 Migration complete!\n");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});

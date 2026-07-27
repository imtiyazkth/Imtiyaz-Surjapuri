import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  increment,
  serverTimestamp,
  Timestamp,
} from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import type { Article, ArticleCard, ArticleInput } from "@/types/article";
import { sanitizeHtml } from "@/lib/sanitize";
import { slugify, estimateReadTime } from "@/lib/slug";
import { POSTS_PER_PAGE } from "@/lib/constants";

const COLLECTION = "articles";
const articlesRef = () => adminDb.collection(COLLECTION);

// ---- Serialisation helpers ----

function timestampToString(ts: Timestamp | null | undefined): string | null {
  if (!ts) return null;
  return ts.toDate().toISOString();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function docToArticle(id: string, data: Record<string, any>): Article {
  return {
    ...data,
    id,
    publishedAt: timestampToString(data.publishedAt),
    createdAt: timestampToString(data.createdAt) ?? "",
    updatedAt: timestampToString(data.updatedAt) ?? "",
    scheduledAt: timestampToString(data.scheduledAt),
  } as Article;
}

// ---- Public queries (published only) ----

export async function getPublishedArticles(opts?: {
  limit?: number;
  category?: string;
  tag?: string;
  after?: DocumentSnapshot;
}): Promise<ArticleCard[]> {
  let q = articlesRef()
    .where("status", "==", "published")
    .orderBy("publishedAt", "desc")
    .limit(opts?.limit ?? POSTS_PER_PAGE);

  if (opts?.category) {
    q = articlesRef()
      .where("status", "==", "published")
      .where("categories", "array-contains", opts.category)
      .orderBy("publishedAt", "desc")
      .limit(opts?.limit ?? POSTS_PER_PAGE);
  }

  if (opts?.tag) {
    q = articlesRef()
      .where("status", "==", "published")
      .where("tags", "array-contains", opts.tag)
      .orderBy("publishedAt", "desc")
      .limit(opts?.limit ?? POSTS_PER_PAGE);
  }

  if (opts?.after) {
    q = q.startAfter(opts.after);
  }

  const snap = await q.get();
  return snap.docs.map((d) => {
    const data = docToArticle(d.id, d.data());
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { contentHtml, contentMarkdown, ...card } = data;
    return card as ArticleCard;
  });
}

export async function getFeaturedArticles(count = 4): Promise<ArticleCard[]> {
  const snap = await articlesRef()
    .where("status", "==", "published")
    .where("featured", "==", true)
    .orderBy("publishedAt", "desc")
    .limit(count)
    .get();

  return snap.docs.map((d) => {
    const data = docToArticle(d.id, d.data());
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { contentHtml, contentMarkdown, ...card } = data;
    return card as ArticleCard;
  });
}

export async function getBreakingArticles(count = 5): Promise<ArticleCard[]> {
  const snap = await articlesRef()
    .where("status", "==", "published")
    .where("breaking", "==", true)
    .orderBy("publishedAt", "desc")
    .limit(count)
    .get();

  return snap.docs.map((d) => {
    const data = docToArticle(d.id, d.data());
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { contentHtml, contentMarkdown, ...card } = data;
    return card as ArticleCard;
  });
}

export async function getTrendingArticles(count = 5): Promise<ArticleCard[]> {
  const snap = await articlesRef()
    .where("status", "==", "published")
    .where("trending", "==", true)
    .orderBy("publishedAt", "desc")
    .limit(count)
    .get();

  return snap.docs.map((d) => {
    const data = docToArticle(d.id, d.data());
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { contentHtml, contentMarkdown, ...card } = data;
    return card as ArticleCard;
  });
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const snap = await articlesRef()
    .where("slug", "==", slug)
    .where("status", "==", "published")
    .limit(1)
    .get();

  if (snap.empty) return null;
  return docToArticle(snap.docs[0].id, snap.docs[0].data());
}

export async function getRelatedArticles(
  article: Article,
  count = 3
): Promise<ArticleCard[]> {
  if (!article.categories?.length) return [];

  const snap = await articlesRef()
    .where("status", "==", "published")
    .where("categories", "array-contains", article.primaryCategory)
    .orderBy("publishedAt", "desc")
    .limit(count + 1)
    .get();

  return snap.docs
    .filter((d) => d.id !== article.id)
    .slice(0, count)
    .map((d) => {
      const data = docToArticle(d.id, d.data());
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { contentHtml, contentMarkdown, ...card } = data;
      return card as ArticleCard;
    });
}

export async function getAllPublishedSlugs(): Promise<string[]> {
  const snap = await articlesRef()
    .where("status", "==", "published")
    .select("slug")
    .get();
  return snap.docs.map((d) => d.data().slug as string);
}

// ---- Admin queries (all statuses) ----

export async function getAllArticlesAdmin(opts?: {
  status?: string;
  limit?: number;
}): Promise<Article[]> {
  let q = articlesRef()
    .orderBy("createdAt", "desc")
    .limit(opts?.limit ?? 50);

  if (opts?.status) {
    q = articlesRef()
      .where("status", "==", opts.status)
      .orderBy("createdAt", "desc")
      .limit(opts?.limit ?? 50);
  }

  const snap = await q.get();
  return snap.docs.map((d) => docToArticle(d.id, d.data()));
}

export async function getArticleById(id: string): Promise<Article | null> {
  const snap = await articlesRef().doc(id).get();
  if (!snap.exists) return null;
  return docToArticle(snap.id, snap.data()!);
}

// ---- Write operations (admin only) ----

export async function createArticle(
  input: ArticleInput
): Promise<{ id: string; slug: string }> {
  const slug = slugify(input.title);
  const sanitised = sanitizeHtml(input.contentHtml);
  const readTime = estimateReadTime(input.contentHtml);

  const data = {
    ...input,
    slug,
    contentHtml: sanitised,
    readTime,
    viewCount: 0,
    likeCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    publishedAt:
      input.status === "published"
        ? serverTimestamp()
        : null,
  };

  const ref = await articlesRef().add(data);
  return { id: ref.id, slug };
}

export async function updateArticle(
  id: string,
  input: Partial<ArticleInput>
): Promise<void> {
  const updates: Record<string, unknown> = {
    ...input,
    updatedAt: serverTimestamp(),
  };

  if (input.contentHtml) {
    updates.contentHtml = sanitizeHtml(input.contentHtml);
    updates.readTime = estimateReadTime(input.contentHtml);
  }

  if (input.status === "published") {
    // Only set publishedAt the first time publishing
    const existing = await getArticleById(id);
    if (!existing?.publishedAt) {
      updates.publishedAt = serverTimestamp();
    }
  }

  await articlesRef().doc(id).update(updates);
}

export async function deleteArticle(id: string): Promise<void> {
  await articlesRef().doc(id).delete();
}

export async function incrementViewCount(id: string): Promise<void> {
  await articlesRef().doc(id).update({ viewCount: increment(1) });
}

export async function incrementLikeCount(
  id: string,
  delta: 1 | -1
): Promise<void> {
  await articlesRef().doc(id).update({ likeCount: increment(delta) });
}

// ---- Search (basic — for advanced use Algolia or Typesense) ----

export async function searchArticles(
  queryText: string,
  count = 20
): Promise<ArticleCard[]> {
  const q = queryText.toLowerCase();

  // Firestore has no full-text search — fetch recent and filter client-side
  // For production: replace with Algolia/Typesense
  const snap = await articlesRef()
    .where("status", "==", "published")
    .orderBy("publishedAt", "desc")
    .limit(200)
    .get();

  const results = snap.docs
    .map((d) => docToArticle(d.id, d.data()))
    .filter((a) => {
      const haystack = [a.title, a.excerpt, a.author, ...a.categories, ...a.tags]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    })
    .slice(0, count);

  return results.map((a) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { contentHtml, contentMarkdown, ...card } = a;
    return card as ArticleCard;
  });
}

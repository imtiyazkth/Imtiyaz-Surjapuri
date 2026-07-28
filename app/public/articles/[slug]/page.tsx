import { adminDb } from "@/lib/firebase/admin";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function fetchSingleArticle(slug: string) {
  try {
    if (!adminDb) return null;
    const snapshot = await adminDb.collection("articles").where("slug", "==", slug).limit(1).get();
    if (snapshot.empty) {
      const docById = await adminDb.collection("articles").doc(slug).get();
      if (docById.exists) {
        return { id: docById.id, ...docById.data() };
      }
      return null;
    }
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  } catch (err) {
    console.error("Article fetch error:", err);
    return null;
  }
}

export default async function PublicArticlePage({ params }: { params: { slug: string } }) {
  const article: any = await fetchSingleArticle(params.slug);

  if (!article) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">404 - Article Not Found</h1>
        <p className="text-slate-400 mb-6">The article you are looking for does not exist or has been moved.</p>
        <Link href="/" className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 max-w-4xl mx-auto">
      <header className="mb-8 border-b border-slate-800 pb-6">
        <span className="text-xs uppercase tracking-widest text-red-500 font-semibold">{article.category || "News"}</span>
        <h1 className="text-3xl md:text-5xl font-bold mt-2 text-white">{article.title}</h1>
      </header>
      <div className="prose prose-invert max-w-none text-slate-300">
        {article.content}
      </div>
    </article>
  );
}

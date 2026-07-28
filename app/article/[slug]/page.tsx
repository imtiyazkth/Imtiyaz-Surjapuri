import { db } from "@/lib/firebase/admin";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 0; // Fresh dynamic rendering

async function getArticle(slug: string) {
  try {
    const snapshot = await db.collection("articles").where("slug", "==", slug).limit(1).get();
    if (snapshot.empty) {
      // Fallback: try by Document ID
      const docById = await db.collection("articles").doc(slug).get();
      if (docById.exists) {
        return { id: docById.id, ...docById.data() };
      }
      return null;
    }
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (err) {
    console.error("Error fetching single article:", err);
    return null;
  }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article: any = await getArticle(params.slug);

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">404 - Article Not Found</h1>
        <p className="text-slate-400 mb-6">The article you are looking for does not exist or has been removed.</p>
        <Link href="/" className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition">
          Return to Homepage
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 max-w-4xl mx-auto">
      <header className="mb-8 border-b border-slate-800 pb-6">
        <span className="text-xs uppercase tracking-widest text-red-500 font-semibold">{article.category || "General"}</span>
        <h1 className="text-3xl md:text-5xl font-bold mt-2 text-white">{article.title}</h1>
        <p className="text-slate-400 text-sm mt-3">{new Date(article.createdAt).toLocaleDateString()}</p>
      </header>

      {article.coverImage && (
        <div className="mb-8 rounded-xl overflow-hidden border border-slate-800">
          <img src={article.coverImage} alt={article.title} className="w-full max-h-[450px] object-cover" />
        </div>
      )}

      <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed space-y-4">
        {article.content}
      </div>

      <div className="mt-12 pt-6 border-t border-slate-800">
        <Link href="/" className="text-blue-400 hover:underline text-sm">
          ← Back to All Articles
        </Link>
      </div>
    </article>
  );
}

import { adminDb } from "@/lib/firebase/admin";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getArticle(slug: string) {
  try {
    const snapshot = await adminDb.collection("articles").where("slug", "==", slug).limit(1).get();
    if (!snapshot.empty) {
      return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    }
    const docById = await adminDb.collection("articles").doc(slug).get();
    if (docById.exists) {
      return { id: docById.id, ...docById.data() };
    }
  } catch (e) {
    console.error("Firestore read error:", e);
  }
  return null;
}

export default async function Page({ params }: { params: { slug: string } }) {
  const article: any = await getArticle(params.slug);

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-bold text-red-500 mb-2">Article Not Found</h1>
        <p className="text-slate-400 text-sm mb-6">The requested article could not be loaded or found in Firestore.</p>
        <Link href="/" className="px-5 py-2 bg-red-600 text-white text-sm rounded-lg font-medium">Return Home</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-white">{article.title}</h1>
      <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">{article.content}</div>
    </main>
  );
}

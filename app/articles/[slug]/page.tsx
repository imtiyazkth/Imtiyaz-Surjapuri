"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    async function fetchArticle() {
      try {
        setLoading(true);
        // 1. Try fetching by slug field
        const q = query(collection(db, "articles"), where("slug", "==", slug));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0];
          setArticle({ id: docData.id, ...docData.data() });
          setLoading(false);
          return;
        }

        // 2. Fallback: Try fetching directly by Document ID
        const docRef = doc(db, "articles", slug);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setArticle({ id: docSnap.id, ...docSnap.data() });
        } else {
          setArticle(null);
        }
      } catch (error) {
        console.error("Error fetching article:", error);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="text-sm text-slate-400 animate-pulse">Loading article content...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-2">Article Not Found</h1>
        <p className="text-slate-400 text-xs mb-6 max-w-sm">
          The requested article could not be loaded from Firestore. Please verify the document exists in your database.
        </p>
        <Link href="/" className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg font-semibold transition">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 max-w-3xl mx-auto">
      <Link href="/" className="inline-block text-xs text-red-400 hover:underline mb-6">
        ← Back to Articles
      </Link>
      <h1 className="text-3xl font-bold text-white mb-4">{article.title}</h1>
      {article.createdAt && (
        <p className="text-xs text-slate-500 mb-6">
          Published: {new Date(article.createdAt?.seconds * 1000 || article.createdAt).toLocaleDateString()}
        </p>
      )}
      <div className="text-slate-300 leading-relaxed whitespace-pre-wrap text-sm md:text-base border-t border-slate-800 pt-6">
        {article.content || article.body || "No content provided for this article."}
      </div>
    </main>
  );
}

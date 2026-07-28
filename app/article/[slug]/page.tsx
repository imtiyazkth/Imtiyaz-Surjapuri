"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

export default function ArticleDetailPage() {
  const params = useParams();
  const rawParam = params?.slug as string;
  const decodedParam = rawParam ? decodeURIComponent(rawParam) : "";

  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!decodedParam) return;

    async function fetchArticle() {
      try {
        setLoading(true);

        // 1. Direct Document ID lookup
        const directDocRef = doc(db, "articles", decodedParam);
        const directDocSnap = await getDoc(directDocRef);

        if (directDocSnap.exists()) {
          setArticle({ id: directDocSnap.id, ...directDocSnap.data() });
          setLoading(false);
          return;
        }

        // 2. Scan collection for Slug or ID match
        const querySnapshot = await getDocs(collection(db, "articles"));
        let matched: any = null;

        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const id = docSnap.id;
          const slug = data.slug || "";
          if (id === decodedParam || slug === decodedParam) {
            matched = { id, ...data };
          }
        });

        setArticle(matched);
      } catch (error) {
        console.error("Firestore read error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [decodedParam]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="text-xs text-slate-400 animate-pulse">Loading article content...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-2">Article Not Found</h1>
        <p className="text-slate-400 text-xs mb-6 max-w-sm">
          Could not retrieve document from Firestore.
        </p>
        <Link href="/" className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg font-semibold transition">
          Return Home
        </Link>
      </div>
    );
  }

  // Fallback to excerpt if content string is empty
  const mainContent = article.content && article.content.trim() !== "" 
    ? article.content 
    : article.excerpt || "No body text available.";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 max-w-3xl mx-auto">
      <Link href="/" className="inline-block text-xs text-red-400 hover:underline mb-6">
        ← Back to Home
      </Link>
      <h1 className="text-3xl font-bold text-white mb-4">{article.title}</h1>
      <div className="text-slate-300 leading-relaxed whitespace-pre-wrap text-base border-t border-slate-800 pt-6">
        {mainContent}
      </div>
    </main>
  );
}

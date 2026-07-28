"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";

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

        // 1. Check direct Document ID in Firestore
        const directDocRef = doc(db, "articles", decodedParam);
        const directDocSnap = await getDoc(directDocRef);

        if (directDocSnap.exists()) {
          setArticle({ id: directDocSnap.id, ...directDocSnap.data() });
          setLoading(false);
          return;
        }

        // 2. Search by 'slug' field
        const slugQuery = query(collection(db, "articles"), where("slug", "==", decodedParam));
        const slugSnap = await getDocs(slugQuery);

        if (!slugSnap.empty) {
          const docData = slugSnap.docs[0];
          setArticle({ id: docData.id, ...docData.data() });
          setLoading(false);
          return;
        }

        // 3. Fallback: Search all articles and match by Title or ID
        const allArticlesSnap = await getDocs(collection(db, "articles"));
        let matchedDoc: any = null;

        allArticlesSnap.forEach((docItem) => {
          const data = docItem.data();
          const docId = docItem.id;
          const title = data.title || "";
          const slug = data.slug || "";

          if (
            docId.toLowerCase() === decodedParam.toLowerCase() ||
            slug.toLowerCase() === decodedParam.toLowerCase() ||
            title.toLowerCase() === decodedParam.toLowerCase()
          ) {
            matchedDoc = { id: docId, ...data };
          }
        });

        setArticle(matchedDoc);
      } catch (error) {
        console.error("Error fetching article:", error);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [decodedParam]);

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
          The requested article could not be found in Firestore.
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
      
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
        {article.title}
      </h1>

      {article.subtitle && (
        <p className="text-sm text-slate-400 mb-4 italic">
          {article.subtitle}
        </p>
      )}

      {article.createdAt && (
        <p className="text-xs text-slate-500 mb-6">
          Published: {new Date(article.createdAt?.seconds ? article.createdAt.seconds * 1000 : article.createdAt).toLocaleDateString()}
        </p>
      )}

      <div className="text-slate-300 leading-relaxed whitespace-pre-wrap text-base border-t border-slate-800 pt-6 space-y-4">
        {article.content || article.body || article.description || "No text content available for this article."}
      </div>
    </main>
  );
}

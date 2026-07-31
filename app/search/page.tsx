"use client";

import { useState, useEffect, FormEvent, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface Article {
  id: string; slug: string; title: string; excerpt?: string;
  coverImage?: string; primaryCategory: string; catColor?: string;
  author: string; readTime: string; publishedAt?: string | null;
}

function timeAgo(raw?: string | null): string {
  if (!raw) return "";
  try {
    const ms = Date.now() - new Date(raw).getTime();
    const h = Math.floor(ms/3600000), d = Math.floor(ms/86400000);
    if (ms < 3600000) return `${Math.floor(ms/60000)}m ago`;
    if (h < 24) return `${h}h ago`;
    return `${d}d ago`;
  } catch { return ""; }
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const initialQ     = searchParams.get("q") ?? "";

  const [q,        setQ]        = useState(initialQ);
  const [results,  setResults]  = useState<Article[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialQ.trim().length >= 2) doSearch(initialQ);
    setQ(initialQ);
  }, [initialQ]); // eslint-disable-line

  const doSearch = async (query: string) => {
    if (query.trim().length < 2) return;
    setLoading(true); setSearched(false);
    try {
      const r = await fetch(`/api/articles?q=${encodeURIComponent(query.trim())}&limit=24`);
      const d = await r.json();
      setResults(d.articles ?? []);
    } catch { setResults([]); }
    finally { setLoading(false); setSearched(true); }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const t = q.trim();
    if (t.length >= 2) {
      router.push(`/search?q=${encodeURIComponent(t)}`);
      doSearch(t);
    }
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", background:"var(--bg)" }}>
      <TopBar />
      <Header />

      <main style={{ flex:1 }}>
        <div className="main-container">
          <div style={{ marginBottom:"32px" }}>
            <h1 style={{
              fontFamily:"var(--font-playfair)", fontWeight:800,
              fontSize:"1.8rem", color:"var(--text-1)", marginBottom:"20px"
            }}>
              {initialQ ? `Results for "${initialQ}"` : "Search Articles"}
            </h1>

            <form onSubmit={handleSubmit}
              style={{ display:"flex", gap:"10px", maxWidth:"580px" }}>
              <input type="search" value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search articles, topics, categories…"
                autoFocus
                className="admin-input"
                style={{ flex:1, height:"48px", fontSize:"0.95rem" }} />
              <button type="submit" className="btn-primary"
                style={{ height:"48px", padding:"0 24px", whiteSpace:"nowrap" }}>
                🔍 Search
              </button>
            </form>

            {searched && !loading && (
              <p style={{ marginTop:"12px", fontSize:"0.82rem", color:"var(--text-3)" }}>
                {results.length > 0
                  ? `${results.length} result${results.length !== 1 ? "s" : ""} found`
                  : `No results for "${initialQ}"`}
              </p>
            )}
          </div>

          {loading && (
            <div style={{ padding:"48px 0", textAlign:"center", color:"var(--text-3)" }}>
              Searching…
            </div>
          )}

          {!loading && searched && results.length === 0 && (
            <div style={{ padding:"48px 0", textAlign:"center" }}>
              <p style={{ fontSize:"3rem", marginBottom:"12px" }}>🔍</p>
              <p style={{ color:"var(--text-2)", marginBottom:"8px", fontFamily:"var(--font-playfair)", fontSize:"1.1rem" }}>
                No articles found
              </p>
              <p style={{ fontSize:"0.82rem", color:"var(--text-3)", marginBottom:"20px" }}>
                Try different keywords or browse all articles.
              </p>
              <Link href="/articles" className="btn-primary">
                Browse All Articles →
              </Link>
            </div>
          )}

          {!loading && !searched && (
            <p style={{ color:"var(--text-3)", fontSize:"0.88rem" }}>
              Enter at least 2 characters to search.
            </p>
          )}

          {!loading && results.length > 0 && (
            <div className="articles-grid">
              {results.map((a) => {
                const c = a.catColor ?? "#C41C1C";
                return (
                  <article key={a.id} className="a-card">
                    {a.coverImage && (
                      <Link href={`/articles/${a.slug}`}
                        className="a-card-img" style={{ display:"block" }}>
                        <Image src={a.coverImage} alt={a.title} fill
                          sizes="(max-width:640px) 100vw,33vw"
                          style={{ objectFit:"cover" }} />
                      </Link>
                    )}
                    <div className="a-card-body">
                      <span className="cat-pill" style={{
                        background:`${c}20`, color:c, borderColor:`${c}50`
                      }}>
                        {a.primaryCategory}
                      </span>
                      <Link href={`/articles/${a.slug}`}>
                        <h2 className="a-card-title">{a.title}</h2>
                      </Link>
                      {a.excerpt && <p className="a-card-excerpt">{a.excerpt}</p>}
                      <div className="a-card-meta">
                        <span style={{ fontWeight:600, color:"var(--text-2)" }}>{a.author}</span>
                        <span>·</span><span>{timeAgo(a.publishedAt)}</span>
                        <span>·</span><span>{a.readTime}</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div style={{ padding:"80px", textAlign:"center", color:"var(--text-3)" }}>
        Loading…
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}

"use client";

import { useState, useEffect, FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

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
  const initialQ     = searchParams.get("q") ?? "";

  const [q,       setQ]       = useState(initialQ);
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialQ.trim().length >= 2) doSearch(initialQ);
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
    window.history.pushState({}, "", `/search?q=${encodeURIComponent(q)}`);
    doSearch(q);
  };

  return (
    <div className="main-container">
      <div style={{ marginBottom:"28px" }}>
        <h1 style={{ fontFamily:"var(--font-playfair)", fontWeight:800, fontSize:"1.8rem", color:"var(--text-1)", marginBottom:"16px" }}>
          {initialQ ? `Results for "${initialQ}"` : "Search"}
        </h1>

        {/* Search form */}
        <form onSubmit={handleSubmit} style={{ display:"flex", gap:"10px", maxWidth:"560px" }}>
          <input
            type="search" value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search articles, categories, topics…"
            autoFocus
            style={{
              flex:1, height:"44px", padding:"0 16px",
              borderRadius:"10px", border:"1px solid var(--border)",
              background:"var(--bg-card)", color:"var(--text-1)",
              fontSize:"0.9rem", fontFamily:"var(--font-sans)",
              outline:"none", transition:"border-color 0.2s"
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--brand-red)")}
            onBlur={(e)  => (e.target.style.borderColor = "var(--border)")}
          />
          <button type="submit" className="btn-primary" style={{ height:"44px", padding:"0 20px" }}>
            Search
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

      {/* Loading */}
      {loading && (
        <div style={{ padding:"48px 0", textAlign:"center", color:"var(--text-3)", fontSize:"0.9rem" }}>
          Searching…
        </div>
      )}

      {/* No results */}
      {!loading && searched && results.length === 0 && (
        <div style={{ padding:"48px 0", textAlign:"center" }}>
          <p style={{ fontSize:"2rem", marginBottom:"12px" }}>🔍</p>
          <p style={{ color:"var(--text-2)", marginBottom:"6px" }}>
            No articles found for &ldquo;{initialQ}&rdquo;
          </p>
          <p style={{ fontSize:"0.82rem", color:"var(--text-3)" }}>
            Try different keywords or{" "}
            <Link href="/articles" style={{ color:"var(--brand-red)" }}>browse all articles</Link>.
          </p>
        </div>
      )}

      {/* Prompt */}
      {!loading && !searched && (
        <p style={{ color:"var(--text-3)", fontSize:"0.88rem" }}>
          Enter at least 2 characters to search.
        </p>
      )}

      {/* Results grid */}
      {!loading && results.length > 0 && (
        <div className="articles-grid">
          {results.map((a) => {
            const c = a.catColor ?? "#C41C1C";
            return (
              <article key={a.id} className="a-card">
                {a.coverImage && (
                  <Link href={`/articles/${a.slug}`} className="a-card-img" style={{ display:"block" }}>
                    <Image src={a.coverImage} alt={a.title} fill
                      sizes="(max-width:640px) 100vw,33vw" style={{ objectFit:"cover" }} />
                  </Link>
                )}
                <div className="a-card-body">
                  <span className="cat-pill" style={{ background:`${c}20`, color:c, borderColor:`${c}50` }}>
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
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ padding:"48px", textAlign:"center", color:"var(--text-3)" }}>Loading…</div>}>
      <SearchContent />
    </Suspense>
  );
}

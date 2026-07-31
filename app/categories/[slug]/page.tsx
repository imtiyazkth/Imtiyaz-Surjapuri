"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface Article {
  id: string; slug: string; title: string; excerpt?: string;
  coverImage?: string; primaryCategory: string; catColor?: string;
  author: string; readTime: string; publishedAt?: string | null;
  trending?: boolean; breaking?: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  "analysis":      "#0f766e",
  "breaking-news": "#C41C1C",
  "opinion":       "#b45309",
  "politics":      "#7c3aed",
  "economy":       "#15803d",
  "technology":    "#0369a1",
  "education":     "#9333ea",
  "social-issues": "#be185d",
  "world":         "#b45309",
  "blog":          "#6366f1",
  "general":       "#C41C1C",
};

function timeAgo(raw?: string | null): string {
  if (!raw) return "";
  try {
    const ms = Date.now() - new Date(raw).getTime();
    const h = Math.floor(ms / 3600000), d = Math.floor(ms / 86400000);
    if (ms < 3600000) return `${Math.floor(ms / 60000)}m ago`;
    if (h < 24) return `${h}h ago`;
    return `${d}d ago`;
  } catch { return ""; }
}

export default function CategoryPage() {
  const params    = useParams<{ slug: string }>();
  const slug      = params?.slug ?? "";
  const catName   = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const catColor  = CATEGORY_COLORS[slug] ?? "#C41C1C";

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/articles?category=${encodeURIComponent(slug)}&limit=24`)
      .then((r) => r.json())
      .then((d) => {
        const arts = d.articles ?? [];
        setArticles(arts);
        if (arts.length === 0) {
          // Try without filter — show all and let user see the category
          setError(`No articles in "${catName}" yet.`);
        }
      })
      .catch(() => setError("Failed to load articles."))
      .finally(() => setLoading(false));
  }, [slug, catName]);

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", background:"var(--bg)" }}>
      <TopBar />
      <Header />

      <main style={{ flex:1 }}>
        <div className="main-container">
          {/* Header */}
          <div style={{
            marginBottom:"24px", paddingBottom:"16px",
            borderBottom:"1px solid var(--border)"
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"6px" }}>
              <span style={{
                width:"4px", height:"28px", borderRadius:"2px",
                background: catColor, flexShrink:0
              }} />
              <h1 style={{
                fontFamily:"var(--font-playfair)", fontWeight:800,
                fontSize:"1.8rem", color:"var(--text-1)"
              }}>
                {catName}
              </h1>
            </div>
            <p style={{ fontSize:"0.82rem", color:"var(--text-3)", marginLeft:"14px" }}>
              {loading ? "Loading…" : `${articles.length} articles`}
            </p>
          </div>

          {/* Loading skeletons */}
          {loading && (
            <div className="articles-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ borderRadius:"12px", overflow:"hidden",
                  border:"1px solid var(--border)" }}>
                  <div className="skeleton" style={{ height:"200px" }} />
                  <div style={{ padding:"14px", display:"flex",
                    flexDirection:"column", gap:"10px" }}>
                    <div className="skeleton" style={{ height:"14px", width:"60px" }} />
                    <div className="skeleton" style={{ height:"18px" }} />
                    <div className="skeleton" style={{ height:"14px", width:"40%", marginTop:"8px" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error / empty */}
          {!loading && articles.length === 0 && (
            <div style={{ padding:"64px 0", textAlign:"center" }}>
              <p style={{ fontSize:"3rem", marginBottom:"12px" }}>📂</p>
              <p style={{ color:"var(--text-2)", fontSize:"1rem", marginBottom:"8px" }}>
                {error || "No articles found."}
              </p>
              <Link href="/articles" className="btn-primary"
                style={{ marginTop:"16px", display:"inline-block" }}>
                Browse All Articles →
              </Link>
            </div>
          )}

          {/* Articles grid */}
          {!loading && articles.length > 0 && (
            <div className="articles-grid">
              {articles.map((a) => {
                const c = a.catColor ?? catColor;
                return (
                  <article key={a.id} className="a-card">
                    {a.coverImage && (
                      <Link href={`/articles/${a.slug}`}
                        className="a-card-img" style={{ display:"block" }}>
                        <Image src={a.coverImage} alt={a.title} fill
                          sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
                          style={{ objectFit:"cover" }} />
                        {a.trending && (
                          <span className="cat-pill" style={{
                            position:"absolute", top:"8px", right:"8px",
                            background:"#B8860B", color:"#fff", border:"none"
                          }}>🔥 Trending</span>
                        )}
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

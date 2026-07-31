"use client";

import { useEffect, useState } from "react";
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

const CATEGORIES = [
  "Analysis","Breaking News","Opinion","Politics","Economy",
  "Technology","Education","Social Issues","World","Blog",
];

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

export default function AllArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState("All");

  useEffect(() => {
    fetch("/api/articles?limit=48")
      .then((r) => r.json())
      .then((d) => setArticles(d.articles ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "All"
    ? articles
    : articles.filter((a) => a.primaryCategory === filter);

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", background:"var(--bg)" }}>
      <TopBar />
      <Header />

      {/* Red category navbar */}
      <nav className="site-nav">
        <div className="site-nav-inner" style={{ overflowX:"auto" }}>
          {["All", ...CATEGORIES].map((cat) => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`nav-link${filter === cat ? " active" : ""}`}>
              {cat}
            </button>
          ))}
        </div>
      </nav>

      <main style={{ flex:1 }}>
        <div className="main-container">
          <div style={{
            marginBottom:"24px", paddingBottom:"16px",
            borderBottom:"1px solid var(--border)",
            display:"flex", alignItems:"center",
            justifyContent:"space-between", flexWrap:"wrap", gap:"10px"
          }}>
            <h1 style={{
              fontFamily:"var(--font-playfair)", fontWeight:800,
              fontSize:"1.8rem", color:"var(--text-1)"
            }}>
              {filter === "All" ? "All Articles" : filter}
            </h1>
            <p style={{ fontSize:"0.82rem", color:"var(--text-3)" }}>
              {loading ? "Loading…" : `${filtered.length} articles`}
            </p>
          </div>

          {loading && (
            <div className="articles-grid">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} style={{ borderRadius:"12px", overflow:"hidden",
                  border:"1px solid var(--border)" }}>
                  <div className="skeleton" style={{ height:"200px" }} />
                  <div style={{ padding:"14px", display:"flex",
                    flexDirection:"column", gap:"10px" }}>
                    <div className="skeleton" style={{ height:"12px", width:"60px" }} />
                    <div className="skeleton" style={{ height:"16px" }} />
                    <div className="skeleton" style={{ height:"12px", width:"40%", marginTop:"6px" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div style={{ padding:"64px 0", textAlign:"center" }}>
              <p style={{ color:"var(--text-3)", fontSize:"0.9rem", marginBottom:"12px" }}>
                No articles in this category yet.
              </p>
              <button onClick={() => setFilter("All")}
                style={{ background:"none", border:"none",
                  color:"var(--brand-red)", cursor:"pointer",
                  fontSize:"0.88rem", textDecoration:"underline" }}>
                ← Show all articles
              </button>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="articles-grid">
              {filtered.map((a) => {
                const c = a.catColor ?? "#C41C1C";
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
                      <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
                        {a.breaking && (
                          <span className="cat-pill" style={{
                            background:c, color:"#fff", border:"none"
                          }}>Breaking</span>
                        )}
                        <span className="cat-pill" style={{
                          background:`${c}20`, color:c, borderColor:`${c}50`
                        }}>
                          {a.primaryCategory}
                        </span>
                      </div>
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

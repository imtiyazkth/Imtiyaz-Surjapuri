"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  coverImage?: string;
  coverImageAlt?: string;
  primaryCategory: string;
  catColor?: string;
  author: string;
  readTime: string;
  publishedAt?: string | null;
  viewCount?: number;
  breaking?: boolean;
  trending?: boolean;
  categories?: string[];
}

const ALL_CATEGORIES = [
  "Analysis","Breaking News","Opinion","Politics","Economy",
  "Technology","Education","Social Issues","World","Blog","Video","Photos",
];

function timeAgo(raw?: string | null): string {
  if (!raw) return "";
  try {
    const ms = Date.now() - new Date(raw).getTime();
    const m = Math.floor(ms / 60000);
    const h = Math.floor(ms / 3600000);
    const d = Math.floor(ms / 86400000);
    if (m < 60)  return `${m}m ago`;
    if (h < 24)  return `${h}h ago`;
    return `${d}d ago`;
  } catch { return ""; }
}

function ArticleCard({ article }: { article: Article }) {
  const href  = `/articles/${article.slug}`;
  const color = article.catColor ?? "#C41C1C";
  const date  = timeAgo(article.publishedAt);

  return (
    <article className="a-card">
      {article.coverImage && (
        <Link href={href} className="a-card-img" style={{ display:"block" }}>
          <Image
            src={article.coverImage}
            alt={article.coverImageAlt || article.title}
            fill
            sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
            style={{ objectFit:"cover" }}
          />
          {article.trending && (
            <span className="cat-pill" style={{
              position:"absolute", top:"8px", right:"8px",
              background:"#B8860B", color:"#fff", border:"none",
            }}>
              🔥 Trending
            </span>
          )}
        </Link>
      )}
      <div className="a-card-body">
        <div style={{ display:"flex", gap:"6px", flexWrap:"wrap", alignItems:"center" }}>
          {article.breaking && (
            <span className="cat-pill" style={{ background:color, color:"#fff", border:"none" }}>Breaking</span>
          )}
          <span className="cat-pill" style={{
            background:`${color}20`, color, borderColor:`${color}50`
          }}>
            {article.primaryCategory}
          </span>
        </div>
        <Link href={href}>
          <h2 className="a-card-title">{article.title}</h2>
        </Link>
        {article.excerpt && (
          <p className="a-card-excerpt">{article.excerpt}</p>
        )}
        <div className="a-card-meta">
          <span style={{ fontWeight:600, color:"var(--text-2)" }}>{article.author}</span>
          {date && <><span>·</span><span>{date}</span></>}
          <span>·</span><span>{article.readTime}</span>
          {(article.viewCount ?? 0) > 0 && (
            <><span>·</span><span>👁 {article.viewCount!.toLocaleString()}</span></>
          )}
        </div>
      </div>
    </article>
  );
}

function Skeleton() {
  return (
    <div style={{ borderRadius:"12px", overflow:"hidden", border:"1px solid var(--border)" }}>
      <div className="skeleton" style={{ height:"200px" }} />
      <div style={{ padding:"14px 16px", display:"flex", flexDirection:"column", gap:"10px" }}>
        <div className="skeleton" style={{ height:"14px", width:"60px" }} />
        <div className="skeleton" style={{ height:"18px" }} />
        <div className="skeleton" style={{ height:"18px", width:"85%" }} />
        <div className="skeleton" style={{ height:"14px", width:"40%", marginTop:"8px" }} />
      </div>
    </div>
  );
}

export default function ArticlesPage() {
  const [articles,    setArticles]    = useState<Article[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    fetch("/api/articles?limit=48")
      .then((r) => r.json())
      .then((d) => setArticles(d.articles ?? []))
      .catch(() => setError("Failed to load articles. Please refresh."))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    activeFilter === "All"
      ? articles
      : articles.filter((a) => a.primaryCategory === activeFilter);

  return (
    <div className="main-container">
      {/* Page header */}
      <div style={{ marginBottom:"24px", borderBottom:"1px solid var(--border)", paddingBottom:"16px" }}>
        <h1 style={{
          fontFamily:"var(--font-playfair)", fontWeight:800,
          fontSize:"1.8rem", color:"var(--text-1)", marginBottom:"4px"
        }}>
          All Articles
        </h1>
        <p style={{ fontSize:"0.82rem", color:"var(--text-3)" }}>
          {loading ? "Loading…" : `${articles.length} articles published`}
        </p>
      </div>

      {/* Category filter tabs */}
      <div className="cat-tabs">
        {["All", ...ALL_CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`cat-tab${activeFilter === cat ? " active" : ""}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      {/* Skeleton */}
      {loading && (
        <div className="articles-grid">
          {Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} />)}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && filtered.length === 0 && (
        <div style={{ padding:"64px 0", textAlign:"center" }}>
          <p style={{ color:"var(--text-3)", fontSize:"0.9rem", marginBottom:"12px" }}>
            No articles in this category yet.
          </p>
          <button
            onClick={() => setActiveFilter("All")}
            style={{
              background:"none", border:"none", color:"var(--brand-red)",
              cursor:"pointer", fontSize:"0.85rem", fontFamily:"var(--font-sans)",
              textDecoration:"underline"
            }}
          >
            ← Show all articles
          </button>
        </div>
      )}

      {/* Articles grid */}
      {!loading && !error && filtered.length > 0 && (
        <div className="articles-grid">
          {filtered.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}

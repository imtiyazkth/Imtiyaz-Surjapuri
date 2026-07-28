"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface Article {
  id: string; slug: string; title: string; excerpt?: string;
  coverImage?: string; coverImageAlt?: string;
  primaryCategory: string; catColor?: string;
  author: string; readTime: string; publishedAt?: string | null;
  viewCount?: number; breaking?: boolean; trending?: boolean;
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

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const slug   = params?.slug ?? "";
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [catName,  setCatName]  = useState(slug.replace(/-/g," ").replace(/\b\w/g, c => c.toUpperCase()));

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/articles?category=${encodeURIComponent(slug)}&limit=24`)
      .then(r => r.json())
      .then(d => {
        const arts = d.articles ?? [];
        setArticles(arts);
        if (arts[0]?.primaryCategory) setCatName(arts[0].primaryCategory);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  const color = articles[0]?.catColor ?? "#C41C1C";

  return (
    <div className="main-container">
      {/* Header */}
      <div style={{ marginBottom:"24px", paddingBottom:"16px", borderBottom:"1px solid var(--border)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"6px" }}>
          <span style={{ width:"4px", height:"28px", background:color, borderRadius:"2px", flexShrink:0 }} />
          <h1 style={{ fontFamily:"var(--font-playfair)", fontWeight:800, fontSize:"1.8rem", color:"var(--text-1)" }}>
            {catName}
          </h1>
        </div>
        <p style={{ fontSize:"0.82rem", color:"var(--text-3)", marginLeft:"14px" }}>
          {loading ? "Loading…" : `${articles.length} articles`}
        </p>
      </div>

      {/* Skeleton */}
      {loading && (
        <div className="articles-grid">
          {Array.from({length:6}).map((_,i) => (
            <div key={i} style={{ borderRadius:"12px", overflow:"hidden", border:"1px solid var(--border)" }}>
              <div className="skeleton" style={{ height:"200px" }} />
              <div style={{ padding:"14px", display:"flex", flexDirection:"column", gap:"10px" }}>
                <div className="skeleton" style={{ height:"14px", width:"60px" }} />
                <div className="skeleton" style={{ height:"18px" }} />
                <div className="skeleton" style={{ height:"14px", width:"40%", marginTop:"8px" }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && articles.length === 0 && (
        <div style={{ padding:"64px 0", textAlign:"center" }}>
          <p style={{ color:"var(--text-3)", marginBottom:"12px" }}>No articles in this category yet.</p>
          <Link href="/articles" style={{ color:"var(--brand-red)", fontSize:"0.85rem" }}>
            ← Browse all articles
          </Link>
        </div>
      )}

      {/* Grid */}
      {!loading && articles.length > 0 && (
        <div className="articles-grid">
          {articles.map((a) => {
            const c = a.catColor ?? "#C41C1C";
            return (
              <article key={a.id} className="a-card">
                {a.coverImage && (
                  <Link href={`/articles/${a.slug}`} className="a-card-img" style={{ display:"block" }}>
                    <Image src={a.coverImage} alt={a.coverImageAlt||a.title} fill
                      sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
                      style={{ objectFit:"cover" }} />
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

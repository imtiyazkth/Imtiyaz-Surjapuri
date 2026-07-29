"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface Article {
  id: string; slug: string; title: string;
  excerpt?: string; contentHtml?: string;
  coverImage?: string; coverImageAlt?: string;
  primaryCategory: string; catColor?: string;
  author: string; readTime: string;
  publishedAt?: string | null;
  viewCount?: number; likeCount?: number;
  breaking?: boolean; trending?: boolean;
  tags?: string[]; youtubeLinks?: string[];
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

function getYTId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

export default function ArticleDetailPage() {
  const params  = useParams<{ slug: string }>();
  const slugParam = params?.slug ?? "";

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked,   setLiked]   = useState(false);
  const [likes,   setLikes]   = useState(0);

  useEffect(() => {
    if (!slugParam) return;

    // Fetch all articles and find by slug OR id
    fetch("/api/articles?limit=100")
      .then((r) => r.json())
      .then((d) => {
        const list: Article[] = d.articles ?? [];
        const found = list.find(
          (a) =>
            a.slug === slugParam ||
            a.id === slugParam ||
            a.slug?.includes(slugParam) ||
            slugParam.includes(a.id)
        );
        if (found) {
          setArticle(found);
          setLikes(found.likeCount ?? 0);
          setLiked(localStorage.getItem(`liked_${found.id}`) === "1");
          fetch("/api/views", {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({ id: found.id }),
          }).catch(() => {});
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slugParam]);

  const handleLike = async () => {
    if (!article) return;
    const delta = liked ? -1 : 1;
    try {
      const r = await fetch("/api/like", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ id: article.id, delta }),
      });
      const d = await r.json();
      if (d.likes !== undefined) {
        setLikes(d.likes);
        setLiked(!liked);
        if (!liked) localStorage.setItem(`liked_${article.id}`, "1");
        else localStorage.removeItem(`liked_${article.id}`);
      }
    } catch {}
  };

  if (loading) return (
    <div style={{ maxWidth:"820px", margin:"0 auto", padding:"32px 16px" }}>
      {[200,40,20,120,80,120].map((h,i) => (
        <div key={i} className="skeleton" style={{ height:h, marginBottom:"16px", borderRadius:"8px" }} />
      ))}
    </div>
  );

  if (!article) return (
    <div style={{ maxWidth:"820px", margin:"0 auto", padding:"80px 16px", textAlign:"center" }}>
      <p style={{ fontSize:"3rem", marginBottom:"12px" }}>📄</p>
      <h1 style={{ fontFamily:"var(--font-playfair)", fontSize:"1.5rem", color:"var(--text-1)", marginBottom:"8px" }}>
        Article not found
      </h1>
      <p style={{ color:"var(--text-3)", marginBottom:"24px" }}>
        This article may have been moved or deleted.
      </p>
      <Link href="/" className="btn-primary">← Go Home</Link>
    </div>
  );

  const color = article.catColor ?? "#C41C1C";
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div style={{ maxWidth:"820px", margin:"0 auto", padding:"28px 16px" }}>

      {/* Breadcrumb */}
      <nav style={{ fontSize:"0.75rem", color:"var(--text-3)", marginBottom:"14px",
        display:"flex", gap:"6px", alignItems:"center", flexWrap:"wrap" }}>
        <Link href="/" style={{ color:"var(--text-3)" }}>Home</Link>
        <span>/</span>
        <Link href="/articles" style={{ color:"var(--text-3)" }}>Articles</Link>
        <span>/</span>
        <span style={{ color:"var(--text-1)" }}
          className="line-clamp-2">{article.title}</span>
      </nav>

      {/* Badges */}
      <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"10px" }}>
        {article.breaking && (
          <span className="cat-pill" style={{ background:"var(--brand-red)", color:"#fff", border:"none" }}>
            Breaking
          </span>
        )}
        {article.trending && (
          <span className="cat-pill" style={{ background:"#B8860B", color:"#fff", border:"none" }}>
            🔥 Trending
          </span>
        )}
        <span className="cat-pill" style={{ background:`${color}20`, color, borderColor:`${color}50` }}>
          {article.primaryCategory}
        </span>
      </div>

      {/* Title */}
      <h1 style={{
        fontFamily:"var(--font-playfair)", fontWeight:800,
        fontSize:"clamp(1.5rem,4vw,2.2rem)", lineHeight:1.2,
        color:"var(--text-1)", marginBottom:"14px"
      }}>
        {article.title}
      </h1>

      {/* Excerpt */}
      {article.excerpt && (
        <p style={{
          fontFamily:"var(--font-serif)", fontSize:"1.05rem", color:"var(--text-2)",
          lineHeight:1.75, borderLeft:"4px solid var(--brand-red)",
          paddingLeft:"14px", marginBottom:"18px", fontStyle:"italic"
        }}>
          {article.excerpt}
        </p>
      )}

      {/* Meta */}
      <div style={{
        display:"flex", alignItems:"center", gap:"10px", flexWrap:"wrap",
        fontSize:"0.8rem", color:"var(--text-3)",
        borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)",
        padding:"10px 0", marginBottom:"20px"
      }}>
        <span style={{ fontWeight:600, color:"var(--text-2)" }}>{article.author}</span>
        <span>·</span><span>{timeAgo(article.publishedAt)}</span>
        <span>·</span><span>{article.readTime} read</span>
        {(article.viewCount ?? 0) > 0 && (
          <><span>·</span><span>👁 {article.viewCount!.toLocaleString()}</span></>
        )}
      </div>

      {/* Cover image */}
      {article.coverImage && (
        <div style={{ borderRadius:"12px", overflow:"hidden", marginBottom:"24px",
          position:"relative", paddingTop:"52%" }}>
          <Image src={article.coverImage} alt={article.coverImageAlt||article.title}
            fill priority style={{ objectFit:"cover" }}
            sizes="(max-width:860px) 100vw, 820px" />
        </div>
      )}

      {/* Body */}
      {article.contentHtml && (
        <div className="article-body"
          dangerouslySetInnerHTML={{ __html: article.contentHtml }} />
      )}

      {/* YouTube */}
      {article.youtubeLinks && article.youtubeLinks.length > 0 && (
        <div style={{ marginTop:"24px" }}>
          <h3 style={{ fontFamily:"var(--font-playfair)", fontWeight:700, fontSize:"1.05rem",
            color:"var(--text-1)", marginBottom:"10px" }}>📺 Watch</h3>
          {article.youtubeLinks.map((url, i) => {
            const vid = getYTId(url);
            if (!vid) return null;
            return (
              <div key={i} style={{ position:"relative", paddingTop:"56.25%",
                borderRadius:"10px", overflow:"hidden", marginBottom:"12px" }}>
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${vid}`}
                  style={{ position:"absolute", inset:0, width:"100%", height:"100%", border:"none" }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen loading="lazy" title={`Video ${i+1}`}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div style={{ marginTop:"20px", display:"flex", flexWrap:"wrap", gap:"8px" }}>
          {article.tags.map((tag) => (
            <Link key={tag} href={`/search?q=${encodeURIComponent(tag)}`}
              style={{
                padding:"4px 12px", borderRadius:"20px", fontSize:"0.75rem",
                border:"1px solid var(--border)", color:"var(--text-3)",
                textDecoration:"none"
              }}>
              #{tag}
            </Link>
          ))}
        </div>
      )}

      {/* Like + Share */}
      <div style={{
        marginTop:"28px", paddingTop:"18px", borderTop:"1px solid var(--border)",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        flexWrap:"wrap", gap:"12px"
      }}>
        <button onClick={handleLike} style={{
          display:"inline-flex", alignItems:"center", gap:"8px",
          padding:"8px 20px", borderRadius:"24px", cursor:"pointer",
          fontSize:"0.85rem", fontWeight:600, transition:"all 0.15s",
          background: liked ? "var(--brand-red)" : "transparent",
          color:      liked ? "#fff" : "var(--text-2)",
          border:`1px solid ${liked ? "var(--brand-red)" : "var(--border)"}`,
          fontFamily:"var(--font-sans)"
        }}>
          {liked ? "❤️" : "🤍"} {likes.toLocaleString()} {liked ? "Liked" : "Like"}
        </button>

        <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
          {[
            { label:"Facebook", color:"#1877F2", href:`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
            { label:"X",        color:"#000",    href:`https://x.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}` },
            { label:"WhatsApp", color:"#25D366", href:`https://wa.me/?text=${encodeURIComponent(article.title+" "+shareUrl)}` },
          ].map(({ label, color: c, href }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer"
              style={{ padding:"7px 14px", borderRadius:"20px", fontSize:"0.75rem",
                fontWeight:700, color:"#fff", background:c, textDecoration:"none" }}>
              {label}
            </a>
          ))}
        </div>
      </div>

      <div style={{ marginTop:"24px" }}>
        <Link href="/" style={{ color:"var(--brand-red)", fontSize:"0.85rem" }}>← Back to Home</Link>
      </div>
    </div>
  );
}

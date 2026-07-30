"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { sanitizeHtmlClient } from "@/lib/sanitize-client";

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
    const h = Math.floor(ms / 3600000), d = Math.floor(ms / 86400000);
    if (ms < 3600000) return `${Math.floor(ms / 60000)}m ago`;
    if (h < 24) return `${h}h ago`;
    return `${d}d ago`;
  } catch { return ""; }
}

function ytId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

export default function ArticlePage() {
  const params    = useParams<{ slug: string }>();
  const slugParam = decodeURIComponent(params?.slug ?? "");

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked,   setLiked]   = useState(false);
  const [likes,   setLikes]   = useState(0);

  // Sanitize HTML content (memoized — only runs when article changes)
  const safeHtml = useMemo(() => {
    if (!article?.contentHtml) return "";
    return sanitizeHtmlClient(article.contentHtml);
  }, [article?.contentHtml]);

  useEffect(() => {
    if (!slugParam) return;

    fetch("/api/articles?limit=100")
      .then((r) => r.json())
      .then((d) => {
        const list: Article[] = d.articles ?? [];
        const found =
          list.find((a) => a.slug === slugParam) ??
          list.find((a) => a.id === slugParam) ??
          list.find(
            (a) =>
              a.slug?.replace(/[^a-z0-9]+/g, "-") ===
              slugParam.replace(/[^a-z0-9]+/g, "-")
          ) ??
          list.find((a) => slugParam.includes(a.id)) ??
          list.find((a) =>
            a.slug?.includes(slugParam.split("-").slice(0, -1).join("-"))
          );

        if (found) {
          setArticle(found);
          setLikes(found.likeCount ?? 0);
          setLiked(localStorage.getItem(`liked_${found.id}`) === "1");
          fetch("/api/views", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: found.id }),
          }).catch(() => {});
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slugParam]);

  const handleLike = async () => {
    if (!article) return;
    const newLiked = !liked;
    const newLikes = likes + (newLiked ? 1 : -1);
    setLiked(newLiked);
    setLikes(Math.max(0, newLikes));
    try {
      const r = await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: article.id, delta: newLiked ? 1 : -1 }),
      });
      const d = await r.json();
      if (d.likes !== undefined) setLikes(d.likes);
      if (newLiked) localStorage.setItem(`liked_${article.id}`, "1");
      else localStorage.removeItem(`liked_${article.id}`);
    } catch {
      setLiked(!newLiked);
      setLikes(likes);
    }
  };

  const handleShare = async (platform?: string) => {
    if (!article) return;
    const url   = window.location.href;
    const title = article.title;
    const text  = article.excerpt ?? title;
    if (!platform && navigator.share) {
      try { await navigator.share({ title, text, url }); return; } catch {}
    }
    const encoded = encodeURIComponent(url);
    const encTitle = encodeURIComponent(title);
    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
      twitter:  `https://x.com/intent/tweet?url=${encoded}&text=${encTitle}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encTitle}%20${encoded}`,
    };
    if (platform && urls[platform]) {
      window.open(urls[platform], "_blank", "noopener,noreferrer,width=600,height=400");
    }
  };

  if (loading) return (
    <div style={{ maxWidth:"820px", margin:"0 auto", padding:"32px 16px" }}>
      {[220,40,30,160,100,140].map((h,i) => (
        <div key={i} className="skeleton"
          style={{ height:h, marginBottom:"16px", borderRadius:"8px" }} />
      ))}
    </div>
  );

  if (!article) return (
    <div style={{ maxWidth:"820px", margin:"0 auto", padding:"80px 16px", textAlign:"center" }}>
      <div style={{
        width:"80px", height:"80px", borderRadius:"50%",
        background:"rgba(196,28,28,0.1)", display:"flex",
        alignItems:"center", justifyContent:"center",
        margin:"0 auto 20px", fontSize:"2.2rem"
      }}>🔍</div>
      <h1 style={{ fontFamily:"var(--font-playfair)", fontSize:"1.6rem",
        color:"var(--text-1)", marginBottom:"10px" }}>
        Article Not Found
      </h1>
      <p style={{ color:"var(--text-3)", fontSize:"0.88rem", marginBottom:"28px" }}>
        This article may have been removed or the link is incorrect.
      </p>
      <div style={{ display:"flex", gap:"12px", justifyContent:"center", flexWrap:"wrap" }}>
        <Link href="/" className="btn-primary">🏠 Go Home</Link>
        <Link href="/articles" className="btn-outline">Browse Articles</Link>
      </div>
    </div>
  );

  const color = article.catColor ?? "#C41C1C";

  return (
    <div style={{ maxWidth:"820px", margin:"0 auto", padding:"28px 16px 60px" }}>
      <nav style={{ fontSize:"0.75rem", color:"var(--text-3)", marginBottom:"16px",
        display:"flex", gap:"6px", alignItems:"center", flexWrap:"wrap" }}>
        <Link href="/" style={{ color:"var(--text-3)" }}>Home</Link>
        <span>›</span>
        <Link href="/articles" style={{ color:"var(--text-3)" }}>Articles</Link>
        <span>›</span>
        <span style={{ color:"var(--text-1)", display:"-webkit-box",
          WebkitLineClamp:1, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
          {article.title}
        </span>
      </nav>

      <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"10px" }}>
        {article.breaking && (
          <span className="cat-pill" style={{ background:"var(--brand-red)", color:"#fff", border:"none" }}>
            🔴 Breaking
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

      <h1 style={{ fontFamily:"var(--font-playfair)", fontWeight:800,
        fontSize:"clamp(1.5rem,4vw,2.2rem)", lineHeight:1.2,
        color:"var(--text-1)", marginBottom:"14px" }}>
        {article.title}
      </h1>

      {article.excerpt && (
        <p style={{ fontFamily:"var(--font-serif)", fontSize:"1.05rem",
          color:"var(--text-2)", lineHeight:1.75, borderLeft:"4px solid var(--brand-red)",
          paddingLeft:"14px", marginBottom:"18px", fontStyle:"italic" }}>
          {article.excerpt}
        </p>
      )}

      <div style={{ display:"flex", alignItems:"center", gap:"10px", flexWrap:"wrap",
        fontSize:"0.8rem", color:"var(--text-3)",
        borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)",
        padding:"10px 0", marginBottom:"22px" }}>
        <span style={{ fontWeight:600, color:"var(--text-2)" }}>{article.author}</span>
        <span>·</span><span>{timeAgo(article.publishedAt)}</span>
        <span>·</span><span>📖 {article.readTime}</span>
        {(article.viewCount ?? 0) > 0 && (
          <><span>·</span><span>👁 {article.viewCount!.toLocaleString()} views</span></>
        )}
      </div>

      {article.coverImage && (
        <div style={{ borderRadius:"12px", overflow:"hidden",
          marginBottom:"24px", position:"relative", paddingTop:"52%" }}>
          <Image src={article.coverImage} alt={article.coverImageAlt || article.title}
            fill priority style={{ objectFit:"cover" }}
            sizes="(max-width:860px) 100vw, 820px" />
        </div>
      )}

      {/* SANITIZED HTML — XSS safe */}
      {safeHtml && (
        <div className="article-body"
          dangerouslySetInnerHTML={{ __html: safeHtml }} />
      )}

      {article.youtubeLinks && article.youtubeLinks.length > 0 && (
        <div style={{ marginTop:"28px" }}>
          <h3 style={{ fontFamily:"var(--font-playfair)", fontWeight:700,
            fontSize:"1.1rem", color:"var(--text-1)", marginBottom:"12px" }}>
            📺 Watch
          </h3>
          {article.youtubeLinks.map((url, i) => {
            const vid = ytId(url);
            if (!vid) return null;
            return (
              <div key={i} style={{ position:"relative", paddingTop:"56.25%",
                borderRadius:"12px", overflow:"hidden", marginBottom:"14px" }}>
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${vid}`}
                  style={{ position:"absolute", inset:0, width:"100%", height:"100%", border:"none" }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen loading="lazy" title={`Video ${i + 1}`} />
              </div>
            );
          })}
        </div>
      )}

      {article.tags && article.tags.length > 0 && (
        <div style={{ marginTop:"24px", display:"flex", flexWrap:"wrap", gap:"8px" }}>
          {article.tags.map((tag) => (
            <Link key={tag} href={`/search?q=${encodeURIComponent(tag)}`}
              style={{ padding:"5px 12px", borderRadius:"20px", fontSize:"0.75rem",
                border:"1px solid var(--border)", color:"var(--text-3)", textDecoration:"none" }}>
              #{tag}
            </Link>
          ))}
        </div>
      )}

      <div style={{ marginTop:"32px", paddingTop:"20px", borderTop:"1px solid var(--border)",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        flexWrap:"wrap", gap:"14px" }}>
        <button onClick={handleLike} style={{
          display:"inline-flex", alignItems:"center", gap:"8px",
          padding:"9px 22px", borderRadius:"24px", cursor:"pointer",
          fontSize:"0.88rem", fontWeight:700, transition:"all 0.2s",
          background: liked ? "var(--brand-red)" : "transparent",
          color:      liked ? "#fff" : "var(--text-2)",
          border:`1.5px solid ${liked ? "var(--brand-red)" : "var(--border)"}`,
          fontFamily:"var(--font-sans)",
          transform: liked ? "scale(1.05)" : "scale(1)",
        }}>
          <span style={{ fontSize:"1.1rem" }}>{liked ? "❤️" : "🤍"}</span>
          <span>{likes.toLocaleString()}</span>
          <span>{liked ? "Liked!" : "Like"}</span>
        </button>

        <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", alignItems:"center" }}>
          <span style={{ fontSize:"0.75rem", color:"var(--text-3)" }}>Share:</span>
          {typeof navigator !== "undefined" && "share" in navigator && (
            <button onClick={() => handleShare()}
              style={{ padding:"7px 14px", borderRadius:"20px", fontSize:"0.78rem",
                fontWeight:700, color:"var(--text-1)", background:"var(--bg-card)",
                border:"1px solid var(--border)", cursor:"pointer",
                fontFamily:"var(--font-sans)" }}>
              📤 Share
            </button>
          )}
          {[
            { key:"facebook", label:"Facebook", bg:"#1877F2" },
            { key:"twitter",  label:"X",        bg:"#000"    },
            { key:"whatsapp", label:"WhatsApp", bg:"#25D366" },
          ].map(({ key, label, bg }) => (
            <button key={key} onClick={() => handleShare(key)}
              style={{ padding:"7px 14px", borderRadius:"20px", fontSize:"0.78rem",
                fontWeight:700, color:"#fff", background:bg,
                border:"none", cursor:"pointer", fontFamily:"var(--font-sans)" }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop:"32px" }}>
        <Link href="/" style={{ color:"var(--brand-red)", fontSize:"0.85rem" }}>
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

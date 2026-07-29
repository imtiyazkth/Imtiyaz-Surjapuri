"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TopBar from "@/components/layout/TopBar";

interface Article {
  id: string; slug: string; title: string; excerpt?: string;
  coverImage?: string; coverImageAlt?: string;
  primaryCategory: string; catColor?: string;
  author: string; readTime: string;
  publishedAt?: string | null;
  viewCount?: number;
  featured?: boolean; breaking?: boolean; trending?: boolean;
  categories?: string[]; tags?: string[];
}

const CATEGORIES = [
  "Analysis","Breaking News","Opinion","Politics","Economy",
  "Technology","Education","Social Issues","World","Blog",
];

function timeAgo(raw?: string | null): string {
  if (!raw) return "";
  try {
    const ms = Date.now() - new Date(raw).getTime();
    const h = Math.floor(ms / 3600000);
    const d = Math.floor(ms / 86400000);
    if (ms < 3600000) return `${Math.floor(ms / 60000)}m ago`;
    if (h < 24) return `${h}h ago`;
    return `${d}d ago`;
  } catch { return ""; }
}

// ── Article Card ──────────────────────────────────────────────
function ArticleCard({ article, large = false }: { article: Article; large?: boolean }) {
  const href  = `/articles/${article.slug}`;
  const color = article.catColor ?? "#C41C1C";
  const date  = timeAgo(article.publishedAt);

  if (large) {
    return (
      <Link href={href} style={{ display:"block", textDecoration:"none" }}>
        <article style={{
          position:"relative", borderRadius:"14px", overflow:"hidden",
          minHeight:"360px", background:"#111",
          display:"flex", flexDirection:"column", justifyContent:"flex-end"
        }}>
          {article.coverImage && (
            <Image src={article.coverImage} alt={article.coverImageAlt||article.title}
              fill priority sizes="(max-width:768px) 100vw, 60vw"
              style={{ objectFit:"cover", opacity:0.7 }} />
          )}
          <div style={{
            position:"relative", zIndex:1, padding:"20px",
            background:"linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)"
          }}>
            <div style={{ display:"flex", gap:"6px", marginBottom:"8px", flexWrap:"wrap" }}>
              {article.breaking && (
                <span className="cat-pill" style={{ background:color, color:"#fff", border:"none" }}>Breaking</span>
              )}
              <span className="cat-pill" style={{ background:`${color}30`, color:"#fff", borderColor:`${color}60` }}>
                {article.primaryCategory}
              </span>
            </div>
            <h2 style={{
              fontFamily:"var(--font-playfair)", fontWeight:800,
              color:"#fff", fontSize:"clamp(1.1rem,3vw,1.5rem)",
              lineHeight:1.25, marginBottom:"8px"
            }}>
              {article.title}
            </h2>
            {article.excerpt && (
              <p style={{ color:"rgba(255,255,255,0.75)", fontSize:"0.88rem", marginBottom:"10px",
                display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden"
              }}>{article.excerpt}</p>
            )}
            <div style={{ display:"flex", gap:"10px", color:"rgba(255,255,255,0.65)", fontSize:"0.75rem" }}>
              <span>{article.author}</span>
              {date && <><span>·</span><span>{date}</span></>}
              <span>·</span><span>{article.readTime}</span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <article className="a-card">
      {article.coverImage && (
        <Link href={href} className="a-card-img" style={{ display:"block" }}>
          <Image src={article.coverImage} alt={article.coverImageAlt||article.title}
            fill sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
            style={{ objectFit:"cover" }} />
          {article.trending && (
            <span className="cat-pill" style={{
              position:"absolute", top:"8px", right:"8px",
              background:"#B8860B", color:"#fff", border:"none"
            }}>🔥 Trending</span>
          )}
        </Link>
      )}
      <div className="a-card-body">
        <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
          {article.breaking && (
            <span className="cat-pill" style={{ background:color, color:"#fff", border:"none" }}>Breaking</span>
          )}
          <span className="cat-pill" style={{ background:`${color}20`, color, borderColor:`${color}50` }}>
            {article.primaryCategory}
          </span>
        </div>
        <Link href={href}><h2 className="a-card-title">{article.title}</h2></Link>
        {article.excerpt && <p className="a-card-excerpt">{article.excerpt}</p>}
        <div className="a-card-meta">
          <span style={{ fontWeight:600, color:"var(--text-2)" }}>{article.author}</span>
          {date && <><span>·</span><span>{date}</span></>}
          <span>·</span><span>{article.readTime}</span>
        </div>
      </div>
    </article>
  );
}

// ── Breaking Ticker ───────────────────────────────────────────
function Ticker({ items }: { items: Article[] }) {
  if (!items.length) return null;
  const doubled = [...items, ...items];
  return (
    <div className="ticker-wrap">
      <div className="ticker-label">
        <span className="ticker-dot" />
        <span>Breaking</span>
      </div>
      <div style={{ flex:1, overflow:"hidden", display:"flex", alignItems:"center" }}>
        <div className="ticker-track">
          {doubled.map((a, i) => (
            <Link key={`${a.id}-${i}`} href={`/articles/${a.slug}`} className="ticker-item">
              <span style={{ color:"var(--brand-red)", fontWeight:900, fontSize:"0.5rem" }}>●</span>
              {a.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────
function Skeleton() {
  return (
    <div style={{ borderRadius:"12px", overflow:"hidden", border:"1px solid var(--border)" }}>
      <div className="skeleton" style={{ height:"200px" }} />
      <div style={{ padding:"14px", display:"flex", flexDirection:"column", gap:"10px" }}>
        <div className="skeleton" style={{ height:"12px", width:"60px" }} />
        <div className="skeleton" style={{ height:"16px" }} />
        <div className="skeleton" style={{ height:"16px", width:"80%" }} />
        <div className="skeleton" style={{ height:"12px", width:"40%", marginTop:"8px" }} />
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function HomePage() {
  const [articles,   setArticles]   = useState<Article[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");
  const [activeTab,  setActiveTab]  = useState("All");

  useEffect(() => {
    fetch("/api/articles?limit=20")
      .then((r) => r.json())
      .then((d) => {
        if (d.articles) setArticles(d.articles);
        else setError("Could not load articles.");
      })
      .catch(() => setError("Could not load articles. Please refresh the page."))
      .finally(() => setLoading(false));
  }, []);

  const breaking = articles.filter((a) => a.breaking);
  const featured = articles.filter((a) => a.featured);
  const mainFeed = activeTab === "All"
    ? articles
    : articles.filter((a) =>
        a.primaryCategory === activeTab ||
        a.categories?.some((c) => c.toLowerCase().replace(/\s+/g,"-") === activeTab.toLowerCase().replace(/\s+/g,"-"))
      );

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", background:"var(--bg)" }}>
      <TopBar />
      <Header />

      {/* Breaking ticker */}
      {!loading && breaking.length > 0 && <Ticker items={breaking} />}

      {/* Category nav */}
      <nav className="site-nav">
        <div className="site-nav-inner">
          {["All", ...CATEGORIES].map((cat) => (
            <button key={cat} onClick={() => setActiveTab(cat)}
              className={`nav-link${activeTab === cat ? " active" : ""}`}>
              {cat}
            </button>
          ))}
          <Link href="/articles" className="nav-link" style={{ marginLeft:"auto" }}>
            All Articles →
          </Link>
        </div>
      </nav>

      <main style={{ flex:1 }}>
        <div className="main-container">

          {/* Error banner */}
          {error && (
            <div className="alert alert-error" style={{ marginBottom:"20px" }}>{error}</div>
          )}

          {/* Loading */}
          {loading && (
            <div className="articles-grid">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} />)}
            </div>
          )}

          {!loading && !error && (
            <>
              {/* Hero section — featured article + sidebar */}
              {activeTab === "All" && featured.length > 0 && (
                <section style={{ marginBottom:"36px" }}>
                  <div className="hero-grid">
                    {/* Main featured */}
                    <div>
                      <ArticleCard article={featured[0]} large />
                    </div>
                    {/* Sidebar — next 3 articles */}
                    <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                      {articles.filter((a) => !a.featured).slice(0, 3).map((a) => {
                        const c = a.catColor ?? "#C41C1C";
                        return (
                          <Link key={a.id} href={`/articles/${a.slug}`}
                            style={{ textDecoration:"none" }}
                          >
                            <div className="a-horiz">
                              {a.coverImage && (
                                <div className="a-horiz-img">
                                  <Image src={a.coverImage} alt={a.title}
                                    width={84} height={68} style={{ objectFit:"cover", width:"100%", height:"100%" }} />
                                </div>
                              )}
                              <div style={{ flex:1, minWidth:0 }}>
                                <span className="cat-pill" style={{ background:`${c}20`, color:c, borderColor:`${c}50` }}>
                                  {a.primaryCategory}
                                </span>
                                <p className="a-horiz-title">{a.title}</p>
                                <p style={{ fontSize:"0.72rem", color:"var(--text-3)", marginTop:"4px" }}>
                                  {timeAgo(a.publishedAt)} · {a.readTime}
                                </p>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </section>
              )}

              {/* Section label */}
              <div className="section-divider">
                <span className="section-bar" />
                <span className="section-label">
                  {activeTab === "All" ? "Latest Articles" : activeTab}
                </span>
                <span className="section-line" />
                <Link href="/articles"
                  style={{ fontSize:"0.78rem", color:"var(--brand-red)", whiteSpace:"nowrap" }}>
                  See all →
                </Link>
              </div>

              {/* Empty state */}
              {mainFeed.length === 0 && (
                <div style={{ padding:"48px 0", textAlign:"center" }}>
                  <p style={{ color:"var(--text-3)", marginBottom:"12px" }}>
                    No articles in this category yet.
                  </p>
                  <button onClick={() => setActiveTab("All")}
                    style={{ background:"none", border:"none", color:"var(--brand-red)",
                      cursor:"pointer", textDecoration:"underline", fontSize:"0.85rem" }}>
                    ← Show all articles
                  </button>
                </div>
              )}

              {/* Articles grid */}
              {mainFeed.length > 0 && (
                <div className="articles-grid">
                  {mainFeed.slice(0, 15).map((a) => (
                    <ArticleCard key={a.id} article={a} />
                  ))}
                </div>
              )}

              {/* View all button */}
              {mainFeed.length >= 10 && (
                <div style={{ textAlign:"center", marginTop:"32px" }}>
                  <Link href="/articles" className="btn-primary">
                    View All Articles →
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Article {
  id: string; slug: string; title: string;
  primaryCategory?: string; category?: string;
  status: string; readTime: string;
  viewCount?: number; createdAt?: string;
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState("all");
  const [search,   setSearch]   = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [msg,      setMsg]      = useState("");

  const loadArticles = () => {
    setLoading(true);
    fetch("/api/articles?admin=1&limit=100")
      .then((r) => r.json())
      .then((d) => setArticles(d.articles ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadArticles(); }, []);

  const filtered = articles.filter((a) => {
    const matchStatus = filter === "all" || a.status === filter;
    const matchSearch = !search || a.title?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?\n\nThis cannot be undone.`)) return;
    setDeleting(id);
    try {
      const r = await fetch(`/api/articles/${id}`, { method: "DELETE" });
      if (r.ok) {
        setArticles((p) => p.filter((a) => a.id !== id));
        setMsg("Article deleted.");
        setTimeout(() => setMsg(""), 3000);
      }
    } catch { alert("Delete failed. Try again."); }
    finally { setDeleting(null); }
  };

  const handleToggle = async (id: string, status: string) => {
    const next = status === "published" ? "draft" : "published";
    try {
      await fetch(`/api/articles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      setArticles((p) => p.map((a) => a.id === id ? { ...a, status: next } : a));
    } catch { alert("Update failed."); }
  };

  const counts = {
    all:       articles.length,
    published: articles.filter((a) => a.status === "published").length,
    draft:     articles.filter((a) => a.status === "draft").length,
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
        marginBottom:"20px", flexWrap:"wrap", gap:"12px" }}>
        <h1 style={{ fontFamily:"var(--font-playfair)", fontWeight:700,
          fontSize:"1.5rem", color:"var(--text-1)" }}>
          Articles
        </h1>
        <Link href="/admin/articles/new" className="btn-primary">✏️ New Article</Link>
      </div>

      {/* Success message */}
      {msg && <div className="alert alert-success" style={{ marginBottom:"12px" }}>{msg}</div>}

      {/* Filter tabs */}
      <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"16px" }}>
        {(["all","published","draft"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            style={{
              padding:"6px 14px", borderRadius:"20px", border:"1px solid var(--border)",
              background: filter === f ? "var(--brand-red)" : "transparent",
              color: filter === f ? "#fff" : "var(--text-2)",
              fontSize:"0.78rem", fontWeight:600, cursor:"pointer",
              fontFamily:"var(--font-sans)",
            }}>
            {f === "all" ? "All" : f === "published" ? "Published" : "Drafts"} ({counts[f]})
          </button>
        ))}
      </div>

      {/* Search */}
      <input type="search" value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by title…"
        className="admin-input"
        style={{ marginBottom:"16px", maxWidth:"320px" }}
      />

      {/* Loading */}
      {loading && (
        <div style={{ padding:"40px", textAlign:"center", color:"var(--text-3)" }}>
          Loading articles…
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div style={{ padding:"40px", textAlign:"center" }}>
          <p style={{ color:"var(--text-3)", marginBottom:"12px" }}>No articles found.</p>
          <Link href="/admin/articles/new" className="btn-primary" style={{ fontSize:"0.82rem" }}>
            + Write First Article
          </Link>
        </div>
      )}

      {/* Article cards — mobile friendly (no table) */}
      {!loading && filtered.length > 0 && (
        <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
          {filtered.map((a) => (
            <div key={a.id} style={{
              background:"var(--bg-card)", border:"1px solid var(--border)",
              borderRadius:"12px", padding:"14px 16px",
            }}>
              {/* Title + category */}
              <div style={{ marginBottom:"10px" }}>
                <p style={{ fontWeight:700, fontSize:"0.92rem", color:"var(--text-1)",
                  marginBottom:"4px", lineHeight:1.35 }}>
                  {a.title}
                </p>
                <div style={{ display:"flex", gap:"8px", alignItems:"center", flexWrap:"wrap" }}>
                  <span style={{ fontSize:"0.72rem", color:"var(--text-3)" }}>
                    {a.primaryCategory ?? a.category ?? "General"} · {a.readTime}
                  </span>
                  <span className={`badge badge-${a.status}`}>{a.status}</span>
                  <span style={{ fontSize:"0.72rem", color:"var(--text-3)" }}>
                    👁 {(a.viewCount ?? 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action buttons — always visible on mobile */}
              <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
                <Link href={`/admin/articles/${a.id}/edit`}
                  style={{
                    padding:"6px 14px", borderRadius:"8px",
                    background:"var(--brand-red)", color:"#fff",
                    fontSize:"0.78rem", fontWeight:600, textDecoration:"none"
                  }}>
                  ✏️ Edit
                </Link>
                <button onClick={() => handleToggle(a.id, a.status)}
                  style={{
                    padding:"6px 14px", borderRadius:"8px",
                    background:"transparent", border:"1px solid var(--border)",
                    color:"var(--text-2)", fontSize:"0.78rem", fontWeight:600,
                    cursor:"pointer", fontFamily:"var(--font-sans)"
                  }}>
                  {a.status === "published" ? "⬇ Unpublish" : "⬆ Publish"}
                </button>
                <Link href={`/articles/${a.slug}`} target="_blank"
                  style={{
                    padding:"6px 14px", borderRadius:"8px",
                    background:"transparent", border:"1px solid var(--border)",
                    color:"var(--text-2)", fontSize:"0.78rem", fontWeight:600,
                    textDecoration:"none"
                  }}>
                  👁 View
                </Link>
                <button
                  onClick={() => handleDelete(a.id, a.title)}
                  disabled={deleting === a.id}
                  style={{
                    padding:"6px 14px", borderRadius:"8px",
                    background:"transparent", border:"1px solid #fecaca",
                    color:"#ef4444", fontSize:"0.78rem", fontWeight:600,
                    cursor: deleting === a.id ? "not-allowed" : "pointer",
                    opacity: deleting === a.id ? 0.5 : 1,
                    fontFamily:"var(--font-sans)"
                  }}>
                  {deleting === a.id ? "Deleting…" : "🗑 Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

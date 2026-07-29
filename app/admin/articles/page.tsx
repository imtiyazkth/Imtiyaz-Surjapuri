"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Article {
  id: string; slug: string; title: string;
  primaryCategory?: string; category?: string;
  status: string; readTime: string; viewCount?: number; createdAt?: string;
}

function timeStr(raw?: string): string {
  if (!raw) return "—";
  try {
    return new Date(raw).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
  } catch { return "—"; }
}

export default function AdminArticlesPage() {
  const router  = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState("all");
  const [search,   setSearch]   = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/articles?admin=1&limit=100")
      .then((r) => r.json())
      .then((d) => setArticles(d.articles ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = articles.filter((a) => {
    const matchStatus = filter === "all" || a.status === filter;
    const matchSearch = search === "" ||
      a.title?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?\n\nThis cannot be undone.`)) return;
    setDeleting(id);
    try {
      await fetch(`/api/articles/${id}`, { method: "DELETE" });
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch { alert("Delete failed."); }
    finally { setDeleting(null); }
  };

  const handlePublishToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "published" ? "draft" : "published";
    try {
      await fetch(`/api/articles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setArticles((prev) =>
        prev.map((a) => a.id === id ? { ...a, status: newStatus } : a)
      );
    } catch { alert("Update failed."); }
  };

  const counts = {
    all:       articles.length,
    published: articles.filter((a) => a.status === "published").length,
    draft:     articles.filter((a) => a.status === "draft").length,
  };

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"24px", flexWrap:"wrap", gap:"12px" }}>
        <h1 style={{ fontFamily:"var(--font-playfair)", fontWeight:700, fontSize:"1.6rem", color:"var(--text-1)" }}>
          Articles
        </h1>
        <Link href="/admin/articles/new" className="btn-primary">✏️ New Article</Link>
      </div>

      <div className="admin-table-wrap">
        {/* Toolbar */}
        <div className="admin-table-header">
          <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
            {([["all","All"], ["published","Published"], ["draft","Drafts"]] as const).map(([key, label]) => (
              <button key={key} onClick={() => setFilter(key)}
                className={`cat-tab${filter === key ? " active" : ""}`}
                style={{ padding:"5px 12px", fontSize:"0.75rem" }}>
                {label} ({counts[key]})
              </button>
            ))}
          </div>
          <input
            type="search" value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by title…"
            className="admin-input"
            style={{ marginLeft:"auto", width:"200px", height:"34px" }}
          />
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ padding:"40px", textAlign:"center", color:"var(--text-3)" }}>
            Loading articles…
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div style={{ padding:"40px", textAlign:"center" }}>
            <p style={{ color:"var(--text-3)", fontSize:"0.85rem", marginBottom:"12px" }}>
              No articles found.
            </p>
            <Link href="/admin/articles/new" className="btn-primary" style={{ fontSize:"0.8rem" }}>
              + Create First Article
            </Link>
          </div>
        )}

        {/* Table */}
        {!loading && filtered.length > 0 && (
          <div style={{ overflowX:"auto" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  {["Title", "Category", "Status", "Views", "Date", "Actions"].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id} className="admin-table-row">
                    <td style={{ maxWidth:"260px" }}>
                      <p style={{ fontWeight:600, color:"var(--text-1)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                        {a.title}
                      </p>
                      <p style={{ fontSize:"0.72rem", color:"var(--text-3)", marginTop:"2px" }}>
                        {a.readTime} · {a.slug}
                      </p>
                    </td>
                    <td style={{ whiteSpace:"nowrap" }}>
                      <span style={{ fontSize:"0.78rem", color:"var(--text-2)" }}>
                        {a.primaryCategory ?? a.category ?? "—"}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${a.status}`}>{a.status}</span>
                    </td>
                    <td style={{ whiteSpace:"nowrap" }}>
                      <span style={{ fontSize:"0.78rem", color:"var(--text-3)" }}>
                        {(a.viewCount ?? 0).toLocaleString()}
                      </span>
                    </td>
                    <td style={{ whiteSpace:"nowrap" }}>
                      <span style={{ fontSize:"0.72rem", color:"var(--text-3)" }}>
                        {timeStr(a.createdAt)}
                      </span>
                    </td>
                    <td>
                      <div style={{ display:"flex", gap:"10px", alignItems:"center", whiteSpace:"nowrap" }}>
                        <Link href={`/admin/articles/${a.id}/edit`}
                          style={{ fontSize:"0.78rem", color:"var(--brand-red)", textDecoration:"none" }}>
                          Edit
                        </Link>
                        <button onClick={() => handlePublishToggle(a.id, a.status)}
                          style={{ background:"none", border:"none", cursor:"pointer",
                            fontSize:"0.78rem", color:"var(--text-3)" }}>
                          {a.status === "published" ? "Unpublish" : "Publish"}
                        </button>
                        <button
                          onClick={() => handleDelete(a.id, a.title)}
                          disabled={deleting === a.id}
                          style={{ background:"none", border:"none", cursor:"pointer",
                            fontSize:"0.78rem", color:"#ef4444",
                            opacity: deleting === a.id ? 0.5 : 1 }}>
                          {deleting === a.id ? "…" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

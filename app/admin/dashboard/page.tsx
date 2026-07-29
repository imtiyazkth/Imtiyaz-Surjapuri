import type { Metadata } from "next";
import Link from "next/link";
import { adminDb } from "@/lib/firebase/admin";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

async function getStats() {
  try {
    const snap = await adminDb.collection("articles").limit(100).get();
    const all  = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Record<string, unknown>));
    // Deduplicate by slug
    const seen = new Set<string>();
    const articles = all.filter((a) => {
      const s = a.slug as string;
      if (!s || seen.has(s)) return false;
      seen.add(s); return true;
    });
    return {
      total:     articles.length,
      published: articles.filter((a) => a.status === "published").length,
      drafts:    articles.filter((a) => a.status === "draft").length,
      views:     articles.reduce((s, a) => s + ((a.viewCount as number) || 0), 0),
      recent:    articles.slice(0, 8),
    };
  } catch (e) {
    console.error("Dashboard stats error:", e);
    return { total: 0, published: 0, drafts: 0, views: 0, recent: [] };
  }
}

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"24px", flexWrap:"wrap", gap:"12px" }}>
        <div>
          <h1 style={{ fontFamily:"var(--font-playfair)", fontWeight:700, fontSize:"1.6rem", color:"var(--text-1)" }}>
            Dashboard
          </h1>
          <p style={{ fontSize:"0.8rem", color:"var(--text-3)", marginTop:"2px" }}>
            Welcome back, Md Imtiyaz Alam
          </p>
        </div>
        <Link href="/admin/articles/new" className="btn-primary">✏️ New Article</Link>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"12px", marginBottom:"24px" }}>
        {[
          { icon:"📝", value:stats.total,     label:"Total Articles", bg:"" },
          { icon:"✅", value:stats.published,  label:"Published",      bg:"#dcfce7" },
          { icon:"📋", value:stats.drafts,     label:"Drafts",         bg:"#fef3c7" },
          { icon:"👁",  value:stats.views,      label:"Total Views",    bg:"#dbeafe" },
        ].map(({ icon, value, label, bg }) => (
          <div key={label} className="stat-card" style={ bg ? { background:bg, borderColor:"transparent" } : {} }>
            <div className="stat-card-icon">{icon}</div>
            <div className="stat-card-value">{(value as number).toLocaleString()}</div>
            <div className="stat-card-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr", gap:"10px", marginBottom:"24px" }}>
        {[
          { href:"/admin/articles/new", icon:"✏️", title:"Write New Article",  desc:"Start a draft or publish immediately" },
          { href:"/admin/articles",     icon:"📋", title:"Manage All Articles", desc:"Edit, publish, or delete articles" },
          { href:"/admin/categories",   icon:"🗂", title:"Manage Categories",  desc:"Add, edit, or reorder categories" },
        ].map(({ href, icon, title, desc }) => (
          <Link key={href} href={href} className="quick-action">
            <span className="quick-action-icon">{icon}</span>
            <div>
              <div className="quick-action-title">{title}</div>
              <div className="quick-action-desc">{desc}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent articles */}
      <div className="admin-table-wrap">
        <div className="admin-table-header" style={{ justifyContent:"space-between" }}>
          <span style={{ fontFamily:"var(--font-playfair)", fontWeight:700, fontSize:"0.95rem", color:"var(--text-1)" }}>
            Recent Articles
          </span>
          <Link href="/admin/articles" style={{ fontSize:"0.78rem", color:"var(--brand-red)", textDecoration:"none" }}>
            View all →
          </Link>
        </div>

        {stats.recent.length === 0 ? (
          <div style={{ padding:"40px", textAlign:"center" }}>
            <p style={{ color:"var(--text-3)", fontSize:"0.85rem" }}>
              No articles yet.{" "}
              <Link href="/admin/articles/new" style={{ color:"var(--brand-red)" }}>Create your first →</Link>
            </p>
          </div>
        ) : (
          stats.recent.map((a) => (
            <div key={a.id as string} className="recent-row">
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontSize:"0.85rem", fontWeight:600, color:"var(--text-1)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                  {a.title as string}
                </p>
                <p style={{ fontSize:"0.72rem", color:"var(--text-3)", marginTop:"2px" }}>
                  {(a.primaryCategory ?? a.category) as string} · {a.readTime as string}
                </p>
              </div>
              <span className={`badge badge-${a.status as string}`}>{a.status as string}</span>
              <span style={{ fontSize:"0.72rem", color:"var(--text-3)" }}>
                {((a.viewCount as number) || 0).toLocaleString()} views
              </span>
              <Link
                href={`/admin/articles/${a.id as string}/edit`}
                style={{ fontSize:"0.78rem", color:"var(--brand-red)", textDecoration:"none", flexShrink:0 }}
              >
                Edit
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

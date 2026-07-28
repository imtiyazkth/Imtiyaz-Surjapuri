import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticlesAdmin } from "@/lib/db/articles";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const all = await getAllArticlesAdmin({ limit: 100 });

  // Deduplicate by slug (in case migration ran multiple times)
  const seen     = new Set<string>();
  const articles = all.filter((a) => {
    if (seen.has(a.slug)) return false;
    seen.add(a.slug);
    return true;
  });

  const published  = articles.filter((a) => a.status === "published").length;
  const drafts     = articles.filter((a) => a.status === "draft").length;
  const totalViews = articles.reduce((s, a) => s + (a.viewCount || 0), 0);
  const recent     = articles.slice(0, 8);

  return (
    <div>
      {/* Header */}
      <div style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        marginBottom:"24px", flexWrap:"wrap", gap:"12px"
      }}>
        <div>
          <h1 style={{
            fontFamily:"var(--font-playfair)", fontWeight:700,
            fontSize:"1.6rem", color:"var(--text-1)"
          }}>
            Dashboard
          </h1>
          <p style={{ fontSize:"0.82rem", color:"var(--text-3)", marginTop:"2px" }}>
            Welcome back. Here&apos;s what&apos;s happening.
          </p>
        </div>
        <Link href="/admin/articles/new" className="btn-primary">
          ✏️ New Article
        </Link>
      </div>

      {/* Stats */}
      <div style={{
        display:"grid", gridTemplateColumns:"repeat(2,1fr)",
        gap:"12px", marginBottom:"24px"
      }}>
        {[
          { icon:"📝", value:articles.length, label:"Total Articles", bg:"" },
          { icon:"✅", value:published,        label:"Published",      bg:"#dcfce7" },
          { icon:"📋", value:drafts,           label:"Drafts",         bg:"#fef3c7" },
          { icon:"👁",  value:totalViews,       label:"Total Views",    bg:"#dbeafe" },
        ].map(({ icon, value, label, bg }) => (
          <div key={label} className="stat-card" style={bg ? { background:bg, borderColor:"transparent" } : {}}>
            <div className="stat-card-icon">{icon}</div>
            <div className="stat-card-value">{value.toLocaleString()}</div>
            <div className="stat-card-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{
        display:"grid", gridTemplateColumns:"1fr",
        gap:"10px", marginBottom:"24px"
      }}>
        {[
          { href:"/admin/articles/new", icon:"✏️", title:"Write New Article",  desc:"Start a draft or publish immediately" },
          { href:"/admin/categories",   icon:"🗂", title:"Manage Categories", desc:"Add, edit, or reorder categories" },
          { href:"/admin/analytics",    icon:"📈", title:"View Analytics",     desc:"Check traffic and performance" },
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

      {/* Recent articles — pure CSS hover via class, no JS handlers */}
      <div className="admin-table-wrap">
        <div className="admin-table-header" style={{ justifyContent:"space-between" }}>
          <span style={{
            fontFamily:"var(--font-playfair)", fontWeight:700,
            fontSize:"0.95rem", color:"var(--text-1)"
          }}>
            Recent Articles
          </span>
          <Link href="/admin/articles" style={{ fontSize:"0.78rem", color:"var(--brand-red)", textDecoration:"none" }}>
            View all →
          </Link>
        </div>

        {recent.length === 0 ? (
          <div style={{ padding:"48px 20px", textAlign:"center" }}>
            <p style={{ color:"var(--text-3)", fontSize:"0.85rem" }}>
              No articles yet.{" "}
              <Link href="/admin/articles/new" style={{ color:"var(--brand-red)" }}>
                Create your first article →
              </Link>
            </p>
          </div>
        ) : (
          <div>
            {recent.map((a) => (
              <div key={a.id} className="recent-row">
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{
                    fontSize:"0.85rem", fontWeight:600, color:"var(--text-1)",
                    overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"
                  }}>
                    {a.title}
                  </p>
                  <p style={{ fontSize:"0.72rem", color:"var(--text-3)", marginTop:"2px" }}>
                    {a.primaryCategory} · {a.readTime}
                  </p>
                </div>
                <span className={`badge badge-${a.status}`}>{a.status}</span>
                <span style={{ fontSize:"0.72rem", color:"var(--text-3)", flexShrink:0 }}>
                  {(a.viewCount || 0).toLocaleString()} views
                </span>
                <Link
                  href={`/admin/articles/${a.id}/edit`}
                  style={{ fontSize:"0.78rem", color:"var(--brand-red)", textDecoration:"none", flexShrink:0 }}
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

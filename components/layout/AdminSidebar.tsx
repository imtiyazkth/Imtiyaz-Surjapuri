"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { SITE_NAME } from "@/lib/constants";

const NAV = [
  { href: "/admin/dashboard",    icon: "📊", label: "Dashboard" },
  { href: "/admin/articles",     icon: "📝", label: "All Articles" },
  { href: "/admin/articles/new", icon: "✏️",  label: "New Article" },
  { href: "/admin/categories",   icon: "🗂",  label: "Categories" },
  { href: "/admin/tags",         icon: "🏷",  label: "Tags" },
  { href: "/admin/analytics",    icon: "📈", label: "Analytics" },
  { href: "/admin/settings",     icon: "⚙️",  label: "Settings" },
];

export default function AdminSidebar() {
  const pathname   = usePathname();
  const router     = useRouter();
  const [open, setOpen]   = useState(false);
  const [logout, setLogout] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => { setOpen(false); }, [pathname]);

  const handleLogout = async () => {
    setLogout(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const isActive = (href: string) => {
    if (href === "/admin/articles" && pathname.includes("/new")) return false;
    if (href === "/admin/articles" && pathname.includes("/edit")) return false;
    return pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href));
  };

  return (
    <>
      {/* ── Mobile top bar ─────────────────────── */}
      <div className="admin-mobile-bar">
        <button
          onClick={() => setOpen(true)}
          className="admin-menu-btn"
          aria-label="Open menu"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            width: "36px", height: "36px",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", fontSize: "1.1rem", color: "var(--text-1)"
          }}
        >
          ☰
        </button>
        <span style={{
          fontFamily: "var(--font-playfair)",
          fontWeight: 700, fontSize: "1rem",
          color: "var(--text-1)"
        }}>
          Admin Panel
        </span>
        <Link
          href="/admin/articles/new"
          style={{
            marginLeft: "auto",
            background: "var(--brand-red)", color: "#fff",
            padding: "7px 14px", borderRadius: "8px",
            fontSize: "0.78rem", fontWeight: 700,
            textDecoration: "none"
          }}
        >
          + New
        </Link>
      </div>

      {/* ── Mobile overlay ──────────────────────── */}
      {open && (
        <div
          className="admin-overlay show"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Sidebar ─────────────────────────────── */}
      <aside className={`admin-sidebar${open ? " open" : ""}`}>
        {/* Brand */}
        <div className="admin-brand">
          <Link href="/" target="_blank" style={{ textDecoration: "none" }}>
            <div className="admin-brand-name">{SITE_NAME}</div>
          </Link>
          <div className="admin-brand-sub">Admin Panel</div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "8px 0", overflowY: "auto" }}>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-link${isActive(item.href) ? " active" : ""}`}
            >
              <span className="icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="admin-sidebar-footer">
          <Link
            href="/"
            target="_blank"
            className="admin-nav-link"
            style={{ marginBottom: "2px" }}
          >
            <span className="icon">🌐</span>
            View Site
          </Link>
          <button
            onClick={handleLogout}
            disabled={logout}
            className="admin-nav-link"
            style={{
              width: "100%", border: "none",
              cursor: logout ? "not-allowed" : "pointer",
              opacity: logout ? 0.6 : 1,
              color: "var(--text-3)"
            }}
          >
            <span className="icon">🚪</span>
            {logout ? "Signing out…" : "Sign Out"}
          </button>
        </div>
      </aside>
    </>
  );
}

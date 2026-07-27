"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { clsx } from "clsx";
import { SITE_NAME } from "@/lib/constants";

const NAV_ITEMS = [
  { href: "/admin/dashboard",  icon: "📊", label: "Dashboard" },
  { href: "/admin/articles",   icon: "📝", label: "Articles" },
  { href: "/admin/articles/new", icon: "➕", label: "New Article" },
  { href: "/admin/categories", icon: "🗂", label: "Categories" },
  { href: "/admin/tags",       icon: "🏷", label: "Tags" },
  { href: "/admin/analytics",  icon: "📈", label: "Analytics" },
  { href: "/admin/settings",   icon: "⚙️", label: "Settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-4 py-4 border-b border-[var(--surface-border)]">
        <Link href="/" target="_blank">
          <span className="font-display font-bold text-base text-[var(--text-primary)]">
            {SITE_NAME}
          </span>
        </Link>
        <p className="text-xs font-sans text-[var(--text-muted)] mt-0.5">
          Admin Panel
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto" aria-label="Admin navigation">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== "/admin/dashboard" && pathname.startsWith(item.href) &&
             !(item.href === "/admin/articles" && pathname.includes("/new")));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-sans",
                "transition-colors font-medium",
                isActive
                  ? "bg-[var(--brand-red)] text-white"
                  : "text-[var(--text-secondary)] hover:bg-[var(--surface-bg)] hover:text-[var(--text-primary)]"
              )}
            >
              <span className="text-base" aria-hidden="true">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-[var(--surface-border)]">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                     font-sans text-[var(--text-muted)] hover:text-[var(--text-primary)]
                     hover:bg-[var(--surface-bg)] transition-colors"
        >
          <span>🌐</span> View Site
        </Link>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                     font-sans text-[var(--text-muted)] hover:text-red-500
                     hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors
                     disabled:opacity-60 mt-0.5"
        >
          <span>🚪</span>
          {loggingOut ? "Signing out…" : "Sign Out"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="md:hidden fixed top-3 left-3 z-50 p-2 rounded-lg
                   bg-[var(--surface-card)] border border-[var(--surface-border)]
                   shadow-card text-[var(--text-primary)]"
        onClick={() => setMobileOpen((o) => !o)}
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? "✕" : "☰"}
      </button>

      {/* Overlay on mobile */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx("admin-sidebar", mobileOpen && "open")}
        aria-label="Admin sidebar"
      >
        <SidebarContent />
      </aside>
    </>
  );
}

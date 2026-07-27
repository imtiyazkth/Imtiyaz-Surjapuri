import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticlesAdmin } from "@/lib/db/articles";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const allArticles = await getAllArticlesAdmin({ limit: 100 });

  const published = allArticles.filter((a) => a.status === "published").length;
  const drafts    = allArticles.filter((a) => a.status === "draft").length;
  const total     = allArticles.length;
  const totalViews = allArticles.reduce((sum, a) => sum + (a.viewCount || 0), 0);

  const recent = allArticles.slice(0, 8);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-[var(--text-primary)]">
            Dashboard
          </h1>
          <p className="font-sans text-sm text-[var(--text-muted)] mt-0.5">
            Welcome back. Here's what's happening.
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          className="px-4 py-2.5 rounded-lg bg-[var(--brand-red)] text-white
                     font-sans text-sm font-semibold hover:bg-[var(--brand-red-dark)]
                     transition-colors"
        >
          + New Article
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Articles" value={total} icon="📝" />
        <StatCard label="Published" value={published} icon="✅" color="green" />
        <StatCard label="Drafts" value={drafts} icon="📋" color="amber" />
        <StatCard label="Total Views" value={totalViews.toLocaleString()} icon="👁" color="blue" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <QuickAction href="/admin/articles/new"  icon="✍️"  label="Write New Article" desc="Start a new draft or publish" />
        <QuickAction href="/admin/categories"     icon="🗂"  label="Manage Categories" desc="Add or edit categories" />
        <QuickAction href="/admin/analytics"      icon="📈"  label="View Analytics"    desc="See site performance" />
      </div>

      {/* Recent articles */}
      <div className="bg-[var(--surface-card)] border border-[var(--surface-border)] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--surface-border)] flex items-center justify-between">
          <h2 className="font-display font-bold text-base text-[var(--text-primary)]">
            Recent Articles
          </h2>
          <Link
            href="/admin/articles"
            className="text-xs font-sans text-[var(--brand-red)] hover:underline"
          >
            View all →
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-[var(--text-muted)] font-sans text-sm">
              No articles yet.{" "}
              <Link href="/admin/articles/new" className="text-[var(--brand-red)] hover:underline">
                Create your first article →
              </Link>
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--surface-border)]">
            {recent.map((a) => (
              <div
                key={a.id}
                className="px-5 py-3.5 flex items-center gap-4 hover:bg-[var(--surface-bg)] transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-sans font-medium text-sm text-[var(--text-primary)] truncate">
                    {a.title}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">
                    {a.primaryCategory} · {a.readTime}
                  </p>
                </div>
                <span
                  className={`flex-shrink-0 px-2 py-0.5 rounded text-xs font-sans font-semibold
                    ${a.status === "published"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                      : a.status === "draft"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                >
                  {a.status}
                </span>
                <span className="flex-shrink-0 text-xs text-[var(--text-muted)] font-sans hidden sm:block">
                  {a.viewCount?.toLocaleString() ?? 0} views
                </span>
                <Link
                  href={`/admin/articles/${a.id}/edit`}
                  className="flex-shrink-0 text-xs font-sans text-[var(--brand-red)] hover:underline"
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

function StatCard({
  label,
  value,
  icon,
  color = "default",
}: {
  label: string;
  value: string | number;
  icon: string;
  color?: "green" | "amber" | "blue" | "default";
}) {
  const bg = {
    green:   "bg-green-50 dark:bg-green-900/10",
    amber:   "bg-amber-50 dark:bg-amber-900/10",
    blue:    "bg-blue-50 dark:bg-blue-900/10",
    default: "bg-[var(--surface-bg)]",
  }[color];

  return (
    <div className={`rounded-xl border border-[var(--surface-border)] p-5 ${bg}`}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl" aria-hidden="true">{icon}</span>
      </div>
      <p className="font-display font-bold text-2xl text-[var(--text-primary)]">
        {value}
      </p>
      <p className="font-sans text-xs text-[var(--text-muted)] mt-1">{label}</p>
    </div>
  );
}

function QuickAction({
  href,
  icon,
  label,
  desc,
}: {
  href: string;
  icon: string;
  label: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-4 p-4 rounded-xl border border-[var(--surface-border)]
                 bg-[var(--surface-card)] hover:border-[var(--brand-red)] transition-colors"
    >
      <span className="text-2xl flex-shrink-0" aria-hidden="true">{icon}</span>
      <div>
        <p className="font-sans font-semibold text-sm text-[var(--text-primary)] group-hover:text-[var(--brand-red)] transition-colors">
          {label}
        </p>
        <p className="font-sans text-xs text-[var(--text-muted)] mt-0.5">{desc}</p>
      </div>
    </Link>
  );
}

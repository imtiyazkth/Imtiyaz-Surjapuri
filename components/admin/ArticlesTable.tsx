"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Article } from "@/types/article";
import { formatDistanceToNow } from "date-fns";

interface ArticlesTableProps {
  articles: Article[];
}

type Filter = "all" | "published" | "draft" | "archived";

export default function ArticlesTable({ articles }: ArticlesTableProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const [searchQ, setSearchQ] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered = articles.filter((a) => {
    const matchesFilter = filter === "all" || a.status === filter;
    const matchesSearch =
      searchQ === "" ||
      a.title.toLowerCase().includes(searchQ.toLowerCase()) ||
      a.author.toLowerCase().includes(searchQ.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    await fetch(`/api/articles/${id}`, { method: "DELETE" });
    setDeleting(null);
    router.refresh();
  };

  const handleTogglePublish = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "published" ? "draft" : "published";
    await fetch(`/api/articles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    router.refresh();
  };

  const FILTERS: { key: Filter; label: string }[] = [
    { key: "all",       label: `All (${articles.length})` },
    { key: "published", label: `Published (${articles.filter((a) => a.status === "published").length})` },
    { key: "draft",     label: `Drafts (${articles.filter((a) => a.status === "draft").length})` },
    { key: "archived",  label: `Archived (${articles.filter((a) => a.status === "archived").length})` },
  ];

  return (
    <div className="bg-[var(--surface-card)] border border-[var(--surface-border)] rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="px-5 py-4 border-b border-[var(--surface-border)] flex flex-wrap gap-3 items-center">
        {/* Status filters */}
        <div className="flex gap-1 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-sans font-semibold transition-colors ${
                filter === f.key
                  ? "bg-[var(--brand-red)] text-white"
                  : "bg-[var(--surface-bg)] text-[var(--text-secondary)] hover:bg-[var(--surface-border)]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        {/* Search */}
        <input
          type="search"
          placeholder="Filter by title or author…"
          value={searchQ}
          onChange={(e) => setSearchQ(e.target.value)}
          className="ml-auto h-8 px-3 rounded-md text-xs font-sans
                     bg-[var(--surface-bg)] border border-[var(--surface-border)]
                     text-[var(--text-primary)] focus:outline-none
                     focus:ring-2 focus:ring-[var(--brand-red)] w-56"
        />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-[var(--text-muted)] font-sans text-sm">
            No articles found.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--surface-border)]">
                {["Title", "Category", "Status", "Views", "Date", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-sans font-semibold
                                 uppercase tracking-wide text-[var(--text-muted)]"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--surface-border)]">
              {filtered.map((article) => (
                <tr
                  key={article.id}
                  className="hover:bg-[var(--surface-bg)] transition-colors"
                >
                  {/* Title */}
                  <td className="px-5 py-3 max-w-xs">
                    <p className="font-sans font-medium text-sm text-[var(--text-primary)] truncate">
                      {article.title}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">
                      {article.author} · {article.readTime}
                    </p>
                  </td>

                  {/* Category */}
                  <td className="px-5 py-3">
                    <span className="text-xs font-sans text-[var(--text-secondary)]">
                      {article.primaryCategory}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-sans font-semibold ${
                        article.status === "published"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                          : article.status === "draft"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                      }`}
                    >
                      {article.status}
                    </span>
                  </td>

                  {/* Views */}
                  <td className="px-5 py-3">
                    <span className="text-xs font-sans text-[var(--text-muted)]">
                      {(article.viewCount || 0).toLocaleString()}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-5 py-3">
                    <span className="text-xs font-sans text-[var(--text-muted)] whitespace-nowrap">
                      {article.createdAt
                        ? formatDistanceToNow(new Date(article.createdAt as string), {
                            addSuffix: true,
                          })
                        : "—"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/articles/${article.id}/edit`}
                        className="text-xs font-sans text-[var(--brand-red)] hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() =>
                          handleTogglePublish(article.id, article.status)
                        }
                        className="text-xs font-sans text-[var(--text-secondary)]
                                   hover:text-[var(--text-primary)] transition-colors"
                      >
                        {article.status === "published" ? "Unpublish" : "Publish"}
                      </button>
                      <button
                        onClick={() => handleDelete(article.id, article.title)}
                        disabled={deleting === article.id}
                        className="text-xs font-sans text-red-500 hover:text-red-700
                                   transition-colors disabled:opacity-50"
                      >
                        {deleting === article.id ? "…" : "Delete"}
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
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticlesAdmin } from "@/lib/db/articles";
import ArticlesTable from "@/components/admin/ArticlesTable";

export const metadata: Metadata = { title: "Articles" };
export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  const articles = await getAllArticlesAdmin({ limit: 50 });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl text-[var(--text-primary)]">
          Articles
        </h1>
        <Link
          href="/admin/articles/new"
          className="px-4 py-2.5 rounded-lg bg-[var(--brand-red)] text-white
                     font-sans text-sm font-semibold hover:bg-[var(--brand-red-dark)]
                     transition-colors"
        >
          + New Article
        </Link>
      </div>

      <ArticlesTable articles={articles} />
    </div>
  );
}

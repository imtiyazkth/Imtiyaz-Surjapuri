import { getPublishedArticles } from "@/lib/db/articles";
import { getAllCategories } from "@/lib/db/categories";
import ArticleCard from "@/components/article/ArticleCard";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Articles",
  description: "Browse all published articles, analysis, and news.",
};

export const revalidate = 60;

export default async function ArticlesPage() {
  const [articles, categories] = await Promise.all([
    getPublishedArticles({ limit: 24 }),
    getAllCategories(true),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page header */}
      <div className="mb-8 border-b border-[var(--surface-border)] pb-5">
        <h1 className="font-display font-bold text-3xl text-[var(--text-primary)] mb-2">
          All Articles
        </h1>
        <p className="font-sans text-[var(--text-muted)] text-sm">
          {articles.length} articles published
        </p>
      </div>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <Link
            href="/articles"
            className="px-3 py-1.5 rounded-full text-xs font-sans font-semibold
                       bg-[var(--brand-red)] text-white"
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="px-3 py-1.5 rounded-full text-xs font-sans font-semibold
                         border border-[var(--surface-border)] text-[var(--text-secondary)]
                         hover:border-[var(--brand-red)] hover:text-[var(--brand-red)]
                         transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}

      {/* Articles grid */}
      {articles.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-[var(--text-muted)] font-sans">
            No articles published yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}

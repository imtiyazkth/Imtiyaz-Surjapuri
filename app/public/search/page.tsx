import type { Metadata } from "next";
import { searchArticles } from "@/lib/db/articles";
import ArticleCard from "@/components/article/ArticleCard";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export const dynamic = "force-dynamic"; // SSR — search is always fresh

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: "${q}"` : "Search",
    robots: { index: false },
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const results = query.length >= 2 ? await searchArticles(query, 24) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl text-[var(--text-primary)] mb-1">
          {query ? `Results for "${query}"` : "Search"}
        </h1>
        {query && (
          <p className="font-sans text-[var(--text-muted)] text-sm">
            {results.length} article{results.length !== 1 ? "s" : ""} found
          </p>
        )}
      </div>

      {/* Search form (progressive enhancement — works without JS via page reload) */}
      <form action="/search" method="get" className="mb-8 flex gap-2 max-w-lg">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search articles, categories, tags…"
          autoFocus
          className="flex-1 h-11 px-4 rounded-lg text-sm
                     bg-[var(--surface-card)] border border-[var(--surface-border)]
                     text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
                     focus:outline-none focus:ring-2 focus:ring-[var(--brand-red)]"
        />
        <button
          type="submit"
          className="px-5 h-11 rounded-lg bg-[var(--brand-red)] text-white
                     font-sans text-sm font-semibold hover:bg-[var(--brand-red-dark)]
                     transition-colors"
        >
          Search
        </button>
      </form>

      {/* Results */}
      {!query && (
        <p className="text-[var(--text-muted)] font-sans text-sm">
          Enter at least 2 characters to search.
        </p>
      )}

      {query && results.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-[var(--text-muted)] font-sans text-base mb-2">
            No results found for &ldquo;{query}&rdquo;
          </p>
          <p className="text-[var(--text-muted)] font-sans text-sm">
            Try different keywords or browse by{" "}
            <a
              href="/articles"
              className="text-[var(--brand-red)] hover:underline"
            >
              category
            </a>
            .
          </p>
        </div>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {results.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}

import {
  getFeaturedArticles,
  getPublishedArticles,
  getTrendingArticles,
} from "@/lib/db/articles";
import { getAllCategories } from "@/lib/db/categories";
import ArticleCard from "@/components/article/ArticleCard";
import type { ArticleCard as ArticleCardType } from "@/types/article";
import Link from "next/link";

export const revalidate = 60; // ISR — regenerate every 60s

export default async function HomePage() {
  const [featured, latest, trending, categories] = await Promise.all([
    getFeaturedArticles(4),
    getPublishedArticles({ limit: 9 }),
    getTrendingArticles(5),
    getAllCategories(true),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* ── Hero Grid ──────────────────────────────── */}
      {featured.length > 0 && (
        <section className="mb-10" aria-label="Featured articles">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Main feature — full height left column */}
            {featured[0] && (
              <div className="md:col-span-2">
                <ArticleCard
                  article={featured[0]}
                  variant="featured"
                  priority
                />
              </div>
            )}

            {/* Right column — 3 smaller features stacked */}
            <div className="flex flex-col gap-4">
              {featured.slice(1, 4).map((article) => (
                <div key={article.id} className="flex-1">
                  <ArticleCard article={article} variant="horizontal" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Section divider ────────────────────────── */}
      <Divider label="Latest Articles" href="/articles" />

      {/* ── Main + Sidebar layout ──────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Latest articles — 2/3 width */}
        <section className="lg:col-span-2" aria-label="Latest articles">
          {latest.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {latest.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
          {latest.length >= 9 && (
            <div className="mt-6 text-center">
              <Link
                href="/articles"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md
                           bg-[var(--brand-red)] text-white font-sans text-sm font-semibold
                           hover:bg-[var(--brand-red-dark)] transition-colors"
              >
                View All Articles →
              </Link>
            </div>
          )}
        </section>

        {/* Sidebar — 1/3 width */}
        <aside className="space-y-8">
          {/* Trending */}
          {trending.length > 0 && (
            <SidebarBox label="Trending Now">
              <div className="divide-y divide-[var(--surface-border)]">
                {trending.map((article, i) => (
                  <div key={article.id} className="py-2.5 flex gap-3 items-start">
                    <span
                      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center
                                    text-xs font-bold text-white"
                      style={{ backgroundColor: `hsl(${i * 30}, 70%, 40%)` }}
                    >
                      {i + 1}
                    </span>
                    <ArticleCard article={article} variant="compact" />
                  </div>
                ))}
              </div>
            </SidebarBox>
          )}

          {/* Categories cloud */}
          {categories.length > 0 && (
            <SidebarBox label="Browse Categories">
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full
                               text-xs font-sans font-semibold border transition-colors
                               hover:text-white"
                    style={{
                      borderColor: `${cat.color}50`,
                      color: cat.color,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor =
                        cat.color;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor =
                        "transparent";
                    }}
                  >
                    {cat.name}
                    {cat.count ? (
                      <span className="opacity-70">({cat.count})</span>
                    ) : null}
                  </Link>
                ))}
              </div>
            </SidebarBox>
          )}
        </aside>
      </div>
    </div>
  );
}

// ── Helper sub-components ──────────────────────────────────

function Divider({ label, href }: { label: string; href: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="w-1 h-6 bg-[var(--brand-red)] rounded-full" aria-hidden="true" />
      <h2 className="font-display font-bold text-xl text-[var(--text-primary)]">
        {label}
      </h2>
      <div className="flex-1 border-t border-[var(--surface-border)]" />
      <Link
        href={href}
        className="text-xs font-sans text-[var(--brand-red)] hover:underline whitespace-nowrap"
      >
        See all →
      </Link>
    </div>
  );
}

function SidebarBox({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[var(--surface-card)] border border-[var(--surface-border)] rounded-lg p-4">
      <h3
        className="font-display font-bold text-base text-[var(--text-primary)]
                      border-b border-[var(--surface-border)] pb-2.5 mb-3"
      >
        {label}
      </h3>
      {children}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-16 text-center">
      <p className="text-[var(--text-muted)] font-sans text-sm">
        No articles published yet. Check back soon.
      </p>
    </div>
  );
}

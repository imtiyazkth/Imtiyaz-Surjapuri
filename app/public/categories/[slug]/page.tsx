import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublishedArticles } from "@/lib/db/articles";
import { getCategoryBySlug, getAllCategories } from "@/lib/db/categories";
import ArticleCard from "@/components/article/ArticleCard";
import { buildCategoryMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 120;

export async function generateStaticParams() {
  const cats = await getAllCategories(true);
  return cats.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug);
  if (!cat) return {};
  return buildCategoryMetadata(cat.name, cat.description);
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const [category, articles] = await Promise.all([
    getCategoryBySlug(slug),
    getPublishedArticles({ category: slug, limit: 24 }),
  ]);

  if (!category) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 pb-5 border-b border-[var(--surface-border)]">
        <div className="flex items-center gap-3 mb-2">
          <span
            className="w-1 h-8 rounded-full"
            style={{ backgroundColor: category.color }}
            aria-hidden="true"
          />
          <h1
            className="font-display font-bold text-3xl text-[var(--text-primary)]"
          >
            {category.name}
          </h1>
        </div>
        {category.description && (
          <p className="font-sans text-[var(--text-muted)] text-sm ml-4">
            {category.description}
          </p>
        )}
        <p className="font-sans text-[var(--text-muted)] text-xs ml-4 mt-1">
          {articles.length} articles
        </p>
      </div>

      {/* Articles */}
      {articles.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-[var(--text-muted)] font-sans text-sm">
            No articles in this category yet.
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

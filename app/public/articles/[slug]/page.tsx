import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getArticleBySlug,
  getRelatedArticles,
  getAllPublishedSlugs,
} from "@/lib/db/articles";
import { buildArticleMetadata } from "@/lib/seo";
import ArticleCard from "@/components/article/ArticleCard";
import CategoryPill from "@/components/article/CategoryPill";
import ShareButtons from "@/components/article/ShareButtons";
import SocialLinks from "@/components/article/SocialLinks";
import JsonLd from "@/components/seo/JsonLd";
import ViewCounter from "@/components/article/ViewCounter";
import LikeButton from "@/components/article/LikeButton";
import { SITE_URL } from "@/lib/constants";
import { formatDistanceToNow, format } from "date-fns";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 300; // ISR — every 5 minutes

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return buildArticleMetadata(article);
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const related = await getRelatedArticles(article, 3);

  const pubDate = article.publishedAt
    ? new Date(article.publishedAt as string)
    : null;
  const formattedDate = pubDate
    ? format(pubDate, "MMMM d, yyyy")
    : "";
  const relativeDate = pubDate
    ? formatDistanceToNow(pubDate, { addSuffix: true })
    : "";
  const articleUrl = `${SITE_URL}/articles/${article.slug}`;

  return (
    <>
      {/* JSON-LD */}
      <JsonLd article={article} url={articleUrl} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* ── Article content ─────────────────────── */}
          <article className="lg:col-span-2">
            {/* Breadcrumbs */}
            <nav
              className="flex items-center gap-1.5 text-xs font-sans
                            text-[var(--text-muted)] mb-4"
              aria-label="Breadcrumb"
            >
              <Link href="/" className="hover:text-[var(--brand-red)] transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link
                href={`/categories/${article.categories?.[0]}`}
                className="hover:text-[var(--brand-red)] transition-colors capitalize"
              >
                {article.primaryCategory}
              </Link>
              <span>/</span>
              <span className="text-[var(--text-primary)] line-clamp-1">
                {article.title}
              </span>
            </nav>

            {/* Category + flags */}
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <CategoryPill
                name={article.primaryCategory}
                slug={article.categories?.[0]}
                color={article.catColor}
                size="sm"
              />
              {article.breaking && (
                <span className="cat-pill text-xs px-2.5 py-1 bg-[var(--brand-red)] text-white border-0">
                  Breaking
                </span>
              )}
              {article.trending && (
                <span className="cat-pill text-xs px-2.5 py-1 bg-[var(--brand-gold)] text-white border-0">
                  🔥 Trending
                </span>
              )}
            </div>

            {/* Title */}
            <h1
              className="font-display font-bold text-[var(--text-primary)]
                            text-2xl md:text-3xl lg:text-4xl leading-tight mb-4"
            >
              {article.title}
            </h1>

            {/* Excerpt */}
            <p
              className="font-serif text-[var(--text-secondary)] text-lg
                            leading-relaxed mb-5 italic border-l-4
                            border-[var(--brand-red)] pl-4"
            >
              {article.excerpt}
            </p>

            {/* Meta row */}
            <div
              className="flex items-center gap-4 flex-wrap
                            text-sm font-sans text-[var(--text-muted)]
                            border-y border-[var(--surface-border)] py-3 mb-6"
            >
              <span className="font-semibold text-[var(--text-primary)]">
                {article.author}
              </span>
              <span title={formattedDate}>{relativeDate}</span>
              <span>·</span>
              <span>{article.readTime} read</span>
              <span>·</span>
              <ViewCounter articleId={article.id} initial={article.viewCount} />
            </div>

            {/* Cover image */}
            {article.coverImage && (
              <figure className="mb-7 rounded-lg overflow-hidden">
                <Image
                  src={article.coverImage}
                  alt={article.coverImageAlt || article.title}
                  width={860}
                  height={490}
                  className="w-full object-cover"
                  priority
                />
              </figure>
            )}

            {/* Article body */}
            <div
              className="article-body"
              dangerouslySetInnerHTML={{ __html: article.contentHtml }}
            />

            {/* YouTube videos */}
            {article.youtubeLinks && article.youtubeLinks.length > 0 && (
              <div className="mt-8 space-y-4">
                <h3 className="font-display font-bold text-lg text-[var(--text-primary)]">
                  Watch
                </h3>
                {article.youtubeLinks.map((url, i) => (
                  <VideoEmbed key={i} url={url} />
                ))}
              </div>
            )}

            {/* Social links */}
            {article.socialLinks &&
              Object.values(article.socialLinks).some(Boolean) && (
                <div className="mt-8">
                  <SocialLinks links={article.socialLinks} />
                </div>
              )}

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${tag}`}
                    className="px-3 py-1.5 rounded-full text-xs font-sans font-medium
                               bg-[var(--surface-bg)] border border-[var(--surface-border)]
                               text-[var(--text-secondary)] hover:border-[var(--brand-red)]
                               hover:text-[var(--brand-red)] transition-colors"
                  >
                    # {tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Like + Share */}
            <div
              className="mt-8 pt-6 border-t border-[var(--surface-border)]
                            flex items-center justify-between flex-wrap gap-4"
            >
              <LikeButton articleId={article.id} initial={article.likeCount} />
              <ShareButtons
                url={articleUrl}
                title={article.title}
                whatsapp
              />
            </div>
          </article>

          {/* ── Sidebar ─────────────────────────────── */}
          <aside className="space-y-6">
            {/* Source links */}
            {article.sourceLinks && article.sourceLinks.length > 0 && (
              <div
                className="bg-[var(--surface-card)] border border-[var(--surface-border)]
                              rounded-lg p-4"
              >
                <h3 className="font-display font-bold text-sm mb-3 text-[var(--text-primary)]">
                  Sources
                </h3>
                <ul className="space-y-2">
                  {article.sourceLinks.map((s, i) => (
                    <li key={i}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-sans text-[var(--brand-red)]
                                   hover:underline flex items-start gap-1.5"
                      >
                        <span className="mt-0.5">↗</span>
                        <span>{s.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Related articles */}
            {related.length > 0 && (
              <div
                className="bg-[var(--surface-card)] border border-[var(--surface-border)]
                              rounded-lg p-4"
              >
                <h3 className="font-display font-bold text-sm mb-3 text-[var(--text-primary)] border-b border-[var(--surface-border)] pb-2">
                  Related Articles
                </h3>
                <div className="space-y-3">
                  {related.map((r) => (
                    <ArticleCard key={r.id} article={r} variant="compact" />
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}

function VideoEmbed({ url }: { url: string }) {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (!match) return null;
  const id = match[1];
  const embedUrl = `https://www.youtube-nocookie.com/embed/${id}`;

  return (
    <div className="relative rounded-lg overflow-hidden" style={{ paddingTop: "56.25%" }}>
      <iframe
        src={embedUrl}
        className="absolute inset-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        title="Embedded video"
      />
    </div>
  );
}

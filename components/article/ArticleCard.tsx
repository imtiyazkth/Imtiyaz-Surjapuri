import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import type { ArticleCard as ArticleCardType } from "@/types/article";
import CategoryPill from "./CategoryPill";
import { clsx } from "clsx";

interface ArticleCardProps {
  article: ArticleCardType;
  variant?: "default" | "horizontal" | "compact" | "featured";
  priority?: boolean;
}

function formatDate(raw: string | null): string {
  if (!raw) return "";
  try {
    const d = new Date(raw);
    return formatDistanceToNow(d, { addSuffix: true });
  } catch {
    return "";
  }
}

export default function ArticleCard({
  article,
  variant = "default",
  priority = false,
}: ArticleCardProps) {
  const href = `/articles/${article.slug}`;
  const date = formatDate(article.publishedAt as string);
  const catColor = article.catColor ?? "#C41C1C";

  // ── Featured (large hero card) ──────────────────────
  if (variant === "featured") {
    return (
      <article className="article-card group relative overflow-hidden rounded-lg h-full min-h-[420px] bg-[var(--surface-card)]">
        {/* Background image */}
        {article.coverImage && (
          <div className="absolute inset-0 article-card-image">
            <Image
              src={article.coverImage}
              alt={article.coverImageAlt || article.title}
              fill
              className="object-cover"
              priority={priority}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          </div>
        )}
        <Link href={href} className="absolute inset-0 z-10">
          <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
            <div className="mb-2 flex items-center gap-2 flex-wrap">
              {article.breaking && (
                <span className="cat-pill text-[0.6rem] px-2 py-0.5 bg-[var(--brand-red)] text-white border-0">
                  Breaking
                </span>
              )}
              <CategoryPill
                name={article.primaryCategory}
                color={catColor}
                size="xs"
              />
            </div>
            <h2
              className="font-display font-bold text-white leading-tight mb-2
                          text-xl md:text-2xl line-clamp-3 group-hover:underline
                          decoration-[var(--brand-red)] underline-offset-4"
            >
              {article.title}
            </h2>
            <p className="text-white/80 text-sm line-clamp-2 font-sans mb-3">
              {article.excerpt}
            </p>
            <div className="flex items-center gap-3 text-white/70 text-xs font-sans">
              <span>{article.author}</span>
              <span>·</span>
              <span>{date}</span>
              <span>·</span>
              <span>{article.readTime} read</span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  // ── Horizontal (sidebar / list view) ───────────────
  if (variant === "horizontal") {
    return (
      <article className="article-card group flex gap-3 rounded-lg overflow-hidden bg-[var(--surface-card)] border border-[var(--surface-border)] p-3">
        {article.coverImage && (
          <Link href={href} className="flex-shrink-0 article-card-image rounded-md overflow-hidden">
            <Image
              src={article.coverImage}
              alt={article.coverImageAlt || article.title}
              width={88}
              height={72}
              className="object-cover w-[88px] h-[72px]"
              sizes="88px"
            />
          </Link>
        )}
        <div className="flex-1 min-w-0">
          <CategoryPill
            name={article.primaryCategory}
            color={catColor}
            size="xs"
          />
          <Link href={href}>
            <h3
              className="font-display font-bold text-[0.9rem] leading-tight
                          text-[var(--text-primary)] mt-1 mb-1 line-clamp-2
                          group-hover:text-[var(--brand-red)] transition-colors"
            >
              {article.title}
            </h3>
          </Link>
          <p className="text-[var(--text-muted)] text-xs font-sans">
            {date} · {article.readTime}
          </p>
        </div>
      </article>
    );
  }

  // ── Compact (tight list, no image) ─────────────────
  if (variant === "compact") {
    return (
      <article className="article-card group border-b border-[var(--surface-border)] py-3 last:border-0">
        <div className="flex items-start gap-2">
          <span
            className="mt-1.5 flex-shrink-0 w-2 h-2 rounded-full"
            style={{ backgroundColor: catColor }}
            aria-hidden="true"
          />
          <div>
            <Link href={href}>
              <h3
                className="font-display font-semibold text-sm leading-snug
                            text-[var(--text-primary)] line-clamp-2
                            group-hover:text-[var(--brand-red)] transition-colors"
              >
                {article.title}
              </h3>
            </Link>
            <p className="text-[var(--text-muted)] text-xs font-sans mt-0.5">
              {date} · {article.readTime}
            </p>
          </div>
        </div>
      </article>
    );
  }

  // ── Default (vertical card with image on top) ───────
  return (
    <article
      className={clsx(
        "article-card group flex flex-col rounded-lg overflow-hidden",
        "bg-[var(--surface-card)] border border-[var(--surface-border)]"
      )}
    >
      {/* Cover image */}
      {article.coverImage && (
        <Link
          href={href}
          className="article-card-image block relative overflow-hidden"
          style={{ paddingTop: "60%" }}
        >
          <Image
            src={article.coverImage}
            alt={article.coverImageAlt || article.title}
            fill
            className="object-cover"
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {article.trending && (
            <span
              className="absolute top-2 right-2 cat-pill text-[0.6rem] px-2 py-0.5
                            bg-[var(--brand-gold)] text-white border-0"
            >
              🔥 Trending
            </span>
          )}
        </Link>
      )}

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <div className="mb-2">
          <CategoryPill
            name={article.primaryCategory}
            slug={article.categories?.[0]}
            color={catColor}
            size="xs"
          />
          {article.breaking && (
            <span
              className="ml-1.5 cat-pill text-[0.6rem] px-2 py-0.5
                            bg-[var(--brand-red)] text-white border-0"
            >
              Breaking
            </span>
          )}
        </div>

        <Link href={href} className="flex-1">
          <h2
            className="font-display font-bold text-[var(--text-primary)]
                        leading-snug text-[1rem] mb-2 line-clamp-3
                        group-hover:text-[var(--brand-red)] transition-colors"
          >
            {article.title}
          </h2>
          <p className="text-[var(--text-secondary)] text-sm line-clamp-2 font-serif">
            {article.excerpt}
          </p>
        </Link>

        {/* Meta */}
        <div className="mt-3 pt-3 border-t border-[var(--surface-border)] flex items-center justify-between text-xs text-[var(--text-muted)] font-sans">
          <span className="font-medium">{article.author}</span>
          <div className="flex items-center gap-2">
            <span>{date}</span>
            <span>·</span>
            <span>{article.readTime}</span>
            {article.viewCount > 0 && (
              <>
                <span>·</span>
                <span title="views">
                  👁 {article.viewCount.toLocaleString()}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

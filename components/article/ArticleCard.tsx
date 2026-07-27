"use client";

import Link from "next/link";
import Image from "next/image";
import { clsx } from "clsx";

interface ArticleCardProps {
  article: {
    id: string;
    slug: string;
    title: string;
    excerpt?: string;
    coverImage?: string;
    coverImageAlt?: string;
    primaryCategory: string;
    catColor?: string;
    author: string;
    readTime: string;
    publishedAt?: string | null;
    viewCount?: number;
    featured?: boolean;
    breaking?: boolean;
    trending?: boolean;
    categories?: string[];
    tags?: string[];
  };
  variant?: "default" | "horizontal" | "compact" | "featured";
  priority?: boolean;
}

function timeAgo(raw?: string | null): string {
  if (!raw) return "";
  try {
    const ms    = Date.now() - new Date(raw).getTime();
    const mins  = Math.floor(ms / 60000);
    const hours = Math.floor(ms / 3600000);
    const days  = Math.floor(ms / 86400000);
    if (mins < 60)  return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  } catch { return ""; }
}

export default function ArticleCard({
  article,
  variant = "default",
  priority = false,
}: ArticleCardProps) {
  const href  = `/articles/${article.slug}`;
  const date  = timeAgo(article.publishedAt);
  const color = article.catColor ?? "#C41C1C";

  // ── Featured (large overlay card) ─────────────────
  if (variant === "featured") {
    return (
      <article className="group relative overflow-hidden rounded-xl min-h-[380px] flex flex-col justify-end bg-gray-900">
        {article.coverImage && (
          <Image
            src={article.coverImage}
            alt={article.coverImageAlt || article.title}
            fill
            className="object-cover opacity-70 group-hover:opacity-80 transition-opacity"
            priority={priority}
            sizes="(max-width:768px) 100vw, 50vw"
          />
        )}
        <div className="relative z-10 p-5 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {article.breaking && (
              <span className="px-2 py-0.5 rounded text-[0.6rem] font-bold uppercase tracking-wider bg-red-600 text-white">
                Breaking
              </span>
            )}
            <span
              className="px-2 py-0.5 rounded text-[0.6rem] font-bold uppercase tracking-wider"
              style={{ background: `${color}25`, color, border: `1px solid ${color}50` }}
            >
              {article.primaryCategory}
            </span>
          </div>
          <Link href={href}>
            <h2 className="font-display font-bold text-white text-xl leading-tight mb-2 group-hover:underline decoration-red-500 underline-offset-3 line-clamp-3">
              {article.title}
            </h2>
          </Link>
          {article.excerpt && (
            <p className="text-white/70 text-sm font-sans line-clamp-2 mb-3">{article.excerpt}</p>
          )}
          <div className="flex items-center gap-2 text-white/60 text-xs font-sans">
            <span>{article.author}</span>
            {date && <><span>·</span><span>{date}</span></>}
            <span>·</span><span>{article.readTime} read</span>
          </div>
        </div>
      </article>
    );
  }

  // ── Horizontal (image left, text right) ───────────
  if (variant === "horizontal") {
    return (
      <article className="group flex gap-3 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3 hover:border-red-300 dark:hover:border-red-700 transition-colors">
        {article.coverImage && (
          <Link href={href} className="flex-shrink-0 rounded-lg overflow-hidden">
            <Image
              src={article.coverImage}
              alt={article.coverImageAlt || article.title}
              width={88}
              height={72}
              className="object-cover w-[88px] h-[72px] group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
        )}
        <div className="flex-1 min-w-0">
          <span
            className="inline-block px-2 py-0.5 rounded text-[0.6rem] font-bold uppercase tracking-wider mb-1"
            style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}
          >
            {article.primaryCategory}
          </span>
          <Link href={href}>
            <h3 className="font-display font-bold text-[0.9rem] leading-tight text-gray-900 dark:text-white mt-0.5 mb-1 line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
              {article.title}
            </h3>
          </Link>
          <p className="text-gray-400 text-xs font-sans">{date} · {article.readTime}</p>
        </div>
      </article>
    );
  }

  // ── Compact (no image, borderless list item) ───────
  if (variant === "compact") {
    return (
      <article className="group border-b border-gray-100 dark:border-gray-800 py-3 last:border-0">
        <div className="flex items-start gap-2">
          <span
            className="mt-1.5 flex-shrink-0 w-2 h-2 rounded-full"
            style={{ backgroundColor: color }}
          />
          <div>
            <Link href={href}>
              <h3 className="font-display font-semibold text-sm leading-snug text-gray-900 dark:text-white line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                {article.title}
              </h3>
            </Link>
            <p className="text-gray-400 text-xs font-sans mt-0.5">
              {date} · {article.readTime}
            </p>
          </div>
        </div>
      </article>
    );
  }

  // ── Default (vertical card with image on top) ──────
  return (
    <article className={clsx(
      "group flex flex-col rounded-xl overflow-hidden",
      "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800",
      "hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
    )}>
      {/* Cover image */}
      {article.coverImage && (
        <Link href={href} className="block overflow-hidden relative" style={{ paddingTop: "58%" }}>
          <Image
            src={article.coverImage}
            alt={article.coverImageAlt || article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-400"
            priority={priority}
            sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
          />
          {article.trending && (
            <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[0.6rem] font-bold bg-amber-500 text-white">
              🔥 Trending
            </span>
          )}
        </Link>
      )}

      {/* Card body */}
      <div className="flex flex-col flex-1 p-4">
        {/* Category + Breaking badge */}
        <div className="flex items-center gap-1.5 flex-wrap mb-2">
          {article.breaking && (
            <span className="px-2 py-0.5 rounded text-[0.6rem] font-bold uppercase tracking-wider bg-red-600 text-white">
              Breaking
            </span>
          )}
          <span
            className="px-2 py-0.5 rounded text-[0.6rem] font-bold uppercase tracking-wider"
            style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}
          >
            {article.primaryCategory}
          </span>
        </div>

        {/* Title + excerpt */}
        <Link href={href} className="flex-1">
          <h2 className="font-display font-bold text-gray-900 dark:text-white leading-snug text-[1rem] mb-2 line-clamp-3 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
            {article.title}
          </h2>
          {article.excerpt && (
            <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 font-sans">
              {article.excerpt}
            </p>
          )}
        </Link>

        {/* Meta row */}
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-400 font-sans">
          <span className="font-medium text-gray-600 dark:text-gray-300">{article.author}</span>
          <div className="flex items-center gap-2">
            {date && <span>{date}</span>}
            <span>·</span>
            <span>{article.readTime}</span>
            {(article.viewCount ?? 0) > 0 && (
              <><span>·</span><span title="views">👁 {article.viewCount!.toLocaleString()}</span></>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

import Link from "next/link";
import type { ArticleCard } from "@/types/article";

interface BreakingTickerProps {
  articles: ArticleCard[];
}

export default function BreakingTicker({ articles }: BreakingTickerProps) {
  if (!articles.length) return null;

  // Duplicate for seamless infinite loop
  const items = [...articles, ...articles];

  return (
    <div
      className="bg-[var(--surface-card)] border-b border-[var(--surface-border)]
                    flex items-stretch overflow-hidden"
      style={{ height: "var(--ticker-h)" }}
      aria-label="Breaking news"
    >
      {/* Label */}
      <div
        className="flex-shrink-0 flex items-center gap-2 px-3 z-10
                      bg-[var(--brand-red)] text-white"
        style={{ minWidth: "120px" }}
      >
        <span
          className="w-2 h-2 rounded-full bg-white animate-pulse-dot"
          aria-hidden="true"
        />
        <span className="text-xs font-sans font-bold tracking-widest uppercase whitespace-nowrap">
          Breaking
        </span>
      </div>

      {/* Scrolling track */}
      <div className="flex-1 overflow-hidden relative flex items-center">
        <div className="ticker-track flex items-center gap-0">
          {items.map((article, i) => (
            <Link
              key={`${article.id}-${i}`}
              href={`/articles/${article.slug}`}
              className="flex-shrink-0 flex items-center gap-2 px-5 text-sm
                         font-sans text-[var(--text-primary)]
                         hover:text-[var(--brand-red)] transition-colors
                         whitespace-nowrap"
            >
              <span className="text-[var(--brand-red)] font-bold" aria-hidden="true">
                ●
              </span>
              {article.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

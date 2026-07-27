"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TopBar from "@/components/layout/TopBar";

// ── Types (inline — avoids server-only type imports) ──────────
interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  coverImageAlt?: string;
  primaryCategory: string;
  catColor?: string;
  author: string;
  readTime: string;
  publishedAt: string | null;
  viewCount: number;
  featured: boolean;
  breaking: boolean;
  trending: boolean;
  tags: string[];
  categories: string[];
}

// ── Helpers ────────────────────────────────────────────────────
function timeAgo(raw: string | null): string {
  if (!raw) return "";
  try {
    const ms = Date.now() - new Date(raw).getTime();
    const mins  = Math.floor(ms / 60000);
    const hours = Math.floor(ms / 3600000);
    const days  = Math.floor(ms / 86400000);
    if (mins < 60)  return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  } catch { return ""; }
}

// ── Article Card (inline minimal version) ─────────────────────
function Card({ article, large = false }: { article: Article; large?: boolean }) {
  const href  = `/articles/${article.slug}`;
  const color = article.catColor ?? "#C41C1C";
  const date  = timeAgo(article.publishedAt);

  if (large) {
    return (
      <article className="group relative overflow-hidden rounded-xl min-h-[360px] flex flex-col justify-end bg-gray-900">
        {article.coverImage && (
          <Image
            src={article.coverImage}
            alt={article.coverImageAlt || article.title}
            fill
            className="object-cover opacity-70 group-hover:opacity-80 transition-opacity"
            priority
            sizes="(max-width:768px) 100vw, 60vw"
          />
        )}
        <div className="relative z-10 p-5 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
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
          <p className="text-white/70 text-sm font-sans line-clamp-2 mb-3">{article.excerpt}</p>
          <div className="flex items-center gap-2 text-white/60 text-xs font-sans">
            <span>{article.author}</span>
            <span>·</span><span>{date}</span>
            <span>·</span><span>{article.readTime} read</span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-lg transition-shadow">
      {article.coverImage && (
        <Link href={href} className="block overflow-hidden relative" style={{ paddingTop: "58%" }}>
          <Image
            src={article.coverImage}
            alt={article.coverImageAlt || article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
          />
        </Link>
      )}
      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {article.breaking && (
            <span className="px-2 py-0.5 rounded text-[0.6rem] font-bold uppercase tracking-wider bg-red-600 text-white">
              Breaking
            </span>
          )}
          {article.trending && (
            <span className="px-2 py-0.5 rounded text-[0.6rem] font-bold uppercase bg-amber-500 text-white">
              🔥 Trending
            </span>
          )}
          <span
            className="px-2 py-0.5 rounded text-[0.6rem] font-bold uppercase tracking-wider"
            style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}
          >
            {article.primaryCategory}
          </span>
        </div>
        <Link href={href} className="flex-1">
          <h2 className="font-display font-bold text-gray-900 dark:text-white leading-snug text-[1rem] mb-2 line-clamp-3 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
            {article.title}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 font-sans">
            {article.excerpt}
          </p>
        </Link>
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-400 font-sans">
          <span className="font-medium text-gray-600 dark:text-gray-300">{article.author}</span>
          <div className="flex items-center gap-2">
            <span>{date}</span>
            <span>·</span>
            <span>{article.readTime}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

// ── Skeleton loader ────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 animate-pulse">
      <div className="bg-gray-200 dark:bg-gray-800 h-48 w-full" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-4" />
      </div>
    </div>
  );
}

// ── Breaking ticker (client, no server data needed) ────────────
function Ticker({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;
  const items = [...articles, ...articles];
  return (
    <div className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 flex overflow-hidden h-10">
      <div className="flex-shrink-0 flex items-center gap-2 px-3 bg-red-600 text-white min-w-[110px]">
        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        <span className="text-xs font-bold uppercase tracking-widest whitespace-nowrap">Breaking</span>
      </div>
      <div className="flex-1 overflow-hidden flex items-center">
        <div className="flex items-center gap-0 whitespace-nowrap" style={{ animation: "ticker-scroll 50s linear infinite" }}>
          {items.map((a, i) => (
            <Link
              key={`${a.id}-${i}`}
              href={`/articles/${a.slug}`}
              className="flex-shrink-0 flex items-center gap-2 px-5 text-sm text-gray-700 dark:text-gray-300 hover:text-red-600 transition-colors"
            >
              <span className="text-red-600 font-bold">●</span>
              {a.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Category pill navigation ───────────────────────────────────
const CATEGORIES = [
  "Analysis","Breaking News","Opinion","Politics","Economy",
  "Technology","Education","Social Issues","World","Blog",
];

// ══════════════════════════════════════════════════════════════
//  MAIN PAGE
// ══════════════════════════════════════════════════════════════
export default function HomePage() {
  const [articles,  setArticles]  = useState<Article[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    async function fetchArticles() {
      try {
        // Fetch from the API route — no Admin SDK on client
        const res = await fetch("/api/articles?limit=18");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setArticles(data.articles ?? []);
      } catch (err) {
        console.error("Failed to fetch articles:", err);
        setError("Could not load articles. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  // Filter by active category tab
  const filtered =
    activeTab === "All"
      ? articles
      : articles.filter((a) =>
          a.primaryCategory === activeTab ||
          a.categories?.includes(activeTab.toLowerCase().replace(/ /g, "-"))
        );

  const featured  = articles.filter((a) => a.featured).slice(0, 1);
  const breaking  = articles.filter((a) => a.breaking).slice(0, 5);
  const mainFeed  = activeTab === "All" ? articles.slice(0, 15) : filtered;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <TopBar />
      <Header />

      {/* Breaking ticker */}
      {!loading && breaking.length > 0 && <Ticker articles={breaking} />}

      {/* Category nav */}
      <nav className="bg-red-600 text-white overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-0">
          {["All", ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`flex-shrink-0 px-3.5 py-2.5 text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-colors ${
                activeTab === cat
                  ? "bg-red-800 text-white"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
          <Link
            href="/articles"
            className="flex-shrink-0 ml-auto px-3.5 py-2.5 text-xs font-bold uppercase tracking-wide text-white/80 hover:text-white hover:bg-white/10 whitespace-nowrap"
          >
            All Articles →
          </Link>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">

        {/* Error state */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-sans">
            {error}
          </div>
        )}

        {/* Loading skeleton grid */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} />)}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* ── Hero section ─────────────────────────── */}
            {activeTab === "All" && featured.length > 0 && (
              <section className="mb-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="md:col-span-2">
                    <Card article={featured[0]} large />
                  </div>
                  <div className="flex flex-col gap-4">
                    {articles
                      .filter((a) => !a.featured)
                      .slice(0, 3)
                      .map((a) => (
                        <article key={a.id} className="flex gap-3 items-start p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-red-300 transition-colors group">
                          {a.coverImage && (
                            <Link href={`/articles/${a.slug}`} className="flex-shrink-0">
                              <Image
                                src={a.coverImage}
                                alt={a.title}
                                width={84}
                                height={68}
                                className="rounded-lg object-cover w-[84px] h-[68px]"
                              />
                            </Link>
                          )}
                          <div className="flex-1 min-w-0">
                            <span
                              className="text-[0.6rem] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                              style={{ background: `${a.catColor ?? "#C41C1C"}20`, color: a.catColor ?? "#C41C1C" }}
                            >
                              {a.primaryCategory}
                            </span>
                            <Link href={`/articles/${a.slug}`}>
                              <h3 className="font-display font-bold text-sm text-gray-900 dark:text-white mt-1 line-clamp-2 group-hover:text-red-600 transition-colors">
                                {a.title}
                              </h3>
                            </Link>
                            <p className="text-xs text-gray-400 font-sans mt-1">{timeAgo(a.publishedAt)} · {a.readTime}</p>
                          </div>
                        </article>
                      ))}
                  </div>
                </div>
              </section>
            )}

            {/* ── Section label ────────────────────────── */}
            <div className="flex items-center gap-3 mb-6">
              <span className="w-1 h-6 bg-red-600 rounded-full" />
              <h2 className="font-display font-bold text-xl text-gray-900 dark:text-white">
                {activeTab === "All" ? "Latest Articles" : activeTab}
              </h2>
              <div className="flex-1 border-t border-gray-200 dark:border-gray-800" />
              <Link href="/articles" className="text-xs text-red-600 hover:underline whitespace-nowrap font-sans">
                See all →
              </Link>
            </div>

            {/* ── Main article grid ────────────────────── */}
            {mainFeed.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-gray-500 dark:text-gray-400 font-sans text-base">
                  No articles in this category yet.
                </p>
                <button
                  onClick={() => setActiveTab("All")}
                  className="mt-4 text-red-600 hover:underline font-sans text-sm"
                >
                  ← Show all articles
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {mainFeed.map((article) => (
                  <Card key={article.id} article={article} />
                ))}
              </div>
            )}

            {/* ── Load more button ─────────────────────── */}
            {mainFeed.length >= 15 && (
              <div className="mt-10 text-center">
                <Link
                  href="/articles"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-red-600 text-white font-sans text-sm font-semibold hover:bg-red-700 transition-colors"
                >
                  View All Articles →
                </Link>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

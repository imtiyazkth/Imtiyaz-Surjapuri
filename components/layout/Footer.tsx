"use client";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

// Categories is optional — homepage renders Footer without server data
const DEFAULT_CATEGORIES = [
  { slug: "analysis",      name: "Analysis" },
  { slug: "breaking-news", name: "Breaking News" },
  { slug: "opinion",       name: "Opinion" },
  { slug: "politics",      name: "Politics" },
  { slug: "economy",       name: "Economy" },
  { slug: "technology",    name: "Technology" },
  { slug: "education",     name: "Education" },
];

interface FooterProps {
  categories?: { id?: string; slug: string; name: string }[];
}

export default function Footer({ categories }: FooterProps) {
  const year = new Date().getFullYear();
  const cats = categories ?? DEFAULT_CATEGORIES;

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/">
              <h2 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-2">
                {SITE_NAME}
              </h2>
            </Link>
            <p className="font-sans text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">
              Independent journalism, analysis, and commentary covering India,
              the Gulf, and the world.
            </p>
            {/* Social links */}
            <div className="flex gap-3 mt-4">
              {[
                { href: "https://twitter.com/", label: "X", icon: "𝕏" },
                { href: "https://facebook.com/", label: "Facebook", icon: "f" },
                { href: "https://youtube.com/", label: "YouTube", icon: "▶" },
                { href: "https://wa.me/", label: "WhatsApp", icon: "💬" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-full flex items-center justify-center
                             bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                             text-gray-500 hover:text-red-600 hover:border-red-400
                             transition-colors text-xs font-bold"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-display font-bold text-sm text-gray-900 dark:text-white mb-3 uppercase tracking-wide">
              Categories
            </h3>
            <ul className="space-y-1.5">
              {cats.slice(0, 7).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="font-sans text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pages */}
          <div>
            <h3 className="font-display font-bold text-sm text-gray-900 dark:text-white mb-3 uppercase tracking-wide">
              Pages
            </h3>
            <ul className="space-y-1.5">
              {[
                { href: "/",         label: "Home" },
                { href: "/articles", label: "All Articles" },
                { href: "/search",   label: "Search" },
                { href: "/about",    label: "About" },
                { href: "/contact",  label: "Contact" },
                { href: "/admin/login", label: "Admin" },
              ].map((p) => (
                <li key={p.href}>
                  <Link
                    href={p.href}
                    className="font-sans text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 transition-colors"
                  >
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-100 dark:border-gray-800 pt-6 flex flex-col sm:flex-row
                        items-center justify-between gap-3 text-xs font-sans text-gray-400">
          <p>© {year} {SITE_NAME}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-red-600 transition-colors">Privacy Policy</Link>
            <Link href="/terms"   className="hover:text-red-600 transition-colors">Terms</Link>
            <span>{SITE_URL.replace("https://", "")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

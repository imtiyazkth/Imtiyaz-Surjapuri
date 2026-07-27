import Link from "next/link";
import type { Category } from "@/types/category";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/constants";

interface FooterProps {
  categories: Category[];
}

export default function Footer({ categories }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--surface-border)] bg-[var(--surface-card)] mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/">
              <h2 className="font-display font-bold text-xl text-[var(--text-primary)] mb-2">
                {SITE_NAME}
              </h2>
            </Link>
            <p className="font-sans text-sm text-[var(--text-muted)] leading-relaxed max-w-xs">
              {SITE_TAGLINE}. Independent journalism, analysis, and commentary
              covering India, the Gulf, and the world.
            </p>
            {/* Social icons */}
            <div className="flex gap-3 mt-4">
              {[
                { href: "https://twitter.com/ImtiyazSurjapuri", label: "X/Twitter", icon: "𝕏" },
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
                             bg-[var(--surface-bg)] border border-[var(--surface-border)]
                             text-[var(--text-muted)] hover:text-[var(--brand-red)]
                             hover:border-[var(--brand-red)] transition-colors text-xs font-bold"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-display font-bold text-sm text-[var(--text-primary)] mb-3 uppercase tracking-wide">
              Categories
            </h3>
            <ul className="space-y-1.5">
              {categories.slice(0, 7).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="font-sans text-sm text-[var(--text-muted)]
                               hover:text-[var(--brand-red)] transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pages */}
          <div>
            <h3 className="font-display font-bold text-sm text-[var(--text-primary)] mb-3 uppercase tracking-wide">
              Pages
            </h3>
            <ul className="space-y-1.5">
              {[
                { href: "/",         label: "Home" },
                { href: "/articles", label: "All Articles" },
                { href: "/search",   label: "Search" },
                { href: "/about",    label: "About" },
                { href: "/contact",  label: "Contact" },
              ].map((p) => (
                <li key={p.href}>
                  <Link
                    href={p.href}
                    className="font-sans text-sm text-[var(--text-muted)]
                               hover:text-[var(--brand-red)] transition-colors"
                  >
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[var(--surface-border)] pt-6 flex flex-col sm:flex-row
                        items-center justify-between gap-3 text-xs font-sans text-[var(--text-muted)]">
          <p>© {year} {SITE_NAME}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-[var(--brand-red)] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[var(--brand-red)] transition-colors">
              Terms
            </Link>
            <a
              href={SITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--brand-red)] transition-colors"
            >
              {SITE_URL.replace("https://", "")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

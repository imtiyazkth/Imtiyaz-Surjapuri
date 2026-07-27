import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "404 — Page Not Found" };

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8"
         style={{ background: "var(--surface-bg)" }}>
      <div className="text-center max-w-md">
        <p className="font-display font-bold text-8xl text-[var(--brand-red)] mb-4">
          404
        </p>
        <h1 className="font-display font-bold text-2xl text-[var(--text-primary)] mb-3">
          Page not found
        </h1>
        <p className="font-sans text-[var(--text-muted)] text-sm mb-8">
          The article or page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-lg bg-[var(--brand-red)] text-white
                       font-sans text-sm font-semibold hover:bg-[var(--brand-red-dark)]
                       transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/articles"
            className="px-5 py-2.5 rounded-lg border border-[var(--surface-border)]
                       text-[var(--text-secondary)] font-sans text-sm font-semibold
                       hover:border-[var(--brand-red)] hover:text-[var(--brand-red)]
                       transition-colors"
          >
            Browse Articles
          </Link>
        </div>
      </div>
    </div>
  );
}

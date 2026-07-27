import Link from "next/link";
import SearchBar from "@/components/layout/SearchBar";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export default function Header() {
  return (
    <header
      className="bg-[var(--surface-card)] border-b border-[var(--surface-border)]
                    sticky top-0 z-30"
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo / Site name */}
        <Link href="/" className="flex-shrink-0">
          <h1
            className="font-display font-bold text-2xl leading-none
                          text-[var(--text-primary)] hover:text-[var(--brand-red)]
                          transition-colors"
          >
            {SITE_NAME}
          </h1>
          <p
            className="font-sans text-[0.65rem] text-[var(--text-muted)]
                          tracking-widest uppercase mt-0.5 hidden sm:block"
          >
            {SITE_TAGLINE}
          </p>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-sm">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}

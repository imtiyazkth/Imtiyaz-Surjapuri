"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { Category } from "@/types/category";
import { clsx } from "clsx";

interface NavbarProps {
  categories: Category[];
}

export default function Navbar({ categories }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    ...categories.slice(0, 8).map((c) => ({
      href: `/categories/${c.slug}`,
      label: c.name,
    })),
  ];

  return (
    <nav
      className="bg-[var(--brand-red)] text-white z-20"
      aria-label="Category navigation"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Desktop */}
        <div className="hidden md:flex items-center overflow-x-auto gap-0">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "flex-shrink-0 px-3.5 py-2.5 text-xs font-sans font-semibold",
                  "tracking-wide uppercase transition-colors whitespace-nowrap",
                  isActive
                    ? "bg-[var(--brand-red-dark)] text-white"
                    : "hover:bg-white/10 text-white/90 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/articles"
            className="flex-shrink-0 ml-auto px-3.5 py-2.5 text-xs font-sans
                       font-semibold tracking-wide uppercase hover:bg-white/10
                       text-white/90 hover:text-white transition-colors whitespace-nowrap"
          >
            All Articles →
          </Link>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center justify-between h-10">
          <span className="text-xs font-sans font-bold tracking-widest uppercase">
            Menu
          </span>
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-label="Open navigation"
            className="p-1"
          >
            <span className="text-lg">{mobileOpen ? "✕" : "☰"}</span>
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-white/20 pb-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-2 py-2 text-sm font-sans font-medium
                           hover:bg-white/10 rounded"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/articles"
              onClick={() => setMobileOpen(false)}
              className="block px-2 py-2 text-sm font-sans font-semibold
                         hover:bg-white/10 rounded mt-1 border-t border-white/20 pt-2"
            >
              All Articles →
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

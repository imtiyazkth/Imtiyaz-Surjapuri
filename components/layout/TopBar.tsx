"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    const next = !isDark;
    root.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setIsDark(next);
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="w-7 h-7 rounded-full flex items-center justify-center
                 bg-[var(--surface-border)] hover:bg-[var(--brand-red)]
                 text-[var(--text-secondary)] hover:text-white
                 transition-colors text-sm"
    >
      {isDark ? "☀" : "🌙"}
    </button>
  );
}

export default function TopBar() {
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    setDateStr(
      new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );
  }, []);

  return (
    <div
      className="h-9 border-b border-[var(--surface-border)]
                    bg-[var(--surface-card)] text-[var(--text-muted)]"
      style={{ fontSize: "0.72rem" }}
    >
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <span className="hidden sm:block font-sans">{dateStr}</span>
        <span className="font-sans font-semibold tracking-widest uppercase text-[var(--brand-red)]">
          {SITE_NAME}
        </span>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/login"
            className="hover:text-[var(--brand-red)] transition-colors"
            aria-label="Admin login"
          >
            Admin
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}

"use client";
import { useEffect, useRef, useState } from "react";

// ── View Counter ───────────────────────────────────────
export default function ViewCounter({
  articleId,
  initial,
}: {
  articleId: string;
  initial: number;
}) {
  const [views, setViews] = useState(initial);
  const counted = useRef(false);

  useEffect(() => {
    if (counted.current) return;
    counted.current = true;

    // Increment view count server-side
    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: articleId }),
    })
      .then((r) => r.json())
      .then((d) => { if (d.views) setViews(d.views); })
      .catch(() => {});
  }, [articleId]);

  return (
    <span
      className="flex items-center gap-1 text-xs font-sans text-[var(--text-muted)]"
      title={`${views.toLocaleString()} views`}
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      {views.toLocaleString()}
    </span>
  );
}

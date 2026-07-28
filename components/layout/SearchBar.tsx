"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const [q, setQ] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const t = q.trim();
    if (t.length > 1) { router.push(`/search?q=${encodeURIComponent(t)}`); setQ(""); }
  };

  return (
    <form onSubmit={submit} className="search-form">
      <input
        type="search" value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search articles…"
        aria-label="Search"
        className="search-input"
      />
      <button type="submit" aria-label="Search" className="search-btn">
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
      </button>
    </form>
  );
}

"use client";
import { useEffect, useState } from "react";

export default function LikeButton({
  articleId,
  initial,
}: {
  articleId: string;
  initial: number;
}) {
  const key = `liked_${articleId}`;
  const [likes, setLikes] = useState(initial);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLiked(localStorage.getItem(key) === "1");
  }, [key]);

  const toggle = async () => {
    if (loading) return;
    setLoading(true);
    const delta = liked ? -1 : 1;
    try {
      const r = await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: articleId, delta }),
      });
      const d = await r.json();
      if (d.likes !== undefined) {
        setLikes(d.likes);
        setLiked(!liked);
        if (!liked) {
          localStorage.setItem(key, "1");
        } else {
          localStorage.removeItem(key);
        }
      }
    } catch {}
    setLoading(false);
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-label={liked ? "Unlike article" : "Like article"}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full
                  text-sm font-sans font-semibold border transition-all
                  ${liked
                    ? "bg-[var(--brand-red)] text-white border-[var(--brand-red)]"
                    : "border-[var(--surface-border)] text-[var(--text-secondary)] hover:border-[var(--brand-red)] hover:text-[var(--brand-red)]"
                  }
                  ${loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span>{liked ? "❤️" : "🤍"}</span>
      <span>{likes.toLocaleString()}</span>
      <span>{liked ? "Liked" : "Like"}</span>
    </button>
  );
}

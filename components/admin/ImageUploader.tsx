"use client";
import { useState } from "react";
import Image from "next/image";

interface ImageUploaderProps {
  currentUrl?: string;
  onUpload: (url: string) => void;
  onInsert?: (url: string) => void;
  label?: string;
}

// Validate that a URL looks like an image link
function looksLikeImage(url: string): boolean {
  try {
    const u = new URL(url);
    const path = u.pathname.toLowerCase();
    // Accept common image extensions OR known image CDN hostnames
    const hasImageExt = /\.(jpg|jpeg|png|gif|webp|avif|svg)(\?.*)?$/.test(path);
    const isImageCdn  = [
      "images.unsplash.com",
      "res.cloudinary.com",
      "i.imgur.com",
      "i.ytimg.com",
      "lh3.googleusercontent.com",
      "firebasestorage.googleapis.com",
    ].some((h) => u.hostname.includes(h));
    return hasImageExt || isImageCdn;
  } catch {
    return false;
  }
}

export default function ImageUploader({
  currentUrl,
  onUpload,
  onInsert,
  label = "Image URL",
}: ImageUploaderProps) {
  const [urlInput, setUrlInput]   = useState(currentUrl ?? "");
  const [preview,  setPreview]    = useState(currentUrl ?? "");
  const [error,    setError]      = useState("");
  const [loading,  setLoading]    = useState(false);

  const applyUrl = (url: string) => {
    setError("");
    const trimmed = url.trim();
    if (!trimmed) {
      setError("Please enter a URL.");
      return;
    }
    // Basic URL validation
    try { new URL(trimmed); } catch {
      setError("Not a valid URL. Must start with https://");
      return;
    }
    setLoading(true);
    setPreview(trimmed);
    onUpload(trimmed);
    setTimeout(() => setLoading(false), 600);
  };

  const handleInsert = () => {
    if (preview && onInsert) onInsert(preview);
  };

  const handleRemove = () => {
    setUrlInput("");
    setPreview("");
    onUpload("");
    setError("");
  };

  return (
    <div className="space-y-3">
      {/* Label */}
      <p className="text-xs font-sans font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {label}
      </p>

      {/* URL input row */}
      <div className="flex gap-2">
        <input
          type="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applyUrl(urlInput)}
          placeholder="https://images.unsplash.com/photo-... or https://i.imgur.com/..."
          className="flex-1 h-10 px-3 rounded-lg text-sm font-sans
                     bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700
                     text-gray-900 dark:text-white placeholder:text-gray-400
                     focus:outline-none focus:ring-2 focus:ring-red-500 transition"
        />
        <button
          type="button"
          onClick={() => applyUrl(urlInput)}
          disabled={!urlInput.trim() || loading}
          className="px-4 h-10 rounded-lg bg-red-600 text-white text-sm font-sans
                     font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors
                     whitespace-nowrap"
        >
          {loading ? "…" : "Use URL"}
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-500 font-sans">{error}</p>
      )}

      {/* Tip */}
      <p className="text-xs text-gray-400 font-sans">
        💡 Tip: Paste any image URL from Unsplash, Cloudinary, Imgur, Google Images, etc.
        No file upload needed.
      </p>

      {/* Preview */}
      {preview && (
        <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
          <Image
            src={preview}
            alt="Image preview"
            width={600}
            height={300}
            className="w-full object-cover max-h-52"
            onError={() => {
              setError("Could not load that image URL. Try a different link.");
              setPreview("");
            }}
          />
          {/* Action buttons overlay */}
          <div className="absolute top-2 right-2 flex gap-1.5">
            {onInsert && (
              <button
                type="button"
                onClick={handleInsert}
                className="px-2.5 py-1 rounded text-xs bg-black/60 text-white hover:bg-black/80 font-sans transition-colors"
              >
                Insert in article
              </button>
            )}
            <button
              type="button"
              onClick={handleRemove}
              className="px-2.5 py-1 rounded text-xs bg-red-600/80 text-white hover:bg-red-700 font-sans transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Common image source links */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-gray-400 font-sans">Quick sources:</span>
        {[
          { label: "Unsplash",   href: "https://unsplash.com" },
          { label: "Cloudinary", href: "https://cloudinary.com" },
          { label: "Imgur",      href: "https://imgur.com/upload" },
        ].map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-red-600 hover:underline font-sans"
          >
            {s.label} ↗
          </a>
        ))}
      </div>
    </div>
  );
}

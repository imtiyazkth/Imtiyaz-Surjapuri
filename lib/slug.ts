/**
 * Generate a URL-safe slug from a title.
 * Handles Unicode, multiple spaces, and special chars.
 */
export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")   // strip diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")     // strip non-alphanumeric
    .replace(/\s+/g, "-")             // spaces → hyphens
    .replace(/-+/g, "-")             // collapse multiple hyphens
    .replace(/^-|-$/g, "");           // trim leading/trailing hyphens
}

/**
 * Generate a unique slug by appending a timestamp if needed.
 */
export function uniqueSlug(text: string): string {
  const base = slugify(text);
  const suffix = Date.now().toString(36).slice(-4);
  return `${base}-${suffix}`;
}

/**
 * Estimate reading time from HTML or plain text content.
 * Average adult reading speed: 238 words per minute.
 */
export function estimateReadTime(html: string): string {
  // Strip HTML tags to count actual words
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const wordCount = text.split(" ").filter(Boolean).length;
  const minutes = Math.ceil(wordCount / 238);
  return `${Math.max(1, minutes)} min`;
}

/**
 * Convert a YouTube watch URL or short URL to embed URL.
 * Returns null if not a valid YouTube URL.
 */
export function toYouTubeEmbed(url: string): string | null {
  try {
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (!match) return null;
    return `https://www.youtube-nocookie.com/embed/${match[1]}`;
  } catch {
    return null;
  }
}

/**
 * Client-side HTML sanitizer — no external dependencies.
 * Strips XSS vectors before dangerouslySetInnerHTML.
 */

const ALLOWED_TAGS = new Set([
  "p","br","hr","h1","h2","h3","h4","h5","h6",
  "ul","ol","li","strong","em","b","i","u","s","mark",
  "blockquote","pre","code","kbd",
  "a","img","figure","figcaption",
  "table","thead","tbody","tr","th","td",
  "div","span",
  "iframe",
]);

const DANGEROUS_EVENT = /^on[a-z]+$/i;
const DANGEROUS_URI   = /^(javascript|data|vbscript):/i;
const YOUTUBE_RE      = /^https:\/\/www\.youtube(-nocookie)?\.com\/embed\/[\w-]+(\?.*)?$/;

export function sanitizeHtmlClient(dirty: string): string {
  // Server-side: return as-is (no DOM available)
  if (typeof window === "undefined" || !dirty) return dirty ?? "";

  try {
    const tpl      = document.createElement("template");
    tpl.innerHTML  = dirty;
    const fragment = tpl.content;

    // Walk all elements
    const elements = Array.from(fragment.querySelectorAll("*"));
    for (const el of elements) {
      const tag = el.tagName.toLowerCase();

      // Remove disallowed tags (keep their text content)
      if (!ALLOWED_TAGS.has(tag)) {
        el.replaceWith(...Array.from(el.childNodes));
        continue;
      }

      // iframes: only YouTube embeds
      if (tag === "iframe") {
        const src = el.getAttribute("src") ?? "";
        if (!YOUTUBE_RE.test(src)) {
          el.remove();
          continue;
        }
      }

      // Remove dangerous attributes
      for (const attr of Array.from(el.attributes)) {
        const name  = attr.name.toLowerCase();
        const value = attr.value;
        if (
          DANGEROUS_EVENT.test(name) ||
          ((name === "href" || name === "src") && DANGEROUS_URI.test(value.trim()))
        ) {
          el.removeAttribute(attr.name);
        }
      }

      // Add safe target/rel to external links
      if (tag === "a") {
        const href = el.getAttribute("href") ?? "";
        if (href.startsWith("http") || href.startsWith("//")) {
          el.setAttribute("target", "_blank");
          el.setAttribute("rel", "noopener noreferrer");
        }
      }
    }

    const out    = document.createElement("div");
    out.appendChild(fragment);
    return out.innerHTML;
  } catch {
    // If anything fails, return empty string (fail safe)
    return "";
  }
}

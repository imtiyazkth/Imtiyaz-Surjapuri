/**
 * Server-side HTML sanitisation using DOMPurify + jsdom.
 * Run this before storing contentHtml to Firestore.
 * The client should also sanitise before dangerouslySetInnerHTML.
 */

import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";
import { YOUTUBE_EMBED_RE } from "@/lib/constants";

function createServerDOMPurify() {
  const { window } = new JSDOM("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return DOMPurify(window as any);
}

const ALLOWED_TAGS = [
  "h1", "h2", "h3", "h4", "h5", "h6",
  "p", "br", "hr",
  "ul", "ol", "li",
  "strong", "em", "u", "s", "mark",
  "blockquote", "pre", "code",
  "a", "img",
  "table", "thead", "tbody", "tr", "th", "td",
  "div", "span", "figure", "figcaption",
  "iframe",  // allowed only for YouTube (see hook below)
];

const ALLOWED_ATTR = [
  "href", "src", "alt", "title", "class", "id",
  "target", "rel",
  "width", "height",
  "loading",
  "allowfullscreen", "frameborder",
  // YouTube iframe only
  "allow",
];

/**
 * Sanitise article HTML content before writing to Firestore.
 * Strips all scripts, event handlers, and unsafe iframes.
 * Only allows YouTube iframes.
 */
export function sanitizeHtml(dirty: string): string {
  const purify = createServerDOMPurify();

  purify.addHook("uponSanitizeElement", (node, data) => {
    if (data.tagName === "iframe") {
      const src = (node as HTMLIFrameElement).getAttribute("src") ?? "";
      if (!YOUTUBE_EMBED_RE.test(src)) {
        // Remove non-YouTube iframes entirely
        node.parentNode?.removeChild(node);
      }
    }
  });

  return purify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ADD_ATTR: ["allowfullscreen"],
    FORCE_BODY: true,
    RETURN_DOM: false,
  });
}

/**
 * Sanitise a plain text excerpt (strip all HTML).
 */
export function sanitizeText(text: string): string {
  const purify = createServerDOMPurify();
  return purify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}

/**
 * Client-side: sanitise before dangerouslySetInnerHTML.
 * Uses browser's own DOMPurify (no jsdom needed).
 */
export function sanitizeHtmlClient(dirty: string): string {
  if (typeof window === "undefined") return dirty;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const purify = require("dompurify");
  return purify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ADD_ATTR: ["allowfullscreen"],
  });
}

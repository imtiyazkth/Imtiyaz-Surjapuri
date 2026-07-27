import type { Metadata } from "next";
import type { Article } from "@/types/article";
import {
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
  TWITTER_HANDLE,
  DEFAULT_OG_IMAGE,
} from "@/lib/constants";

export function buildSiteMetadata(): Metadata {
  return {
    title: {
      default: `${SITE_NAME} — ${SITE_TAGLINE}`,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_TAGLINE,
    metadataBase: new URL(SITE_URL),
    openGraph: {
      siteName: SITE_NAME,
      locale: "en_IN",
      type: "website",
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      site: TWITTER_HANDLE,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export function buildArticleMetadata(article: Article): Metadata {
  const canonical = `${SITE_URL}/articles/${article.slug}`;
  const image = article.coverImage || DEFAULT_OG_IMAGE;
  const pubDate =
    article.publishedAt instanceof Object &&
    "toDate" in (article.publishedAt as object)
      ? // Firestore Timestamp
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (article.publishedAt as any).toDate().toISOString()
      : String(article.publishedAt ?? "");

  return {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
    alternates: { canonical },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      url: canonical,
      publishedTime: pubDate,
      authors: [article.author],
      images: [{ url: image, width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [image],
    },
  };
}

export function buildCategoryMetadata(
  name: string,
  description?: string
): Metadata {
  return {
    title: `${name} — News & Analysis`,
    description:
      description ||
      `Read the latest ${name.toLowerCase()} articles on ${SITE_NAME}.`,
  };
}

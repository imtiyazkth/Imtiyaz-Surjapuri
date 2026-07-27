import type { Article } from "@/types/article";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

interface JsonLdProps {
  article: Article;
  url: string;
}

export default function JsonLd({ article, url }: JsonLdProps) {
  const pubDate =
    article.publishedAt
      ? new Date(article.publishedAt as string).toISOString()
      : undefined;

  const schema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    datePublished: pubDate,
    dateModified: new Date(article.updatedAt as string).toISOString(),
    author: {
      "@type": "Person",
      name: article.author,
      url: `${SITE_URL}/about`,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icons/icon-512.png`,
      },
    },
    image: article.coverImage
      ? {
          "@type": "ImageObject",
          url: article.coverImage,
          width: 1200,
          height: 630,
        }
      : undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
    keywords: article.tags?.join(", "),
    articleSection: article.primaryCategory,
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

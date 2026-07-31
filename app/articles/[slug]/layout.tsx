import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    // Fetch from our own API to get article data server-side
    const res  = await fetch(
      `${SITE_URL}/api/articles?limit=100`,
      { next: { revalidate: 300 } }
    );
    const data = await res.json();
    const list = data.articles ?? [];

    const article = list.find(
      (a: { slug: string; id: string }) =>
        a.slug === slug || a.id === slug
    );

    if (!article) {
      return {
        title: "Article Not Found",
        description: "This article does not exist.",
      };
    }

    const image = article.coverImage || `${SITE_URL}/og-default.jpg`;

    return {
      title:       article.title,
      description: article.excerpt || article.title,
      openGraph: {
        title:       article.title,
        description: article.excerpt || article.title,
        url:         `${SITE_URL}/articles/${article.slug}`,
        siteName:    SITE_NAME,
        type:        "article",
        // This is what Facebook/WhatsApp/Twitter use for preview image
        images: [
          {
            url:    image,
            width:  1200,
            height: 630,
            alt:    article.title,
          },
        ],
      },
      twitter: {
        card:        "summary_large_image",
        title:       article.title,
        description: article.excerpt || article.title,
        images:      [image],
      },
    };
  } catch {
    return {
      title:       SITE_NAME,
      description: "Independent News, Analysis & Commentary",
    };
  }
}

export default function ArticleDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

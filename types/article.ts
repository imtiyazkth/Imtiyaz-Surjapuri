import { Timestamp } from "firebase-admin/firestore";

export type ArticleStatus = "draft" | "published" | "archived" | "scheduled";

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  whatsapp?: string;
  website?: string;
}

export interface Article {
  id: string;
  slug: string;

  // Content
  title: string;
  excerpt: string;
  contentHtml: string;
  contentMarkdown?: string;

  // Media
  coverImage: string;
  coverImageAlt: string;
  images?: string[];
  youtubeLinks?: string[];

  // Taxonomy
  categories: string[];       // category slugs
  primaryCategory: string;    // first/main category
  catColor?: string;          // denormalised for fast render
  tags: string[];

  // Author
  author: string;
  authorId?: string;

  // Status & flags
  status: ArticleStatus;
  featured: boolean;
  breaking: boolean;
  trending: boolean;

  // SEO
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;

  // Stats
  viewCount: number;
  likeCount: number;
  readTime: string;

  // Social & external links
  socialLinks?: SocialLinks;
  sourceLinks?: { label: string; url: string }[];

  // Timestamps (Firestore Timestamp on server, string on client after JSON serialisation)
  publishedAt: Timestamp | string | null;
  scheduledAt?: Timestamp | string | null;
  createdAt: Timestamp | string;
  updatedAt: Timestamp | string;
}

// Lightweight version for card lists (no contentHtml)
export type ArticleCard = Omit<Article, "contentHtml" | "contentMarkdown">;

// Create/Edit form payload (no server-set fields)
export type ArticleInput = Omit<
  Article,
  "id" | "viewCount" | "likeCount" | "createdAt" | "updatedAt" | "publishedAt"
> & {
  publishedAt?: string | null;
};

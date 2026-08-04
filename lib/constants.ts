export const SITE_NAME = "ISurjapuri";
export const SITE_TAGLINE = "Independent News, Analysis & Commentary";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://imtiyazsurjapuri.com";
export const TWITTER_HANDLE =
  process.env.NEXT_PUBLIC_TWITTER_HANDLE || "@ImtiyazSurjapuri";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`;

export const POSTS_PER_PAGE = 12;
export const ADMIN_POSTS_PER_PAGE = 20;

// Session cookie settings
export const SESSION_COOKIE_NAME = "session";
export const SESSION_DURATION_DAYS = 14;
export const SESSION_DURATION_MS = SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000;

// Rate limiting
export const CONTACT_RATE_LIMIT = 3; // submissions per hour per IP
export const LIKE_RATE_LIMIT = 1;    // like per article per visitor

// Allowed domains for social/source links
export const ALLOWED_SOCIAL_DOMAINS = [
  "facebook.com",
  "www.facebook.com",
  "instagram.com",
  "www.instagram.com",
  "x.com",
  "www.x.com",
  "twitter.com",
  "www.twitter.com",
  "youtube.com",
  "www.youtube.com",
  "youtu.be",
  "whatsapp.com",
  "www.whatsapp.com",
  "wa.me",
  "isurjapuri.com",
  "www.isurjapuri.com",
];

// Allowed YouTube embed patterns
export const YOUTUBE_EMBED_RE =
  /^https:\/\/(www\.)?youtube(-nocookie)?\.com\/embed\/[\w-]+(\?.*)?$/;
export const YOUTUBE_URL_RE =
  /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

// Default article categories
export const DEFAULT_CATEGORIES = [
  { name: "Analysis", slug: "analysis", color: "#0f766e", order: 1 },
  { name: "Breaking News", slug: "breaking-news", color: "#C41C1C", order: 2 },
  { name: "Opinion", slug: "opinion", color: "#b45309", order: 3 },
  { name: "Politics", slug: "politics", color: "#7c3aed", order: 4 },
  { name: "Economy", slug: "economy", color: "#15803d", order: 5 },
  { name: "Technology", slug: "technology", color: "#0369a1", order: 6 },
  { name: "Education", slug: "education", color: "#9333ea", order: 7 },
  { name: "Social Issues", slug: "social-issues", color: "#be185d", order: 8 },
  { name: "World", slug: "world", color: "#b45309", order: 9 },
  { name: "Blog", slug: "blog", color: "#6366f1", order: 10 },
  { name: "Video", slug: "video", color: "#dc2626", order: 11 },
  { name: "Photos", slug: "photos", color: "#d97706", order: 12 },
  { name: "Health", slug: "health", color: "#059669", order: 13 },
  { name: "Sports", slug: "sports", color: "#2563eb", order: 14 },
];

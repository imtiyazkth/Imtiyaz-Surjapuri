import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  // Allow all external image hostnames
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http",  hostname: "**" },
    ],
  },

  async headers() {
    return [
      {
        // Apply security headers to ALL routes
        source: "/(.*)",
        headers: [
          // Prevent clickjacking
          {
            key:   "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          // Prevent MIME type sniffing
          {
            key:   "X-Content-Type-Options",
            value: "nosniff",
          },
          // Control referrer info
          {
            key:   "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Disable browser features not needed
          {
            key:   "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          // Force HTTPS for 1 year
          {
            key:   "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          // Content Security Policy
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Scripts: self + Next.js inline + Google Analytics
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://pagead2.googlesyndication.com",
              // Styles: self + Google Fonts + inline (Tailwind)
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Fonts: self + Google Fonts CDN
              "font-src 'self' https://fonts.gstatic.com",
              // Images: self + Firebase Storage + CDN sources
              "img-src 'self' data: blob: https://firebasestorage.googleapis.com https://images.unsplash.com https://i.ytimg.com https://lh3.googleusercontent.com https://res.cloudinary.com https://i.imgur.com https://*.githubusercontent.com",
              // Media
              "media-src 'self' https://firebasestorage.googleapis.com",
              // Connect: self + Firebase
              "connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://firestore.googleapis.com wss://*.firebaseio.com",
              // Frames: YouTube only
              "frame-src https://www.youtube-nocookie.com https://www.youtube.com",
              // No plugins
              "object-src 'none'",
              // Base URI restriction
              "base-uri 'self'",
              // Form submissions only to self
              "form-action 'self'",
            ].join("; "),
          },
          // Prevent XSS in older browsers
          {
            key:   "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
      {
        // Cache static assets aggressively
        source: "/_next/static/(.*)",
        headers: [
          {
            key:   "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

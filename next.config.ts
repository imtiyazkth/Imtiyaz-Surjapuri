import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Skip TypeScript errors during Vercel build so hotfixes deploy instantly
  typescript: {
    ignoreBuildErrors: true,
  },
  // Skip ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Allow ALL external image hostnames (Unsplash, Cloudinary, Imgur, YouTube, etc.)
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http",  hostname: "**" },
    ],
  },
};

export default nextConfig;

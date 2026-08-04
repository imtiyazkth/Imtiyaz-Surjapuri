import type { Metadata } from "next";
import "./globals.css";
import { ThemeScript } from "@/components/layout/ThemeScript";
import ScrollProgress from "@/components/layout/ScrollProgress";

export const metadata: Metadata = {
  title: {
    default:  "ISurjapuri — Independent News, Analysis & Commentary",
    template: "%s | ISurjapuri",
  },
  description:
    "Independent journalism, analysis, and commentary covering India, the Gulf, and the world. Speaking truth without fear.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://imtiyaz-site.vercel.app"
  ),
  openGraph: {
    type:        "website",
    siteName:    "ISurjapuri",
    title:       "ISurjapuri — Independent News, Analysis & Commentary",
    description: "Independent journalism, analysis, and commentary covering India, the Gulf, and the world.",
    // Default OG image — shown when no article image is available
    images: [
      {
        url:    "https://raw.githubusercontent.com/imtiyazkth/QRaksha/main/docs/assets/Imtiyaz-Surjapuri.png",
        width:  1200,
        height: 630,
        alt:    "ISurjapuri",
      },
    ],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "ISurjapuri",
    description: "Independent News, Analysis & Commentary",
    images: [
      "https://raw.githubusercontent.com/imtiyazkth/QRaksha/main/docs/assets/Imtiyaz-Surjapuri.png"
    ],
  },
  robots: {
    index:  true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#C41C1C" />
      </head>
      <body>
        <ThemeScript />
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}

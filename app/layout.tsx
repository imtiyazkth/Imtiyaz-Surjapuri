import type { Metadata } from "next";
import { Playfair_Display, Source_Serif_4, DM_Sans } from "next/font/google";
import "./globals.css";
import { buildSiteMetadata } from "@/lib/seo";
import ScrollProgress from "@/components/layout/ScrollProgress";
import { ThemeScript } from "@/components/layout/ThemeScript";

// ── Font loading via next/font (zero layout shift) ──
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "600", "700", "800"],
  style: ["normal", "italic"],
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = buildSiteMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${sourceSerif.variable} ${dmSans.variable}`}
    >
      <head>
        {/* Preconnect to Firebase Storage */}
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#C41C1C" />
      </head>
      <body>
        {/* Inline script prevents dark mode flash before hydration */}
        <ThemeScript />
        {/* Reading progress bar */}
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}

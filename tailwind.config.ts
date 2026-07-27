import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Brand editorial palette
        brand: {
          red: "#C41C1C",
          "red-dark": "#A01515",
          "red-light": "#E03030",
          gold: "#B8860B",
          dark: "#1A1208",
        },
        // Surface tones (light)
        surface: {
          50: "#F7F4EF",
          100: "#EEEAE3",
          200: "#DDD9D2",
          300: "#C5BFB8",
          400: "#8A8278",
          500: "#4A4540",
          900: "#0F0D0A",
        },
        // Dark mode surfaces
        dark: {
          50: "#0C0A07",
          100: "#141108",
          200: "#1A1710",
          300: "#2A2418",
          400: "#3A3228",
          500: "#6A6258",
          600: "#B0A89C",
          900: "#F2EDE4",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        serif: ["var(--font-source-serif)", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "2xs": ["0.65rem", { lineHeight: "1rem" }],
      },
      boxShadow: {
        card: "0 1px 4px rgba(0,0,0,0.06)",
        "card-hover": "0 4px 20px rgba(0,0,0,0.09)",
        "card-lift": "0 12px 48px rgba(0,0,0,0.13)",
      },
      animation: {
        "ticker-scroll": "ticker-scroll 40s linear infinite",
        "fade-up": "fade-up 0.3s ease both",
        "pulse-dot": "pulse-dot 1.5s ease-in-out infinite",
      },
      keyframes: {
        "ticker-scroll": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
      },
      typography: {
        editorial: {
          css: {
            "--tw-prose-body": "#4A4540",
            "--tw-prose-headings": "#0F0D0A",
            "--tw-prose-links": "#C41C1C",
            "--tw-prose-bold": "#0F0D0A",
            "--tw-prose-quotes": "#4A4540",
            "--tw-prose-quote-borders": "#C41C1C",
            "font-family": "var(--font-source-serif)",
            "font-size": "1.0625rem",
            "line-height": "1.85",
            h2: {
              "font-family": "var(--font-playfair)",
              "font-weight": "700",
              "font-size": "1.35rem",
              "margin-top": "2rem",
            },
            h3: {
              "font-family": "var(--font-playfair)",
              "font-weight": "600",
            },
            blockquote: {
              "border-left-color": "#C41C1C",
              "background": "#F7F4EF",
              padding: "1rem 1.25rem",
              "border-radius": "4px",
            },
          },
        },
      },
    },
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("@tailwindcss/typography"),
  ],
};

export default config;

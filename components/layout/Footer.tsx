"use client";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const DEFAULT_CATEGORIES = [
  { slug: "analysis",      name: "Analysis" },
  { slug: "breaking-news", name: "Breaking News" },
  { slug: "opinion",       name: "Opinion" },
  { slug: "politics",      name: "Politics" },
  { slug: "economy",       name: "Economy" },
  { slug: "technology",    name: "Technology" },
  { slug: "education",     name: "Education" },
];

interface FooterProps {
  categories?: { id?: string; slug: string; name: string }[];
}

export default function Footer({ categories }: FooterProps) {
  const year = new Date().getFullYear();
  const cats = categories ?? DEFAULT_CATEGORIES;

  const SOCIALS = [
    { href: "https://www.facebook.com/ImtiyaSurjapuri",   label: "Facebook",  icon: "f",  color: "#1877F2" },
    { href: "https://www.instagram.com/ImtiyazSurjapuri", label: "Instagram", icon: "📸", color: "#E1306C" },
    { href: "https://x.com/Imtiyazkth",                   label: "X",         icon: "𝕏",  color: "#000"    },
    { href: "https://youtube.com/@imtiyazvedio",           label: "YouTube",   icon: "▶",  color: "#FF0000" },
  ];

  return (
    <footer style={{ background:"var(--bg-card)", borderTop:"1px solid var(--border)", marginTop:"48px" }}>
      <div style={{ maxWidth:"1280px", margin:"0 auto", padding:"36px 16px 20px" }}>
        <div className="footer-grid" style={{ marginBottom:"28px" }}>
          {/* Brand */}
          <div style={{ gridColumn:"span 2" }}>
            <Link href="/">
              <h2 style={{ fontFamily:"var(--font-playfair)", fontWeight:800, fontSize:"1.2rem", color:"var(--text-1)", marginBottom:"8px" }}>
                {SITE_NAME}
              </h2>
            </Link>
            <p style={{ fontSize:"0.83rem", color:"var(--text-3)", lineHeight:1.6, maxWidth:"280px", marginBottom:"16px" }}>
              Independent journalism, analysis, and commentary covering India, the Gulf, and the world.
            </p>
            {/* Social icons */}
            <div style={{ display:"flex", gap:"10px", flexWrap:"wrap" }}>
              {SOCIALS.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    width:"36px", height:"36px", borderRadius:"50%",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    background: s.color, color:"#fff",
                    fontSize:"0.85rem", fontWeight:700, textDecoration:"none",
                    transition:"opacity 0.15s"
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 style={{ fontFamily:"var(--font-playfair)", fontWeight:700, fontSize:"0.85rem",
              color:"var(--text-1)", marginBottom:"12px", textTransform:"uppercase", letterSpacing:"0.07em" }}>
              Categories
            </h3>
            <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:"8px" }}>
              {cats.slice(0, 7).map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/categories/${cat.slug}`}
                    style={{ fontSize:"0.83rem", color:"var(--text-3)", transition:"color 0.15s" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--brand-red)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-3)")}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pages */}
          <div>
            <h3 style={{ fontFamily:"var(--font-playfair)", fontWeight:700, fontSize:"0.85rem",
              color:"var(--text-1)", marginBottom:"12px", textTransform:"uppercase", letterSpacing:"0.07em" }}>
              Pages
            </h3>
            <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:"8px" }}>
              {[
                { href:"/",         label:"Home" },
                { href:"/articles", label:"All Articles" },
                { href:"/search",   label:"Search" },
                { href:"/about",    label:"About" },
                { href:"/contact",  label:"Contact" },
              ].map((p) => (
                <li key={p.href}>
                  <Link href={p.href}
                    style={{ fontSize:"0.83rem", color:"var(--text-3)", transition:"color 0.15s" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--brand-red)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-3)")}
                  >
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop:"1px solid var(--border)", paddingTop:"16px",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          flexWrap:"wrap", gap:"10px", fontSize:"0.75rem", color:"var(--text-3)"
        }}>
          <p>© {year} {SITE_NAME}. All rights reserved.</p>
          <div style={{ display:"flex", gap:"16px" }}>
            <Link href="/privacy" style={{ color:"var(--text-3)" }}>Privacy Policy</Link>
            <Link href="/terms"   style={{ color:"var(--text-3)" }}>Terms</Link>
            <span>{SITE_URL.replace("https://","")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

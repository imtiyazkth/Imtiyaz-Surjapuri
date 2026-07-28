import Link from "next/link";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "404 — Page Not Found" };

export default function NotFound() {
  return (
    <div className="notfound">
      <div style={{ textAlign:"center", maxWidth:"420px" }}>
        <div style={{
          width:"80px", height:"80px", borderRadius:"50%",
          background:"rgba(196,28,28,0.1)", display:"flex",
          alignItems:"center", justifyContent:"center",
          margin:"0 auto 20px", fontSize:"2rem"
        }}>
          🔍
        </div>
        <p style={{
          fontFamily:"var(--font-playfair)", fontWeight:800,
          fontSize:"4.5rem", color:"var(--brand-red)",
          lineHeight:1, marginBottom:"8px"
        }}>
          404
        </p>
        <h1 style={{
          fontFamily:"var(--font-playfair)", fontWeight:700,
          fontSize:"1.4rem", color:"var(--text-1)", marginBottom:"10px"
        }}>
          Page not found
        </h1>
        <p style={{ fontSize:"0.88rem", color:"var(--text-3)", marginBottom:"28px", lineHeight:1.6 }}>
          The article or page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div style={{ display:"flex", gap:"12px", justifyContent:"center", flexWrap:"wrap" }}>
          <Link
            href="/"
            className="btn-primary"
          >
            Go Home
          </Link>
          <Link
            href="/articles"
            className="btn-outline"
          >
            Browse Articles
          </Link>
        </div>
      </div>
    </div>
  );
}

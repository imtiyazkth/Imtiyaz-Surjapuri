"use client";

import Link from "next/link";
import SearchBar from "@/components/layout/SearchBar";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" style={{ textDecoration:"none", flexShrink:0 }}>
          <h1 className="site-logo" style={{
            fontWeight:800, fontSize:"1.4rem", lineHeight:1,
            color:"var(--text-1)", transition:"color 0.15s"
          }}
          onMouseEnter={(e)=>((e.currentTarget as HTMLElement).style.color="var(--brand-red)")}
          onMouseLeave={(e)=>((e.currentTarget as HTMLElement).style.color="var(--text-1)")}
          >
            {SITE_NAME}
          </h1>
          <p style={{
            fontSize:"0.6rem", color:"var(--text-3)",
            letterSpacing:"0.1em", textTransform:"uppercase",
            marginTop:"2px"
          }}>
            {SITE_TAGLINE}
          </p>
        </Link>
        <div style={{ flex:1, maxWidth:"320px", marginLeft:"auto" }}>
          <SearchBar />
        </div>
      </div>
    </header>
  );
}

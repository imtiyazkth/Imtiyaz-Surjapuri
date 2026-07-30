"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

export default function TopBar() {
  const [dateStr, setDateStr] = useState("");
  const [isDark,  setIsDark]  = useState(false);

  useEffect(() => {
    setDateStr(
      new Date().toLocaleDateString("en-IN", {
        weekday:"long", year:"numeric", month:"long", day:"numeric"
      })
    );
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setIsDark(next);
  };

  return (
    <div className="topbar">
      <div className="topbar-inner">
        {/* Date - hidden on mobile */}
        <span style={{ display:"none", fontSize:"0.7rem" }} className="date-str">
          {dateStr}
        </span>

        {/* Site name - center */}
        <span style={{
          fontFamily:"var(--font-playfair)", fontWeight:700,
          fontSize:"0.78rem", letterSpacing:"0.12em",
          textTransform:"uppercase", color:"var(--brand-red)"
        }}>
          {SITE_NAME}
        </span>

        {/* Right: shield icon (discreet admin) + dark mode toggle */}
        <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
          {/* 🛡️ Shield = Admin (invisible to casual visitors) */}
          <Link
            href="/admin/login"
            title="Admin Panel"
            aria-label="Admin Panel"
            style={{
              width:"28px", height:"28px", borderRadius:"50%",
              display:"flex", alignItems:"center", justifyContent:"center",
              background:"transparent", border:"none",
              cursor:"pointer", fontSize:"0.9rem",
              textDecoration:"none", color:"var(--text-3)",
              transition:"color 0.15s",
              lineHeight:1
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--brand-red)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-3)")}
          >
            🛡️
          </Link>

          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Light mode" : "Dark mode"}
          >
            {isDark ? "☀" : "🌙"}
          </button>
        </div>
      </div>
    </div>
  );
}

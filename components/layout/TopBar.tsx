"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

export default function TopBar() {
  const [dateStr, setDateStr] = useState("");
  const [isDark,  setIsDark]  = useState(false);

  useEffect(() => {
    setDateStr(new Date().toLocaleDateString("en-IN", {
      weekday:"long", year:"numeric", month:"long", day:"numeric"
    }));
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
        <span style={{ display:"none" }} className="md-show">{dateStr}</span>
        <span style={{
          fontFamily:"var(--font-playfair)", fontWeight:700,
          fontSize:"0.78rem", letterSpacing:"0.12em",
          textTransform:"uppercase", color:"var(--brand-red)"
        }}>
          {SITE_NAME}
        </span>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <Link href="/admin/login" style={{ color:"var(--text-3)", fontSize:"0.72rem", transition:"color 0.15s" }}
            onMouseEnter={(e)=>((e.target as HTMLElement).style.color="var(--brand-red)")}
            onMouseLeave={(e)=>((e.target as HTMLElement).style.color="var(--text-3)")}
          >
            Admin
          </Link>
          <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
            {isDark ? "☀" : "🌙"}
          </button>
        </div>
      </div>
    </div>
  );
}

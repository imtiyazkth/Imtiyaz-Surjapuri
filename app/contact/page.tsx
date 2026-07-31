"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

const SOCIALS = [
  {
    name:    "Facebook",
    href:    "https://www.facebook.com/ImtiyaSurjapuri",
    color:   "#1877F2",
    bg:      "#E8F0FE",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.1 24 18.1 24 12.07z"/>
      </svg>
    ),
  },
  {
    name:    "Instagram",
    href:    "https://www.instagram.com/ImtiyazSurjapuri",
    color:   "#E1306C",
    bg:      "#FCE4EC",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
  {
    name:    "X (Twitter)",
    href:    "https://x.com/Imtiyazkth",
    color:   "#000000",
    bg:      "#F5F5F5",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    name:    "YouTube",
    href:    "https://youtube.com/@imtiyazvedio",
    color:   "#FF0000",
    bg:      "#FFEBEE",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    name:    "Email",
    href:    "mailto:supportsurjapuri@gmail.com",
    color:   "#EA4335",
    bg:      "#FFEBEE",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" width="24" height="24">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/>
      </svg>
    ),
    label: "supportsurjapuri@gmail.com",
  },
];

export default function ContactPage() {
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent,    setSent]    = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate send (replace with your email service later)
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
    setLoading(false);
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", background:"var(--bg)" }}>
      <TopBar />
      <Header />

      <main style={{ flex:1 }}>
        <div className="main-container" style={{ maxWidth:"900px" }}>

          {/* Page header */}
          <div style={{ marginBottom:"40px", textAlign:"center" }}>
            <h1 style={{
              fontFamily:"var(--font-playfair)", fontWeight:800,
              fontSize:"clamp(1.8rem,4vw,2.5rem)",
              color:"var(--text-1)", marginBottom:"12px"
            }}>
              Get in Touch
            </h1>
            <p style={{
              fontSize:"1rem", color:"var(--text-2)",
              maxWidth:"520px", margin:"0 auto", lineHeight:1.7
            }}>
              Have a story tip, feedback, or collaboration idea?
              Reach out through any of the channels below.
            </p>
          </div>

          <div style={{
            display:"grid",
            gridTemplateColumns:"1fr",
            gap:"32px"
          }}>
            {/* Social / Contact channels */}
            <div>
              <h2 style={{
                fontFamily:"var(--font-playfair)", fontWeight:700,
                fontSize:"1.2rem", color:"var(--text-1)",
                marginBottom:"20px"
              }}>
                Connect With Me
              </h2>

              <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                {SOCIALS.map((s) => (
                  
                    key={s.name}
                    href={s.href}
                    target={s.href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    style={{
                      display:"flex", alignItems:"center", gap:"16px",
                      padding:"16px 20px", borderRadius:"14px",
                      background:"var(--bg-card)",
                      border:"1px solid var(--border)",
                      textDecoration:"none", transition:"all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = s.color;
                      (e.currentTarget as HTMLElement).style.transform = "translateX(4px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                      (e.currentTarget as HTMLElement).style.transform = "translateX(0)";
                    }}
                  >
                    {/* Icon circle */}
                    <div style={{
                      width:"48px", height:"48px", borderRadius:"50%",
                      background: s.bg,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      color: s.color, flexShrink:0,
                    }}>
                      {s.icon}
                    </div>

                    {/* Text */}
                    <div>
                      <p style={{
                        fontWeight:700, fontSize:"0.95rem",
                        color:"var(--text-1)", marginBottom:"2px"
                      }}>
                        {s.name}
                      </p>
                      <p style={{ fontSize:"0.78rem", color:"var(--text-3)" }}>
                        {s.label ?? s.href.replace("https://", "").replace("mailto:", "")}
                      </p>
                    </div>

                    {/* Arrow */}
                    <span style={{
                      marginLeft:"auto", color: s.color,
                      fontSize:"1.2rem", fontWeight:700
                    }}>→</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Contact form */}
            <div>
              <h2 style={{
                fontFamily:"var(--font-playfair)", fontWeight:700,
                fontSize:"1.2rem", color:"var(--text-1)",
                marginBottom:"20px"
              }}>
                Send a Message
              </h2>

              {sent ? (
                <div style={{
                  textAlign:"center", padding:"48px 24px",
                  background:"var(--bg-card)",
                  border:"1px solid #bbf7d0", borderRadius:"16px"
                }}>
                  <p style={{ fontSize:"3rem", marginBottom:"12px" }}>✅</p>
                  <h3 style={{
                    fontFamily:"var(--font-playfair)", fontWeight:700,
                    fontSize:"1.2rem", color:"var(--text-1)", marginBottom:"8px"
                  }}>
                    Message Sent!
                  </h3>
                  <p style={{ color:"var(--text-3)", fontSize:"0.88rem" }}>
                    Thank you for reaching out. I&apos;ll get back to you soon.
                  </p>
                  <button onClick={() => { setSent(false); setName(""); setEmail(""); setSubject(""); setMessage(""); }}
                    style={{
                      marginTop:"20px", background:"none",
                      border:"none", color:"var(--brand-red)",
                      cursor:"pointer", fontSize:"0.88rem",
                      textDecoration:"underline", fontFamily:"var(--font-sans)"
                    }}>
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}
                  style={{
                    background:"var(--bg-card)", border:"1px solid var(--border)",
                    borderRadius:"16px", padding:"24px",
                    display:"flex", flexDirection:"column", gap:"16px"
                  }}>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
                    <div>
                      <label style={lbl}>Your Name</label>
                      <input type="text" value={name}
                        onChange={(e) => setName(e.target.value)}
                        required placeholder="Md Imtiyaz…"
                        className="admin-input" />
                    </div>
                    <div>
                      <label style={lbl}>Email Address</label>
                      <input type="email" value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required placeholder="you@example.com"
                        className="admin-input" />
                    </div>
                  </div>

                  <div>
                    <label style={lbl}>Subject</label>
                    <input type="text" value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required placeholder="Story tip / Feedback / Collaboration"
                      className="admin-input" />
                  </div>

                  <div>
                    <label style={lbl}>Message</label>
                    <textarea value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required placeholder="Write your message here…"
                      rows={5} className="admin-input"
                      style={{ height:"auto", resize:"vertical", padding:"10px 12px" }} />
                  </div>

                  <button type="submit" disabled={loading} className="btn-primary"
                    style={{ height:"44px", fontSize:"0.9rem", justifyContent:"center" }}>
                    {loading ? "Sending…" : "📨 Send Message"}
                  </button>

                  <p style={{ fontSize:"0.75rem", color:"var(--text-3)", textAlign:"center" }}>
                    Or email directly:{" "}
                    <a href="mailto:supportsurjapuri@gmail.com"
                      style={{ color:"var(--brand-red)" }}>
                      supportsurjapuri@gmail.com
                    </a>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

const lbl: React.CSSProperties = {
  display:"block", fontSize:"0.72rem", fontWeight:700,
  textTransform:"uppercase", letterSpacing:"0.06em",
  color:"var(--text-3)", marginBottom:"6px"
};

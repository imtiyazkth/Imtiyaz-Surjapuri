"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const SOCIALS = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/ImtiyaSurjapuri",
    color: "#1877F2",
    bg: "#E8F0FE",
    label: "facebook.com/ImtiyaSurjapuri",
    emoji: "📘",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/ImtiyazSurjapuri",
    color: "#E1306C",
    bg: "#FCE4EC",
    label: "instagram.com/ImtiyazSurjapuri",
    emoji: "📸",
  },
  {
    name: "X (Twitter)",
    href: "https://x.com/Imtiyazkth",
    color: "#000000",
    bg: "#F5F5F5",
    label: "x.com/Imtiyazkth",
    emoji: "𝕏",
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@imtiyazvedio",
    color: "#FF0000",
    bg: "#FFEBEE",
    label: "youtube.com/@imtiyazvedio",
    emoji: "▶",
  },
  {
    name: "Email",
    href: "mailto:supportsurjapuri@gmail.com",
    color: "#EA4335",
    bg: "#FFEBEE",
    label: "supportsurjapuri@gmail.com",
    emoji: "✉",
  },
];

const lbl: React.CSSProperties = {
  display: "block",
  fontSize: "0.72rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "var(--text-3)",
  marginBottom: "6px",
};

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
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <TopBar />
      <Header />

      <main style={{ flex: 1 }}>
        <div className="main-container" style={{ maxWidth: "900px" }}>

          {/* Page header */}
          <div style={{ marginBottom: "40px", textAlign: "center" }}>
            <h1 style={{
              fontFamily: "var(--font-playfair)",
              fontWeight: 800,
              fontSize: "clamp(1.8rem,4vw,2.5rem)",
              color: "var(--text-1)",
              marginBottom: "12px",
            }}>
              Get in Touch
            </h1>
            <p style={{
              fontSize: "1rem",
              color: "var(--text-2)",
              maxWidth: "520px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}>
              Have a story tip, feedback, or collaboration idea?
              Reach out through any of the channels below.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "32px" }}>

            {/* ── Social channels ── */}
            <div>
              <h2 style={{
                fontFamily: "var(--font-playfair)",
                fontWeight: 700,
                fontSize: "1.2rem",
                color: "var(--text-1)",
                marginBottom: "20px",
              }}>
                Connect With Me
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {SOCIALS.map((s) => (
                  
                    key={s.name}
                    href={s.href}
                    target={s.href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      padding: "16px 20px",
                      borderRadius: "14px",
                      background: "var(--bg-card)",
                      border: "1px solid var(--border)",
                      textDecoration: "none",
                      transition: "all 0.2s",
                    }}
                  >
                    {/* Icon circle */}
                    <div style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      background: s.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: s.color,
                      flexShrink: 0,
                      fontSize: "1.4rem",
                      fontWeight: 700,
                    }}>
                      {s.emoji}
                    </div>

                    {/* Text */}
                    <div style={{ flex: 1 }}>
                      <p style={{
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        color: "var(--text-1)",
                        marginBottom: "2px",
                      }}>
                        {s.name}
                      </p>
                      <p style={{ fontSize: "0.78rem", color: "var(--text-3)" }}>
                        {s.label}
                      </p>
                    </div>

                    {/* Arrow */}
                    <span style={{ color: s.color, fontSize: "1.2rem", fontWeight: 700 }}>
                      →
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* ── Contact form ── */}
            <div>
              <h2 style={{
                fontFamily: "var(--font-playfair)",
                fontWeight: 700,
                fontSize: "1.2rem",
                color: "var(--text-1)",
                marginBottom: "20px",
              }}>
                Send a Message
              </h2>

              {sent ? (
                <div style={{
                  textAlign: "center",
                  padding: "48px 24px",
                  background: "var(--bg-card)",
                  border: "1px solid #bbf7d0",
                  borderRadius: "16px",
                }}>
                  <p style={{ fontSize: "3rem", marginBottom: "12px" }}>✅</p>
                  <h3 style={{
                    fontFamily: "var(--font-playfair)",
                    fontWeight: 700,
                    fontSize: "1.2rem",
                    color: "var(--text-1)",
                    marginBottom: "8px",
                  }}>
                    Message Sent!
                  </h3>
                  <p style={{ color: "var(--text-3)", fontSize: "0.88rem" }}>
                    Thank you for reaching out. I&apos;ll get back to you soon.
                  </p>
                  <button
                    onClick={() => {
                      setSent(false);
                      setName("");
                      setEmail("");
                      setSubject("");
                      setMessage("");
                    }}
                    style={{
                      marginTop: "20px",
                      background: "none",
                      border: "none",
                      color: "var(--brand-red)",
                      cursor: "pointer",
                      fontSize: "0.88rem",
                      textDecoration: "underline",
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "16px",
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={lbl}>Your Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Your name"
                        className="admin-input"
                      />
                    </div>
                    <div>
                      <label style={lbl}>Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="you@example.com"
                        className="admin-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label style={lbl}>Subject</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                      placeholder="Story tip / Feedback / Collaboration"
                      className="admin-input"
                    />
                  </div>

                  <div>
                    <label style={lbl}>Message</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      placeholder="Write your message here…"
                      rows={5}
                      className="admin-input"
                      style={{ height: "auto", resize: "vertical", padding: "10px 12px" }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                    style={{ height: "44px", fontSize: "0.9rem", justifyContent: "center" }}
                  >
                    {loading ? "Sending…" : "📨 Send Message"}
                  </button>

                  <p style={{ fontSize: "0.75rem", color: "var(--text-3)", textAlign: "center" }}>
                    Or email directly:{" "}
                    <a href="mailto:supportsurjapuri@gmail.com" style={{ color: "var(--brand-red)" }}>
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

"use client";

import { useState, FormEvent } from "react";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const lbl: React.CSSProperties = {
  display: "block",
  fontSize: "0.72rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "var(--text-3)",
  marginBottom: "6px",
};

const SOCIALS = [
  { 
    name: "Facebook",    
    href: "https://www.facebook.com/ImtiyaSurjapuri",   
    brandColor: "#1877F2",
    bg: "#1877F2", 
    label: "facebook.com/ImtiyaSurjapuri",
    svg: <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z"/></svg>
  },
  { 
    name: "Instagram",   
    href: "https://www.instagram.com/ImtiyazSurjapuri", 
    brandColor: "#E1306C",
    bg: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)", 
    label: "instagram.com/ImtiyazSurjapuri",
    svg: <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.07M12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.88z"/></svg>
  },
  { 
    name: "X (Twitter)", 
    href: "https://x.com/Imtiyazkth",                   
    brandColor: "var(--text-1)",
    bg: "#000000", 
    label: "x.com/Imtiyazkth",
    svg: <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
  },
  { 
    name: "YouTube",     
    href: "https://youtube.com/@imtiyazvedio",           
    brandColor: "#FF0000",
    bg: "#FF0000", 
    label: "youtube.com/@imtiyazvedio",
    svg: <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M21.582 6.186a2.684 2.684 0 00-1.884-1.895C17.965 3.84 12 3.84 12 3.84s-5.965 0-7.698.451a2.684 2.684 0 00-1.884 1.895C2 7.935 2 12 2 12s0 4.065.418 5.814a2.684 2.684 0 001.884 1.895c1.733.451 7.698.451 7.698.451s5.965 0 7.698-.451a2.684 2.684 0 001.884-1.895C22 16.065 22 12 22 12s0-4.065-.418-5.814zM9.99 15.474v-6.948L15.98 12l-5.99 3.474z"/></svg>
  },
  { 
    name: "Email",       
    href: "mailto:supportsurjapuri@gmail.com",           
    brandColor: "#EA4335",
    bg: "#EA4335", 
    label: "supportsurjapuri@gmail.com",
    svg: <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
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
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
    setLoading(false);
  };

  const SocialCard = ({ s }: { s: typeof SOCIALS[0] }) => (
    <a
      href={s.href}
      target={s.href.startsWith("mailto") ? undefined : "_blank"}
      rel="noopener noreferrer"
      style={{
        display: "flex", alignItems: "center", gap: "16px",
        padding: "16px 20px", borderRadius: "14px",
        background: "var(--bg-card)", border: "1px solid var(--border)",
        textDecoration: "none", transition: "all 0.2s",
      }}
    >
      <div style={{
        width: "48px", height: "48px", borderRadius: "50%",
        background: s.bg, display: "flex", alignItems: "center",
        justifyContent: "center", color: "#ffffff",
        flexShrink: 0
      }}>
        {s.svg}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-1)", marginBottom: "2px" }}>
          {s.name}
        </p>
        <p style={{ fontSize: "0.78rem", color: "var(--text-3)" }}>{s.label}</p>
      </div>
      <span style={{ color: s.brandColor, fontSize: "1.2rem", fontWeight: 700 }}>→</span>
    </a>
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <TopBar />
      <Header />
      <main style={{ flex: 1 }}>
        <div className="main-container" style={{ maxWidth: "900px" }}>
          <div style={{ marginBottom: "40px", textAlign: "center" }}>
            <h1 style={{
              fontFamily: "var(--font-playfair)", fontWeight: 800,
              fontSize: "clamp(1.8rem,4vw,2.5rem)", color: "var(--text-1)", marginBottom: "12px",
            }}>
              Get in Touch
            </h1>
            <p style={{ fontSize: "1rem", color: "var(--text-2)", maxWidth: "520px", margin: "0 auto", lineHeight: 1.7 }}>
              Have a story tip, feedback, or collaboration idea? Reach out through any of the channels below.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "32px" }}>
            <div>
              <h2 style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, fontSize: "1.2rem", color: "var(--text-1)", marginBottom: "20px" }}>
                Connect With Me
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {SOCIALS.map((s) => <SocialCard key={s.name} s={s} />)}
              </div>
            </div>

            <div>
              <h2 style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, fontSize: "1.2rem", color: "var(--text-1)", marginBottom: "20px" }}>
                Send a Message
              </h2>
              {sent ? (
                <div style={{
                  textAlign: "center", padding: "48px 24px",
                  background: "var(--bg-card)", border: "1px solid #bbf7d0", borderRadius: "16px",
                }}>
                  <p style={{ fontSize: "3rem", marginBottom: "12px" }}>✅</p>
                  <h3 style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, fontSize: "1.2rem", color: "var(--text-1)", marginBottom: "8px" }}>
                    Message Sent!
                  </h3>
                  <p style={{ color: "var(--text-3)", fontSize: "0.88rem" }}>
                    Thank you for reaching out. I'll get back to you soon.
                  </p>
                  <button
                    onClick={() => { setSent(false); setName(""); setEmail(""); setSubject(""); setMessage(""); }}
                    style={{ marginTop: "20px", background: "none", border: "none", color: "var(--brand-red)", cursor: "pointer", fontSize: "0.88rem", textDecoration: "underline", fontFamily: "var(--font-sans)" }}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  style={{
                    background: "var(--bg-card)", border: "1px solid var(--border)",
                    borderRadius: "16px", padding: "24px",
                    display: "flex", flexDirection: "column", gap: "16px",
                  }}
                >
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={lbl}>Your Name</label>
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your name" className="admin-input" />
                    </div>
                    <div>
                      <label style={lbl}>Email Address</label>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className="admin-input" />
                    </div>
                  </div>
                  <div>
                    <label style={lbl}>Subject</label>
                    <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required placeholder="Story tip / Feedback / Collaboration" className="admin-input" />
                  </div>
                  <div>
                    <label style={lbl}>Message</label>
                    <textarea value={message} onChange={(e) => setMessage(e.target.value)} required placeholder="Write your message here..." rows={5} className="admin-input" style={{ height: "auto", resize: "vertical", padding: "10px 12px" }} />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary" style={{ height: "44px", fontSize: "0.9rem", justifyContent: "center" }}>
                    {loading ? "Sending..." : "Send Message"}
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

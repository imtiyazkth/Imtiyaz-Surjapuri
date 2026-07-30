"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Article {
  id: string; slug: string; title: string; excerpt: string;
  contentHtml: string; coverImage: string; coverImageAlt: string;
  primaryCategory: string; catColor: string; categories: string[];
  tags: string[]; author: string; readTime: string; status: string;
  featured: boolean; breaking: boolean; trending: boolean;
  youtubeLinks: string[]; socialLinks: Record<string,string>;
  seoTitle: string; seoDescription: string;
}

const CATEGORIES = [
  { name:"Analysis",      slug:"analysis",      color:"#0f766e" },
  { name:"Breaking News", slug:"breaking-news", color:"#C41C1C" },
  { name:"Opinion",       slug:"opinion",       color:"#b45309" },
  { name:"Politics",      slug:"politics",      color:"#7c3aed" },
  { name:"Economy",       slug:"economy",       color:"#15803d" },
  { name:"Technology",    slug:"technology",    color:"#0369a1" },
  { name:"Education",     slug:"education",     color:"#9333ea" },
  { name:"Social Issues", slug:"social-issues", color:"#be185d" },
  { name:"World",         slug:"world",         color:"#b45309" },
  { name:"Blog",          slug:"blog",          color:"#6366f1" },
  { name:"General",       slug:"general",       color:"#C41C1C" },
];

export default function EditArticlePage() {
  const params  = useParams<{ id: string }>();
  const router  = useRouter();
  const id      = params?.id ?? "";

  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");
  const [notFound, setNotFound] = useState(false);

  // Form fields
  const [title,      setTitle]      = useState("");
  const [excerpt,    setExcerpt]    = useState("");
  const [content,    setContent]    = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [coverAlt,   setCoverAlt]   = useState("");
  const [category,   setCategory]   = useState("General");
  const [tagsInput,  setTagsInput]  = useState("");
  const [author,     setAuthor]     = useState("Imtiyaz Surjapuri");
  const [status,     setStatus]     = useState("published");
  const [featured,   setFeatured]   = useState(false);
  const [breaking,   setBreaking]   = useState(false);
  const [trending,   setTrending]   = useState(false);
  const [youtube,    setYoutube]    = useState("");
  const [seoTitle,   setSeoTitle]   = useState("");
  const [seoDesc,    setSeoDesc]    = useState("");

  useEffect(() => {
    if (!id) return;
    // Try fetching by ID directly, then fallback to list search
    fetch(`/api/articles/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.article) {
          populate(d.article);
        } else {
          // Fallback: search in full list
          return fetch("/api/articles?admin=1&limit=100")
            .then((r) => r.json())
            .then((d2) => {
              const found = (d2.articles ?? []).find(
                (a: Article) => a.id === id || a.slug === id
              );
              if (found) populate(found);
              else setNotFound(true);
            });
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  function populate(a: Article) {
    setTitle(a.title ?? "");
    setExcerpt(a.excerpt ?? "");
    setContent(a.contentHtml ?? "");
    setCoverImage(a.coverImage ?? "");
    setCoverAlt(a.coverImageAlt ?? "");
    setCategory(a.primaryCategory ?? "General");
    setTagsInput((a.tags ?? []).join(", "));
    setAuthor(a.author ?? "Imtiyaz Surjapuri");
    setStatus(a.status ?? "published");
    setFeatured(Boolean(a.featured));
    setBreaking(Boolean(a.breaking));
    setTrending(Boolean(a.trending));
    setYoutube((a.youtubeLinks ?? []).join("\n"));
    setSeoTitle(a.seoTitle ?? "");
    setSeoDesc(a.seoDescription ?? "");
  }

  const handleSave = async (publish?: boolean) => {
    if (!title.trim()) { setError("Title is required."); return; }
    setError(""); setSaving(true);
    const now = new Date().toISOString();
    const catObj = CATEGORIES.find((c) => c.name === category || c.slug === category);

    const payload = {
      title: title.trim(),
      excerpt: excerpt.trim(),
      contentHtml: content,
      coverImage, coverImageAlt: coverAlt,
      primaryCategory: catObj?.name ?? category,
      catColor: catObj?.color ?? "#C41C1C",
      categories: [catObj?.slug ?? "general"],
      tags: tagsInput.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean),
      author, status: publish ? "published" : status,
      featured, breaking, trending,
      youtubeLinks: youtube.split("\n").map((u) => u.trim()).filter(Boolean),
      seoTitle, seoDescription: seoDesc,
      updatedAt: now,
      ...(publish ? { publishedAt: now } : {}),
    };

    try {
      const r = await fetch(`/api/articles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.error ?? "Save failed."); }
      else {
        setSuccess(publish ? "Article published!" : "Changes saved!");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch { setError("Network error. Try again."); }
    finally { setSaving(false); }
  };

  // ── Render states ───────────────────────────────────────────
  if (loading) return (
    <div style={{ padding:"40px 0" }}>
      {[40,20,200,40,80].map((h,i) => (
        <div key={i} className="skeleton" style={{ height:h, marginBottom:"14px", borderRadius:"8px" }} />
      ))}
    </div>
  );

  if (notFound) return (
    <div style={{ textAlign:"center", padding:"60px 0" }}>
      <p style={{ fontSize:"2.5rem", marginBottom:"12px" }}>📄</p>
      <h2 style={{ fontFamily:"var(--font-playfair)", color:"var(--text-1)", marginBottom:"8px" }}>Article not found</h2>
      <p style={{ color:"var(--text-3)", marginBottom:"20px" }}>
        ID: <code style={{ background:"var(--border)", padding:"2px 6px", borderRadius:"4px" }}>{id}</code>
      </p>
      <Link href="/admin/articles" className="btn-primary">← Back to Articles</Link>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
        marginBottom:"24px", flexWrap:"wrap", gap:"12px" }}>
        <div>
          <Link href="/admin/articles"
            style={{ fontSize:"0.78rem", color:"var(--text-3)", marginBottom:"4px", display:"block" }}>
            ← Back to Articles
          </Link>
          <h1 style={{ fontFamily:"var(--font-playfair)", fontWeight:700,
            fontSize:"1.5rem", color:"var(--text-1)" }}>
            Edit Article
          </h1>
        </div>
        <div style={{ display:"flex", gap:"10px" }}>
          <button onClick={() => handleSave(false)} disabled={saving} className="btn-outline">
            {saving ? "Saving…" : "💾 Save"}
          </button>
          <button onClick={() => handleSave(true)} disabled={saving} className="btn-primary">
            {saving ? "Publishing…" : "🚀 Publish"}
          </button>
        </div>
      </div>

      {error   && <div className="alert alert-error"   style={{ marginBottom:"16px" }}>⚠ {error}</div>}
      {success && <div className="alert alert-success" style={{ marginBottom:"16px" }}>✓ {success}</div>}

      <div style={{ display:"grid", gridTemplateColumns:"1fr", gap:"16px" }}>
        {/* @media(min-width:1024px) → 2col handled inline */}

        {/* LEFT: Main content */}
        <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>

          {/* Title + Excerpt */}
          <div style={{ background:"var(--bg-card)", border:"1px solid var(--border)",
            borderRadius:"12px", padding:"18px" }}>
            <label style={lbl}>Title *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Article title…" className="admin-input" style={{ marginBottom:"12px", fontWeight:700, fontSize:"1rem" }} />
            <label style={lbl}>Excerpt / Summary</label>
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Short 2-3 line summary…" rows={3}
              className="admin-input" style={{ height:"auto", resize:"vertical", padding:"10px 12px" }} />
          </div>

          {/* Content */}
          <div style={{ background:"var(--bg-card)", border:"1px solid var(--border)",
            borderRadius:"12px", padding:"18px" }}>
            <label style={lbl}>Article Content (HTML)</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)}
              placeholder="Write article content here… (HTML supported)"
              rows={14} className="admin-input"
              style={{ height:"auto", resize:"vertical", padding:"10px 12px",
                fontFamily:"monospace", fontSize:"0.82rem" }} />
            <p style={{ fontSize:"0.72rem", color:"var(--text-3)", marginTop:"6px" }}>
              💡 You can write plain text or HTML tags like &lt;p&gt;, &lt;h2&gt;, &lt;strong&gt;, &lt;blockquote&gt;
            </p>
          </div>

          {/* Cover Image */}
          <div style={{ background:"var(--bg-card)", border:"1px solid var(--border)",
            borderRadius:"12px", padding:"18px" }}>
            <label style={lbl}>Cover Image URL</label>
            <input value={coverImage} onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://images.unsplash.com/…" className="admin-input"
              style={{ marginBottom:"10px" }} />
            {coverImage && (
              <img src={coverImage} alt="preview"
                style={{ width:"100%", maxHeight:"180px", objectFit:"cover",
                  borderRadius:"8px", marginBottom:"10px" }}
                onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
              />
            )}
            <label style={lbl}>Alt Text</label>
            <input value={coverAlt} onChange={(e) => setCoverAlt(e.target.value)}
              placeholder="Describe the image…" className="admin-input" />
          </div>

          {/* SEO */}
          <div style={{ background:"var(--bg-card)", border:"1px solid var(--border)",
            borderRadius:"12px", padding:"18px" }}>
            <label style={lbl}>SEO Title <span style={{ color:"var(--text-3)" }}>(max 60 chars)</span></label>
            <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)}
              placeholder={title || "SEO title…"} maxLength={60} className="admin-input"
              style={{ marginBottom:"10px" }} />
            <label style={lbl}>SEO Description <span style={{ color:"var(--text-3)" }}>(max 160 chars)</span></label>
            <textarea value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)}
              placeholder={excerpt || "Meta description…"} maxLength={160} rows={3}
              className="admin-input" style={{ height:"auto", resize:"vertical", padding:"10px 12px" }} />
          </div>

          {/* YouTube */}
          <div style={{ background:"var(--bg-card)", border:"1px solid var(--border)",
            borderRadius:"12px", padding:"18px" }}>
            <label style={lbl}>YouTube URLs <span style={{ color:"var(--text-3)" }}>(one per line)</span></label>
            <textarea value={youtube} onChange={(e) => setYoutube(e.target.value)}
              placeholder={"https://www.youtube.com/watch?v=…"} rows={3}
              className="admin-input" style={{ height:"auto", resize:"vertical",
                padding:"10px 12px", fontFamily:"monospace", fontSize:"0.78rem" }} />
          </div>
        </div>

        {/* RIGHT: Settings sidebar */}
        <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>

          {/* Publish */}
          <div style={{ background:"var(--bg-card)", border:"1px solid var(--border)",
            borderRadius:"12px", padding:"18px" }}>
            <p style={{ ...lbl, marginBottom:"12px" }}>Publish Settings</p>
            <label style={lbl}>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}
              className="admin-input" style={{ marginBottom:"14px" }}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <div style={{ display:"flex", flexDirection:"column", gap:"10px", marginBottom:"16px" }}>
              {([
                ["featured", featured, setFeatured, "⭐ Featured"],
                ["breaking", breaking, setBreaking, "🔴 Breaking News"],
                ["trending", trending, setTrending, "🔥 Trending"],
              ] as const).map(([key, val, setter, label]) => (
                <label key={key} style={{ display:"flex", alignItems:"center", gap:"10px",
                  cursor:"pointer", fontSize:"0.85rem", color:"var(--text-2)" }}>
                  <input type="checkbox" checked={val}
                    onChange={(e) => setter(e.target.checked)}
                    style={{ width:"16px", height:"16px", accentColor:"var(--brand-red)" }} />
                  {label}
                </label>
              ))}
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
              <button onClick={() => handleSave(true)} disabled={saving} className="btn-primary"
                style={{ width:"100%", justifyContent:"center", height:"40px" }}>
                {saving ? "Publishing…" : "🚀 Publish Now"}
              </button>
              <button onClick={() => handleSave(false)} disabled={saving} className="btn-outline"
                style={{ width:"100%", justifyContent:"center", height:"40px" }}>
                {saving ? "Saving…" : "💾 Save Draft"}
              </button>
            </div>
          </div>

          {/* Category */}
          <div style={{ background:"var(--bg-card)", border:"1px solid var(--border)",
            borderRadius:"12px", padding:"18px" }}>
            <label style={lbl}>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="admin-input" style={{ marginBottom:"0" }}>
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div style={{ background:"var(--bg-card)", border:"1px solid var(--border)",
            borderRadius:"12px", padding:"18px" }}>
            <label style={lbl}>Tags <span style={{ color:"var(--text-3)" }}>(comma separated)</span></label>
            <textarea value={tagsInput} onChange={(e) => setTagsInput(e.target.value)}
              placeholder="india, politics, analysis" rows={3}
              className="admin-input" style={{ height:"auto", resize:"vertical", padding:"10px 12px" }} />
          </div>

          {/* Author */}
          <div style={{ background:"var(--bg-card)", border:"1px solid var(--border)",
            borderRadius:"12px", padding:"18px" }}>
            <label style={lbl}>Author</label>
            <input value={author} onChange={(e) => setAuthor(e.target.value)}
              className="admin-input" />
          </div>

          {/* View on site */}
          <Link href={`/articles/${id}`} target="_blank"
            style={{ display:"block", textAlign:"center", padding:"10px",
              background:"var(--bg)", border:"1px solid var(--border)",
              borderRadius:"12px", fontSize:"0.82rem", color:"var(--brand-red)",
              textDecoration:"none" }}>
            👁 Preview Article →
          </Link>
        </div>
      </div>
    </div>
  );
}

const lbl: React.CSSProperties = {
  display:"block", fontSize:"0.7rem", fontWeight:700,
  textTransform:"uppercase", letterSpacing:"0.07em",
  color:"var(--text-3)", marginBottom:"6px"
};

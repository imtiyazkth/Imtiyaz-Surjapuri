"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import TiptapLink from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import ImageUploader from "./ImageUploader";

interface Category {
  id: string;
  slug: string;
  name: string;
  color: string;
  order?: number;
  visible?: boolean;
}

interface ArticleEditorProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  article?: any;
  categories: Category[];
}

export default function ArticleEditor({ article, categories }: ArticleEditorProps) {
  const router  = useRouter();
  const isEdit  = !!article;

  // ── Form state ─────────────────────────────────────
  const [title,          setTitle]          = useState(article?.title          ?? "");
  const [excerpt,        setExcerpt]        = useState(article?.excerpt         ?? "");
  const [author,         setAuthor]         = useState(article?.author          ?? "Imtiyaz Surjapuri");
  const [status,         setStatus]         = useState(article?.status          ?? "draft");
  const [featured,       setFeatured]       = useState(article?.featured        ?? false);
  const [breaking,       setBreaking]       = useState(article?.breaking        ?? false);
  const [trending,       setTrending]       = useState(article?.trending        ?? false);
  const [coverImage,     setCoverImage]     = useState(article?.coverImage      ?? "");
  const [coverImageAlt,  setCoverImageAlt]  = useState(article?.coverImageAlt   ?? "");
  const [selectedCats,   setSelectedCats]   = useState<string[]>(article?.categories   ?? []);
  const [tagsInput,      setTagsInput]      = useState((article?.tags ?? []).join(", "));
  const [youtubeLinks,   setYoutubeLinks]   = useState((article?.youtubeLinks ?? []).join("\n"));
  const [seoTitle,       setSeoTitle]       = useState(article?.seoTitle        ?? "");
  const [seoDesc,        setSeoDesc]        = useState(article?.seoDescription  ?? "");
  const [socialFB,       setSocialFB]       = useState(article?.socialLinks?.facebook  ?? "");
  const [socialIG,       setSocialIG]       = useState(article?.socialLinks?.instagram ?? "");
  const [socialTW,       setSocialTW]       = useState(article?.socialLinks?.twitter   ?? "");
  const [socialYT,       setSocialYT]       = useState(article?.socialLinks?.youtube   ?? "");
  const [socialWA,       setSocialWA]       = useState(article?.socialLinks?.whatsapp  ?? "");
  const [socialWeb,      setSocialWeb]      = useState(article?.socialLinks?.website   ?? "");

  const [saving,   setSaving]  = useState(false);
  const [error,    setError]   = useState("");
  const [success,  setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState<"content"|"seo"|"social">("content");

  // ── Tiptap editor ──────────────────────────────────
  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapImage.configure({ inline: false, allowBase64: false }),
      TiptapLink.configure({ openOnClick: false }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Start writing your article here…" }),
    ],
    content: article?.contentHtml ?? "",
    editorProps: {
      attributes: { class: "tiptap-editor focus:outline-none" },
    },
  });

  // ── Category toggle ─────────────────────────────────
  const toggleCat = (slug: string) =>
    setSelectedCats((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
    );

  // ── Insert image URL into editor ────────────────────
  const handleInsertImage = useCallback(
    (url: string) => {
      editor?.chain().focus().setImage({ src: url }).run();
    },
    [editor]
  );

  // ── Save / Publish ──────────────────────────────────
  const handleSave = async (publishNow?: boolean) => {
    setError("");
    setSuccess("");

    if (!title.trim())   { setError("Title is required."); return; }
    if (!excerpt.trim()) { setError("Excerpt is required."); return; }
    if (!editor)         { setError("Editor not ready."); return; }

    const contentHtml = editor.getHTML();
    if (!contentHtml || contentHtml === "<p></p>") {
      setError("Article content cannot be empty.");
      return;
    }

    const finalCats   = selectedCats.length ? selectedCats : ["blog"];
    const primaryCat  = finalCats[0];
    const catColor    = categories.find((c) => c.slug === primaryCat)?.color ?? "#C41C1C";

    const payload = {
      title:           title.trim(),
      excerpt:         excerpt.trim(),
      contentHtml,
      primaryCategory: categories.find((c) => c.slug === primaryCat)?.name ?? primaryCat,
      catColor,
      categories:      finalCats,
      tags:            tagsInput.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean),
      author:          author.trim() || "Imtiyaz Surjapuri",
      status:          publishNow ? "published" : status,
      featured,
      breaking,
      trending,
      coverImage:      coverImage.trim(),
      coverImageAlt:   coverImageAlt.trim(),
      youtubeLinks:    youtubeLinks.split("\n").map((u) => u.trim()).filter(Boolean),
      seoTitle:        seoTitle.trim(),
      seoDescription:  seoDesc.trim(),
      socialLinks: {
        facebook:  socialFB.trim()  || undefined,
        instagram: socialIG.trim()  || undefined,
        twitter:   socialTW.trim()  || undefined,
        youtube:   socialYT.trim()  || undefined,
        whatsapp:  socialWA.trim()  || undefined,
        website:   socialWeb.trim() || undefined,
      },
    };

    setSaving(true);
    try {
      const url    = isEdit ? `/api/articles/${article.id}` : "/api/articles";
      const method = isEdit ? "PUT" : "POST";
      const res    = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Save failed.");
      } else {
        setSuccess(publishNow ? "Article published!" : "Draft saved!");
        if (!isEdit && data.id) {
          router.push(`/admin/articles/${data.id}/edit`);
        } else {
          router.refresh();
        }
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ── Render ──────────────────────────────────────────
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

      {/* ── Left: editor area ───────────────────────── */}
      <div className="xl:col-span-2 space-y-4">

        {/* Title + excerpt */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Article Title…"
            className="w-full font-display font-bold text-2xl bg-transparent
                       text-gray-900 dark:text-white placeholder:text-gray-400
                       focus:outline-none border-0"
          />
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Short excerpt / summary (2–3 sentences)…"
            rows={2}
            className="w-full mt-3 font-sans text-base bg-transparent resize-none
                       text-gray-600 dark:text-gray-400 placeholder:text-gray-400
                       focus:outline-none border-t border-gray-100 dark:border-gray-800 pt-3"
          />
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
          <div className="flex border-b border-gray-100 dark:border-gray-800">
            {(["content","seo","social"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-sans font-semibold capitalize transition-colors ${
                  activeTab === tab
                    ? "border-b-2 border-red-600 text-red-600 -mb-px"
                    : "text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                {tab === "seo" ? "SEO" : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* CONTENT tab */}
          {activeTab === "content" && (
            <div>
              <EditorToolbar editor={editor} onInsertImage={handleInsertImage} />
              <div className="border-t border-gray-100 dark:border-gray-800 tiptap-editor min-h-[420px]">
                <EditorContent editor={editor} />
              </div>
            </div>
          )}

          {/* SEO tab */}
          {activeTab === "seo" && (
            <div className="p-5 space-y-4">
              <Field label="SEO Title" hint="Overrides the article title in Google (max 60 chars)">
                <input type="text" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder={title || "SEO title…"} maxLength={60} className={inp} />
                <CharCount v={seoTitle} max={60} />
              </Field>
              <Field label="SEO Description" hint="Shown in search snippets (max 160 chars)">
                <textarea value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)}
                  placeholder={excerpt || "Meta description…"} maxLength={160} rows={3}
                  className={inp + " resize-none"} />
                <CharCount v={seoDesc} max={160} />
              </Field>
            </div>
          )}

          {/* SOCIAL tab */}
          {activeTab === "social" && (
            <div className="p-5 space-y-4">
              {[
                ["Facebook URL",     socialFB,  setSocialFB,  "https://facebook.com/…"],
                ["Instagram URL",    socialIG,  setSocialIG,  "https://instagram.com/…"],
                ["X / Twitter URL",  socialTW,  setSocialTW,  "https://x.com/…"],
                ["YouTube URL",      socialYT,  setSocialYT,  "https://youtube.com/…"],
                ["WhatsApp URL",     socialWA,  setSocialWA,  "https://wa.me/…"],
                ["Website / Source", socialWeb, setSocialWeb, "https://…"],
              ].map(([label, val, setter, ph]) => (
                <Field key={label as string} label={label as string}>
                  <input type="url" value={val as string}
                    onChange={(e) => (setter as React.Dispatch<React.SetStateAction<string>>)(e.target.value)}
                    placeholder={ph as string} className={inp} />
                </Field>
              ))}
            </div>
          )}
        </div>

        {/* YouTube links */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
          <Field label="YouTube Video URLs" hint="One URL per line — embedded in the article">
            <textarea
              value={youtubeLinks}
              onChange={(e) => setYoutubeLinks(e.target.value)}
              placeholder={"https://www.youtube.com/watch?v=…\nhttps://youtu.be/…"}
              rows={3}
              className={inp + " resize-none font-mono text-xs"}
            />
          </Field>
        </div>

        {/* Feedback messages */}
        {error   && <Msg type="error">{error}</Msg>}
        {success && <Msg type="success">{success}</Msg>}
      </div>

      {/* ── Right: sidebar ──────────────────────────── */}
      <div className="space-y-4">

        {/* Publish panel */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
          <h3 className="font-display font-bold text-sm mb-4 text-gray-900 dark:text-white">Publish</h3>
          <div className="mb-4">
            <label className={lbl}>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={inp}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="space-y-2.5 mb-5">
            {([
              ["featured", featured, setFeatured, "⭐ Featured article"],
              ["breaking", breaking, setBreaking, "🔴 Breaking news"],
              ["trending", trending, setTrending, "🔥 Trending"],
            ] as const).map(([key, val, setter, label]) => (
              <label key={key} className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={val}
                  onChange={(e) => setter(e.target.checked)}
                  className="w-4 h-4 rounded accent-red-600" />
                <span className="text-sm font-sans text-gray-600 dark:text-gray-300">{label}</span>
              </label>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <button onClick={() => handleSave(true)} disabled={saving}
              className="w-full h-11 rounded-lg bg-red-600 text-white font-sans font-semibold text-sm hover:bg-red-700 disabled:opacity-60 transition-colors">
              {saving ? "Saving…" : "Publish Now"}
            </button>
            <button onClick={() => handleSave(false)} disabled={saving}
              className="w-full h-11 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-sans font-semibold text-sm hover:border-red-500 hover:text-red-600 disabled:opacity-60 transition-colors">
              Save Draft
            </button>
          </div>
        </div>

        {/* Cover image — URL only */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
          <h3 className="font-display font-bold text-sm mb-4 text-gray-900 dark:text-white">Cover Image</h3>
          <ImageUploader
            currentUrl={coverImage}
            onUpload={setCoverImage}
            onInsert={handleInsertImage}
            label="Cover Image URL"
          />
          {coverImage && (
            <div className="mt-3">
              <label className={lbl}>Alt Text (accessibility)</label>
              <input type="text" value={coverImageAlt}
                onChange={(e) => setCoverImageAlt(e.target.value)}
                placeholder="Describe the image…"
                className={inp} />
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
          <h3 className="font-display font-bold text-sm mb-3 text-gray-900 dark:text-white">Categories</h3>
          <div className="space-y-1.5 max-h-52 overflow-y-auto">
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={selectedCats.includes(cat.slug)}
                  onChange={() => toggleCat(cat.slug)}
                  className="w-4 h-4 rounded accent-red-600" />
                <span className="flex items-center gap-1.5 text-sm font-sans text-gray-600 dark:text-gray-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  {cat.name}
                </span>
              </label>
            ))}
          </div>
          {selectedCats[0] && (
            <p className="text-xs font-sans text-gray-400 mt-2">
              Primary: <strong>{selectedCats[0]}</strong>
            </p>
          )}
        </div>

        {/* Tags */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
          <h3 className="font-display font-bold text-sm mb-3 text-gray-900 dark:text-white">Tags</h3>
          <textarea value={tagsInput} onChange={(e) => setTagsInput(e.target.value)}
            placeholder="delimitation, india, politics, bjp"
            rows={3} className={inp + " resize-none text-xs"} />
          <p className="text-xs text-gray-400 font-sans mt-1">Comma-separated. 3–8 tags recommended.</p>
        </div>

        {/* Author */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
          <h3 className="font-display font-bold text-sm mb-3 text-gray-900 dark:text-white">Author</h3>
          <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className={inp} />
        </div>

        {/* Preview link */}
        {isEdit && article.status === "published" && (
          <a href={`/articles/${article.slug}`} target="_blank" rel="noopener noreferrer"
            className="block text-center text-sm font-sans text-red-600 hover:underline py-2">
            View Published Article →
          </a>
        )}
      </div>
    </div>
  );
}

// ── Toolbar ────────────────────────────────────────────────────
function EditorToolbar({
  editor,
  onInsertImage,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editor: any;
  onInsertImage: (url: string) => void;
}) {
  if (!editor) return null;

  const B = ({ label, onClick, active, title }: { label: string; onClick: () => void; active?: boolean; title?: string }) => (
    <button type="button" onClick={onClick} title={title ?? label}
      className={`px-2 py-1.5 rounded text-xs font-sans font-semibold transition-colors ${
        active ? "bg-red-600 text-white" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
      }`}>
      {label}
    </button>
  );

  return (
    <div className="flex flex-wrap gap-0.5 p-2 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
      <B label="H2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} />
      <B label="H3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} />
      <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-0.5 self-center" />
      <B label="B" title="Bold" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} />
      <B label="I" title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} />
      <B label="U" title="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} />
      <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-0.5 self-center" />
      <B label="• List" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} />
      <B label="1. List" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} />
      <B label="❝" title="Blockquote" onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} />
      <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-0.5 self-center" />
      <B label="🖼 Image" title="Insert image by URL" onClick={() => {
        const url = window.prompt("Paste image URL (from Unsplash, Imgur, Cloudinary, etc.):");
        if (url?.trim()) onInsertImage(url.trim());
      }} />
      <B label="🔗 Link" onClick={() => {
        const url = window.prompt("Enter link URL:");
        if (url) editor.chain().focus().setLink({ href: url }).run();
      }} active={editor.isActive("link")} />
      <B label="Unlink" onClick={() => editor.chain().focus().unsetLink().run()} />
      <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-0.5 self-center" />
      <B label="↩" title="Undo" onClick={() => editor.chain().focus().undo().run()} />
      <B label="↪" title="Redo" onClick={() => editor.chain().focus().redo().run()} />
    </div>
  );
}

// ── Tiny helper components ─────────────────────────────────────
const inp = `w-full h-9 px-3 rounded-lg text-sm font-sans bg-gray-50 dark:bg-gray-800
             border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white
             placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500
             focus:border-transparent transition`.replace(/\s+/g, " ");

const lbl = "block text-xs font-sans font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={lbl}>{label}</label>
      {hint && <p className="text-xs text-gray-400 font-sans mb-1.5">{hint}</p>}
      {children}
    </div>
  );
}

function CharCount({ v, max }: { v: string; max: number }) {
  return (
    <p className={`text-right text-xs font-sans mt-1 ${v.length > max ? "text-red-500" : "text-gray-400"}`}>
      {v.length} / {max}
    </p>
  );
}

function Msg({ type, children }: { type: "error"|"success"; children: React.ReactNode }) {
  const cls = type === "error"
    ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
    : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400";
  return (
    <div className={`${cls} border rounded-lg px-4 py-3 text-sm font-sans`}>
      {type === "error" ? "⚠ " : "✓ "}{children}
    </div>
  );
}

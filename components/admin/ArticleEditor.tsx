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
import type { Article } from "@/types/article";
import type { Category } from "@/types/category";
import ImageUploader from "./ImageUploader";

interface ArticleEditorProps {
  article?: Article;
  categories: Category[];
}

const DEFAULT_FORM = {
  title: "",
  excerpt: "",
  primaryCategory: "",
  categories: [] as string[],
  tags: "",
  author: "Imtiyaz Surjapuri",
  status: "draft" as "draft" | "published" | "archived",
  featured: false,
  breaking: false,
  trending: false,
  coverImage: "",
  coverImageAlt: "",
  youtubeLinks: "",
  seoTitle: "",
  seoDescription: "",
  socialFacebook: "",
  socialInstagram: "",
  socialTwitter: "",
  socialYoutube: "",
  socialWhatsapp: "",
  socialWebsite: "",
};

export default function ArticleEditor({
  article,
  categories,
}: ArticleEditorProps) {
  const router = useRouter();
  const isEdit = !!article;

  const [form, setForm] = useState({
    title:           article?.title ?? DEFAULT_FORM.title,
    excerpt:         article?.excerpt ?? DEFAULT_FORM.excerpt,
    primaryCategory: article?.primaryCategory ?? DEFAULT_FORM.primaryCategory,
    categories:      article?.categories ?? DEFAULT_FORM.categories,
    tags:            article?.tags?.join(", ") ?? DEFAULT_FORM.tags,
    author:          article?.author ?? DEFAULT_FORM.author,
    status:          (article?.status as "draft" | "published" | "archived") ?? DEFAULT_FORM.status,
    featured:        article?.featured ?? DEFAULT_FORM.featured,
    breaking:        article?.breaking ?? DEFAULT_FORM.breaking,
    trending:        article?.trending ?? DEFAULT_FORM.trending,
    coverImage:      article?.coverImage ?? DEFAULT_FORM.coverImage,
    coverImageAlt:   article?.coverImageAlt ?? DEFAULT_FORM.coverImageAlt,
    youtubeLinks:    article?.youtubeLinks?.join("\n") ?? DEFAULT_FORM.youtubeLinks,
    seoTitle:        article?.seoTitle ?? DEFAULT_FORM.seoTitle,
    seoDescription:  article?.seoDescription ?? DEFAULT_FORM.seoDescription,
    socialFacebook:  article?.socialLinks?.facebook ?? DEFAULT_FORM.socialFacebook,
    socialInstagram: article?.socialLinks?.instagram ?? DEFAULT_FORM.socialInstagram,
    socialTwitter:   article?.socialLinks?.twitter ?? DEFAULT_FORM.socialTwitter,
    socialYoutube:   article?.socialLinks?.youtube ?? DEFAULT_FORM.socialYoutube,
    socialWhatsapp:  article?.socialLinks?.whatsapp ?? DEFAULT_FORM.socialWhatsapp,
    socialWebsite:   article?.socialLinks?.website ?? DEFAULT_FORM.socialWebsite,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState<"content" | "seo" | "social">("content");

  // ── Tiptap editor setup ────────────────────────────
  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapImage.configure({ inline: false, allowBase64: false }),
      TiptapLink.configure({ openOnClick: false }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({
        placeholder: "Start writing your article here…",
      }),
    ],
    content: article?.contentHtml ?? "",
    editorProps: {
      attributes: {
        class: "tiptap-editor focus:outline-none",
      },
    },
  });

  // ── Field helpers ──────────────────────────────────
  const set = (key: keyof typeof form, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleCategory = (slug: string) => {
    setForm((f) => {
      const has = f.categories.includes(slug);
      const next = has
        ? f.categories.filter((c) => c !== slug)
        : [...f.categories, slug];
      return {
        ...f,
        categories: next,
        primaryCategory: next[0] ?? "",
      };
    });
  };

  // ── Cover image upload ─────────────────────────────
  const handleCoverUpload = useCallback((url: string) => {
    setForm((f) => ({ ...f, coverImage: url }));
  }, []);

  // ── Insert image into editor ───────────────────────
  const handleInsertImage = useCallback(
    (url: string) => {
      editor?.chain().focus().setImage({ src: url }).run();
    },
    [editor]
  );

  // ── Save / Publish ─────────────────────────────────
  const handleSave = async (publishNow?: boolean) => {
    setError("");
    setSuccess("");

    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!form.excerpt.trim()) {
      setError("Excerpt / summary is required.");
      return;
    }
    if (!editor) {
      setError("Editor not ready.");
      return;
    }

    const contentHtml = editor.getHTML();
    if (contentHtml === "<p></p>" || contentHtml.trim() === "") {
      setError("Article content cannot be empty.");
      return;
    }

    setSaving(true);

    const catColor =
      categories.find((c) => c.slug === form.primaryCategory)?.color ??
      "#C41C1C";

    const payload = {
      title:           form.title.trim(),
      excerpt:         form.excerpt.trim(),
      contentHtml,
      primaryCategory: form.primaryCategory || "blog",
      catColor,
      categories:      form.categories.length ? form.categories : ["blog"],
      tags: form.tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
      author:   form.author.trim() || "Imtiyaz Surjapuri",
      status:   publishNow ? "published" : form.status,
      featured: form.featured,
      breaking: form.breaking,
      trending: form.trending,
      coverImage:    form.coverImage,
      coverImageAlt: form.coverImageAlt.trim(),
      youtubeLinks: form.youtubeLinks
        .split("\n")
        .map((u) => u.trim())
        .filter(Boolean),
      seoTitle:       form.seoTitle.trim(),
      seoDescription: form.seoDescription.trim(),
      socialLinks: {
        facebook:  form.socialFacebook.trim() || undefined,
        instagram: form.socialInstagram.trim() || undefined,
        twitter:   form.socialTwitter.trim() || undefined,
        youtube:   form.socialYoutube.trim() || undefined,
        whatsapp:  form.socialWhatsapp.trim() || undefined,
        website:   form.socialWebsite.trim() || undefined,
      },
    };

    try {
      const url = isEdit ? `/api/articles/${article!.id}` : "/api/articles";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Save failed.");
      } else {
        setSuccess(
          publishNow
            ? "Article published successfully!"
            : "Draft saved successfully!"
        );
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

  // ── Tab labels ─────────────────────────────────────
  const TABS = [
    { key: "content" as const, label: "Content" },
    { key: "seo"     as const, label: "SEO" },
    { key: "social"  as const, label: "Social Links" },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* ── Left column: editor ─────────────────── */}
      <div className="xl:col-span-2 space-y-4">
        {/* Title */}
        <div className="bg-[var(--surface-card)] border border-[var(--surface-border)] rounded-xl p-5">
          <input
            type="text"
            placeholder="Article Title…"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            className="w-full font-display font-bold text-2xl bg-transparent
                       text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
                       focus:outline-none border-0"
          />
          <textarea
            placeholder="Short excerpt / summary (2–3 sentences)…"
            value={form.excerpt}
            onChange={(e) => set("excerpt", e.target.value)}
            rows={2}
            className="w-full mt-3 font-serif text-base bg-transparent
                       text-[var(--text-secondary)] placeholder:text-[var(--text-muted)]
                       focus:outline-none resize-none border-t border-[var(--surface-border)]
                       pt-3"
          />
        </div>

        {/* Tabs */}
        <div className="bg-[var(--surface-card)] border border-[var(--surface-border)] rounded-xl overflow-hidden">
          <div className="flex border-b border-[var(--surface-border)]">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-3 text-sm font-sans font-semibold transition-colors
                  ${activeTab === tab.key
                    ? "border-b-2 border-[var(--brand-red)] text-[var(--brand-red)] -mb-px"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content tab */}
          {activeTab === "content" && (
            <div>
              {/* Toolbar */}
              {editor && <EditorToolbar editor={editor} />}
              {/* Editor */}
              <div className="border-t border-[var(--surface-border)] tiptap-editor">
                <EditorContent editor={editor} />
              </div>
            </div>
          )}

          {/* SEO tab */}
          {activeTab === "seo" && (
            <div className="p-5 space-y-4">
              <FormField label="SEO Title" hint="Overrides the article title in search results">
                <input
                  type="text"
                  value={form.seoTitle}
                  onChange={(e) => set("seoTitle", e.target.value)}
                  placeholder={form.title || "SEO title…"}
                  maxLength={60}
                  className={inputCls}
                />
                <CharCount value={form.seoTitle} max={60} />
              </FormField>
              <FormField label="SEO Description" hint="Shown in Google search snippets (max 160 characters)">
                <textarea
                  value={form.seoDescription}
                  onChange={(e) => set("seoDescription", e.target.value)}
                  placeholder={form.excerpt || "Meta description…"}
                  maxLength={160}
                  rows={3}
                  className={inputCls + " resize-none"}
                />
                <CharCount value={form.seoDescription} max={160} />
              </FormField>
            </div>
          )}

          {/* Social links tab */}
          {activeTab === "social" && (
            <div className="p-5 space-y-4">
              {[
                { key: "socialFacebook",  label: "Facebook URL",  placeholder: "https://facebook.com/…" },
                { key: "socialInstagram", label: "Instagram URL", placeholder: "https://instagram.com/…" },
                { key: "socialTwitter",   label: "X / Twitter URL", placeholder: "https://x.com/…" },
                { key: "socialYoutube",   label: "YouTube URL",   placeholder: "https://youtube.com/…" },
                { key: "socialWhatsapp",  label: "WhatsApp URL",  placeholder: "https://wa.me/…" },
                { key: "socialWebsite",   label: "Website / Source URL", placeholder: "https://…" },
              ].map((field) => (
                <FormField key={field.key} label={field.label}>
                  <input
                    type="url"
                    value={form[field.key as keyof typeof form] as string}
                    onChange={(e) => set(field.key as keyof typeof form, e.target.value)}
                    placeholder={field.placeholder}
                    className={inputCls}
                  />
                </FormField>
              ))}
            </div>
          )}
        </div>

        {/* YouTube links */}
        <div className="bg-[var(--surface-card)] border border-[var(--surface-border)] rounded-xl p-5">
          <FormField label="YouTube Video URLs" hint="One URL per line. These will be embedded in the article.">
            <textarea
              value={form.youtubeLinks}
              onChange={(e) => set("youtubeLinks", e.target.value)}
              placeholder={"https://www.youtube.com/watch?v=…\nhttps://youtu.be/…"}
              rows={3}
              className={inputCls + " resize-none font-mono text-xs"}
            />
          </FormField>
        </div>

        {/* Feedback */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800
                          rounded-lg px-4 py-3 text-sm text-red-600 dark:text-red-400 font-sans">
            ⚠ {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800
                          rounded-lg px-4 py-3 text-sm text-green-600 dark:text-green-400 font-sans">
            ✓ {success}
          </div>
        )}
      </div>

      {/* ── Right column: sidebar settings ──────── */}
      <div className="space-y-4">
        {/* Publish panel */}
        <div className="bg-[var(--surface-card)] border border-[var(--surface-border)] rounded-xl p-5">
          <h3 className="font-display font-bold text-sm mb-4 text-[var(--text-primary)]">
            Publish
          </h3>

          <div className="mb-4">
            <label className={labelCls}>Status</label>
            <select
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
              className={inputCls}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Flags */}
          <div className="space-y-2.5 mb-5">
            {[
              { key: "featured", label: "⭐ Featured article" },
              { key: "breaking", label: "🔴 Breaking news" },
              { key: "trending", label: "🔥 Trending" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form[key as "featured" | "breaking" | "trending"]}
                  onChange={(e) => set(key as keyof typeof form, e.target.checked)}
                  className="w-4 h-4 rounded accent-[var(--brand-red)]"
                />
                <span className="text-sm font-sans text-[var(--text-secondary)]">{label}</span>
              </label>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="w-full h-11 rounded-lg bg-[var(--brand-red)] text-white
                         font-sans font-semibold text-sm hover:bg-[var(--brand-red-dark)]
                         disabled:opacity-60 transition-colors"
            >
              {saving ? "Saving…" : "Publish Now"}
            </button>
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="w-full h-11 rounded-lg border border-[var(--surface-border)]
                         text-[var(--text-secondary)] font-sans font-semibold text-sm
                         hover:border-[var(--brand-red)] hover:text-[var(--brand-red)]
                         disabled:opacity-60 transition-colors"
            >
              Save Draft
            </button>
          </div>
        </div>

        {/* Cover image */}
        <div className="bg-[var(--surface-card)] border border-[var(--surface-border)] rounded-xl p-5">
          <h3 className="font-display font-bold text-sm mb-4 text-[var(--text-primary)]">
            Cover Image
          </h3>
          <ImageUploader
            currentUrl={form.coverImage}
            onUpload={handleCoverUpload}
            onInsert={handleInsertImage}
          />
          {form.coverImage && (
            <div className="mt-3">
              <label className={labelCls}>Alt Text</label>
              <input
                type="text"
                value={form.coverImageAlt}
                onChange={(e) => set("coverImageAlt", e.target.value)}
                placeholder="Describe the image for accessibility"
                className={inputCls}
              />
            </div>
          )}
        </div>

        {/* Category */}
        <div className="bg-[var(--surface-card)] border border-[var(--surface-border)] rounded-xl p-5">
          <h3 className="font-display font-bold text-sm mb-3 text-[var(--text-primary)]">
            Categories
          </h3>
          <div className="space-y-1.5 max-h-52 overflow-y-auto">
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={form.categories.includes(cat.slug)}
                  onChange={() => toggleCategory(cat.slug)}
                  className="w-4 h-4 rounded accent-[var(--brand-red)]"
                />
                <span className="flex items-center gap-1.5 text-sm font-sans text-[var(--text-secondary)]">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  {cat.name}
                </span>
              </label>
            ))}
          </div>
          {form.primaryCategory && (
            <p className="text-xs font-sans text-[var(--text-muted)] mt-2">
              Primary: <strong>{form.primaryCategory}</strong>
            </p>
          )}
        </div>

        {/* Tags */}
        <div className="bg-[var(--surface-card)] border border-[var(--surface-border)] rounded-xl p-5">
          <h3 className="font-display font-bold text-sm mb-3 text-[var(--text-primary)]">
            Tags
          </h3>
          <textarea
            value={form.tags}
            onChange={(e) => set("tags", e.target.value)}
            placeholder="delimitation, india, politics, bjp"
            rows={3}
            className={inputCls + " resize-none text-xs"}
          />
          <p className="text-xs text-[var(--text-muted)] font-sans mt-1">
            Comma-separated. 3–8 tags recommended.
          </p>
        </div>

        {/* Author */}
        <div className="bg-[var(--surface-card)] border border-[var(--surface-border)] rounded-xl p-5">
          <h3 className="font-display font-bold text-sm mb-3 text-[var(--text-primary)]">
            Author
          </h3>
          <input
            type="text"
            value={form.author}
            onChange={(e) => set("author", e.target.value)}
            className={inputCls}
          />
        </div>

        {/* Article preview link (edit mode only) */}
        {isEdit && article.status === "published" && (
          <a
            href={`/articles/${article.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-sm font-sans text-[var(--brand-red)]
                       hover:underline py-2"
          >
            View Published Article →
          </a>
        )}
      </div>
    </div>
  );
}

// ── Tiptap toolbar ─────────────────────────────────────────
function EditorToolbar({ editor }: { editor: ReturnType<typeof useEditor> }) {
  if (!editor) return null;

  const btn = (
    label: string,
    action: () => void,
    active?: boolean,
    title?: string
  ) => (
    <button
      key={label}
      type="button"
      onClick={action}
      title={title ?? label}
      className={`px-2 py-1.5 rounded text-xs font-sans font-semibold transition-colors
        ${active
          ? "bg-[var(--brand-red)] text-white"
          : "text-[var(--text-secondary)] hover:bg-[var(--surface-bg)]"
        }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-wrap gap-0.5 p-2 border-b border-[var(--surface-border)]
                    bg-[var(--surface-bg)]">
      {btn("H2", () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        editor.isActive("heading", { level: 2 }))}
      {btn("H3", () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        editor.isActive("heading", { level: 3 }))}
      <div className="w-px h-6 bg-[var(--surface-border)] mx-0.5 self-center" />
      {btn("B", () => editor.chain().focus().toggleBold().run(),
        editor.isActive("bold"), "Bold")}
      {btn("I", () => editor.chain().focus().toggleItalic().run(),
        editor.isActive("italic"), "Italic")}
      {btn("U", () => editor.chain().focus().toggleUnderline().run(),
        editor.isActive("underline"), "Underline")}
      {btn("S̶", () => editor.chain().focus().toggleStrike().run(),
        editor.isActive("strike"), "Strikethrough")}
      <div className="w-px h-6 bg-[var(--surface-border)] mx-0.5 self-center" />
      {btn("• List", () => editor.chain().focus().toggleBulletList().run(),
        editor.isActive("bulletList"))}
      {btn("1. List", () => editor.chain().focus().toggleOrderedList().run(),
        editor.isActive("orderedList"))}
      {btn("❝ Quote", () => editor.chain().focus().toggleBlockquote().run(),
        editor.isActive("blockquote"))}
      {btn("</>", () => editor.chain().focus().toggleCode().run(),
        editor.isActive("code"), "Inline code")}
      <div className="w-px h-6 bg-[var(--surface-border)] mx-0.5 self-center" />
      {btn("⬅", () => editor.chain().focus().setTextAlign("left").run(),
        editor.isActive({ textAlign: "left" }), "Align left")}
      {btn("≡", () => editor.chain().focus().setTextAlign("center").run(),
        editor.isActive({ textAlign: "center" }), "Align center")}
      {btn("⮕", () => editor.chain().focus().setTextAlign("right").run(),
        editor.isActive({ textAlign: "right" }), "Align right")}
      <div className="w-px h-6 bg-[var(--surface-border)] mx-0.5 self-center" />
      {btn("🔗 Link", () => {
        const url = window.prompt("Enter URL:");
        if (url) editor.chain().focus().setLink({ href: url }).run();
      }, editor.isActive("link"))}
      {btn("Unlink", () => editor.chain().focus().unsetLink().run())}
      <div className="w-px h-6 bg-[var(--surface-border)] mx-0.5 self-center" />
      {btn("↩ Undo", () => editor.chain().focus().undo().run())}
      {btn("↪ Redo", () => editor.chain().focus().redo().run())}
    </div>
  );
}

// ── Small helpers ───────────────────────────────────────────
const inputCls = `
  w-full h-9 px-3 rounded-lg text-sm font-sans
  bg-[var(--surface-bg)] border border-[var(--surface-border)]
  text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
  focus:outline-none focus:ring-2 focus:ring-[var(--brand-red)]
  focus:border-transparent transition
`.trim();

const labelCls =
  "block text-xs font-sans font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wide";

function FormField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {hint && (
        <p className="text-xs text-[var(--text-muted)] font-sans mb-1.5">{hint}</p>
      )}
      {children}
    </div>
  );
}

function CharCount({ value, max }: { value: string; max: number }) {
  const len = value.length;
  const over = len > max;
  return (
    <p
      className={`text-right text-xs font-sans mt-1 ${
        over ? "text-red-500" : "text-[var(--text-muted)]"
      }`}
    >
      {len} / {max}
    </p>
  );
}

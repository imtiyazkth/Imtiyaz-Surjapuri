"use client";
import { useCallback, useRef, useState } from "react";
import Image from "next/image";

interface ImageUploaderProps {
  currentUrl?: string;
  onUpload: (url: string) => void;
  onInsert?: (url: string) => void;
}

export default function ImageUploader({
  currentUrl,
  onUpload,
  onInsert,
}: ImageUploaderProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [dragging, setDragging] = useState(false);

  const uploadFile = useCallback(
    async (file: File) => {
      setError("");
      setUploading(true);
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Upload failed");
        } else {
          onUpload(data.url);
        }
      } catch {
        setError("Network error during upload.");
      } finally {
        setUploading(false);
      }
    },
    [onUpload]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const handleUrlPaste = () => {
    const url = urlInput.trim();
    if (!url) return;
    onUpload(url);
    setUrlInput("");
  };

  return (
    <div className="space-y-3">
      {/* Preview */}
      {currentUrl && (
        <div className="relative rounded-lg overflow-hidden border border-[var(--surface-border)]">
          <Image
            src={currentUrl}
            alt="Cover image preview"
            width={400}
            height={200}
            className="w-full object-cover"
          />
          <div className="absolute top-2 right-2 flex gap-1.5">
            {onInsert && (
              <button
                onClick={() => onInsert(currentUrl)}
                className="px-2 py-1 rounded text-xs bg-black/60 text-white hover:bg-black/80 font-sans"
              >
                Insert in article
              </button>
            )}
            <button
              onClick={() => onUpload("")}
              className="px-2 py-1 rounded text-xs bg-red-600/80 text-white hover:bg-red-700 font-sans"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
                    transition-colors ${dragging
          ? "border-[var(--brand-red)] bg-red-50 dark:bg-red-900/10"
          : "border-[var(--surface-border)] hover:border-[var(--brand-red)]"
        }`}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className="hidden"
        />
        {uploading ? (
          <div className="flex items-center justify-center gap-2 text-sm text-[var(--text-muted)] font-sans">
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Uploading…
          </div>
        ) : (
          <>
            <p className="text-sm font-sans text-[var(--text-muted)]">
              📁 Drop image here or{" "}
              <span className="text-[var(--brand-red)] font-semibold">click to browse</span>
            </p>
            <p className="text-xs text-[var(--text-muted)] font-sans mt-1">
              JPG, PNG, WebP · Max 5MB
            </p>
          </>
        )}
      </div>

      {/* URL input */}
      <div className="flex gap-2">
        <input
          type="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Or paste an image URL…"
          className="flex-1 h-9 px-3 rounded-lg text-xs font-sans
                     bg-[var(--surface-bg)] border border-[var(--surface-border)]
                     text-[var(--text-primary)] focus:outline-none
                     focus:ring-2 focus:ring-[var(--brand-red)]"
          onKeyDown={(e) => e.key === "Enter" && handleUrlPaste()}
        />
        <button
          onClick={handleUrlPaste}
          disabled={!urlInput.trim()}
          className="px-3 h-9 rounded-lg bg-[var(--brand-red)] text-white text-xs
                     font-sans font-semibold disabled:opacity-50 hover:bg-[var(--brand-red-dark)]
                     transition-colors"
        >
          Use URL
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-500 font-sans">{error}</p>
      )}
    </div>
  );
}

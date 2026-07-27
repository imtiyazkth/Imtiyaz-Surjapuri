import type { SocialLinks as SocialLinksType } from "@/types/article";
import { ALLOWED_SOCIAL_DOMAINS } from "@/lib/constants";

function isSafeUrl(url: string, domain: string): boolean {
  try {
    const parsed = new URL(url);
    return ALLOWED_SOCIAL_DOMAINS.some((d) => parsed.hostname === d || parsed.hostname.endsWith(`.${d}`));
  } catch {
    return false;
  }
}

interface SocialLinksProps {
  links: SocialLinksType;
}

const PLATFORM_META: Record<
  string,
  { label: string; color: string; icon: string }
> = {
  facebook:  { label: "Facebook",  color: "#1877F2", icon: "📘" },
  instagram: { label: "Instagram", color: "#E1306C", icon: "📸" },
  twitter:   { label: "X / Twitter", color: "#000",  icon: "𝕏" },
  youtube:   { label: "YouTube",   color: "#FF0000", icon: "▶" },
  whatsapp:  { label: "WhatsApp",  color: "#25D366", icon: "💬" },
  website:   { label: "Website",   color: "#6366f1", icon: "🌐" },
};

export default function SocialLinks({ links }: SocialLinksProps) {
  const entries = Object.entries(links).filter(([, url]) => url && url.trim().length > 0);
  if (entries.length === 0) return null;

  return (
    <div className="bg-[var(--surface-bg)] border border-[var(--surface-border)] rounded-lg p-4">
      <h3 className="font-display font-bold text-sm mb-3 text-[var(--text-primary)]">
        Follow the Story
      </h3>
      <div className="flex flex-wrap gap-2">
        {entries.map(([platform, url]) => {
          const meta = PLATFORM_META[platform];
          if (!meta || !url) return null;
          if (!isSafeUrl(url, platform)) return null;

          return (
            <a
              key={platform}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md
                         text-xs font-sans font-semibold text-white transition-opacity
                         hover:opacity-90"
              style={{ backgroundColor: meta.color }}
            >
              <span>{meta.icon}</span>
              {meta.label}
            </a>
          );
        })}
      </div>
    </div>
  );
}

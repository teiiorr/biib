const DEFAULT_SITE_URL = "https://biib-chi.vercel.app";

/** Boʻsh yoki notoʻgʻri NEXT_PUBLIC_SITE_URL yigʻmani buzmasligi kerak. */
export function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return DEFAULT_SITE_URL;
  try {
    const url = new URL(raw);
    return url.origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export function absoluteUrl(path: string): string {
  return `${siteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

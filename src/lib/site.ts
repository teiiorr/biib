/**
 * Saytning asosiy manzili. NEXT_PUBLIC_SITE_URL bo'sh, faqat probel yoki
 * xato bo'lsa ham build sinmasin: `?? fallback` bo'sh satrni ushlamaydi,
 * shuning uchun `new URL("")` prerenderda ERR_INVALID_URL beradi. Bu yerda
 * qiymat tekshiriladi va kerak bo'lsa protokol qo'shiladi.
 */
const FALLBACK = "https://biib.uz";

function resolveSiteUrl(): string {
  let raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return FALLBACK;
  if (!/^https?:\/\//i.test(raw)) raw = `https://${raw}`;
  try {
    // Kanonik shakl; oxiridagi "/" olib tashlanadi.
    return new URL(raw).href.replace(/\/+$/, "");
  } catch {
    return FALLBACK;
  }
}

export const SITE_URL = resolveSiteUrl();

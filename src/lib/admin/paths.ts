export type AdminPath = "/admin" | `/admin/${string}`;

export const ADMIN_HOME: AdminPath = "/admin";
export const LOGIN_PATH: AdminPath = "/admin/kirish";

/* Faqat panel ichidagi oddiy yoʻl: boshqa sayt, protokolsiz «//» va teskari chiziq ochiq yoʻnaltirishga olib kelardi. */
const SAFE_PATH = /^\/admin(?:\/[\w\-.~%/]*)?(?:\?[\w\-.~%&=+]*)?$/;
/* Kirish va yangilash yoʻllariga qaytish cheksiz aylanma hosil qiladi. */
const LOOPING = /^\/admin\/(?:api|kirish)(?:[/?]|$)/;

/** Tashqaridan kelgan «next» qiymati: xavfsiz boʻlmasa bosh sahifaga. */
export function safeNext(value: unknown): AdminPath {
  if (typeof value !== "string" || value.length > 300) return ADMIN_HOME;
  if (!SAFE_PATH.test(value) || value.includes("//") || LOOPING.test(value)) return ADMIN_HOME;
  return value as AdminPath;
}

export function loginPath(next: AdminPath): string {
  return next === ADMIN_HOME ? LOGIN_PATH : `${LOGIN_PATH}?next=${encodeURIComponent(next)}`;
}

export function refreshPath(next: AdminPath): string {
  return `/admin/api/session?next=${encodeURIComponent(next)}`;
}

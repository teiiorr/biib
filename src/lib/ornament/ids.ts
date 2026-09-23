/** React useId qiymatida «», : kabi belgilar bor; SVG url(#…) uchun faqat harf, raqam, - va _ qoldiriladi. */
export function safeId(prefix: string, raw: string): string {
  return `${prefix}-${raw.replace(/[^a-zA-Z0-9_-]/g, "")}`;
}

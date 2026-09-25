import { clsx, type ClassValue } from "clsx";

/**
 * Mijozga yetib boradigan komponentlar uchun: faqat birlashtirish, tailwind-merge siz (≈ 8 KB gzip
 * birinchi yuklanish JS idan chiqadi). Bu komponentlarning bazaviy sinflari oʻz nomli sinflari —
 * chaqiruvchi ular bilan toʻqnashadigan utilita bermaydi, shu sabab birlashtirish natijasi bir xil.
 * Toʻqnashuvni yechish kerak boʻlgan server komponentlari cn dan foydalanadi.
 */
export function cx(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

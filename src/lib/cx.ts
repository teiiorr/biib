import { clsx, type ClassValue } from "clsx";

/**
 * Mijozdagi komponentlar uchun oddiy birlashtirish: tailwind-merge ishlatilmaydi va birinchi yuklanish
 * JS ≈ 8 KB gzip yengillashadi. Bu komponentlarning bazaviy sinflari oʻz nomli sinflari, ular bilan
 * toʻqnashadigan utilita berilmaydi. Toʻqnashuvni yechish kerak boʻlsa, server komponentlari cn ishlatadi.
 */
export function cx(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

import raw from "./snapshot.json";
import { parseSnapshot, type ContentSnapshot } from "./snapshot";

let parsed: ContentSnapshot | undefined;

/**
 * Repodagi kontent nusxasi (snapshot.json, `pnpm content:pull` yozadi): saytning zaxira manbai,
 * tekshiruvlar (verify, testlar) ham faqat shuni oʻqiydi. Sof modul: server-only emas, tsx va
 * Playwright ichida ham ishlaydi.
 */
export function bundledSnapshot(): ContentSnapshot {
  /* Fayl jarayon davomida oʻzgarmaydi: shakl bir marta tekshiriladi, keyin shu obyekt qaytadi. */
  parsed ??= parseSnapshot(raw, "src/content/snapshot.json");
  return parsed;
}

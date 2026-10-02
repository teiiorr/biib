import "server-only";

import { z } from "zod";

import type { Localized } from "@/content/types";
import type { TextValue } from "@/i18n/text-overrides";

import type { AdminDb } from "../db";

export interface StoredText {
  readonly value: Localized<TextValue>;
  readonly updatedAt: string;
}

function localized<T extends z.ZodType>(item: T) {
  return z.object({ uz: item, oz: item, ozbekca: item, ru: item, en: item });
}

/* Bazadagi l10n_text va l10n_list domenlari bilan bir xil shakl. */
const storedValue = z.union([localized(z.string()), localized(z.array(z.string()))]);

/** Shakli buzilgan almashtirish tashlab yuboriladi. */
export async function loadTextOverrides(db: AdminDb): Promise<ReadonlyMap<string, StoredText>> {
  const { data, error } = await db.from("site_texts").select("key, value, updated_at");
  if (error) throw new Error(`site_texts: ${error.code}`);
  const out = new Map<string, StoredText>();
  for (const row of data) {
    const parsed = storedValue.safeParse(row.value);
    if (parsed.success) out.set(row.key, { value: parsed.data, updatedAt: row.updated_at });
  }
  return out;
}

export async function loadTextOverride(db: AdminDb, key: string): Promise<StoredText | null> {
  const { data, error } = await db
    .from("site_texts")
    .select("value, updated_at")
    .eq("key", key)
    .maybeSingle();
  if (error) throw new Error(`site_texts: ${error.code}`);
  if (!data) return null;
  const parsed = storedValue.safeParse(data.value);
  return parsed.success ? { value: parsed.data, updatedAt: data.updated_at } : null;
}

/**
 * Tahrir boshlangandan beri almashtirish oʻzgarmaganmi: yoʻq boʻlsa hali ham yoʻq, bor boʻlsa aynan
 * shu updated_at bilan. RPC ham rad etadi, lekin bu tekshiruv javobni darhol beradi.
 */
export async function textIsFresh(db: AdminDb, key: string, expected: string | null) {
  const query = db.from("site_texts").select("key").eq("key", key);
  const { data, error } = await (expected ? query.eq("updated_at", expected) : query).maybeSingle();
  if (error) throw new Error(`site_texts: ${error.code}`);
  return expected ? data !== null : data === null;
}

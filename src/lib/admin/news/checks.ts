import "server-only";

import type { AdminDb } from "../db";
import { slugCandidates } from "../slug";

async function slugFree(db: AdminDb, slug: string, own: string | null): Promise<boolean> {
  const { data, error } = await db.rpc("admin_slug_available", {
    candidate: slug,
    ...(own ? { own } : {}),
  });
  if (error) throw new Error(`admin_slug_available: ${error.code}`);
  return data === true;
}

/** Havolaning oʻzi yoki birinchi boʻsh -N varianti; hech biri boʻsh boʻlmasa null. */
export async function firstFreeSlug(
  db: AdminDb,
  base: string,
  own: string | null,
): Promise<string | null> {
  for (const candidate of slugCandidates(base)) {
    if (await slugFree(db, candidate, own)) return candidate;
  }
  return null;
}

export type Freshness = "fresh" | "stale" | "missing";

/**
 * Tahrir boshlangandan beri yozuv oʻzgarmaganini RPC chaqiruvidan oldin tekshiramiz. Bazaning oʻzi ham
 * eskirgan yozuvni rad etadi (PT409), bu yerda esa javob tarmoqqa chiqmasdan darhol qaytadi.
 */
export async function freshness(db: AdminDb, id: string, expected: string): Promise<Freshness> {
  const same = await db
    .from("news")
    .select("id")
    .eq("id", id)
    .eq("updated_at", expected)
    .maybeSingle();
  if (same.error) throw new Error(`news: ${same.error.code}`);
  if (same.data) return "fresh";
  const exists = await db.from("news").select("id").eq("id", id).maybeSingle();
  if (exists.error) throw new Error(`news: ${exists.error.code}`);
  return exists.data ? "stale" : "missing";
}

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
 * Yozuv tahrir boshlangandan beri oʻzgarmaganmi: RPC dan oldin tekshiriladi. Eskirgan yozuvni RPC ning
 * oʻzi ham rad etadi, lekin uning 40001 kodi PostgREST da cheksiz qayta urinishga olib keladi
 * (20261001000106 migratsiyasi uni PT409 ga almashtiradi) — bu tekshiruv javobni darhol beradi.
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

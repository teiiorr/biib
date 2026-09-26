import "server-only";

import type { AdminDb } from "../db";
import { MEDIA_COLUMNS, toMediaItem } from "../media/items";
import { getResultSchema } from "./schema";
import type { MediaItem, NewsAdmin, NewsListRow } from "./types";

export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

/** Panel roʻyxati: saytdagi tartib bilan (sana, keyin yaratilgan vaqt). */
export async function listNews(db: AdminDb): Promise<readonly NewsListRow[]> {
  const { data, error } = await db
    .from("news")
    .select("id, slug, status, published_on, title, updated_at, news_photos(count)")
    .order("published_on", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw new Error(`news: ${error.code}`);
  return data.map((row) => {
    const title = row.title as { uz?: unknown } | null;
    return {
      id: row.id,
      slug: row.slug,
      status: row.status,
      date: row.published_on,
      title: typeof title?.uz === "string" ? title.uz : row.slug,
      photos: row.news_photos[0]?.count ?? 0,
      updatedAt: row.updated_at,
    };
  });
}

export interface LoadedNews {
  readonly data: NewsAdmin;
  readonly updatedAt: string;
}

/** Tahrir uchun admin shakli va kutilgan updated_at; topilmasa null. */
export async function loadNews(db: AdminDb, id: string): Promise<LoadedNews | null> {
  if (!UUID_RE.test(id)) return null;
  const { data, error } = await db.rpc("admin_get", { entity: "news", entity_key: id });
  if (error) throw new Error(`admin_get: ${error.code}`);
  const parsed = getResultSchema.safeParse(data);
  if (!parsed.success) throw new Error("admin_get: shakl notoʻgʻri");
  return parsed.data;
}

export async function mediaByIds(
  db: AdminDb,
  ids: readonly string[],
): Promise<ReadonlyMap<string, MediaItem>> {
  const unique = [...new Set(ids)];
  if (!unique.length) return new Map();
  const { data, error } = await db.from("media").select(MEDIA_COLUMNS).in("id", unique);
  if (error) throw new Error(`media: ${error.code}`);
  return new Map(data.map((row) => [row.id, toMediaItem(row)]));
}

/** Tanlash oynasi uchun: oxirgi yuklangan rasmlar, yangisi birinchi. */
export async function recentMedia(db: AdminDb, limit = 36): Promise<readonly MediaItem[]> {
  const { data, error } = await db
    .from("media")
    .select(MEDIA_COLUMNS)
    .eq("kind", "image")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(`media: ${error.code}`);
  return data.map(toMediaItem);
}

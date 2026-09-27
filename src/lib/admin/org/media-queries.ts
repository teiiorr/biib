import "server-only";

import type { AdminDb } from "../db";
import { MEDIA_COLUMNS, preparedFromRow, toMediaItem, type MediaRowLike } from "../media/items";
import type { MediaItem } from "../news/types";
import type { GalleryMedia, MediaRole, ProjectMediaFile } from "./types";

/* Galereya va loyiha media soʻrovlari: tur va poster bilan (yangilik tahriridagi soʻrov faqat rasm). */
interface MediaRow extends MediaRowLike {
  readonly kind: "image" | "video";
  readonly poster_id: string | null;
}

const COLUMNS = `${MEDIA_COLUMNS}, kind, poster_id` as const;

function galleryMedia(row: MediaRow, posters: ReadonlyMap<string, MediaRow>): GalleryMedia {
  const poster = row.poster_id ? posters.get(row.poster_id) : undefined;
  const shown = row.kind === "video" ? poster : row;
  return {
    id: row.id,
    kind: row.kind,
    src: row.src,
    preview: shown ? preparedFromRow(shown) : null,
    previewSrc: shown?.src ?? "",
    posterId: row.poster_id,
  };
}

async function mediaRows(db: AdminDb, ids: readonly string[]): Promise<readonly MediaRow[]> {
  const unique = [...new Set(ids)];
  if (!unique.length) return [];
  const { data, error } = await db.from("media").select(COLUMNS).in("id", unique);
  if (error) throw new Error(`media: ${error.code}`);
  return data;
}

/** Id → galereya mediasi (video posteri bilan) va id → oddiy rasm (muqova kadri uchun). */
export async function galleryMediaByIds(
  db: AdminDb,
  ids: readonly string[],
): Promise<{ media: ReadonlyMap<string, GalleryMedia>; images: ReadonlyMap<string, MediaItem> }> {
  const rows = await mediaRows(db, ids);
  const posters = new Map(
    (
      await mediaRows(
        db,
        rows.flatMap((r) => (r.poster_id ? [r.poster_id] : [])),
      )
    ).map((r) => [r.id, r]),
  );
  return {
    media: new Map(rows.map((row) => [row.id, galleryMedia(row, posters)])),
    images: new Map(rows.filter((r) => r.kind === "image").map((r) => [r.id, toMediaItem(r)])),
  };
}

/**
 * Galereya kutubxonasi: MP4 videolar (WebM ni Safari hamma joyda oʻynamaydi) va oxirgi rasmlar.
 * Loyiha videosining telefon va WebM nusxalari tanlovda yoʻq: koʻrinishi asosiysi bilan bir xil,
 * tanlovda ikkita bir xil kadr chalkashtirardi. Videoning koʻrinishi uning posteri.
 */
export async function galleryLibrary(db: AdminDb, limit = 48): Promise<readonly GalleryMedia[]> {
  const [videos, images, variants] = await Promise.all([
    db.from("media").select(COLUMNS).eq("kind", "video").like("src", "%.mp4").order("created_at"),
    db
      .from("media")
      .select(COLUMNS)
      .eq("kind", "image")
      .order("created_at", { ascending: false })
      .limit(limit),
    db.from("project_media").select("webm_id, mobile_mp4_id, mobile_webm_id"),
  ]);
  if (videos.error || images.error || variants.error) throw new Error("media: kutubxona oʻqilmadi");
  const hidden = new Set(
    variants.data.flatMap((row) => [row.webm_id, row.mobile_mp4_id, row.mobile_webm_id]),
  );
  const primary = videos.data.filter((row) => !hidden.has(row.id));
  const posterIds = primary.flatMap((row) => (row.poster_id ? [row.poster_id] : []));
  const posters = new Map((await mediaRows(db, posterIds)).map((row) => [row.id, row]));
  return [...primary, ...images.data].map((row) => galleryMedia(row, posters));
}

/** Loyiha videolari va logotipi (faqat koʻrsatish uchun): fayl nomi va koʻrinish rasmi. */
export async function projectMediaFiles(
  db: AdminDb,
): Promise<Readonly<Partial<Record<MediaRole, ProjectMediaFile>>>> {
  const { data, error } = await db
    .from("project_media")
    .select("role, main_id, poster_id")
    .eq("project_key", "upop-trend");
  if (error) throw new Error(`project_media: ${error.code}`);
  const rows = await mediaRows(
    db,
    data.flatMap((row) => [row.main_id, row.poster_id].filter((id): id is string => !!id)),
  );
  const byId = new Map(rows.map((row) => [row.id, row]));
  const out: Partial<Record<MediaRole, ProjectMediaFile>> = {};
  for (const row of data) {
    const main = row.main_id ? byId.get(row.main_id) : undefined;
    const shown = byId.get(row.poster_id ?? "") ?? (main?.kind === "image" ? main : undefined);
    if (row.role === "loop" || row.role === "film" || row.role === "wordmark")
      out[row.role] = { file: main?.src ?? "", preview: shown ? toMediaItem(shown) : null };
  }
  return out;
}

import "server-only";

import type { AdminDb } from "../db";
import { MEDIA_COLUMNS, toMediaItem } from "./items";
import type { LibraryItem } from "./library-types";

const COLUMNS = `${MEDIA_COLUMNS}, kind, origin, bytes`;

/** Hamma media, yangisi birinchi, har birining ishlatilish soni bilan (admin_media_usage). */
export async function listLibrary(db: AdminDb): Promise<readonly LibraryItem[]> {
  const [rows, usage] = await Promise.all([
    db.from("media").select(COLUMNS).order("created_at", { ascending: false }),
    db.rpc("admin_media_usage"),
  ]);
  if (rows.error) throw new Error(`media: ${rows.error.code}`);
  if (usage.error) throw new Error(`admin_media_usage: ${usage.error.code}`);
  const uses = new Map(usage.data.map((row) => [row.media_id, row.uses]));
  return rows.data.map((row) => ({
    ...toMediaItem(row),
    kind: row.kind,
    origin: row.origin,
    name: row.src.split("/").at(-1) ?? row.src,
    width: row.width,
    height: row.height,
    bytes: row.bytes,
    uses: uses.get(row.id) ?? 0,
  }));
}

/**
 * Oʻchirilgan yozuvning Storage dagi barcha nusxalari («media» bucketi, prefiks «i/<xesh>»). Bir rasm
 * ikki maqsadda yuklangan boʻlsa (xesh bir xil, kengliklar boshqa) boshqa yozuvning nusxalari qoladi.
 * Faqat Storage API: storage.objects ga SQL bilan tegilmaydi. Hammasi oʻchsa true.
 */
export async function removeStoredVariants(db: AdminDb, prefix: string): Promise<boolean> {
  const slash = prefix.lastIndexOf("/");
  const folder = prefix.slice(0, slash);
  const stem = prefix.slice(slash + 1);
  if (slash < 1 || !/^[A-Za-z0-9_-]+$/.test(stem)) return false;
  const bucket = db.storage.from("media");
  const [listed, siblings] = await Promise.all([
    bucket.list(folder, { search: stem, limit: 200 }),
    db.from("media").select("variant_widths").eq("storage_prefix", prefix),
  ]);
  if (listed.error || siblings.error) return false;
  const keep = new Set(
    siblings.data.flatMap((row) =>
      row.variant_widths.flatMap((w) => [`${stem}-${w}.avif`, `${stem}-${w}.webp`]),
    ),
  );
  const names = listed.data
    .map((file) => file.name)
    .filter(
      (name) => (name.startsWith(`${stem}-`) || name.startsWith(`${stem}.`)) && !keep.has(name),
    );
  if (!names.length) return true;
  const { error } = await bucket.remove(names.map((name) => `${folder}/${name}`));
  return !error;
}

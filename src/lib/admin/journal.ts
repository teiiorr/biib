import "server-only";

import type { Json } from "./database.types";
import { PEOPLE_COPY } from "./copy-people";
import type { AdminDb } from "./db";
import { PEOPLE_ENTITIES } from "./restore-people";

export interface JournalRow {
  readonly id: number;
  readonly at: string;
  readonly entity: string;
  readonly action: string;
  readonly summary: string;
  /** Qaytariladigan boʻlim va oldingi holat bor boʻlsa: qaytarish tugmasi. */
  readonly restorable: boolean;
}

function field(value: Json | undefined, ...path: readonly string[]): string | null {
  let current: Json | undefined = value;
  for (const key of path) {
    if (!current || typeof current !== "object" || Array.isArray(current)) return null;
    current = current[key];
  }
  return typeof current === "string" ? current : null;
}

/* Qisqacha: yangilikda oʻzbekcha sarlavha, odamda ism (kutilayotganida lavozim), rasmda fayl nomi,
   tartibda roʻyxat nomi, qolganida kalit. */
function summarize(entity: string, key: string, before: Json, after: Json): string {
  if (entity === "order") return PEOPLE_COPY.order[key] ?? key;
  const source = after ?? before;
  const title =
    field(source, "title", "uz") ?? field(source, "name", "uz") ?? field(source, "role", "uz");
  if (title) return title;
  const src = field(source, "src");
  if (src) return src.split("/").at(-1) ?? src;
  return field(source, "key") ?? field(source, "slug") ?? `${entity} ${key.slice(0, 8)}`;
}

/** Jurnal: yangisi birinchi; before berilsa shu id dan oldingilari (sahifalash). */
export async function loadJournal(
  db: AdminDb,
  limit: number,
  before: number | null = null,
): Promise<readonly JournalRow[]> {
  const { data, error } = await db.rpc("admin_content_log", {
    max_rows: limit,
    ...(before ? { before_id: before } : {}),
  });
  if (error) throw new Error(`admin_content_log: ${error.code}`);
  return data.map((row) => ({
    id: row.id,
    at: row.at,
    entity: row.entity,
    action: row.action,
    summary: summarize(row.entity, row.entity_key, row.before, row.after),
    restorable: (row.entity === "news" || PEOPLE_ENTITIES.has(row.entity)) && row.before !== null,
  }));
}

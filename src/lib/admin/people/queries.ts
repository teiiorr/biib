import "server-only";

import type { PersonKind } from "@/content/types";

import type { Json } from "../database.types";
import type { AdminDb } from "../db";
import { mediaByIds, UUID_RE } from "../news/queries";
import { mediaFor } from "./draft";
import { personResultSchema } from "./schema";
import type { PersonAdmin, PersonListRow } from "./types";

/** Besh tilli JSON dan oʻzbekcha qator (roʻyxat va jurnal uchun). */
export function uzText(value: Json | null): string | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const uz = value.uz;
  return typeof uz === "string" && uz ? uz : null;
}

/** Panel roʻyxati: saytdagi tartib bilan (sort_order, keyin key — content_snapshot bilan bir xil). */
export async function listPeople(db: AdminDb, kind: PersonKind): Promise<readonly PersonListRow[]> {
  const { data, error } = await db
    .from("people")
    .select("id, key, status, name, role, photo_id, updated_at")
    .eq("kind", kind)
    .order("sort_order")
    .order("key");
  if (error) throw new Error(`people: ${error.code}`);
  const media = await mediaByIds(
    db,
    data.flatMap((row) => (row.photo_id ? [row.photo_id] : [])),
  );
  return data.map((row) => ({
    id: row.id,
    key: row.key,
    status: row.status,
    name: uzText(row.name),
    role: uzText(row.role) ?? row.key,
    photo: mediaFor(row.photo_id, media),
    updatedAt: row.updated_at,
  }));
}

export interface LoadedPerson {
  readonly data: PersonAdmin;
  readonly updatedAt: string;
}

/** Tahrir uchun admin shakli va kutilgan updated_at; topilmasa null. */
export async function loadPerson(db: AdminDb, id: string): Promise<LoadedPerson | null> {
  if (!UUID_RE.test(id)) return null;
  const { data, error } = await db.rpc("admin_get", { entity: "person", entity_key: id });
  if (error) throw new Error(`admin_get: ${error.code}`);
  const parsed = personResultSchema.safeParse(data);
  if (!parsed.success) throw new Error("admin_get: shakl notoʻgʻri");
  return parsed.data;
}

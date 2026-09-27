import "server-only";

import type { AdminDb } from "../db";
import { mediaByIds, UUID_RE } from "../news/queries";
import { mediaFor } from "../people/draft";
import { uzText } from "../people/queries";
import { partnerResultSchema } from "./schema";
import { PARTNER_GROUPS, type PartnerAdmin, type PartnerListRow } from "./types";

/**
 * Panel roʻyxati: guruhlar saytdagi tartibda, guruh ichida sort_order va key (content_snapshot bilan
 * bir xil). Tartiblash shu yassi roʻyxatni butunligicha yuboradi.
 */
export async function listPartners(db: AdminDb): Promise<readonly PartnerListRow[]> {
  const { data, error } = await db
    .from("partners")
    .select("id, key, status, group, name, logo_id, updated_at")
    .order("sort_order")
    .order("key");
  if (error) throw new Error(`partners: ${error.code}`);
  const media = await mediaByIds(
    db,
    data.flatMap((row) => (row.logo_id ? [row.logo_id] : [])),
  );
  const rows = data.map((row) => ({
    id: row.id,
    key: row.key,
    status: row.status,
    group: row.group,
    name: uzText(row.name),
    logo: mediaFor(row.logo_id, media),
    updatedAt: row.updated_at,
  }));
  return PARTNER_GROUPS.flatMap((group) => rows.filter((row) => row.group === group));
}

export interface LoadedPartner {
  readonly data: PartnerAdmin;
  readonly updatedAt: string;
}

export async function loadPartner(db: AdminDb, id: string): Promise<LoadedPartner | null> {
  if (!UUID_RE.test(id)) return null;
  const { data, error } = await db.rpc("admin_get", { entity: "partner", entity_key: id });
  if (error) throw new Error(`admin_get: ${error.code}`);
  const parsed = partnerResultSchema.safeParse(data);
  if (!parsed.success) throw new Error("admin_get: shakl notoʻgʻri");
  return parsed.data;
}

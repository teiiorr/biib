import "server-only";

import { z } from "zod";

import { pathFor } from "@/i18n/routes";

import { ADMIN_COPY } from "./copy";
import { NEWS_COPY } from "./copy-news";
import { PEOPLE_COPY } from "./copy-people";
import type { Json } from "./database.types";
import type { AdminDb } from "./db";
import { dbErrorKind, type ActionResult } from "./db-errors";
import { loadPartner } from "./partners/queries";
import { partnerAdminSchema } from "./partners/schema";
import { personWarmPaths } from "./people/kinds";
import { loadPerson } from "./people/queries";
import { personAdminSchema } from "./people/schema";
import { publish } from "./publish";

export const PEOPLE_ENTITIES: ReadonlySet<string> = new Set(["person", "partner", "order"]);

export interface RestorableEntry {
  readonly entity: string;
  readonly entity_key: string;
  readonly before: Json;
}

const J = ADMIN_COPY.journal;
const orderSchema = z.object({
  entity: z.enum(["people", "partners", "milestones"]),
  keys: z.array(z.string().max(80)).min(1).max(400),
});

function failure(code: string | undefined): ActionResult {
  const kind = dbErrorKind({ code });
  const message =
    kind === "conflict"
      ? NEWS_COPY.save.conflict
      : kind === "media"
        ? NEWS_COPY.errors.media
        : kind === "invalid"
          ? PEOPLE_COPY.errors.invalid
          : J.failed;
  return { ok: false, message };
}

function partnerWarm(): readonly string[] {
  return [pathFor("uz", "home"), pathFor("uz", "partners")];
}

/* Tartib yozuvining kaliti: «people:leader», «people:expert», «partners», «milestones». */
function orderWarm(key: string): readonly string[] {
  if (key === "people:leader") return personWarmPaths("leader");
  if (key === "people:expert") return personWarmPaths("expert");
  if (key === "partners") return partnerWarm();
  return [pathFor("uz", "about")];
}

/**
 * Oldingi holat oʻsha saqlash RPC orqali qayta yoziladi. Oʻchirilgan yozuv oʻz id, kalit va oʻrni bilan
 * tiklanadi; mavjudi hozirgi updated_at bilan yoziladi, oraliqda oʻzgargan boʻlsa ham, chunki aynan shu
 * holat tanlangan. Tartib esa faqat roʻyxat tarkibi oʻzgarmagan boʻlsa qaytadi.
 */
export async function restorePeopleEntry(
  db: AdminDb,
  entry: RestorableEntry,
): Promise<ActionResult> {
  if (entry.entity === "person") {
    const before = personAdminSchema.safeParse(entry.before);
    if (!before.success) return { ok: false, message: J.notRestorable };
    const current = await loadPerson(db, entry.entity_key).catch(() => null);
    const { error } = await db.rpc("admin_save_person", {
      p: entry.before,
      ...(current ? { expected: current.updatedAt } : {}),
    });
    if (error) return failure(error.code);
    publish({ warm: personWarmPaths(before.data.kind) });
    return { ok: true };
  }
  if (entry.entity === "partner") {
    if (!partnerAdminSchema.safeParse(entry.before).success)
      return { ok: false, message: J.notRestorable };
    const current = await loadPartner(db, entry.entity_key).catch(() => null);
    const { error } = await db.rpc("admin_save_partner", {
      p: entry.before,
      ...(current ? { expected: current.updatedAt } : {}),
    });
    if (error) return failure(error.code);
    publish({ warm: partnerWarm() });
    return { ok: true };
  }
  const before = orderSchema.safeParse(entry.before);
  if (entry.entity !== "order" || !before.success) return { ok: false, message: J.notRestorable };
  const { error } = await db.rpc("admin_reorder", {
    entity: before.data.entity,
    keys: before.data.keys,
  });
  if (error) {
    const stale = dbErrorKind(error) === "invalid";
    return { ok: false, message: stale ? PEOPLE_COPY.errors.restoreOrder : J.failed };
  }
  publish({ warm: orderWarm(entry.entity_key) });
  return { ok: true };
}

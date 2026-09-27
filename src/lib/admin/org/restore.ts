import "server-only";

import type { z } from "zod";

import type { Json } from "../database.types";
import type { AdminDb } from "../db";
import { dbErrorKind, type ActionResult } from "../db-errors";
import { NEWS_COPY } from "../copy-news";
import { ORG_COPY } from "../copy-org";
import { publish } from "../publish";
import { loadContacts, loadProject } from "./queries";
import { ORG_WARM } from "./results";
import {
  contactsSchema,
  milestoneSchema,
  orderSchema,
  projectSchema,
  shotsSchema,
  socialsSchema,
} from "./schema";

export interface JournalEntry {
  readonly entity: string;
  readonly entity_key: string;
  readonly before: Json;
}

type RpcError = { readonly code?: string | undefined } | null;

interface Restorer {
  readonly schema: z.ZodType;
  readonly warm: readonly string[];
  readonly run: (db: AdminDb, before: Json, key: string) => Promise<RpcError>;
}

/* Yozuv oʻchirilgan boʻlsa (admin_get null) kutilgan vaqt yoʻq: RPC uni oʻsha id bilan qayta yaratadi. */
async function milestoneVersion(db: AdminDb, id: string): Promise<string | undefined> {
  const { data } = await db.rpc("admin_get", { entity: "milestone", entity_key: id });
  const found = data && typeof data === "object" && !Array.isArray(data) ? data.updatedAt : null;
  return typeof found === "string" ? found : undefined;
}

const ORDER_WARM: Readonly<Record<string, readonly string[]>> = {
  milestones: ORG_WARM.history,
  people: ORG_WARM.people,
  partners: ORG_WARM.partners,
};

/* Jurnal obyekti → oʻsha saqlash RPC si. before admin shaklida: qaytarish = uni qayta saqlash. */
const RESTORERS: Readonly<Record<string, Restorer>> = {
  contacts: {
    schema: contactsSchema,
    warm: ORG_WARM.contacts,
    run: async (db, before) => {
      const current = await loadContacts(db);
      const { error } = await db.rpc("admin_save_contacts", {
        p: before,
        ...(current.version ? { expected: current.version } : {}),
      });
      return error;
    },
  },
  socials: {
    schema: socialsSchema,
    warm: ORG_WARM.contacts,
    run: async (db, before) => (await db.rpc("admin_save_socials", { p: before })).error,
  },
  milestone: {
    schema: milestoneSchema,
    warm: ORG_WARM.history,
    run: async (db, before, key) => {
      const expected = await milestoneVersion(db, key);
      const { error } = await db.rpc("admin_save_milestone", {
        p: before,
        ...(expected ? { expected } : {}),
      });
      return error;
    },
  },
  project: {
    schema: projectSchema,
    warm: ORG_WARM.project,
    run: async (db, before) => {
      const current = await loadProject(db);
      const { error } = await db.rpc("admin_save_project", {
        p: before,
        ...(current.version ? { expected: current.version } : {}),
      });
      return error;
    },
  },
  upop_shots: {
    schema: shotsSchema,
    warm: ORG_WARM.gallery,
    run: async (db, before) => (await db.rpc("admin_save_upop_shots", { p: before })).error,
  },
  order: {
    schema: orderSchema,
    warm: [],
    run: async (db, before) => {
      const order = orderSchema.parse(before);
      return (await db.rpc("admin_reorder", { entity: order.entity, keys: order.keys })).error;
    },
  },
};

/** Jurnal «Qaytarish» tugmasi shu obyektlar uchun ham chiqadi. */
export const ORG_RESTORABLE: ReadonlySet<string> = new Set(Object.keys(RESTORERS));

/**
 * Tashkilot yozuvlarini (aloqa, tarmoqlar, tarix, loyiha, galereya, tartib) qaytarish. Boshqa obyekt
 * boʻlsa null: chaqiruvchi oʻz yoʻlidan davom etadi.
 */
export async function restoreOrgEntry(
  db: AdminDb,
  entry: JournalEntry,
): Promise<ActionResult | null> {
  const restorer = RESTORERS[entry.entity];
  if (!restorer) return null;
  if (entry.before === null || !restorer.schema.safeParse(entry.before).success)
    return { ok: false, message: ORG_COPY.restore.failed };
  let error: RpcError;
  try {
    error = await restorer.run(db, entry.before, entry.entity_key);
  } catch {
    return { ok: false, message: ORG_COPY.errors.generic };
  }
  if (error) {
    const kind = dbErrorKind(error);
    const message =
      kind === "conflict"
        ? NEWS_COPY.save.conflict
        : kind === "media"
          ? ORG_COPY.errors.media
          : ORG_COPY.restore.failed;
    return { ok: false, message };
  }
  const order = entry.entity === "order" ? orderSchema.safeParse(entry.before) : null;
  publish({ warm: order?.success ? (ORDER_WARM[order.data.entity] ?? []) : restorer.warm });
  return { ok: true };
}

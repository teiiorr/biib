"use server";

import { ORG_COPY } from "../copy-org";
import type { Json } from "../database.types";
import { adminDb } from "../db";
import { dbErrorKind, type ActionResult } from "../db-errors";
import { requireAdminAction } from "../guard";
import { buildMilestones, type SaveMilestonesState } from "../org/milestones";
import { milestonesPayload, readPayload } from "../org/payloads";
import { listMilestones } from "../org/queries";
import { dbMessage, failure, genericError, ORG_WARM } from "../org/results";
import { publish } from "../publish";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

/**
 * Faqat oʻzgargan yoki yangi qatorlar saqlanadi, har biri oʻz kutilgan vaqti bilan. Oxirida roʻyxat
 * bazadan qayta oʻqiladi: yangi qatorlar tahrirga kaliti va vaqti bilan qaytadi.
 */
export async function saveMilestones(
  prev: SaveMilestonesState,
  formData: FormData,
): Promise<SaveMilestonesState> {
  const session = await requireAdminAction();
  const revision = prev.revision + 1;
  const payload = readPayload(milestonesPayload, formData);
  if (!payload) return genericError(revision);
  const built = buildMilestones(payload);
  if (!built.ok) return { status: "invalid", revision, errors: built.errors };
  const db = adminDb(session.accessToken);
  const keys: string[] = [];
  let touched = false;
  for (const [index, row] of payload.rows.entries()) {
    const input = built.rows[index]?.input;
    if (!input) return genericError(revision);
    if (row.id && !row.changed && row.key) {
      keys.push(row.key);
      continue;
    }
    const { data, error } = await db.rpc("admin_save_milestone", {
      p: input as unknown as Json,
      ...(row.updatedAt ? { expected: row.updatedAt } : {}),
    });
    const saved = data?.[0];
    if (error || !saved) {
      if (touched) publish({ warm: ORG_WARM.history });
      return failure(revision, error?.code);
    }
    touched = true;
    keys.push(saved.key);
  }
  if (payload.reorder && keys.length) {
    const { error } = await db.rpc("admin_reorder", { entity: "milestones", keys });
    if (error) {
      if (touched) publish({ warm: ORG_WARM.history });
      const invalid = dbErrorKind(error) === "invalid";
      return {
        status: "error",
        revision,
        message: invalid ? ORG_COPY.errors.order : dbMessage(error.code),
      };
    }
    touched = true;
  }
  if (touched) publish({ warm: ORG_WARM.history });
  try {
    return { status: "saved", revision, version: null, data: await listMilestones(db) };
  } catch {
    return genericError(revision);
  }
}

/** Oʻchirilgan bosqichni jurnaldan qaytarish mumkin. */
export async function deleteMilestone(id: string, expected: string): Promise<ActionResult> {
  const session = await requireAdminAction();
  if (!UUID_RE.test(id) || expected.length > 64)
    return { ok: false, message: ORG_COPY.errors.notFound };
  const { error } = await adminDb(session.accessToken).rpc("admin_delete_milestone", {
    target: id,
    expected,
  });
  if (error) {
    const conflict = dbErrorKind(error) === "conflict";
    return { ok: false, message: conflict ? ORG_COPY.errors.order : dbMessage(error.code) };
  }
  publish({ warm: ORG_WARM.history });
  return { ok: true };
}

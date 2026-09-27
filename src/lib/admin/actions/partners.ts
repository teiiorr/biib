"use server";

import { redirect } from "next/navigation";

import { pathFor } from "@/i18n/routes";

import { NEWS_COPY } from "../copy-news";
import type { Json } from "../database.types";
import { adminDb } from "../db";
import type { ActionResult } from "../db-errors";
import { requireAdminAction } from "../guard";
import { UUID_RE } from "../news/queries";
import { buildPartner } from "../partners/build";
import { listPartners } from "../partners/queries";
import { partnerPayloadSchema } from "../partners/schema";
import type { PartnerAdmin, PartnerListRow } from "../partners/types";
import { publish } from "../publish";
import { recordFailure, recordMessage, type RecordSaveState, type ReorderResult } from "../record";

type SavePartnerState = RecordSaveState<PartnerAdmin>;

const KEY_RE = /^[a-z][a-z0-9-]{0,63}$/;

/** Hamkor bosh sahifadagi maydonda ham (≥ 6 boʻlsa), shu sabab ikkala sahifa isitiladi. */
function warmPaths(): readonly string[] {
  return [pathFor("uz", "home"), pathFor("uz", "partners")];
}

/** Hamkorni saqlash: odamlar bilan bir xil yoʻl (zod → build → RPC → publish). */
export async function savePartner(
  prev: SavePartnerState,
  formData: FormData,
): Promise<SavePartnerState> {
  const session = await requireAdminAction();
  const revision = prev.revision + 1;
  let raw: unknown = null;
  try {
    raw = JSON.parse(String(formData.get("payload") ?? ""));
  } catch {
    return { status: "error", revision, message: NEWS_COPY.errors.generic };
  }
  const parsed = partnerPayloadSchema.safeParse(raw);
  if (!parsed.success) return { status: "error", revision, message: NEWS_COPY.errors.generic };
  const payload = parsed.data;
  if (payload.id && !payload.expected) return { status: "conflict", revision };
  const built = buildPartner(payload);
  if (!built.ok) return { status: "invalid", revision, errors: built.errors };
  const db = adminDb(session.accessToken);
  const { data, error } = await db.rpc("admin_save_partner", {
    p: built.input as unknown as Json,
    ...(payload.expected ? { expected: payload.expected } : {}),
  });
  const row = data?.[0];
  if (error || !row) return recordFailure(revision, error?.code);
  publish({ warm: warmPaths() });
  if (!payload.id) redirect(`/admin/hamkorlar/${row.id}?saqlandi=1`);
  return {
    status: "saved",
    revision,
    updatedAt: row.updated_at,
    data: { ...built.input, id: row.id, key: row.key },
  };
}

export async function deletePartner(id: string, expected: string): Promise<ActionResult> {
  const session = await requireAdminAction();
  if (!UUID_RE.test(id) || expected.length > 64)
    return { ok: false, message: NEWS_COPY.errors.generic };
  const db = adminDb(session.accessToken);
  const { error } = await db.rpc("admin_delete_partner", { target: id, expected });
  if (error) return { ok: false, message: recordMessage(error.code) };
  publish({ warm: warmPaths() });
  return { ok: true };
}

/** Tartib: hamma hamkorning kalitlari (guruhlar saytdagi tartibda ketma-ket). */
export async function reorderPartners(
  keys: readonly string[],
): Promise<ReorderResult<PartnerListRow>> {
  const session = await requireAdminAction();
  if (!keys.length || keys.length > 400 || !keys.every((k) => KEY_RE.test(k)))
    return { ok: false, message: NEWS_COPY.errors.generic };
  const db = adminDb(session.accessToken);
  const { error } = await db.rpc("admin_reorder", { entity: "partners", keys: [...keys] });
  if (error) return { ok: false, message: recordMessage(error.code) };
  publish({ warm: warmPaths() });
  try {
    return { ok: true, rows: await listPartners(db) };
  } catch {
    return { ok: false, message: NEWS_COPY.errors.generic };
  }
}

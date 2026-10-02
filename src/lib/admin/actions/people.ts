"use server";

import { redirect } from "next/navigation";

import type { PersonKind } from "@/content/types";

import { NEWS_COPY } from "../copy-news";
import type { Json } from "../database.types";
import { adminDb } from "../db";
import type { ActionResult } from "../db-errors";
import { requireAdminAction } from "../guard";
import { UUID_RE } from "../news/queries";
import { buildPerson } from "../people/build";
import { PERSON_KINDS, personWarmPaths } from "../people/kinds";
import { listPeople } from "../people/queries";
import { personPayloadSchema } from "../people/schema";
import type { PersonAdmin, PersonListRow } from "../people/types";
import { publish } from "../publish";
import { recordFailure, recordMessage, type RecordSaveState, type ReorderResult } from "../record";

type SavePersonState = RecordSaveState<PersonAdmin>;

const KEY_RE = /^[a-z][a-z0-9-]{0,63}$/;

function isKind(value: unknown): value is PersonKind {
  return value === "leader" || value === "expert";
}

/**
 * Eskirgan yozuvni baza PT409 bilan rad etadi. Yangi yozuv saqlangach tahrir sahifasiga oʻtiladi.
 */
export async function savePerson(
  prev: SavePersonState,
  formData: FormData,
): Promise<SavePersonState> {
  const session = await requireAdminAction();
  const revision = prev.revision + 1;
  let raw: unknown = null;
  try {
    raw = JSON.parse(String(formData.get("payload") ?? ""));
  } catch {
    return { status: "error", revision, message: NEWS_COPY.errors.generic };
  }
  const parsed = personPayloadSchema.safeParse(raw);
  if (!parsed.success) return { status: "error", revision, message: NEWS_COPY.errors.generic };
  const payload = parsed.data;
  /* Mavjud yozuv faqat kutilgan updated_at bilan: busiz boshqa oynadagi oʻzgarish ustidan yozilardi. */
  if (payload.id && !payload.expected) return { status: "conflict", revision };
  const built = buildPerson(payload);
  if (!built.ok) return { status: "invalid", revision, errors: built.errors };
  const db = adminDb(session.accessToken);
  const { data, error } = await db.rpc("admin_save_person", {
    p: built.input as unknown as Json,
    ...(payload.expected ? { expected: payload.expected } : {}),
  });
  const row = data?.[0];
  if (error || !row) return recordFailure(revision, error?.code);
  publish({ warm: personWarmPaths(payload.kind) });
  if (!payload.id) redirect(`${PERSON_KINDS[payload.kind].admin}/${row.id}?saqlandi=1`);
  return {
    status: "saved",
    revision,
    updatedAt: row.updated_at,
    data: { ...built.input, id: row.id, key: row.key },
  };
}

/** Odamni oʻchirish: saytdan darhol yoʻqoladi, jurnalda oldingi holati qoladi. */
export async function deletePerson(
  kind: PersonKind,
  id: string,
  expected: string,
): Promise<ActionResult> {
  const session = await requireAdminAction();
  if (!isKind(kind) || !UUID_RE.test(id) || expected.length > 64)
    return { ok: false, message: NEWS_COPY.errors.generic };
  const db = adminDb(session.accessToken);
  const { error } = await db.rpc("admin_delete_person", { target: id, expected });
  if (error) return { ok: false, message: recordMessage(error.code) };
  publish({ warm: personWarmPaths(kind) });
  return { ok: true };
}

/**
 * Tartib: bitta turdagi hamma odamning kalitlari yangi tartibda (qisman roʻyxatni baza rad etadi).
 * Javobda yangi updated_at lar bilan roʻyxat: tartiblash har qatorni oʻzgartiradi.
 */
export async function reorderPeople(
  kind: PersonKind,
  keys: readonly string[],
): Promise<ReorderResult<PersonListRow>> {
  const session = await requireAdminAction();
  if (!isKind(kind) || !keys.length || keys.length > 200 || !keys.every((k) => KEY_RE.test(k)))
    return { ok: false, message: NEWS_COPY.errors.generic };
  const db = adminDb(session.accessToken);
  const { error } = await db.rpc("admin_reorder", { entity: "people", keys: [...keys] });
  if (error) return { ok: false, message: recordMessage(error.code) };
  publish({ warm: personWarmPaths(kind) });
  try {
    return { ok: true, rows: await listPeople(db, kind) };
  } catch {
    return { ok: false, message: NEWS_COPY.errors.generic };
  }
}

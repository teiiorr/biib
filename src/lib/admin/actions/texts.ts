"use server";

import { z } from "zod";

import { pathFor } from "@/i18n/routes";
import { TEXT_KEY_RE } from "@/i18n/text-overrides";

import { SYSTEM_COPY } from "../copy-system";
import { NEWS_COPY } from "../copy-news";
import type { Json } from "../database.types";
import { adminDb } from "../db";
import { dbErrorKind, type ActionResult } from "../db-errors";
import { requireAdminAction } from "../guard";
import { publish } from "../publish";
import { buildText, tokensOf } from "../texts/build";
import { catalogEntry } from "../texts/catalog";
import { textIsFresh } from "../texts/queries";
import type { SaveTextState } from "../texts/types";

const E = SYSTEM_COPY.texts.errors;
/* Uzun roʻyxat (maxfiylik boʻlimi) ham sigʻadi; undan kattasi xato yuborilgan maʼlumot. */
const TEXT_MAX = 20_000;
const text = z.string().max(TEXT_MAX);

const payloadSchema = z.object({
  key: z.string().max(160).regex(TEXT_KEY_RE),
  value: z.object({ uz: text, oz: text, ozbekca: text, ru: text, en: text }),
  expected: z.string().max(64).nullable(),
});

function failure(revision: number, code: string | undefined): SaveTextState {
  const kind = dbErrorKind({ code });
  if (kind === "conflict" || kind === "notFound") return { status: "conflict", revision };
  const message = kind === "denied" ? NEWS_COPY.errors.denied : E.generic;
  return { status: "error", revision, message };
}

/**
 * Lugʻat matnini almashtirish: kalit oʻzbekcha lugʻatda boʻlishi, turi (satr yoki roʻyxat) va {belgi}lar
 * toʻplami mos kelishi shart; qiymat meʼyorlanadi (build.ts). Keyin eskirganlik, admin_save_text va
 * hamma sahifa darhol yangilanadi.
 */
export async function saveText(prev: SaveTextState, formData: FormData): Promise<SaveTextState> {
  const session = await requireAdminAction();
  const revision = prev.revision + 1;
  let raw: unknown = null;
  try {
    raw = JSON.parse(String(formData.get("payload") ?? ""));
  } catch {
    return { status: "error", revision, message: E.generic };
  }
  const parsed = payloadSchema.safeParse(raw);
  if (!parsed.success) return { status: "error", revision, message: E.generic };
  const { key, value, expected } = parsed.data;
  const entry = catalogEntry(key);
  if (!entry) return { status: "error", revision, message: E.notFound };
  const built = buildText({ kind: entry.kind, tokens: tokensOf(entry.bundled.uz) }, value);
  if (!built.ok) return { status: "invalid", revision, errors: built.errors };
  const db = adminDb(session.accessToken);
  try {
    if (!(await textIsFresh(db, key, expected))) return { status: "conflict", revision };
  } catch {
    return { status: "error", revision, message: E.generic };
  }
  const { data: updatedAt, error } = await db.rpc("admin_save_text", {
    text_key: key,
    text_value: built.value as unknown as Json,
    ...(expected ? { expected } : {}),
  });
  if (error || !updatedAt) return failure(revision, error?.code);
  publish({ warm: [pathFor("uz", "home")] });
  return { status: "saved", revision, updatedAt, value: built.value };
}

/** «Asliga qaytarish»: almashtirish oʻchadi, saytda lugʻatdagi asl matn qoladi. */
export async function restoreText(key: string): Promise<ActionResult> {
  const session = await requireAdminAction();
  if (typeof key !== "string" || key.length > 160 || !TEXT_KEY_RE.test(key))
    return { ok: false, message: E.notFound };
  const { error } = await adminDb(session.accessToken).rpc("admin_delete_text", { text_key: key });
  if (error) {
    const denied = dbErrorKind(error) === "denied";
    return { ok: false, message: denied ? NEWS_COPY.errors.denied : E.restoreFailed };
  }
  publish({ warm: [pathFor("uz", "home")] });
  return { ok: true };
}

"use server";

import { redirect } from "next/navigation";

import { pathFor } from "@/i18n/routes";

import { NEWS_COPY } from "../copy-news";
import type { Json } from "../database.types";
import { adminDb } from "../db";
import { dbErrorKind, type ActionResult } from "../db-errors";
import { requireAdminAction } from "../guard";
import { buildNews } from "../news/build";
import { firstFreeSlug, freshness } from "../news/checks";
import { UUID_RE } from "../news/queries";
import { payloadSchema } from "../news/schema";
import type { SaveNewsState } from "../news/types";
import { newsWarmPaths, publish } from "../publish";

const E = NEWS_COPY.errors;

function failure(revision: number, code: string | undefined): SaveNewsState {
  const kind = dbErrorKind({ code });
  if (kind === "conflict") return { status: "conflict", revision };
  if (kind === "slugTaken") return { status: "invalid", revision, errors: { slug: E.slugTaken } };
  const message =
    kind === "notFound"
      ? E.notFound
      : kind === "media"
        ? E.media
        : kind === "denied"
          ? E.denied
          : E.generic;
  return { status: "error", revision, message };
}

/** Eskirgan yozuv saqlanmaydi. Yangi yozuv saqlangach oʻz tahrir sahifasiga oʻtiladi. */
export async function saveNews(prev: SaveNewsState, formData: FormData): Promise<SaveNewsState> {
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
  const payload = parsed.data;
  const db = adminDb(session.accessToken);
  let slug = payload.slug;
  try {
    if (payload.id) {
      const state = payload.expected ? await freshness(db, payload.id, payload.expected) : "stale";
      if (state === "stale") return { status: "conflict", revision };
      if (state === "missing") return { status: "error", revision, message: E.notFound };
    }
    /* Avtomatik havola band boʻlsa -2, -3 …; qoʻlda yozilgani oʻzgartirilmaydi, faqat tekshiriladi. */
    if (slug && payload.slugMode === "auto")
      slug = (await firstFreeSlug(db, slug, payload.id)) ?? slug;
  } catch {
    return { status: "error", revision, message: E.generic };
  }
  const built = buildNews({ ...payload, slug });
  if (!built.ok) return { status: "invalid", revision, errors: built.errors };
  const { data, error } = await db.rpc("admin_save_news", {
    p: built.input as unknown as Json,
    ...(payload.expected ? { expected: payload.expected } : {}),
  });
  const row = data?.[0];
  if (error || !row) return failure(revision, error?.code);
  publish({ slugs: [row.slug, row.old_slug], warm: newsWarmPaths(row.slug) });
  if (!payload.id) redirect(`/admin/yangiliklar/${row.id}?saqlandi=1`);
  return {
    status: "saved",
    revision,
    updatedAt: row.updated_at,
    data: { ...built.input, id: row.id, slug: row.slug },
  };
}

/** Havola maydoni uchun: shu havola yoki birinchi boʻsh -N varianti (faqat oʻqish). */
export async function suggestSlug(base: string, own: string | null): Promise<string | null> {
  const session = await requireAdminAction({ write: false });
  if (!/^[a-z0-9-]{1,80}$/.test(base) || (own !== null && !UUID_RE.test(own))) return null;
  try {
    return await firstFreeSlug(adminDb(session.accessToken), base, own);
  } catch {
    return null;
  }
}

/** Yangilikni oʻchirish: beshta tildagi sahifa darhol 404 ga oʻtadi. */
export async function deleteNews(id: string, expected: string): Promise<ActionResult> {
  const session = await requireAdminAction();
  if (!UUID_RE.test(id)) return { ok: false, message: E.notFound };
  const db = adminDb(session.accessToken);
  const state = await freshness(db, id, expected).catch(() => null);
  if (state === "stale") return { ok: false, message: NEWS_COPY.save.conflict };
  if (state === "missing") return { ok: false, message: E.notFound };
  const { data: slug, error } = await db.rpc("admin_delete_news", { target: id, expected });
  if (error) {
    const kind = dbErrorKind(error);
    const message =
      kind === "conflict" ? NEWS_COPY.save.conflict : kind === "notFound" ? E.notFound : E.generic;
    return { ok: false, message };
  }
  publish({ slugs: [slug], warm: [pathFor("uz", "home"), pathFor("uz", "news")] });
  return { ok: true };
}

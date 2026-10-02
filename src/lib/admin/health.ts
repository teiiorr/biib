import "server-only";

import { contentSource, type ContentSource } from "@/lib/cms/env";

import type { Json } from "./database.types";
import type { AdminDb } from "./db";

export interface NewsCounts {
  readonly total: number;
  readonly confirmed: number;
  readonly draft: number;
  readonly pending: number;
}

export interface SiteHealth {
  /** Ommaviy sahifalar maʼlumotni qayerdan oʻqiydi (Vercel muhitida supabase). */
  readonly source: ContentSource;
  readonly reachable: boolean;
  /** Bazadagi nusxa hozir yigʻilgan vaqt (content_snapshot generatedAt). */
  readonly generatedAt: string | null;
  readonly news: NewsCounts | null;
  readonly people: number | null;
}

function list(value: Json | undefined): readonly Json[] {
  return Array.isArray(value) ? value : [];
}

function record(value: Json | undefined): Readonly<Record<string, Json | undefined>> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? value : null;
}

/**
 * Ommaviy sahifalar oʻqiydigan content_snapshot() chaqiriladi: javob kelsa baza ishlayapti,
 * hisoblagichlar esa undagi yozuvlardan olinadi.
 */
export async function siteHealth(db: AdminDb): Promise<SiteHealth> {
  const source = contentSource();
  const { data, error } = await db.rpc("content_snapshot");
  const snapshot = error ? null : record(data);
  if (!snapshot) return { source, reachable: false, generatedAt: null, news: null, people: null };
  const statuses = list(snapshot.news).map((item) => record(item)?.status);
  const count = (status: string) => statuses.filter((value) => value === status).length;
  return {
    source,
    reachable: true,
    generatedAt: typeof snapshot.generatedAt === "string" ? snapshot.generatedAt : null,
    news: {
      total: statuses.length,
      confirmed: count("confirmed"),
      draft: count("draft"),
      pending: count("pending"),
    },
    people: list(snapshot.leadership).length + list(snapshot.experts).length,
  };
}

import "server-only";

import type { z } from "zod";

import { ICON_NAMES } from "@/components/icons/paths";

import type { AdminDb } from "../db";
import type { StoredMilestone } from "./milestones";
import {
  contactsSchema,
  getResult,
  milestoneSchema,
  projectSchema,
  shotsSchema,
  socialsSchema,
} from "./schema";
import type { ContactsAdmin, ProjectAdmin, ShotAdmin, SocialAdmin } from "./types";

export interface Loaded<T> {
  readonly data: T;
  /** updated_at yoki yakka roʻyxatlarda maʼlumotning oʻz izi. */
  readonly version: string | null;
}

async function adminGet<T>(db: AdminDb, entity: string, schema: z.ZodType<T>): Promise<Loaded<T>> {
  const { data, error } = await db.rpc("admin_get", { entity });
  if (error) throw new Error(`admin_get ${entity}: ${error.code}`);
  const parsed = getResult(schema).safeParse(data);
  if (!parsed.success) throw new Error(`admin_get ${entity}: shakl notoʻgʻri`);
  return { data: parsed.data.data, version: parsed.data.updatedAt };
}

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === "object") {
    const entries = Object.entries(value).filter(([, v]) => v !== undefined);
    return Object.fromEntries(
      entries.sort(([a], [b]) => (a < b ? -1 : 1)).map(([k, v]) => [k, sortKeys(v)]),
    );
  }
  return value;
}

/**
 * Kalitlar tartibiga bogʻliq boʻlmagan maʼlumot izi. Vaqt belgisi yoʻq roʻyxatlarda (tarmoqlar,
 * galereya) boshqa oynadagi oʻzgarish va saqlashdagi haqiqiy farq shu iz orqali bilinadi.
 */
export function fingerprint(value: unknown): string {
  return JSON.stringify(sortKeys(value));
}

export function loadContacts(db: AdminDb): Promise<Loaded<ContactsAdmin>> {
  return adminGet(db, "contacts", contactsSchema);
}

/** Aloqa shakli ikki yozuvni birga tahrirlaydi, shu sabab kutilgan versiya ikkalasining izi. */
export function contactsVersion(updatedAt: string | null, socials: readonly SocialAdmin[]): string {
  return JSON.stringify([updatedAt, fingerprint(socials)]);
}

export async function loadSocials(db: AdminDb): Promise<Loaded<readonly SocialAdmin[]>> {
  const { data } = await adminGet(db, "socials", socialsSchema);
  return { data, version: fingerprint(data) };
}

export function loadProject(db: AdminDb): Promise<Loaded<ProjectAdmin>> {
  return adminGet(db, "project", projectSchema);
}

export async function loadShots(db: AdminDb): Promise<Loaded<readonly ShotAdmin[]>> {
  const { data } = await adminGet(db, "upop_shots", shotsSchema);
  return { data, version: fingerprint(data) };
}

const ICONS: ReadonlySet<string> = new Set(ICON_NAMES);

/** Tartib saytdagidek. Belgi saytdagi roʻyxatda boʻlmasa, taqvim belgisi qoʻyiladi. */
export async function listMilestones(db: AdminDb): Promise<readonly StoredMilestone[]> {
  const { data, error } = await db
    .from("milestones")
    .select("id, key, status, year, title, icon, sort_order, updated_at")
    .order("sort_order")
    .order("key");
  if (error) throw new Error(`milestones: ${error.code}`);
  return data.flatMap((row) => {
    const parsed = milestoneSchema.safeParse({
      id: row.id,
      key: row.key,
      status: row.status,
      year: row.year,
      title: row.title,
      icon: ICONS.has(row.icon) ? row.icon : "calendar",
      sortOrder: row.sort_order,
    });
    return parsed.success
      ? [{ id: row.id, key: row.key, updatedAt: row.updated_at, data: parsed.data }]
      : [];
  });
}

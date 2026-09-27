import type { IconName } from "@/components/icons/paths";
import type { ContentStatus, Localized } from "@/content/types";

import { ORG_COPY } from "../copy-org";
import { emptyLocalized } from "../text/locales";
import { parseInteger, requiredLocalized, type ErrorBag } from "./fields";
import type { MilestoneAdmin, OrgSaveState } from "./types";

/* Biz haqimizda sahifasidagi belgi plitkalari oilasi: yoʻnalishlar, vazifalar va tarix belgilari. */
export const MILESTONE_ICONS = [
  "calendar",
  "users",
  "building",
  "star",
  "heart",
  "ticket",
  "map-pin",
  "mic",
  "mask",
  "palette",
  "film",
  "play",
  "news",
  "projects",
  "shield",
] as const satisfies readonly IconName[];

/** Tahrirdagi bitta bosqich. local: React kaliti va xato yoʻli (nuqtasiz). */
export interface MilestoneRow {
  readonly local: string;
  readonly id: string | null;
  readonly key: string | null;
  readonly updatedAt: string | null;
  readonly status: ContentStatus;
  readonly year: string;
  readonly title: Localized;
  readonly icon: IconName;
}

export interface MilestonesDraft {
  readonly rows: readonly MilestoneRow[];
}

/** Bazadagi qator: roʻyxat soʻrovi shu shaklni qaytaradi. */
export interface StoredMilestone {
  readonly id: string;
  readonly key: string;
  readonly updatedAt: string;
  readonly data: MilestoneAdmin;
}

export type SaveMilestonesState = OrgSaveState<readonly StoredMilestone[]>;

export function rowFromStored(stored: StoredMilestone): MilestoneRow {
  return {
    local: stored.id,
    id: stored.id,
    key: stored.key,
    updatedAt: stored.updatedAt,
    status: stored.data.status,
    year: stored.data.year === null ? "" : String(stored.data.year),
    title: stored.data.title,
    icon: stored.data.icon,
  };
}

/** Yangi bosqich qoralama holatida: saytga faqat tasdiqlab, yil yozilganda chiqadi. */
export function emptyRow(local: string): MilestoneRow {
  return {
    local,
    id: null,
    key: null,
    updatedAt: null,
    status: "draft",
    year: "",
    title: emptyLocalized(),
    icon: "calendar",
  };
}

export function milestoneErrorOrder(draft: MilestonesDraft): readonly string[] {
  return draft.rows.flatMap((row) => [`${row.local}-year`, `${row.local}-title`]);
}

export interface BuiltMilestone {
  readonly local: string;
  readonly input: MilestoneAdmin;
}

export type MilestonesBuild =
  | { readonly ok: true; readonly rows: readonly BuiltMilestone[] }
  | { readonly ok: false; readonly errors: ErrorBag };

/** Hamma qatorlar tekshiriladi (xatolar bitta roʻyxatda), saqlanadigani tanlashni chaqiruvchi hal qiladi. */
export function buildMilestones(draft: MilestonesDraft): MilestonesBuild {
  const errors: ErrorBag = {};
  const rows = draft.rows.map((row): BuiltMilestone => {
    const title = requiredLocalized(errors, `${row.local}-title`, row.title);
    const year = parseInteger(row.year);
    if (year !== null && !(year >= 1990 && year <= 2100))
      errors[`${row.local}-year`] = ORG_COPY.errors.year;
    return {
      local: row.local,
      input: {
        ...(row.id ? { id: row.id } : {}),
        ...(row.key ? { key: row.key } : {}),
        status: row.status,
        year: year !== null && Number.isFinite(year) ? year : null,
        title,
        icon: row.icon,
      },
    };
  });
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, rows };
}

/** Saqlanmagan oʻzgarish izi: bitta qator uchun (qaysi qatorni saqlash kerakligi shu bilan). */
export function rowKey(row: MilestoneRow): string {
  return JSON.stringify([row.id, row.status, row.year, row.title, row.icon]);
}

/**
 * Serverga ketadigan yuk: har qatorda «oʻzgarganmi» belgisi (faqat shular saqlanadi) va tartib qayta
 * yozilishi kerakmi. Yangi qatorlar oxirida boʻlsa baza ularni oʻzi oxiriga qoʻyadi: tartib kerak emas.
 */
export function milestonesPayload(draft: MilestonesDraft, baseline: MilestonesDraft) {
  const before = new Map(baseline.rows.map((row) => [row.local, rowKey(row)]));
  const saved = draft.rows.filter((row) => row.id).map((row) => row.local);
  const expected = baseline.rows.map((row) => row.local).filter((local) => saved.includes(local));
  const firstNew = draft.rows.findIndex((row) => !row.id);
  const newInside = firstNew >= 0 && draft.rows.slice(firstNew).some((row) => row.id);
  return {
    rows: draft.rows.map((row) => ({ ...row, changed: before.get(row.local) !== rowKey(row) })),
    reorder: newInside || saved.join(" ") !== expected.join(" "),
  };
}

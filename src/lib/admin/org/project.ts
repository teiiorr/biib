import type { ContentStatus, Localized } from "@/content/types";
import { LOCALES } from "@/i18n/locales";

import { ORG_COPY } from "../copy-org";
import { UPOP_COPY } from "../copy-upop";
import { emptyLocalized } from "../text/locales";
import {
  httpsUrl,
  optionalLocalized,
  parseInteger,
  perLocale,
  requiredLocalized,
  type DetailDraft,
  type ErrorBag,
} from "./fields";
import type { MediaAlt, MediaRole, OrgSaveState, ProjectAdmin } from "./types";

export const FACT_KEYS = ["format", "place", "schedule", "teacher"] as const;
export type FactKey = (typeof FACT_KEYS)[number];
export const MEDIA_ROLES: readonly MediaRole[] = ["loop", "film", "wordmark"];
export const HIGHLIGHT_MAX = 3;

export type CostChoice = "free" | "paid" | "unknown";

export type SaveProjectState = OrgSaveState<ProjectAdmin>;

export interface HighlightDraft {
  readonly local: string;
  readonly text: Localized;
}

/** UPOP tahririda nom, shior va video fayllari yoʻq: bazadagi qiymati saqlashda oʻzgarmaydi. */
export interface ProjectDraft {
  readonly status: ContentStatus;
  readonly ageFrom: string;
  readonly ageTo: string;
  readonly ageStatus: ContentStatus;
  readonly facts: Readonly<Record<FactKey, DetailDraft<Localized>>>;
  readonly cost: CostChoice;
  readonly costStatus: ContentStatus;
  readonly externalHref: string;
  readonly externalLabel: string;
  readonly highlights: readonly HighlightDraft[];
  readonly alts: Readonly<Partial<Record<MediaRole, Localized>>>;
}

function costChoice(free: boolean | null): CostChoice {
  return free === null ? "unknown" : free ? "free" : "paid";
}

export function draftFromProject(data: ProjectAdmin): ProjectDraft {
  const count = Math.max(...LOCALES.map((locale) => data.highlights[locale].length), 0);
  const highlights = Array.from({ length: Math.min(count, HIGHLIGHT_MAX) }, (_, index) => ({
    local: `h${index}`,
    text: perLocale((locale) => data.highlights[locale][index] ?? ""),
  }));
  const alts: Partial<Record<MediaRole, Localized>> = {};
  for (const role of MEDIA_ROLES) {
    const media = data.media[role];
    if (media) alts[role] = media.alt;
  }
  return {
    status: data.status,
    ageFrom: String(data.age.from),
    ageTo: String(data.age.to),
    ageStatus: data.age.status,
    facts: {
      format: { value: data.format.value ?? emptyLocalized(), status: data.format.status },
      place: { value: data.place.value ?? emptyLocalized(), status: data.place.status },
      schedule: { value: data.schedule.value ?? emptyLocalized(), status: data.schedule.status },
      teacher: { value: data.teacher.value ?? emptyLocalized(), status: data.teacher.status },
    },
    cost: costChoice(data.cost.free),
    costStatus: data.cost.status,
    externalHref: data.external.href,
    externalLabel: data.external.label,
    highlights,
    alts,
  };
}

export function projectErrorOrder(draft: ProjectDraft): readonly string[] {
  return [
    "ageFrom",
    "ageTo",
    ...FACT_KEYS,
    "externalHref",
    "externalLabel",
    ...draft.highlights.map((h) => h.local),
    ...MEDIA_ROLES.map((role) => `alt-${role}`),
  ];
}

function age(errors: ErrorBag, draft: ProjectDraft): { from: number; to: number } {
  const from = parseInteger(draft.ageFrom);
  const to = parseInteger(draft.ageTo);
  const valid = (n: number | null): n is number => n !== null && n >= 3 && n <= 30;
  if (!valid(from)) errors.ageFrom = UPOP_COPY.project.ageRange;
  if (!valid(to)) errors.ageTo = UPOP_COPY.project.ageRange;
  else if (valid(from) && to < from) errors.ageTo = UPOP_COPY.project.ageOrder;
  return { from: from ?? 0, to: to ?? 0 };
}

export type ProjectBuild =
  | { readonly ok: true; readonly input: ProjectAdmin }
  | { readonly ok: false; readonly errors: ErrorBag };

/** Bazadagi yozuvdan faqat panelda tahrirlanmaydigan qismlar olinadi: nom, shior va video holati. */
export function buildProject(draft: ProjectDraft, base: ProjectAdmin): ProjectBuild {
  const errors: ErrorBag = {};
  const { from, to } = age(errors, draft);
  const fact = (key: FactKey) => {
    const { value, status } = draft.facts[key];
    return { value: optionalLocalized(errors, key, value, status), status };
  };
  const facts = {
    format: fact("format"),
    place: fact("place"),
    schedule: fact("schedule"),
    teacher: fact("teacher"),
  };
  const href = httpsUrl(draft.externalHref);
  if (!href) errors.externalHref = ORG_COPY.errors.https;
  const label = draft.externalLabel.trim();
  if (!label) errors.externalLabel = ORG_COPY.errors.label;
  const texts = draft.highlights
    .slice(0, HIGHLIGHT_MAX)
    .map((item) => requiredLocalized(errors, item.local, item.text));
  const media: Partial<Record<MediaRole, MediaAlt>> = {};
  for (const role of MEDIA_ROLES) {
    const current = base.media[role];
    const alt = draft.alts[role];
    if (!current || !alt) continue;
    media[role] = { ...current, alt: requiredLocalized(errors, `alt-${role}`, alt) };
  }
  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    input: {
      ...base,
      status: draft.status,
      age: { from, to, status: draft.ageStatus },
      ...facts,
      cost: {
        free: draft.cost === "unknown" ? null : draft.cost === "free",
        status: draft.costStatus,
      },
      highlights: perLocale((locale) => texts.map((text) => text[locale])),
      external: { href: href ?? "", label },
      media,
    },
  };
}

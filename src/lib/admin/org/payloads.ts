import { z } from "zod";

import { ICON_NAMES } from "@/components/icons/paths";

import type { ContactsDraft } from "./contacts";
import { SLOT_COUNT, UPOP_FRAMES, UPOP_MOTIONS, type SlotPayload } from "./gallery";
import type { MilestoneRow } from "./milestones";
import type { ProjectDraft } from "./project";
import { statusSchema } from "./schema";

/* Brauzerdan kelgan yuk: faqat tuzilma va uzunlik chegarasi (katta yuk bazagacha bormasin). Mazmun
   qoidalari build funksiyalarida, brauzerdagi bilan bir xil. */

const SHORT = 400;

function localized(max = SHORT) {
  const value = z.string().max(max);
  return z.object({ uz: value, oz: value, ozbekca: value, ru: value, en: value });
}

function detail<T extends z.ZodType>(value: T) {
  return z.object({ value, status: statusSchema });
}

const line = z.string().max(SHORT);
const version = z.string().max(20_000).nullable();

export const contactsPayload = z.object({
  draft: z.object({
    address: detail(localized()),
    postalCode: z.string().max(20),
    locality: line,
    phones: detail(z.array(z.string().max(40)).max(10)),
    email: detail(line),
    telegram: detail(line),
    hours: detail(localized()),
    map: z.object({ lat: z.string().max(30), lng: z.string().max(30), status: statusSchema }),
    socials: z
      .array(
        z.object({
          id: z.enum(["telegram", "instagram", "youtube", "facebook"]),
          href: line,
          label: z.string().max(80),
          status: statusSchema,
        }),
      )
      .max(4),
  }) satisfies z.ZodType<ContactsDraft>,
  expected: version,
});

const milestoneRow = z.object({
  local: z.string().regex(/^[\w-]{1,64}$/),
  id: z.uuid().nullable(),
  key: z.string().max(80).nullable(),
  updatedAt: z.string().max(64).nullable(),
  status: statusSchema,
  year: z.string().max(10),
  title: localized(),
  icon: z.enum(ICON_NAMES),
}) satisfies z.ZodType<MilestoneRow>;

export const milestonesPayload = z.object({
  rows: z.array(milestoneRow.extend({ changed: z.boolean() })).max(60),
  reorder: z.boolean(),
});

const factDraft = detail(localized(1000));

export const projectPayload = z.object({
  draft: z.object({
    status: statusSchema,
    ageFrom: z.string().max(10),
    ageTo: z.string().max(10),
    ageStatus: statusSchema,
    facts: z.object({
      format: factDraft,
      place: factDraft,
      schedule: factDraft,
      teacher: factDraft,
    }),
    cost: z.enum(["free", "paid", "unknown"]),
    costStatus: statusSchema,
    externalHref: line,
    externalLabel: z.string().max(80),
    highlights: z
      .array(z.object({ local: z.string().regex(/^[\w-]{1,32}$/), text: localized() }))
      .max(3),
    alts: z.object({
      loop: localized().exactOptional(),
      film: localized().exactOptional(),
      wordmark: localized().exactOptional(),
    }),
  }) satisfies z.ZodType<ProjectDraft>,
  expected: version,
});

const slot = z.object({
  mediaId: z.uuid(),
  kind: z.enum(["image", "video"]),
  posterId: z.uuid().nullable(),
  frame: z.enum(UPOP_FRAMES),
  motion: z.enum(UPOP_MOTIONS),
  alt: localized(),
}) satisfies z.ZodType<SlotPayload>;

export const galleryPayload = z.object({
  slots: z.array(slot.nullable()).max(SLOT_COUNT),
  version,
});

/** Yashirin maydondagi JSON: buzilgan yoki begona shakl — null. */
export function readPayload<T>(schema: z.ZodType<T>, formData: FormData): T | null {
  try {
    const parsed = schema.safeParse(JSON.parse(String(formData.get("payload") ?? "")));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

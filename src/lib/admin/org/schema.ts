import { z } from "zod";

import { ICON_NAMES } from "@/components/icons/paths";

import { UPOP_FRAMES, UPOP_MOTIONS } from "./gallery";
import type { ContactsAdmin, MilestoneAdmin, ProjectAdmin, ShotAdmin, SocialAdmin } from "./types";

/* Jurnaldagi eski yozuv ham shu shakllar bilan oʻqiladi va qaytarishdan oldin tekshiriladi.
   Mazmun qoidalari build funksiyalarida. */

function localized<T extends z.ZodType>(value: T) {
  return z.object({ uz: value, oz: value, ozbekca: value, ru: value, en: value });
}

export const statusSchema = z.enum(["confirmed", "draft", "pending"]);
const text = localized(z.string());
const network = z.enum(["telegram", "instagram", "youtube", "facebook"]);

function detail<T extends z.ZodType>(value: T) {
  return z.object({ value: value.nullable(), status: statusSchema });
}

export const contactsSchema: z.ZodType<ContactsAdmin> = z.object({
  address: detail(text),
  postalCode: z.string().nullable(),
  locality: z.string().nullable(),
  phones: detail(z.array(z.string())),
  email: detail(z.string()),
  telegram: detail(z.string()),
  hours: detail(text),
  map: detail(z.object({ lat: z.number(), lng: z.number() })),
});

export const socialsSchema: z.ZodType<readonly SocialAdmin[]> = z
  .array(z.object({ id: network, href: z.string(), label: z.string(), status: statusSchema }))
  .max(4);

export const milestoneSchema: z.ZodType<MilestoneAdmin> = z.object({
  id: z.uuid().exactOptional(),
  key: z.string().exactOptional(),
  status: statusSchema,
  year: z.number().int().nullable(),
  title: text,
  icon: z.enum(ICON_NAMES),
  sortOrder: z.number().int().exactOptional(),
});

const mediaAlt = z.object({ alt: text, status: statusSchema.exactOptional() });

export const projectSchema: z.ZodType<ProjectAdmin> = z.object({
  key: z.literal("upop-trend"),
  status: statusSchema,
  flagship: z.boolean(),
  name: text,
  tagline: text,
  age: z.object({ from: z.number().int(), to: z.number().int(), status: statusSchema }),
  format: detail(text),
  place: detail(text),
  schedule: detail(text),
  teacher: detail(text),
  cost: z.object({ free: z.boolean().nullable(), status: statusSchema }),
  highlights: localized(z.array(z.string()).max(3)),
  external: z.object({ href: z.string(), label: z.string() }),
  media: z.object({
    loop: mediaAlt.exactOptional(),
    film: mediaAlt.exactOptional(),
    wordmark: mediaAlt.exactOptional(),
  }),
});

export const shotsSchema: z.ZodType<readonly ShotAdmin[]> = z
  .array(
    z.object({
      position: z.number().int().min(1).max(8),
      mediaId: z.uuid(),
      posterId: z.uuid().nullable(),
      frame: z.enum(UPOP_FRAMES),
      motion: z.enum(UPOP_MOTIONS),
      alt: text.nullable(),
    }),
  )
  .max(8);

/** Yakka yozuvlarda kutilgan updated_at null boʻlishi mumkin. */
export function getResult<T>(data: z.ZodType<T>) {
  return z.object({ data, updatedAt: z.string().nullable() });
}

export const orderSchema = z.object({
  entity: z.enum(["people", "partners", "milestones"]),
  keys: z.array(z.string().max(80)).min(1).max(500),
});

import { z } from "zod";

import type { PersonAdmin, PersonPayload } from "./types";

function localized<T extends z.ZodType>(value: T) {
  return z.object({ uz: value, oz: value, ozbekca: value, ru: value, en: value });
}

export const statusSchema = z.enum(["confirmed", "draft", "pending"]);
const kind = z.enum(["leader", "expert"]);
/* Uzunlik chegarasi tasodifiy yoki zararli katta yukni bazagacha yetkazmaydi. */
const short = localized(z.string().max(400));

/** Bu yerda faqat tuzilma tekshiriladi, mazmun qoidalari build.ts faylida. */
export const personPayloadSchema: z.ZodType<PersonPayload> = z.object({
  id: z.uuid().nullable(),
  expected: z.string().max(64).nullable(),
  kind,
  status: statusSchema,
  name: short,
  role: short,
  field: short,
  bio: localized(z.string().max(4000)),
  email: z.string().max(200),
  photoId: z.uuid().nullable(),
});

const text = localized(z.string());

export const personAdminSchema: z.ZodType<PersonAdmin> = z.object({
  id: z.uuid().exactOptional(),
  key: z.string().exactOptional(),
  kind,
  status: statusSchema,
  name: text.nullable(),
  role: text,
  field: text.nullable(),
  bio: text.nullable(),
  photoId: z.uuid().nullable(),
  email: z.string().nullable(),
  sortOrder: z.number().int().exactOptional(),
});

export const personResultSchema = z
  .object({ data: personAdminSchema, updatedAt: z.string() })
  .nullable();

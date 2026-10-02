import { z } from "zod";

import { statusSchema } from "../people/schema";
import type { PartnerAdmin, PartnerPayload } from "./types";

function localized<T extends z.ZodType>(value: T) {
  return z.object({ uz: value, oz: value, ozbekca: value, ru: value, en: value });
}

const group = z.enum(["state", "international", "creative", "sponsors"]);

/** Bu yerda faqat tuzilma tekshiriladi, mazmun qoidalari build.ts faylida. */
export const partnerPayloadSchema: z.ZodType<PartnerPayload> = z.object({
  id: z.uuid().nullable(),
  expected: z.string().max(64).nullable(),
  status: statusSchema,
  group,
  name: localized(z.string().max(400)),
  href: z.string().max(400),
  logoId: z.uuid().nullable(),
});

export const partnerAdminSchema: z.ZodType<PartnerAdmin> = z.object({
  id: z.uuid().exactOptional(),
  key: z.string().exactOptional(),
  status: statusSchema,
  group,
  name: localized(z.string()).nullable(),
  logoId: z.uuid().nullable(),
  href: z.string().nullable(),
  sortOrder: z.number().int().exactOptional(),
});

export const partnerResultSchema = z
  .object({ data: partnerAdminSchema, updatedAt: z.string() })
  .nullable();

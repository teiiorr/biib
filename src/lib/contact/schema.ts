import { z } from "zod";

import { MIN_MESSAGE } from "./shared";

const phone = /^\+?[\d\s()-]{7,20}$/;
const email = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  contact: z
    .string()
    .trim()
    .refine((v) => phone.test(v) || email.test(v), { message: "contact" }),
  message: z.string().trim().min(MIN_MESSAGE).max(2000),
  consent: z.literal("on"),
  /* Bot tuzogʻi: odam toʻldirmaydi. */
  website: z.string().max(0),
  startedAt: z.coerce.number().int().positive(),
});

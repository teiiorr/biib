import { z } from "zod";

import type { NewsAdmin, NewsPayload } from "./types";

/* Maydon uzunligi chegarasi: tasodifiy yoki zararli katta yuk bazagacha bormaydi. */
const SHORT = 400;
const LONG = 40_000;

function localized<T extends z.ZodType>(value: T) {
  return z.object({ uz: value, oz: value, ozbekca: value, ru: value, en: value });
}

const status = z.enum(["confirmed", "draft", "pending"]);
const artSlot = z.enum(["art-1", "art-2", "art-3", "art-4", "art-5", "art-6", "art-7"]);
const story = z.object({ primary: artSlot, secondary: artSlot });
const short = localized(z.string().max(SHORT));

/** Brauzerdan kelgan yuk: tuzilma tekshiriladi, mazmun qoidalari build.ts da. */
export const payloadSchema: z.ZodType<NewsPayload> = z.object({
  id: z.uuid().nullable(),
  expected: z.string().max(64).nullable(),
  slug: z.string().max(80),
  slugMode: z.enum(["auto", "manual"]),
  status,
  date: z.string().max(10),
  topic: short,
  title: short,
  lead: localized(z.string().max(1000)),
  body: localized(z.string().max(LONG)),
  quote: localized(z.string().max(1000)),
  coverId: z.uuid().nullable(),
  coverAlt: short,
  coverStatus: status,
  story,
  photoIds: z.array(z.uuid()).max(60),
});

const text = localized(z.string());

/** Bazadagi admin shakli (admin_get, jurnal): eski yozuv ham shu bilan oʻqiladi. */
export const adminSchema: z.ZodType<NewsAdmin> = z.object({
  id: z.uuid().exactOptional(),
  slug: z.string(),
  status,
  date: z.string(),
  topic: text,
  title: text,
  lead: text,
  body: localized(z.array(z.string())),
  quote: text.nullable(),
  cover: z.object({ mediaId: z.uuid().nullable(), alt: text, status }),
  story,
  photos: z.array(z.object({ mediaId: z.uuid() })),
});

export const getResultSchema = z.object({ data: adminSchema, updatedAt: z.string() }).nullable();

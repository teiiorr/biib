import { z } from "zod";

import { ICON_NAMES } from "../components/icons/paths";
import { NEWS_SLUG_MAX, NEWS_SLUG_RE } from "../i18n/routes";
import type { PreparedImage } from "@/lib/images/manifest";
import type {
  Artwork,
  Contacts,
  Localized,
  Milestone,
  NewsArticle,
  Partner,
  Person,
  Project,
  UpopFrame,
  UpopMotion,
  UpopShot,
} from "./types";

/**
 * Butun sayt kontenti bitta nusxada: sahifalar faqat shu nusxadan selektorlar orqali oʻqiydi
 * (select.ts). Manba maʼlumotlar bazasidagi content_snapshot() yoki uning repodagi nusxasi
 * (snapshot.json, bundled.ts). Shakl oʻzgarsa versiya oshiriladi: eski keshlar aralashmaydi.
 */
export const SNAPSHOT_VERSION = 1;

export interface ContentSnapshot {
  readonly version: typeof SNAPSHOT_VERSION;
  readonly projects: readonly Project[];
  /** Yangidan eskiga tartiblangan. */
  readonly news: readonly NewsArticle[];
  readonly leadership: readonly Person[];
  readonly experts: readonly Person[];
  readonly partners: readonly Partner[];
  readonly contacts: Contacts;
  readonly milestones: readonly Milestone[];
  readonly upopGallery: readonly UpopShot[];
  readonly artworks: readonly Artwork[];
  /** Yuklangan rasmlarning tayyor nusxalari (src → nusxalar); manifestdagidan ustun turadi. */
  readonly media: Readonly<Record<string, PreparedImage>>;
  /** Nomi oʻzgargan yangilik: eski slug → yangi slug. */
  readonly redirects: Readonly<Record<string, string>>;
  /** Lugʻat matnlari ustidan yoziladigan qiymatlar (kalit yoʻli → besh til). */
  readonly texts: Readonly<Record<string, Localized>>;
  /** Til tekshiruvi qabul qiladigan nom va atamalar. */
  readonly allowWords: readonly string[];
}

const UPOP_FRAMES = [
  "stage",
  "gold",
  "glass",
  "ticket",
  "film",
  "mat",
] as const satisfies readonly UpopFrame[];
const UPOP_MOTIONS = [
  "curtain",
  "slide-end",
  "wipe",
  "rise",
  "iris",
  "tilt",
  "slide-start",
  "zoom",
] as const satisfies readonly UpopMotion[];

function localized<T extends z.ZodType>(value: T) {
  return z.object({ uz: value, oz: value, ozbekca: value, ru: value, en: value });
}

const status = z.enum(["confirmed", "draft", "pending"]);
const text = localized(z.string());
const artSlot = z.enum(["art-1", "art-2", "art-3", "art-4", "art-5", "art-6", "art-7"]);
const fact = z.object({ value: text.nullable(), status });
const video = z.object({ webm: z.string(), mp4: z.string() });

function detail<T extends z.ZodType>(value: T) {
  return z.object({ value: value.nullable(), status });
}

const project = z.object({
  key: z.literal("upop-trend"),
  status,
  flagship: z.boolean(),
  name: text,
  tagline: text,
  age: z.object({ from: z.number().int(), to: z.number().int(), status }),
  format: fact,
  place: fact,
  schedule: fact,
  cost: z.object({ free: z.boolean().nullable(), status }),
  teacher: fact,
  highlights: localized(z.array(z.string())),
  external: z.object({ href: z.string(), label: z.string() }),
  media: z.object({
    loop: z.object({
      desktop: video,
      mobile: video,
      poster: z.string(),
      width: z.number(),
      height: z.number(),
      alt: text,
      status,
    }),
    film: z.object({
      src: z.string(),
      poster: z.string(),
      duration: z.number(),
      alt: text,
      status,
    }),
    wordmark: z.object({ src: z.string(), width: z.number(), height: z.number(), alt: text }),
  }),
});

const article = z.object({
  slug: z.string().max(NEWS_SLUG_MAX).regex(NEWS_SLUG_RE),
  status,
  date: z.iso.date(),
  topic: text,
  title: text,
  lead: text,
  body: localized(z.array(z.string())),
  quote: text.exactOptional(),
  cover: z.object({ src: z.string().nullable(), alt: text, status }),
  story: z.object({ primary: artSlot, secondary: artSlot }),
  photos: z.array(z.string()).exactOptional(),
});

const person = z.object({
  id: z.string(),
  kind: z.enum(["expert", "leader"]),
  status,
  name: text.nullable(),
  role: text,
  field: text.nullable(),
  bio: text.nullable(),
  photo: z.string().nullable(),
  email: z.string().nullable(),
});

const partner = z.object({
  id: z.string(),
  status,
  group: z.enum(["state", "international", "creative", "sponsors"]),
  name: text.nullable(),
  logo: z.string().nullable(),
  href: z.string().nullable(),
});

const contacts = z.object({
  address: detail(text),
  phones: detail(z.array(z.string())),
  email: detail(z.string()),
  telegram: detail(z.string()),
  hours: detail(text),
  map: detail(z.object({ lat: z.number(), lng: z.number() })),
  socials: z.array(
    z.object({
      id: z.enum(["telegram", "instagram", "youtube", "facebook"]),
      href: z.string(),
      label: z.string(),
      status,
    }),
  ),
  postalCode: z.string().exactOptional(),
  locality: z.string().exactOptional(),
});

const artwork = z.object({
  id: z.string(),
  status,
  src: z.string(),
  width: z.number(),
  height: z.number(),
  firstName: z.string(),
  age: z.number().int(),
  region: text,
  title: text,
  /* Rozilik yozuvisiz ish nusxaga umuman kirmaydi (25.4.1). */
  consent: z.object({ parent: z.literal(true), child: z.literal(true), date: z.string() }),
});

const milestone = z.object({
  id: z.string(),
  status,
  year: z.number().int().nullable(),
  title: text,
  icon: z.enum(ICON_NAMES).exactOptional(),
});

const upopShot = z.object({
  kind: z.enum(["photo", "video"]),
  src: z.string(),
  poster: z.string().exactOptional(),
  frame: z.enum(UPOP_FRAMES),
  motion: z.enum(UPOP_MOTIONS),
  alt: text.exactOptional(),
});

const preparedImage = z.object({
  width: z.number(),
  height: z.number(),
  base: z.string(),
  widths: z.array(z.number()),
  blur: z.string().exactOptional(),
  bright: z.literal(true).exactOptional(),
});

/* Tur bilan bogʻlangan: sxema turdan kengayib ketsa yigʻish shu yerda toʻxtaydi. */
const snapshotSchema: z.ZodType<ContentSnapshot> = z.object({
  version: z.literal(SNAPSHOT_VERSION),
  projects: z.array(project),
  news: z.array(article),
  leadership: z.array(person),
  experts: z.array(person),
  partners: z.array(partner),
  contacts,
  milestones: z.array(milestone),
  upopGallery: z.array(upopShot),
  artworks: z.array(artwork),
  media: z.record(z.string(), preparedImage),
  redirects: z.record(z.string(), z.string()),
  texts: z.record(z.string(), text),
  allowWords: z.array(z.string()),
});

/* Maʼlumotlar keshi 2 MB dan katta yozuvni saqlamaydi: 1 MB da ogohlantirish, boʻlish vaqti keldi. */
const WARN_BYTES = 1_000_000;

/** Tashqi manbadan kelgan nusxani tekshiradi; shakl notoʻgʻri boʻlsa xato otadi (manba nomi bilan). */
export function parseSnapshot(input: unknown, source: string): ContentSnapshot {
  const bytes = new TextEncoder().encode(JSON.stringify(input) ?? "").byteLength;
  if (bytes > WARN_BYTES)
    console.warn(`Kontent nusxasi ${Math.round(bytes / 1024)} KB (${source}): 1 MB dan oshdi.`);
  const result = snapshotSchema.safeParse(input);
  if (!result.success)
    throw new Error(`Kontent nusxasi notoʻgʻri (${source}):\n${z.prettifyError(result.error)}`);
  return result.data;
}

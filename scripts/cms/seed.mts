/**
 * Kontent nusxasini bazaga yozadi. Upsert tabiiy kalitlar boʻyicha ishlaydi (news.slug, people.key,
 * partners.key, milestones.key, projects.key, social_links.network, media.src), shuning uchun yarim
 * yoʻlda uzilgan skriptni qayta ishga tushirish xavfsiz, natija bir xil chiqadi.
 *
 *   pnpm content:seed                                    repodagi nusxa (bundledSnapshot)
 *   pnpm content:seed --from src/content/snapshot.json   boshqa fayldan (yangi loyihani tiklash)
 *   pnpm content:seed --prune                            nusxada yoʻq qatorlarni oʻchiradi
 *
 * SUPABASE_SERVICE_ROLE_KEY faqat shu mahalliy skript uchun, Vercel sozlamalariga qoʻyilmaydi.
 */
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

import { bundledSnapshot } from "../../src/content/bundled";
import { parseSnapshot, type ContentSnapshot } from "../../src/content/snapshot";
import { PREPARED_IMAGES, type PreparedImage } from "../../src/lib/images/manifest";
import { serviceRequest } from "./rest.mts";

const UPSERT = "resolution=merge-duplicates,return=representation";
const PUBLIC_DIR = path.resolve("public");

function argValue(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index > 0 ? process.argv[index + 1] : undefined;
}

function loadInput(): ContentSnapshot {
  const from = argValue("--from");
  if (!from) return bundledSnapshot();
  return parseSnapshot(JSON.parse(readFileSync(path.resolve(from), "utf8")), from);
}

async function upsert<T extends Record<string, unknown>>(
  table: string,
  conflict: string,
  rows: readonly Record<string, unknown>[],
  select = "*",
): Promise<T[]> {
  if (!rows.length) return [];
  return serviceRequest<T[]>("POST", table, { on_conflict: conflict, select }, rows, UPSERT);
}

/* Kalitlarda nuqta va chiziqcha bor, shuning uchun PostgREST filtrida qiymatlar qoʻshtirnoqqa olinadi. */
function inList(values: readonly (string | number)[]): string {
  return `(${values.map((v) => (typeof v === "number" ? String(v) : `"${v}"`)).join(",")})`;
}

// Media ------------------------------------------------------------------------------------------

interface MediaNeed {
  kind: "image" | "video";
  width?: number;
  height?: number;
  durationS?: number;
  poster?: string;
}

function collectMedia(s: ContentSnapshot): Map<string, MediaNeed> {
  const needs = new Map<string, MediaNeed>();
  const add = (src: string | null | undefined, need: MediaNeed) => {
    if (!src) return;
    const known = needs.get(src);
    if (known && known.kind !== need.kind) throw new Error(`${src}: ham rasm, ham video`);
    needs.set(src, { ...need, ...known });
  };
  for (const src of Object.keys(PREPARED_IMAGES)) add(src, { kind: "image" });
  for (const src of Object.keys(s.media)) add(src, { kind: "image" });
  for (const n of s.news) {
    add(n.cover.src, { kind: "image" });
    for (const photo of n.photos ?? []) add(photo, { kind: "image" });
  }
  for (const p of [...s.leadership, ...s.experts]) add(p.photo, { kind: "image" });
  for (const p of s.partners) add(p.logo, { kind: "image" });
  for (const p of s.projects) {
    const { loop, film, wordmark } = p.media;
    add(loop.poster, { kind: "image" });
    add(loop.desktop.mp4, {
      kind: "video",
      width: loop.width,
      height: loop.height,
      poster: loop.poster,
    });
    add(loop.desktop.webm, { kind: "video", poster: loop.poster });
    add(loop.mobile.mp4, { kind: "video", poster: loop.poster });
    add(loop.mobile.webm, { kind: "video", poster: loop.poster });
    add(film.poster, { kind: "image" });
    add(film.src, { kind: "video", durationS: film.duration, poster: film.poster });
    add(wordmark.src, { kind: "image", width: wordmark.width, height: wordmark.height });
  }
  for (const shot of s.upopGallery) {
    if (shot.poster) add(shot.poster, { kind: "image" });
    add(shot.src, {
      kind: shot.kind === "photo" ? "image" : "video",
      ...(shot.poster ? { poster: shot.poster } : {}),
    });
  }
  for (const a of s.artworks) add(a.src, { kind: "image", width: a.width, height: a.height });
  return needs;
}

async function imageSize(src: string): Promise<{ width: number; height: number }> {
  const file = path.join(PUBLIC_DIR, src);
  if (!existsSync(file)) throw new Error(`${src}: oʻlchami nomaʼlum va fayl public/ da yoʻq`);
  const meta = await sharp(file).metadata();
  if (!meta.width || !meta.height) throw new Error(`${src}: oʻlchamni oʻqib boʻlmadi`);
  return { width: meta.width, height: meta.height };
}

async function mediaRow(
  s: ContentSnapshot,
  src: string,
  need: MediaNeed,
  posterId: string | null,
): Promise<Record<string, unknown>> {
  const uploaded: PreparedImage | undefined = s.media[src];
  const prepared = uploaded ?? PREPARED_IMAGES[src];
  const file = path.join(PUBLIC_DIR, src);
  let width = need.width ?? prepared?.width ?? null;
  let height = need.height ?? prepared?.height ?? null;
  if (need.kind === "image" && (width === null || height === null)) {
    ({ width, height } = await imageSize(src));
  }
  return {
    kind: need.kind,
    origin: uploaded ? "storage" : "static",
    src,
    /* Yuklangan rasmning /uploads/i/<hash> manzili bucket ichida i/<hash> boʻlib saqlanadi. */
    storage_prefix: uploaded ? uploaded.base.replace(/^\/uploads\//, "") : null,
    variant_base: prepared?.base ?? null,
    variant_widths: prepared?.widths ?? [],
    width,
    height,
    blur: prepared?.blur ?? null,
    bright: prepared?.bright ?? false,
    bytes: !uploaded && existsSync(file) ? statSync(file).size : null,
    duration_s: need.durationS ?? null,
    poster_id: posterId,
  };
}

/* Videoning poster_id maydoni rasmga ishora qiladi, shuning uchun rasmlar oldin yoziladi. */
async function seedMedia(s: ContentSnapshot): Promise<Map<string, string>> {
  const needs = collectMedia(s);
  const ids = new Map<string, string>();
  const images = [...needs].filter(([, need]) => need.kind === "image");
  const videos = [...needs].filter(([, need]) => need.kind === "video");
  const imageRows = await Promise.all(images.map(([src, need]) => mediaRow(s, src, need, null)));
  for (const row of await upsert<{ id: string; src: string }>("media", "src", imageRows, "id,src"))
    ids.set(row.src, row.id);
  const videoRows = await Promise.all(
    videos.map(([src, need]) =>
      mediaRow(s, src, need, need.poster ? (ids.get(need.poster) ?? null) : null),
    ),
  );
  for (const row of await upsert<{ id: string; src: string }>("media", "src", videoRows, "id,src"))
    ids.set(row.src, row.id);
  return ids;
}

function idOf(ids: ReadonlyMap<string, string>, src: string | null | undefined): string | null {
  if (!src) return null;
  const id = ids.get(src);
  if (!id) throw new Error(`${src}: media qatori yoʻq`);
  return id;
}

// Jadvallar --------------------------------------------------------------------------------------

async function seedProjects(s: ContentSnapshot, ids: ReadonlyMap<string, string>) {
  const projects = await upsert(
    "projects",
    "key",
    s.projects.map((p) => ({
      key: p.key,
      status: p.status,
      flagship: p.flagship,
      name: p.name,
      tagline: p.tagline,
      age_from: p.age.from,
      age_to: p.age.to,
      age_status: p.age.status,
      cost_free: p.cost.free,
      cost_status: p.cost.status,
      highlights: p.highlights,
      external_href: p.external.href,
      external_label: p.external.label,
    })),
    "key",
  );
  const facts = s.projects.flatMap((p) =>
    (["format", "place", "schedule", "teacher"] as const).map((fact) => ({
      project_key: p.key,
      fact,
      value: p[fact].value,
      status: p[fact].status,
    })),
  );
  await upsert("project_facts", "project_key,fact", facts, "fact");
  const media = s.projects.flatMap((p) => {
    const { loop, film, wordmark } = p.media;
    const row = (role: string, main: string, extra: Record<string, unknown>) => ({
      project_key: p.key,
      role,
      main_id: idOf(ids, main),
      webm_id: null,
      mobile_mp4_id: null,
      mobile_webm_id: null,
      poster_id: null,
      status: null,
      ...extra,
    });
    return [
      row("loop", loop.desktop.mp4, {
        webm_id: idOf(ids, loop.desktop.webm),
        mobile_mp4_id: idOf(ids, loop.mobile.mp4),
        mobile_webm_id: idOf(ids, loop.mobile.webm),
        poster_id: idOf(ids, loop.poster),
        alt: loop.alt,
        status: loop.status,
      }),
      row("film", film.src, {
        poster_id: idOf(ids, film.poster),
        alt: film.alt,
        status: film.status,
      }),
      row("wordmark", wordmark.src, { alt: wordmark.alt }),
    ];
  });
  await upsert("project_media", "project_key,role", media, "role");
  return { projects: projects.length, facts: facts.length, projectMedia: media.length };
}

async function seedNews(s: ContentSnapshot, ids: ReadonlyMap<string, string>) {
  const rows = s.news.map((n, index) => ({
    slug: n.slug,
    status: n.status,
    published_on: n.date,
    topic: n.topic,
    title: n.title,
    lead: n.lead,
    body: n.body,
    quote: n.quote ?? null,
    cover_id: idOf(ids, n.cover.src),
    cover_alt: n.cover.alt,
    cover_status: n.cover.status,
    story_primary: n.story.primary,
    story_secondary: n.story.secondary,
    /* Bir kundagi maqolalar created_at boʻyicha tartiblanadi, soniyalar farqi nusxadagi tartibni saqlaydi. */
    created_at: new Date(Date.parse(`${n.date}T12:00:00Z`) - index * 1000).toISOString(),
  }));
  const saved = await upsert<{ id: string; slug: string }>("news", "slug", rows, "id,slug");
  const newsId = new Map(saved.map((row) => [row.slug, row.id]));
  const allIds = [...newsId.values()];
  if (allIds.length)
    await serviceRequest("DELETE", "news_photos", { news_id: `in.${inList(allIds)}` });
  const photos = s.news.flatMap((n) =>
    (n.photos ?? []).map((src, index) => ({
      news_id: newsId.get(n.slug),
      position: index + 1,
      media_id: idOf(ids, src),
    })),
  );
  if (photos.length) await serviceRequest("POST", "news_photos", {}, photos);
  const redirects = Object.entries(s.redirects).map(([oldSlug, slug]) => {
    const target = newsId.get(slug);
    if (!target) throw new Error(`yoʻnaltirish ${oldSlug} → ${slug}: maqola yoʻq`);
    return { old_slug: oldSlug, news_id: target };
  });
  await upsert("news_slug_redirects", "old_slug", redirects, "old_slug");
  return { news: saved.length, newsPhotos: photos.length, redirects: redirects.length };
}

async function seedPeople(s: ContentSnapshot, ids: ReadonlyMap<string, string>) {
  const rows = (["leader", "expert"] as const).flatMap((kind) =>
    (kind === "leader" ? s.leadership : s.experts).map((p, index) => {
      if (p.kind !== kind) throw new Error(`${p.id}: roʻyxat ${kind}, yozuv ${p.kind}`);
      return {
        key: p.id,
        kind: p.kind,
        status: p.status,
        name: p.name,
        role: p.role,
        field: p.field,
        bio: p.bio,
        photo_id: idOf(ids, p.photo),
        email: p.email,
        sort_order: index,
      };
    }),
  );
  return (await upsert("people", "key", rows, "key")).length;
}

async function seedPartners(s: ContentSnapshot, ids: ReadonlyMap<string, string>) {
  const rows = s.partners.map((p, index) => ({
    key: p.id,
    status: p.status,
    group: p.group,
    name: p.name,
    logo_id: idOf(ids, p.logo),
    href: p.href,
    sort_order: index,
  }));
  return (await upsert("partners", "key", rows, "key")).length;
}

async function seedContacts(s: ContentSnapshot) {
  const c = s.contacts;
  await upsert(
    "site_contacts",
    "id",
    [
      {
        id: 1,
        address: c.address.value,
        address_status: c.address.status,
        postal_code: c.postalCode ?? null,
        locality: c.locality ?? null,
        phones: c.phones.value ?? [],
        phones_status: c.phones.status,
        email: c.email.value,
        email_status: c.email.status,
        telegram: c.telegram.value,
        telegram_status: c.telegram.status,
        hours: c.hours.value,
        hours_status: c.hours.status,
        map_lat: c.map.value?.lat ?? null,
        map_lng: c.map.value?.lng ?? null,
        map_status: c.map.status,
      },
    ],
    "id",
  );
  const socials = c.socials.map((link, index) => ({
    network: link.id,
    href: link.href,
    label: link.label,
    status: link.status,
    sort_order: index,
  }));
  return (await upsert("social_links", "network", socials, "network")).length;
}

async function seedMilestones(s: ContentSnapshot) {
  const rows = s.milestones.map((m, index) => ({
    key: m.id,
    status: m.status,
    year: m.year,
    title: m.title,
    icon: m.icon ?? "calendar",
    sort_order: index,
  }));
  return (await upsert("milestones", "key", rows, "key")).length;
}

async function seedGallery(s: ContentSnapshot, ids: ReadonlyMap<string, string>) {
  const shots = s.upopGallery.map((shot, index) => ({
    position: index + 1,
    kind: shot.kind === "photo" ? "image" : "video",
    media_id: idOf(ids, shot.src),
    poster_id: idOf(ids, shot.poster),
    frame: shot.frame,
    motion: shot.motion,
    alt: shot.alt ?? null,
  }));
  const artworks = s.artworks.map((a, index) => ({
    id: a.id,
    status: a.status,
    media_id: idOf(ids, a.src),
    first_name: a.firstName,
    age: a.age,
    region: a.region,
    title: a.title,
    consent_parent: a.consent.parent,
    consent_child: a.consent.child,
    consent_date: a.consent.date,
    sort_order: index,
  }));
  return {
    upopShots: (await upsert("upop_shots", "position", shots, "position")).length,
    artworks: (await upsert("artworks", "id", artworks, "id")).length,
  };
}

async function seedTexts(s: ContentSnapshot) {
  const texts = Object.entries(s.texts).map(([key, value]) => ({ key, value }));
  const words = s.allowWords.map((word) => ({ word }));
  return {
    texts: (await upsert("site_texts", "key", texts, "key")).length,
    allowWords: (await upsert("site_word_allowlist", "word", words, "word")).length,
  };
}

// Nusxada yoʻq qatorlar --------------------------------------------------------------------------

interface Owned {
  readonly table: string;
  readonly column: string;
  readonly keep: readonly (string | number)[];
}

function owned(s: ContentSnapshot): readonly Owned[] {
  return [
    { table: "news", column: "slug", keep: s.news.map((n) => n.slug) },
    { table: "news_slug_redirects", column: "old_slug", keep: Object.keys(s.redirects) },
    {
      table: "people",
      column: "key",
      keep: [...s.leadership, ...s.experts].map((p) => p.id),
    },
    { table: "partners", column: "key", keep: s.partners.map((p) => p.id) },
    { table: "social_links", column: "network", keep: s.contacts.socials.map((l) => l.id) },
    { table: "milestones", column: "key", keep: s.milestones.map((m) => m.id) },
    { table: "upop_shots", column: "position", keep: s.upopGallery.map((_, i) => i + 1) },
    { table: "artworks", column: "id", keep: s.artworks.map((a) => a.id) },
    { table: "site_texts", column: "key", keep: Object.keys(s.texts) },
    { table: "site_word_allowlist", column: "word", keep: s.allowWords },
  ];
}

async function extras(s: ContentSnapshot, prune: boolean): Promise<string[]> {
  const found: string[] = [];
  for (const { table, column, keep } of owned(s)) {
    const rows = await serviceRequest<Record<string, string | number>[]>("GET", table, {
      select: column,
    });
    const keepSet = new Set(keep.map(String));
    const stray = rows.map((row) => String(row[column])).filter((key) => !keepSet.has(key));
    if (!stray.length) continue;
    found.push(`${table}: ${stray.join(", ")}`);
    if (prune) await serviceRequest("DELETE", table, { [column]: `in.${inList(stray)}` });
  }
  return found;
}

// Ishga tushirish --------------------------------------------------------------------------------

const snapshot = loadInput();
const prune = process.argv.includes("--prune");
const ids = await seedMedia(snapshot);
const counts = {
  media: ids.size,
  ...(await seedProjects(snapshot, ids)),
  ...(await seedNews(snapshot, ids)),
  people: await seedPeople(snapshot, ids),
  partners: await seedPartners(snapshot, ids),
  socialLinks: await seedContacts(snapshot),
  siteContacts: 1,
  milestones: await seedMilestones(snapshot),
  ...(await seedGallery(snapshot, ids)),
  ...(await seedTexts(snapshot)),
};
const stray = await extras(snapshot, prune);
process.stdout.write(
  `Yozildi:\n${Object.entries(counts)
    .map(([table, count]) => `  ${table}: ${count}`)
    .join("\n")}\n`,
);
if (stray.length)
  process.stdout.write(
    `${prune ? "Oʻchirildi" : "Nusxada yoʻq qatorlar (--prune bilan oʻchadi)"}:\n  ${stray.join("\n  ")}\n`,
  );

#!/usr/bin/env node
import { mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

import { ROOT } from "./checks/util.mjs";

/*
 * Rasmlar AVIF va WebP koʻrinishida, bir nechta kenglikda oldindan tayyorlanadi. Sahifa ularni Picture
 * komponenti orqali oladi, shuning uchun mijozga next/image kirmaydi va lokal optimizator AVIF kodlashda
 * qotib qolsa ham sahifa kutib qolmaydi.
 *
 *   node scripts/images.mjs
 */
const SRC = path.join(ROOT, "public");
const OUT = path.join(ROOT, "public/img");
const MANIFEST = path.join(ROOT, "src/lib/images/manifest.ts");
/* Oʻrtacha nisbiy yorugʻlik shundan yuqori boʻlsa rasm «yorugʻ» (oq fonli portret ≈ 0.44, sahna ≈ 0.08). */
const BRIGHT_MIN = 0.35;

/** Manbadan katta srcset kengligi manba kengligiga tushiriladi. */
const JOBS = [
  { src: "/brand/logo-hero.png", widths: [40, 80, 120, 240, 408] },
  { src: "/brand/upop-logo.png", widths: [240, 360, 480, 720, 900] },
  /* «UPOP TREND taqdimoti» yangiligi: rasmiy Telegram kanalidagi suratlar (manba 800 px). */
  { src: "/brand/news-taqdimot-01.jpg", widths: [256, 384, 640, 800], blur: true },
  { src: "/brand/news-taqdimot-02.jpg", widths: [400, 800], blur: true },
  { src: "/brand/news-taqdimot-03.jpg", widths: [400, 800], blur: true },
  { src: "/brand/news-taqdimot-04.jpg", widths: [400, 800], blur: true },
  { src: "/brand/news-taqdimot-05.jpg", widths: [400, 800], blur: true },
  { src: "/brand/news-taqdimot-06.jpg", widths: [400, 800], blur: true },
  { src: "/brand/news-taqdimot-07.jpg", widths: [400, 800], blur: true },
  { src: "/brand/news-taqdimot-08.jpg", widths: [400, 800], blur: true },
  { src: "/brand/news-taqdimot-09.jpg", widths: [400, 800], blur: true },
  { src: "/brand/news-taqdimot-10.jpg", widths: [400, 800], blur: true },
  { src: "/brand/news-upop-stage.jpg", widths: [256, 384, 640, 960, 1344], blur: true },
  { src: "/brand/news-korgazma.jpg", widths: [256, 384, 640, 1024], blur: true },
  { src: "/brand/news-multfilm.jpg", widths: [256, 384, 640, 1024], blur: true },
  { src: "/brand/news-seminar.jpg", widths: [256, 384, 640, 1024], blur: true },
  { src: "/brand/news-teatr.jpg", widths: [256, 384, 640, 1024], blur: true },
  /* Rahbariyat portretlarida EXIF va joylashuv olib tashlangan, burilish oldindan qoʻllangan. */
  { src: "/brand/leader-chair.jpg", widths: [320, 480, 640, 960], blur: true },
  { src: "/brand/leader-director.jpg", widths: [320, 480, 640, 960], blur: true },
  { src: "/brand/partner-uzbekgidroenergo.png", widths: [240, 480, 720] },
];

/* AVIF 52 sifatda fotosuratdagi farq koʻzga tashlanmaydi; WebP eski Safari uchun zaxira. */
const AVIF = { quality: 52, effort: 6 };
const WEBP = { quality: 78, effort: 5 };

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;
const base = (src) => path.basename(src, path.extname(src));

mkdirSync(OUT, { recursive: true });
for (const file of readdirSync(OUT)) rmSync(path.join(OUT, file));
mkdirSync(path.dirname(MANIFEST), { recursive: true });

const entries = {};
for (const job of JOBS) {
  const input = path.join(SRC, job.src);
  const meta = await sharp(input).metadata();
  const widths = [...new Set(job.widths.map((w) => Math.min(w, meta.width)))].sort((a, b) => a - b);
  const name = base(job.src);
  for (const width of widths) {
    const resized = sharp(input).resize({ width, withoutEnlargement: true });
    const avif = path.join(OUT, `${name}-${width}.avif`);
    const webp = path.join(OUT, `${name}-${width}.webp`);
    await resized.clone().avif(AVIF).toFile(avif);
    await resized.clone().webp(WEBP).toFile(webp);
    console.log(
      `${name}-${width}`.padEnd(28),
      `avif ${kb(statSync(avif).size).padStart(9)}`,
      `webp ${kb(statSync(webp).size).padStart(9)}`,
    );
  }
  let blur = null;
  if (job.blur) {
    /* Rasm yuklanguncha ramka boʻsh turmasligi uchun kichik xira nusxa. */
    const tiny = await sharp(input).resize({ width: 16 }).blur(1).webp({ quality: 40 }).toBuffer();
    blur = `data:image/webp;base64,${tiny.toString("base64")}`;
  }
  /* Yorugʻ rasm ustidagi oyna yorugʻ ohangga oʻtadi va yorliq toʻq rangda oʻqiladi.
     Shaffof logotiplar hisoblanmaydi, ular doim qorongʻi plitkada turadi. */
  let bright = false;
  if (!meta.hasAlpha) {
    /* Oʻrtacha rangning yorugʻligi oq-qora suratni qorongʻiroq koʻrsatadi, shuning uchun har piksel
       yorugʻligining oʻrtachasi olinadi; 64 px nusxa yetarli. */
    const { data } = await sharp(input).resize({ width: 64 }).removeAlpha().raw().toBuffer({
      resolveWithObject: true,
    });
    const lin = (c) => {
      const v = c / 255;
      return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    };
    let sum = 0;
    for (let i = 0; i < data.length; i += 3)
      sum += 0.2126 * lin(data[i]) + 0.7152 * lin(data[i + 1]) + 0.0722 * lin(data[i + 2]);
    bright = sum / (data.length / 3) > BRIGHT_MIN;
  }
  entries[job.src] = {
    width: meta.width,
    height: meta.height,
    base: `/img/${name}`,
    widths,
    ...(blur ? { blur } : {}),
    ...(bright ? { bright } : {}),
  };
}

const body = Object.entries(entries)
  .map(([src, e]) => {
    const fields = [
      `width: ${e.width}`,
      `height: ${e.height}`,
      `base: "${e.base}"`,
      `widths: [${e.widths.join(", ")}]`,
      ...(e.blur ? [`blur: "${e.blur}"`] : []),
      ...(e.bright ? ["bright: true"] : []),
    ];
    return `  "${src}": {\n    ${fields.join(",\n    ")},\n  },`;
  })
  .join("\n");

writeFileSync(
  MANIFEST,
  `/* scripts/images.mjs yaratgan: oldindan tayyorlangan rasmlar. Qoʻlda tahrir qilinmaydi. */
export interface PreparedImage {
  readonly width: number;
  readonly height: number;
  /** /img/<nom>: fayllar <base>-<kenglik>.avif va .webp */
  readonly base: string;
  readonly widths: readonly number[];
  readonly blur?: string;
  /** Oʻrtacha yorugʻlik baland: oyna ustida yorugʻ ohang (data-tone="light"). */
  readonly bright?: true;
}

export const PREPARED_IMAGES: Readonly<Record<string, PreparedImage>> = {
${body}
};
`,
);
console.log(`${Object.keys(entries).length} rasm, manifest: ${path.relative(ROOT, MANIFEST)}`);

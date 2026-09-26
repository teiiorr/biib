#!/usr/bin/env node
import { mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

import { ROOT } from "./checks/util.mjs";

/*
 * Rasmlar oldindan tayyorlanadi (§11.2, §17): public/brand dagi manbadan public/img ga AVIF va WebP,
 * bir nechta kenglikda. Sahifa ularni <picture> bilan oladi (src/components/ui/Picture.tsx), shu sabab
 * mijozga next/image komponenti kirmaydi va lokal optimizator AVIF da qotib qolsa ham sahifa kutmaydi.
 * Natija: public/img/*.{avif,webp} va src/lib/images/manifest.ts (qoʻlda tahrir qilinmaydi).
 *
 *   node scripts/images.mjs
 */
const SRC = path.join(ROOT, "public");
const OUT = path.join(ROOT, "public/img");
const MANIFEST = path.join(ROOT, "src/lib/images/manifest.ts");

/** widths: srcset kengliklari (manbadan katta boʻlsa manba kengligi bilan cheklanadi). */
const JOBS = [
  { src: "/brand/mark.png", widths: [40, 80, 120, 192] },
  { src: "/brand/logo-hero.png", widths: [40, 80, 120, 240, 408] },
  { src: "/brand/upop-logo.png", widths: [240, 360, 480, 720, 900] },
  { src: "/brand/upop-scene.jpg", widths: [640, 960, 1280, 1920], blur: true },
  { src: "/brand/news-upop-stage.jpg", widths: [256, 384, 640, 960, 1344], blur: true },
  { src: "/brand/news-korgazma.jpg", widths: [256, 384, 640, 1024], blur: true },
  { src: "/brand/news-multfilm.jpg", widths: [256, 384, 640, 1024], blur: true },
  { src: "/brand/news-seminar.jpg", widths: [256, 384, 640, 1024], blur: true },
  { src: "/brand/news-teatr.jpg", widths: [256, 384, 640, 1024], blur: true },
];

/* Sifat: AVIF 52 fotosuratda koʻzga farqsiz, WebP 78 — zaxira (eski Safari). Shaffof PNG sifatli qoladi. */
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
    /* Kichik xira nusxa fon sifatida: rasm kelguncha ramka boʻsh qolmaydi. */
    const tiny = await sharp(input).resize({ width: 16 }).blur(1).webp({ quality: 40 }).toBuffer();
    blur = `data:image/webp;base64,${tiny.toString("base64")}`;
  }
  entries[job.src] = {
    width: meta.width,
    height: meta.height,
    base: `/img/${name}`,
    widths,
    ...(blur ? { blur } : {}),
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
}

export const PREPARED_IMAGES: Readonly<Record<string, PreparedImage>> = {
${body}
};
`,
);
console.log(`${Object.keys(entries).length} rasm, manifest: ${path.relative(ROOT, MANIFEST)}`);

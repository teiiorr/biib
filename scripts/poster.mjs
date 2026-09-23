// Abr posteri: shader oʻrnini bosadigan statik AVIF (WebGL yoʻq, kamaytirilgan harakat, birinchi kadr).
import { mkdirSync, statSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const OUT = path.resolve("public/hero");
mkdirSync(OUT, { recursive: true });

function seeded(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function render({ width, height, bg, dyes, seed }) {
  const rnd = seeded(seed);
  const bands = Math.round(width / 46);
  const bw = width / bands;
  const parts = [`<rect width="${width}" height="${height}" fill="${bg}"/>`];
  for (let b = 0; b < bands; b++) {
    const x = b * bw;
    const shift = (rnd() - 0.5) * height * 0.18;
    let y = -height * 0.2 + shift;
    while (y < height * 1.2) {
      const h = height * (0.06 + rnd() * 0.22);
      const dye = dyes[Math.floor(rnd() * dyes.length)];
      const feather = 6 + rnd() * 10;
      const cover = rnd() > 0.3;
      if (cover) {
        parts.push(
          `<path d="M${x.toFixed(1)} ${(y + feather).toFixed(1)} q${(bw / 2).toFixed(1)} ${(-feather).toFixed(1)} ${bw.toFixed(1)} 0 v${h.toFixed(1)} q${(-bw / 2).toFixed(1)} ${feather.toFixed(1)} ${(-bw).toFixed(1)} 0z" fill="${dye}" fill-opacity="0.92"/>`,
        );
      }
      y += h + rnd() * height * 0.05;
    }
    parts.push(
      `<rect x="${(x + bw - 1).toFixed(1)}" width="1" height="${height}" fill="#000" fill-opacity="0.05"/>`,
    );
  }
  parts.push(
    `<linearGradient id="s" x1="0" y1="0" x2="1" y2="1"><stop offset="0.35" stop-color="#fff" stop-opacity="0"/><stop offset="0.5" stop-color="#fff" stop-opacity="0.14"/><stop offset="0.65" stop-color="#fff" stop-opacity="0"/></linearGradient><rect width="${width}" height="${height}" fill="url(#s)"/>`,
  );
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${parts.join("")}</svg>`;
}

const variants = [
  {
    file: "abr-poster-day.avif",
    bg: "#f7f3ea",
    dyes: ["#d6457f", "#c9a646", "#26619c", "#2fa878"],
    seed: 21,
  },
  {
    file: "abr-poster-night.avif",
    bg: "#0a1026",
    dyes: ["#4ccbcb", "#26619c", "#d9b75a", "#f07aae"],
    seed: 33,
  },
];
for (const v of variants) {
  const svg = render({ width: 1600, height: 1000, ...v });
  const target = path.join(OUT, v.file);
  await sharp(Buffer.from(svg)).avif({ quality: 42, effort: 6 }).toFile(target);
  console.log(`${v.file}: ${Math.round(statSync(target).size / 1024)} KB`);
}

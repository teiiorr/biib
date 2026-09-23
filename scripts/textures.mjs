// Kalka va qogʻoz teksturalari: haqiqiy skanlar kelguncha protsedura bilan yasalgan oʻrinbosar.
import { mkdirSync, writeFileSync, statSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const OUT = path.resolve("public/textures");
mkdirSync(OUT, { recursive: true });

function seeded(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

async function fiber({ file, size = 320, count = 900, light, seed }) {
  const rnd = seeded(seed);
  const strokes = [];
  for (let i = 0; i < count; i++) {
    const x = rnd() * size;
    const y = rnd() * size;
    const len = 6 + rnd() * 22;
    const angle = rnd() * Math.PI;
    const dx = Math.cos(angle) * len;
    const dy = Math.sin(angle) * len;
    const alpha = (0.08 + rnd() * 0.22).toFixed(2);
    const tone = light ? "#5a5240" : "#e9e2d2";
    strokes.push(
      `<path d="M${x.toFixed(1)} ${y.toFixed(1)}l${dx.toFixed(1)} ${dy.toFixed(1)}" stroke="${tone}" stroke-opacity="${alpha}" stroke-width="${(0.5 + rnd() * 0.9).toFixed(2)}" stroke-linecap="round"/>`,
    );
  }
  const bg = light ? "#fffdf8" : "#1c2a34";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="100%" height="100%" fill="${bg}"/>${strokes.join("")}</svg>`;
  const target = path.join(OUT, file);
  await sharp(Buffer.from(svg)).avif({ quality: 38, effort: 6 }).toFile(target);
  const kb = Math.round(statSync(target).size / 1024);
  console.log(`${file}: ${kb} KB`);
}

async function chalk({ file, size = 320, seed }) {
  const rnd = seeded(seed);
  const dots = [];
  for (let i = 0; i < 2600; i++) {
    const x = rnd() * size;
    const y = rnd() * size;
    const r = 0.3 + rnd() * 1.1;
    const a = (0.03 + rnd() * 0.12).toFixed(3);
    dots.push(
      `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}" fill="#f4f1e8" fill-opacity="${a}"/>`,
    );
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="100%" height="100%" fill="#152029"/>${dots.join("")}</svg>`;
  const target = path.join(OUT, file);
  await sharp(Buffer.from(svg)).avif({ quality: 40, effort: 6 }).toFile(target);
  console.log(`${file}: ${Math.round(statSync(target).size / 1024)} KB`);
}

await fiber({ file: "paper-fiber.avif", light: true, seed: 7 });
await fiber({ file: "paper-grain.avif", light: true, seed: 11, count: 1400 });
await chalk({ file: "chalk.avif", seed: 3 });
await chalk({ file: "chalk-board.avif", seed: 5 });
writeFileSync(
  path.join(OUT, "README.txt"),
  "Vaqtinchalik protsedura teksturalari. Haqiqiy skanlar docs/qa/content-pending.md roʻyxatida.\n",
);

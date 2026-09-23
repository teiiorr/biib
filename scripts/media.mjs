#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";
import {
  ENCODERS,
  OUT,
  POSTER_BUDGET,
  SEAM_THRESHOLD,
  SIZES,
  TMP,
  availableEncoders,
  encodeWithinBudget,
  loopSeam,
  poster,
  probe,
} from "./checks/media-tools.mjs";
import { ROOT } from "./checks/util.mjs";

/* §18.4 media quvuri: src/assets/video → public/media. Byudjetlar §17. */
const SRC = path.join(ROOT, "src/assets/video");
const VIDEO_EXT = new Set([".mp4", ".mov", ".webm", ".mkv", ".m4v"]);
const args = process.argv.slice(2);
const only = args.includes("--only") ? args[args.indexOf("--only") + 1] : null;
const dryRun = args.includes("--dry-run");
const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;

async function processVideo(file, encoders) {
  const name = path.basename(file, path.extname(file));
  const info = probe(file);
  console.log(`\n${name}: ${info.width}×${info.height}, ${info.duration.toFixed(2)} s`);
  const rows = [];
  let allOk = true;
  const variants = [
    ["av1", "webm", { d: 34, m: 36 }],
    ["hevc", "hevc.mp4", { d: 28, m: 30 }],
    ["h264", "h264.mp4", { d: 23, m: 25 }],
  ];
  for (const [kind, ext, crf] of variants) {
    const codec = ENCODERS[kind].find((c) => encoders.has(c));
    if (!codec) {
      rows.push(
        `  ${kind.padEnd(5)} kodlovchi yoʻq (${ENCODERS[kind].join("/")}), oʻtkazib yuborildi`,
      );
      continue;
    }
    for (const [suffix, size] of Object.entries(SIZES)) {
      const output = path.join(OUT, `${name}-${suffix}.${ext}`);
      if (dryRun) {
        rows.push(`  ${path.basename(output)} (${codec}, crf ${crf[suffix]})`);
        continue;
      }
      const result = encodeWithinBudget(
        file,
        output,
        kind,
        codec,
        size.width,
        size.budget,
        crf[suffix],
      );
      allOk &&= result.ok;
      rows.push(
        `  ${path.basename(output).padEnd(28)} ${kb(result.size).padStart(8)} / ${kb(size.budget)}  crf ${result.crf}  ${result.ok ? "ok" : "BYUDJETDAN OSHDI"}`,
      );
    }
  }
  if (!dryRun) {
    const posters = await poster(file, name);
    for (const [suffix, p] of Object.entries(posters)) {
      if (!p.ok) allOk = false;
      rows.push(
        `  ${`${name}-poster-${suffix}.avif`.padEnd(28)} ${kb(p.size).padStart(8)}${suffix === "m" ? ` / ${kb(POSTER_BUDGET)}` : ""}  ${p.ok ? "ok" : "BYUDJETDAN OSHDI"}`,
      );
    }
    const seam = await loopSeam(file);
    rows.push(
      `  halqa choki: ${(seam * 100).toFixed(1)} %${seam > SEAM_THRESHOLD ? "  (sezilarli, manbani tekshiring)" : ""}`,
    );
  }
  for (const row of rows) console.log(row);
  return allOk;
}

async function main() {
  if (spawnSync("ffmpeg", ["-version"], { encoding: "utf8" }).status !== 0) {
    console.log("ffmpeg topilmadi: media quvuri oʻtkazib yuborildi (brew install ffmpeg).");
    return 0;
  }
  if (!existsSync(SRC)) {
    console.log(
      `${path.relative(ROOT, SRC)} yoʻq: manba videolar hali kelmagan, quvur oʻtkazib yuborildi.`,
    );
    return 0;
  }
  const files = readdirSync(SRC)
    .filter((f) => VIDEO_EXT.has(path.extname(f).toLowerCase()) && (!only || f.startsWith(only)))
    .map((f) => path.join(SRC, f));
  if (!files.length) {
    console.log("Manba video topilmadi.");
    return 0;
  }
  mkdirSync(OUT, { recursive: true });
  mkdirSync(TMP, { recursive: true });
  const encoders = availableEncoders();
  let ok = true;
  for (const file of files) ok = (await processVideo(file, encoders)) && ok;
  rmSync(TMP, { recursive: true, force: true });
  console.log(ok ? "\nHammasi byudjetda." : "\nBaʼzi fayllar byudjetdan oshdi.");
  return ok ? 0 : 1;
}

process.exit(await main());

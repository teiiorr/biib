#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import {
  ENCODERS,
  OUT,
  SEAM_THRESHOLD,
  TMP,
  availableEncoders,
  ffmpeg,
  loopSeam,
  probe,
} from "./checks/media-tools.mjs";
import { ROOT } from "./checks/util.mjs";

/*
 * §18.4 media quvuri: public/brand (egadan kelgan manbalar) → public/media.
 * Byudjetlar §17: har bir video ≤ 1,8 MB (desktop) / ≤ 0,9 MB (mobil), poster ≤ 120 KB AVIF.
 * Halqa videolar (hero, upop-live) ovozsiz; upop-video bosib koʻriladigan, ovozi saqlanadi.
 * Har bir chiqish uchun crf byudjetga sigʻguncha +3 qadam bilan oshiriladi.
 *
 * Manba halqalarning birinchi va oxirgi kadri mos kelmaydi (ular 5–11 % farq qiladi, ketma-ket
 * kadrlar esa 1–2 %). Shu sabab halqa xfade bilan yopiladi: oxirgi X soniya boshlanishdagi X soniyaga
 * eriydi, natija D−X soniya va oxirgi kadr birinchi kadrga ulanadi (chok ≈ ketma-ket kadr farqi).
 *
 * Qoʻlda takrorlash uchun buyruqlar (crf qiymati byudjetga qarab tanlangan):
 *   LOOP="[0:v]split[a][b];[a]trim=start=X,setpts=PTS-STARTPTS[a];[b]trim=end=X,setpts=PTS-STARTPTS[b];\
 *         [a][b]xfade=transition=fade:duration=X:offset=D-2X,scale=1280:-2,format=yuv420p[v]"
 *   ffmpeg -y -i public/brand/hero-logo-d.mp4 -an -map_metadata -1 -fflags +bitexact -filter_complex "$LOOP" -map "[v]" \
 *     -c:v libsvtav1 -crf <crf> -preset 4 -g 120 -svtav1-params tune=0 public/media/hero-d.webm
 *   ffmpeg -y -i public/brand/hero-logo-d.mp4 -an -map_metadata -1 -fflags +bitexact -filter_complex "$LOOP" -map "[v]" \
 *     -c:v libx264 -crf <crf> -preset slow -profile:v high -g 120 -movflags +faststart public/media/hero-d.mp4
 *   ffmpeg -y -i public/brand/upop-video.mp4 -map_metadata -1 -fflags +bitexact -vf scale=1280:-2,format=yuv420p \
 *     -c:v libx264 -crf <crf> -preset slow -profile:v high -c:a aac -b:a 96k -ac 2 -movflags +faststart public/media/upop-video.mp4
 *   Poster: tayyor MP4 ning birinchi kadri PNG → sharp AVIF (sifat byudjetga sigʻguncha −8 qadam bilan tushadi).
 */
const SRC = path.join(ROOT, "public/brand");
const MB = 1024 * 1024;
const KB = 1024;
const args = process.argv.slice(2);
const only = args.includes("--only") ? args[args.indexOf("--only") + 1] : null;
const dryRun = args.includes("--dry-run");
const kb = (bytes) => `${(bytes / KB).toFixed(0)} KB`;

/** width: masshtab kengligi; loop: xfade uzunligi (s); audio: false boʻlsa ovoz olib tashlanadi. */
const JOBS = [
  {
    name: "hero-d",
    source: "hero-logo-d.mp4",
    width: 1280,
    loop: 1,
    outputs: [
      { file: "hero-d.webm", kind: "av1", crf: 28, budget: 1.6 * MB },
      { file: "hero-d.mp4", kind: "h264", crf: 21, budget: 1.8 * MB },
    ],
    poster: { file: "hero-d-poster.avif", budget: 90 * KB },
  },
  {
    name: "hero-m",
    source: "hero-logo-m.mp4",
    width: 720,
    loop: 1,
    outputs: [
      { file: "hero-m.webm", kind: "av1", crf: 30, budget: 0.9 * MB },
      { file: "hero-m.mp4", kind: "h264", crf: 23, budget: 0.9 * MB },
    ],
    poster: { file: "hero-m-poster.avif", budget: 70 * KB },
  },
  {
    name: "upop-live-d",
    source: "upop-live.mp4",
    width: 1280,
    loop: 1.5,
    outputs: [
      { file: "upop-live-d.webm", kind: "av1", crf: 30, budget: 1.8 * MB },
      { file: "upop-live-d.mp4", kind: "h264", crf: 23, budget: 1.8 * MB },
    ],
    poster: { file: "upop-live-poster.avif", budget: 90 * KB },
  },
  {
    name: "upop-live-m",
    source: "upop-live.mp4",
    width: 854,
    loop: 1.5,
    outputs: [
      { file: "upop-live-m.webm", kind: "av1", crf: 32, budget: 0.9 * MB },
      { file: "upop-live-m.mp4", kind: "h264", crf: 25, budget: 0.9 * MB },
    ],
  },
  {
    name: "upop-video",
    source: "upop-video.mp4",
    width: 1280,
    audio: true,
    outputs: [{ file: "upop-video.mp4", kind: "h264", crf: 23, budget: 8 * MB }],
    poster: { file: "upop-video-poster.avif", from: "upop-video-poster.jpg", budget: 100 * KB },
  },
];

function codecArgs(kind, codec, crf) {
  if (kind === "av1")
    return codec === "libsvtav1"
      ? ["-crf", String(crf), "-preset", "4", "-g", "120", "-svtav1-params", "tune=0"]
      : ["-crf", String(crf), "-b:v", "0", "-cpu-used", "4", "-row-mt", "1", "-g", "120"];
  return [
    "-crf",
    String(crf),
    "-preset",
    "slow",
    "-profile:v",
    "high",
    "-g",
    "120",
    "-movflags",
    "+faststart",
  ];
}

/** Halqa uchun oxirgi X soniya boshlanishga eriydi; oddiy video faqat masshtablanadi. */
function videoFilter(job) {
  const scale = `scale=${job.width}:-2,format=yuv420p[v]`;
  if (!job.loop) return ["-vf", `${scale.replace("[v]", "")}`];
  const x = job.loop;
  const d = probe(path.join(SRC, job.source)).duration;
  const offset = (d - 2 * x).toFixed(3);
  return [
    "-filter_complex",
    `[0:v]split[a][b];[a]trim=start=${x},setpts=PTS-STARTPTS[a];[b]trim=end=${x},setpts=PTS-STARTPTS[b];[a][b]xfade=transition=fade:duration=${x}:offset=${offset},${scale}`,
    "-map",
    "[v]",
  ];
}

function encode(job, output, codec) {
  let crf = output.crf;
  const target = path.join(OUT, output.file);
  /* Ovozsiz halqalar uchun -an; upop-video ovozi AAC 96 kbit/s stereo bilan qoladi. */
  const audio = job.audio ? ["-c:a", "aac", "-b:a", "96k", "-ac", "2"] : ["-an"];
  for (let attempt = 0; attempt < 6; attempt++) {
    const list = [
      "-i",
      path.join(SRC, job.source),
      ...audio,
      "-map_metadata",
      "-1",
      "-fflags",
      "+bitexact",
      ...videoFilter(job),
      "-c:v",
      codec,
      ...codecArgs(output.kind, codec, crf),
      target,
    ];
    ffmpeg(list, output.file);
    const size = statSync(target).size;
    if (size <= output.budget) return { size, crf, ok: true };
    crf += 3;
  }
  return { size: statSync(target).size, crf: crf - 3, ok: false };
}

/** Poster: tayyor MP4 ning birinchi kadri (halqa boshi bilan bir xil) yoki JPG → AVIF, byudjetga sigʻguncha sifat pasayadi. */
async function makePoster(job) {
  const { poster: spec } = job;
  const target = path.join(OUT, spec.file);
  let input;
  if (spec.from) {
    input = path.join(SRC, spec.from);
  } else {
    const encoded = job.outputs.find((o) => o.kind === "h264");
    input = path.join(TMP, `${job.name}-first.png`);
    ffmpeg(["-i", path.join(OUT, encoded.file), "-frames:v", "1", input], "poster kadri");
  }
  const base = sharp(input).resize({ width: job.width, withoutEnlargement: true });
  let quality = 60;
  let bytes = 0;
  for (let attempt = 0; attempt < 6; attempt++) {
    const buffer = await base.clone().avif({ quality, effort: 7 }).toBuffer();
    bytes = buffer.length;
    /* Bufer toʻgʻridan-toʻgʻri yoziladi: sharp orqali qayta saqlash AVIF ni qayta kodlaydi. */
    writeFileSync(target, buffer);
    if (bytes <= spec.budget) break;
    quality -= 8;
  }
  const meta = await sharp(target).metadata();
  return { size: bytes, quality, ok: bytes <= spec.budget, width: meta.width, height: meta.height };
}

/* WebM oqimida duration yoʻq, shu sabab format darajasidan olinadi. */
function describe(file) {
  const info = probe(file);
  const result = spawnSync(
    "ffprobe",
    ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file],
    { encoding: "utf8" },
  );
  const duration = Number(result.stdout) || info.duration;
  return `${info.width}×${info.height}, ${duration.toFixed(2)} s`;
}

async function runJob(job, encoders) {
  const source = path.join(SRC, job.source);
  console.log(`\n${job.name} ← ${job.source} (${describe(source)})`);
  let ok = true;
  for (const output of job.outputs) {
    const codec = ENCODERS[output.kind].find((c) => encoders.has(c));
    if (!codec) {
      console.log(`  ${output.file}: kodlovchi yoʻq (${ENCODERS[output.kind].join("/")})`);
      ok = false;
      continue;
    }
    if (dryRun) {
      console.log(`  ${output.file} (${codec}, crf ${output.crf}, ≤ ${kb(output.budget)})`);
      continue;
    }
    const result = encode(job, output, codec);
    ok &&= result.ok;
    const target = path.join(OUT, output.file);
    console.log(
      `  ${output.file.padEnd(24)} ${kb(result.size).padStart(8)} / ${kb(output.budget)}  crf ${result.crf}  ${describe(target)}  ${result.ok ? "ok" : "BYUDJETDAN OSHDI"}`,
    );
    if (job.loop && output.kind === "h264") {
      const seam = await loopSeam(target);
      console.log(
        `  halqa choki (${output.file}): ${(seam * 100).toFixed(1)} %${seam > SEAM_THRESHOLD ? "  (sezilarli, manbani tekshiring)" : ""}`,
      );
    }
  }
  if (job.poster && !dryRun) {
    const p = await makePoster(job);
    ok &&= p.ok;
    console.log(
      `  ${job.poster.file.padEnd(24)} ${kb(p.size).padStart(8)} / ${kb(job.poster.budget)}  sifat ${p.quality}  ${p.width}×${p.height}  ${p.ok ? "ok" : "BYUDJETDAN OSHDI"}`,
    );
  }
  if (job.loop && !dryRun) {
    const seam = await loopSeam(source);
    console.log(`  halqa choki (manba): ${(seam * 100).toFixed(1)} %`);
  }
  return ok;
}

async function main() {
  if (spawnSync("ffmpeg", ["-version"], { encoding: "utf8" }).status !== 0) {
    console.log("ffmpeg topilmadi: media quvuri oʻtkazib yuborildi (brew install ffmpeg).");
    return 0;
  }
  const jobs = JOBS.filter(
    (j) => existsSync(path.join(SRC, j.source)) && (!only || j.name.startsWith(only)),
  );
  if (!jobs.length) {
    console.log("Manba video topilmadi (public/brand).");
    return 0;
  }
  mkdirSync(OUT, { recursive: true });
  mkdirSync(TMP, { recursive: true });
  const encoders = availableEncoders();
  let ok = true;
  for (const job of jobs) ok = (await runJob(job, encoders)) && ok;
  rmSync(TMP, { recursive: true, force: true });
  console.log(ok ? "\nHammasi byudjetda." : "\nBaʼzi fayllar byudjetdan oshdi.");
  return ok ? 0 : 1;
}

process.exit(await main());

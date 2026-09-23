import { spawnSync } from "node:child_process";
import { statSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { ROOT } from "./util.mjs";

export const OUT = path.join(ROOT, "public/media");
export const TMP = path.join(ROOT, ".verify/media-tmp");
export const SIZES = {
  d: { width: 1920, budget: 1.8 * 1024 * 1024 },
  m: { width: 960, budget: 0.9 * 1024 * 1024 },
};
export const POSTER_BUDGET = 120 * 1024;
export const SEAM_THRESHOLD = 0.06;
export const ENCODERS = { av1: ["libsvtav1", "libaom-av1"], hevc: ["libx265"], h264: ["libx264"] };

export function ffmpeg(list, label) {
  const result = spawnSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...list], {
    encoding: "utf8",
  });
  if (result.status !== 0)
    throw new Error(`${label}: ${result.stderr.trim().split("\n").slice(-3).join(" ")}`);
}

export function probe(file) {
  const result = spawnSync(
    "ffprobe",
    [
      "-v",
      "error",
      "-select_streams",
      "v:0",
      "-show_entries",
      "stream=width,height,duration",
      "-of",
      "json",
      file,
    ],
    { encoding: "utf8" },
  );
  const stream = result.status === 0 ? (JSON.parse(result.stdout).streams?.[0] ?? {}) : {};
  return {
    width: Number(stream.width) || 0,
    height: Number(stream.height) || 0,
    duration: Number(stream.duration) || 0,
  };
}

export function availableEncoders() {
  const result = spawnSync("ffmpeg", ["-hide_banner", "-encoders"], { encoding: "utf8" });
  return new Set(
    (result.stdout ?? "")
      .split("\n")
      .map((line) => line.trim().split(/\s+/)[1])
      .filter(Boolean),
  );
}

function codecArgs(kind, codec, crf) {
  if (kind === "av1")
    return codec === "libsvtav1"
      ? ["-crf", String(crf), "-preset", "6"]
      : ["-crf", String(crf), "-b:v", "0", "-cpu-used", "6", "-row-mt", "1"];
  if (kind === "hevc")
    return ["-crf", String(crf), "-preset", "medium", "-tag:v", "hvc1", "-movflags", "+faststart"];
  return ["-crf", String(crf), "-preset", "slow", "-profile:v", "high", "-movflags", "+faststart"];
}

/** Ovoz va metadata olib tashlanadi; byudjetdan oshsa crf +4 bilan ikki marta qayta kodlanadi. */
export function encodeWithinBudget(input, output, kind, codec, width, budget, baseCrf) {
  let crf = baseCrf;
  for (let attempt = 0; attempt < 3; attempt++) {
    ffmpeg(
      [
        "-i",
        input,
        "-an",
        "-map_metadata",
        "-1",
        "-vf",
        `scale='min(${width},iw)':-2`,
        "-pix_fmt",
        "yuv420p",
        "-c:v",
        codec,
        ...codecArgs(kind, codec, crf),
        output,
      ],
      path.basename(output),
    );
    const size = statSync(output).size;
    if (size <= budget) return { size, crf, ok: true };
    crf += 4;
  }
  return { size: statSync(output).size, crf: crf - 4, ok: false };
}

async function frameBuffer(file, seek, width) {
  const png = path.join(TMP, `${path.basename(file)}-${seek.replace(/[^\w]/g, "_")}.png`);
  const seekArgs = seek.startsWith("-") ? ["-sseof", seek] : ["-ss", seek];
  ffmpeg([...seekArgs, "-i", file, "-frames:v", "1", "-vf", `scale=${width}:-2`, png], "kadr");
  return png;
}

/** Halqa choki: birinchi va oxirgi kadr oʻrtacha farqi (0–1); katta boʻlsa halqa sezilarli sakraydi. */
export async function loopSeam(file) {
  const first = await frameBuffer(file, "0", 160);
  const last = await frameBuffer(file, "-0.05", 160);
  const [a, b] = await Promise.all(
    [first, last].map((f) => sharp(f).greyscale().raw().toBuffer({ resolveWithObject: true })),
  );
  const length = Math.min(a.data.length, b.data.length);
  let total = 0;
  for (let i = 0; i < length; i++) total += Math.abs(a.data[i] - b.data[i]);
  return total / length / 255;
}

export async function poster(file, name) {
  const out = {};
  for (const [suffix, size] of Object.entries(SIZES)) {
    const png = await frameBuffer(file, "0", size.width);
    const target = path.join(OUT, `${name}-poster-${suffix}.avif`);
    let quality = 55;
    let bytes = 0;
    for (let attempt = 0; attempt < 5; attempt++) {
      const buffer = await sharp(png).avif({ quality, effort: 6 }).toBuffer();
      bytes = buffer.length;
      await sharp(buffer).toFile(target);
      if (suffix === "d" || bytes <= POSTER_BUDGET) break;
      quality -= 8;
    }
    out[suffix] = { size: bytes, ok: suffix === "d" || bytes <= POSTER_BUDGET };
  }
  return out;
}

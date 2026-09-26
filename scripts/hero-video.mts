/*
 * Bosh sahifa qahramoni: egasining Higgsfield videosi (src/assets/video/new-hero.mp4, 1920×1080, 10 s) —
 * oltin kitob, bolalar, samolyotcha va yulduzlar belgiga yigʻiladi. Video oʻynamaydi: skroll uni kadrma-
 * kadr oldinga suradi (egasining talabi), keyin sahna belgini sarlavhaga olib boradi.
 *   2 s dan boshlanadi: undan oldingi kadrlar boʻsh fon, birinchi ekran oltin kitob bilan ochiladi;
 *   H.264, har 6-kadr kalit, B-kadrsiz: istalgan joyga sakrash tez (Safari va telefonda ham silliq);
 *   kompyuter 1920×1080, telefon 720×1280 — markaziy qism videoning oʻz fon rangida (#0B1430) tekis
 *   maydonga qoʻyiladi, yuqori va pastki cheti 140 px da eriydi, belgi HERO_LOGO_BOX.portrait oʻrnida;
 *   posterlar: birinchi kadr (skroll oldidan) va oxirgi kadr (harakat oʻchiq, belgi tayyor).
 * Byudjet (§17): kompyuter ≤ 1.8 MB, telefon ≤ 0.9 MB (kerak boʻlsa crf oshiriladi). ffmpeg kerak.
 */
import { execFileSync } from "node:child_process";
import { statSync } from "node:fs";
import path from "node:path";

const SOURCE = path.resolve("src/assets/video/new-hero.mp4");
const OUT = path.resolve("public/media");
const MB = 1024 * 1024;

/* Telefon kadri: manbadan 1152×1080 markaz (x 384) — animatsiyaning eng keng lahzasi ham ichida —
   1080×1013 ga, tepadan 303 px: belgi 1080×1920 kadrning shu nuqtasiga tushadi. Fon — videoning chekka
   rangi (yuqori 12/21/48 va pastki 10/18/43 oʻrtachasi), chegara alfa bilan eritiladi. */
const START = "trim=start=2,setpts=PTS-STARTPTS";
const PORTRAIT =
  "color=c=0x0B1430:s=1080x1920:r=24[bg];" +
  `[0:v]${START},crop=1152:1080:384:0,scale=1080:1013,format=rgba,` +
  "geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='255*min(1,min(Y,H-Y)/140)'[fg];" +
  "[bg][fg]overlay=0:303:shortest=1,scale=720:1280,format=yuv420p[v]";
const LANDSCAPE = `[0:v]${START},format=yuv420p[v]`;

function run(args: string[]): void {
  execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], {
    stdio: "inherit",
  });
}

function encode(graph: string, file: string, crf: number): number {
  const target = path.join(OUT, file);
  run([
    "-i",
    SOURCE,
    "-an",
    "-map_metadata",
    "-1",
    "-filter_complex",
    graph,
    "-map",
    "[v]",
    "-c:v",
    "libx264",
    "-crf",
    String(crf),
    "-preset",
    "slow",
    "-profile:v",
    "high",
    /* Skroll sakrashlari uchun: kalit kadr zich, B-kadr yoʻq — dekoder koʻpi bilan 5 kadr orqaga qaytadi. */
    "-g",
    "6",
    "-keyint_min",
    "6",
    "-sc_threshold",
    "0",
    "-bf",
    "0",
    "-movflags",
    "+faststart",
    target,
  ]);
  return statSync(target).size;
}

/* Byudjetga sigʻguncha crf +2 qadam bilan. */
function fit(graph: string, file: string, crf: number, budget: number): void {
  let value = crf;
  let size = encode(graph, file, value);
  while (size > budget && value < 51) {
    value += 2;
    size = encode(graph, file, value);
  }
  console.log(`${file}\t${(size / 1024).toFixed(0)} KB\tcrf ${value}`);
}

/* Poster tayyor MP4 dan olinadi: kadr ijro etiladigan video bilan piksel-piksel bir xil. */
function poster(video: string, file: string, at: "first" | "last"): void {
  const seek = at === "first" ? ["-ss", "0"] : ["-sseof", "-0.1"];
  run([
    ...seek,
    "-i",
    path.join(OUT, video),
    "-frames:v",
    "1",
    "-c:v",
    "libaom-av1",
    "-still-picture",
    "1",
    "-crf",
    "30",
    path.join(OUT, file),
  ]);
  console.log(`${file}\t${(statSync(path.join(OUT, file)).size / 1024).toFixed(0)} KB`);
}

fit(LANDSCAPE, "hero-scrub-d.mp4", 22, 1.8 * MB);
fit(PORTRAIT, "hero-scrub-m.mp4", 22, 0.9 * MB);
poster("hero-scrub-d.mp4", "hero-scrub-d-poster.avif", "first");
poster("hero-scrub-d.mp4", "hero-scrub-d-end.avif", "last");
poster("hero-scrub-m.mp4", "hero-scrub-m-poster.avif", "first");
poster("hero-scrub-m.mp4", "hero-scrub-m-end.avif", "last");

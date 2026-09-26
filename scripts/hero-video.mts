/*
 * Bosh sahifa qahramoni: egasining Higgsfield videosi (src/assets/video/new-hero.mp4, 1920×1080, 10 s) —
 * oltin kitob, bolalar, samolyotcha va yulduzlar belgiga yigʻiladi. Bir marta ijro etiladi (halqa emas),
 * oxirgi kadrda belgi turadi, keyin skroll sahnasi belgini sarlavhaga olib boradi.
 *   kompyuter: 1920×1080 AV1 (webm) + H.264 (mp4) — belgi tafsilotlari aniq koʻrinsin;
 *   telefon: 1080×1920 — butun animatsiya kengligi (kadrning 21–75 %) sigʻadi: markaziy qism videoning
 *   oʻz fon rangida (#0B1430) tekis maydonga qoʻyiladi, yuqori va pastki cheti 140 px da eriydi (chok
 *   koʻrinmaydi), belgi HERO_LOGO_BOX.portrait oʻrniga tushadi;
 *   posterlar: birinchi kadr (ijro oldidan) va oxirgi kadr (harakat oʻchiq, belgi tayyor).
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
const PORTRAIT =
  "color=c=0x0B1430:s=1080x1920:r=24[bg];" +
  "[0:v]crop=1152:1080:384:0,scale=1080:1013,format=rgba," +
  "geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='255*min(1,min(Y,H-Y)/140)'[fg];" +
  "[bg][fg]overlay=0:303:shortest=1,format=yuv420p[v]";
const LANDSCAPE = "[0:v]format=yuv420p[v]";

function run(args: string[]): void {
  execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], {
    stdio: "inherit",
  });
}

function encode(graph: string, file: string, codec: "av1" | "h264", crf: number): number {
  const target = path.join(OUT, file);
  const common = [
    "-i",
    SOURCE,
    "-an",
    "-map_metadata",
    "-1",
    "-filter_complex",
    graph,
    "-map",
    "[v]",
  ];
  const video =
    codec === "av1"
      ? [
          "-c:v",
          "libsvtav1",
          "-crf",
          String(crf),
          "-preset",
          "4",
          "-g",
          "240",
          "-svtav1-params",
          "tune=0",
        ]
      : [
          "-c:v",
          "libx264",
          "-crf",
          String(crf),
          "-preset",
          "slow",
          "-profile:v",
          "high",
          "-g",
          "240",
          "-movflags",
          "+faststart",
        ];
  run([...common, ...video, target]);
  return statSync(target).size;
}

/* Byudjetga sigʻguncha crf +2 qadam bilan. */
function fit(
  graph: string,
  file: string,
  codec: "av1" | "h264",
  crf: number,
  budget: number,
): void {
  let value = crf;
  let size = encode(graph, file, codec, value);
  while (size > budget && value < 51) {
    value += 2;
    size = encode(graph, file, codec, value);
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

fit(LANDSCAPE, "hero-d.webm", "av1", 30, 1.6 * MB);
fit(LANDSCAPE, "hero-d.mp4", "h264", 23, 1.8 * MB);
fit(PORTRAIT, "hero-m.webm", "av1", 32, 0.9 * MB);
fit(PORTRAIT, "hero-m.mp4", "h264", 25, 0.9 * MB);
poster("hero-d.mp4", "hero-d-poster.avif", "first");
poster("hero-d.mp4", "hero-d-end.avif", "last");
poster("hero-m.mp4", "hero-m-poster.avif", "first");
poster("hero-m.mp4", "hero-m-end.avif", "last");

/*
 * Qahramon videosi bir marta ijro etiladi va oxirgi kadrda belgi turadi, keyin skroll uni sarlavhaga olib boradi.
 * Fon bir tusda qolishi uchun chetlardagi qoraytirish va markazdagi yorugʻ dogʻ sayt zaminiga tekislanadi:
 * yorugʻligi 34 dan past piksel zamin rangini oladi, 50 dan yuqorisi (belgi, oltin, uchqunlar) oʻzgarmaydi.
 * Hajm chegarasi: kompyuter uchun 1.8 MB, telefon uchun 0.9 MB. ffmpeg kerak.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, statSync } from "node:fs";
import path from "node:path";

const ORIGINAL = path.resolve("src/assets/video/new-hero.mp4");
const CACHE = path.resolve(".content-cache");
const SOURCE = path.join(CACHE, "hero-flat.mkv");
const OUT = path.resolve("public/media");
const MB = 1024 * 1024;

/* atlas.css faylidagi --bg va --hero-ground bilan bir xil boʻlishi shart. */
const GROUND = { r: 10, g: 16, b: 38 };
const MASK =
  "st(0,0.2126*r(X,Y)+0.7152*g(X,Y)+0.0722*b(X,Y));" +
  "st(1,clip((ld(0)-34)/16,0,1));st(1,ld(1)*ld(1)*(3-2*ld(1)))";
const FLATTEN =
  "format=gbrp,geq=" +
  `r='${MASK};${GROUND.r}*(1-ld(1))+r(X,Y)*ld(1)':` +
  `g='${MASK};${GROUND.g}*(1-ld(1))+g(X,Y)*ld(1)':` +
  `b='${MASK};${GROUND.b}*(1-ld(1))+b(X,Y)*ld(1)'`;

/* Telefon kadri: manbaning 1152×1080 markazi (animatsiyaning eng keng lahzasi ham sigʻadi) tepadan 303 px
   pastga qoʻyiladi, shunda belgi HERO_LOGO_BOX.portrait oʻrniga tushadi. Chok koʻrinmasligi uchun yuqori va
   pastki chet 140 px davomida eriydi. */
const PORTRAIT =
  "color=c=0x0A1026:s=1080x1920:r=24[bg];" +
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

/* Hajm chegarasiga sigʻguncha crf ikki birlikdan oshiriladi. */
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

/* Poster tayyor MP4 fayldan olinadi, shunda kadr ijro etiladigan video bilan piksel-piksel bir xil. */
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

/* Ogʻir filtr bir marta ishlashi uchun tekislangan nusxa siqilmagan FFV1 formatida saqlanadi. */
mkdirSync(CACHE, { recursive: true });
run(["-i", ORIGINAL, "-an", "-vf", FLATTEN, "-c:v", "ffv1", "-pix_fmt", "gbrp", SOURCE]);

fit(LANDSCAPE, "hero-d.webm", "av1", 30, 1.6 * MB);
fit(LANDSCAPE, "hero-d.mp4", "h264", 23, 1.8 * MB);
fit(PORTRAIT, "hero-m.webm", "av1", 32, 0.9 * MB);
fit(PORTRAIT, "hero-m.mp4", "h264", 25, 0.9 * MB);
poster("hero-d.mp4", "hero-d-poster.avif", "first");
poster("hero-d.mp4", "hero-d-end.avif", "last");
poster("hero-m.mp4", "hero-m-poster.avif", "first");
poster("hero-m.mp4", "hero-m-end.avif", "last");

/* «Biz haqimizda» belgisi: qorongʻi boshlanish tashlanadi, belgi atrofidagi 800 px kvadrat olinadi. */
const ABOUT =
  "[0:v]trim=start=0.8,setpts=PTS-STARTPTS,crop=800:800:555:47,scale=720:720,format=yuv420p[v]";
fit(ABOUT, "about-logo.webm", "av1", 34, 0.6 * MB);
fit(ABOUT, "about-logo.mp4", "h264", 26, 0.6 * MB);
poster("about-logo.mp4", "about-logo-poster.avif", "first");
poster("about-logo.mp4", "about-logo-end.avif", "last");

/*
 * Bosish ovozlari doira yozuvidan kesib olinadi: toʻrtta toʻla «dum» va ikkita jarangdor «tak».
 * Oltovi bitta MP3 spritega 0.7 s lik kataklarda yoziladi, shunda bitta soʻrov va bitta dekodlash yetadi.
 * Har katak 50 ms jimlikdan boshlanadi, aks holda MP3 kodlovchisining siljishi zarba boshini kesadi.
 * SLOT va TAPS qiymatlari src/lib/sound/synth.ts fayli bilan bir xil boʻlishi shart. ffmpeg kerak.
 */
import { execFileSync } from "node:child_process";
import path from "node:path";

const SOURCE = path.resolve("src/assets/audio/doira.mp3");
const TARGET = path.resolve("public/sounds/doira-taps.mp3");
const SLOT = 0.7;
const LEAD = 0.05;
const FADE = 0.2;

/* [hujum vaqti, keyingi zarbagacha oraliq], soniyalarda. */
const HITS: ReadonlyArray<readonly [number, number]> = [
  [3.1369, 0.58], // dum: eng toʻla va baland
  [1.9458, 0.59], // tak: yorqin qoʻngʻiroqchalar
  [7.637, 0.51], // dum
  [4.2925, 0.57], // tak: eng jarangdor
  [8.6745, 0.57], // dum: soʻnishi eng toza (ortidan qayta zarba yoʻq)
  [0.7537, 0.6], // dum: yozuvning birinchi kuchli zarbasi
];

const chains = HITS.map(([attack, gap], i) => {
  const start = attack - 0.005;
  const length = Math.min(0.55, gap - 0.04);
  return [
    `[0:a]atrim=start=${start.toFixed(4)}:duration=${length.toFixed(3)},asetpts=PTS-STARTPTS`,
    "aformat=channel_layouts=mono",
    "afade=t=in:st=0:d=0.003",
    `afade=t=out:st=${(length - FADE).toFixed(3)}:d=${FADE}:curve=exp`,
    "loudnorm=I=-14:TP=-3:LRA=7",
    "aresample=44100",
    `adelay=${Math.round(LEAD * 1000)}`,
    `apad=whole_dur=${SLOT}`,
    `atrim=duration=${SLOT}`,
    `asetpts=N/SR/TB[h${i}]`,
  ].join(",");
});
const graph = `${chains.join(";")};${HITS.map((_, i) => `[h${i}]`).join("")}concat=n=${HITS.length}:v=0:a=1,asetpts=N/SR/TB[out]`;

execFileSync(
  "ffmpeg",
  [
    "-hide_banner",
    "-loglevel",
    "error",
    "-y",
    "-i",
    SOURCE,
    "-filter_complex",
    graph,
    "-map",
    "[out]",
    "-ar",
    "44100",
    /* Oʻzgaruvchan bitreyt: kataklar orasidagi jimlik deyarli joy olmaydi. */
    "-q:a",
    "5",
    "-map_metadata",
    "-1",
    TARGET,
  ],
  { stdio: "inherit" },
);
console.log("yozildi", TARGET, `${HITS.length} zarba × ${SLOT} s`);

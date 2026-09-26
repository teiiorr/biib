/*
 * Bosish ovozi egasining doira yozuvidan (src/assets/audio/doira.mp3, 23 s) kesiladi. Eng taʼsirli zarba
 * oʻlchab tanlangan: 3.137 s dagi «dum» — baland, toʻla past tovush va qoʻngʻiroqchalar jarangi, keyingi
 * zarbagacha 580 ms. Hujumdan 5 ms oldin boshlanadi (tovush boshi kesilmaydi), 0.55 s, oxirgi 0.25 s da
 * soʻnadi, choʻqqi −3 dBFS, mono MP3 (Windows, Android va iPhone da decodeAudioData ochadi).
 * Natija: public/sounds/doira-tap.mp3. ffmpeg kerak.
 */
import { execFileSync } from "node:child_process";
import path from "node:path";

const SOURCE = path.resolve("src/assets/audio/doira.mp3");
const TARGET = path.resolve("public/sounds/doira-tap.mp3");
const START = 3.132;
const LENGTH = 0.55;
const FADE = 0.25;

execFileSync(
  "ffmpeg",
  [
    "-hide_banner",
    "-loglevel",
    "error",
    "-y",
    "-ss",
    String(START),
    "-t",
    String(LENGTH),
    "-i",
    SOURCE,
    "-af",
    [
      "aformat=channel_layouts=mono",
      "afade=t=in:st=0:d=0.003",
      `afade=t=out:st=${(LENGTH - FADE).toFixed(3)}:d=${FADE}:curve=exp`,
      "loudnorm=I=-14:TP=-3:LRA=7",
    ].join(","),
    "-ar",
    "44100",
    "-b:a",
    "96k",
    "-map_metadata",
    "-1",
    TARGET,
  ],
  { stdio: "inherit" },
);
console.log("yozildi", TARGET);

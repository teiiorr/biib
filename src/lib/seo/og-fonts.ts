import { readFile } from "node:fs/promises";
import path from "node:path";

type OgFont = { name: string; data: ArrayBuffer; weight: 400 | 500 | 600 | 700; style: "normal" };

const FONT_DIR = path.join(process.cwd(), "src/assets/fonts");

async function load(file: string): Promise<ArrayBuffer> {
  const buffer = await readFile(path.join(FONT_DIR, file));
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  ) as ArrayBuffer;
}

/** Satori uchun kirillcha glifli TTF fayllar aniq beriladi (§17 SEO). */
export async function loadOgFonts(): Promise<OgFont[]> {
  const [playfair, inter, nunito] = await Promise.all([
    load("Playfair[opsz,wdth,wght].ttf"),
    load("Inter[opsz,wght].ttf"),
    load("Nunito[wght].ttf"),
  ]);
  return [
    { name: "Playfair", data: playfair, weight: 500, style: "normal" },
    { name: "Inter", data: inter, weight: 400, style: "normal" },
    { name: "Nunito", data: nunito, weight: 700, style: "normal" },
  ];
}

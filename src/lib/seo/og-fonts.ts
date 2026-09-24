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

/**
 * Satori uchun kirillcha glifli TTF fayllar aniq beriladi (§17 SEO).
 * Oʻzgaruvchan shriftlarni Satori oʻqiy olmaydi: fontTools instancer bilan statik nusxalar
 * (Akt 700, Inter 400/opsz 32, Nunito 700) yonida saqlanadi. Satori font-feature-settings ni
 * bilmaydi, shu sabab Akt-700 da serifli I (cv05) cmap ga toʻgʻridan-toʻgʻri qoʻyilgan.
 */
export async function loadOgFonts(): Promise<OgFont[]> {
  const [akt, inter, nunito] = await Promise.all([
    load("Akt-700.ttf"),
    load("Inter-400.ttf"),
    load("Nunito-700.ttf"),
  ]);
  return [
    { name: "Akt", data: akt, weight: 700, style: "normal" },
    { name: "Inter", data: inter, weight: 400, style: "normal" },
    { name: "Nunito", data: nunito, weight: 700, style: "normal" },
  ];
}

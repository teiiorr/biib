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
 * (Manrope UZ 700 va 400, Nunito 700) yonida saqlanadi; ʻ ʼ Қ Ғ Ҳ Manrope UZ da bor.
 */
export async function loadOgFonts(): Promise<OgFont[]> {
  const [manropeBold, manrope, nunito] = await Promise.all([
    load("Manrope-700.ttf"),
    load("Manrope-400.ttf"),
    load("Nunito-700.ttf"),
  ]);
  return [
    { name: "Manrope", data: manropeBold, weight: 700, style: "normal" },
    { name: "Manrope", data: manrope, weight: 400, style: "normal" },
    { name: "Nunito", data: nunito, weight: 700, style: "normal" },
  ];
}

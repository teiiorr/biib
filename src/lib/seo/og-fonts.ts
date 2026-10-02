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
 * Satori oʻzgaruvchan shriftni oʻqiy olmaydi, shu sabab kirillcha glifli statik TTF nusxalar
 * (fontTools instancer bilan olingan) aniq beriladi. ʻ ʼ Қ Ғ Ҳ belgilari ikkala shriftda ham bor.
 */
export async function loadOgFonts(): Promise<OgFont[]> {
  const [unbounded, manropeBold, manrope] = await Promise.all([
    load("UnboundedUZ-700.ttf"),
    load("Manrope-700.ttf"),
    load("Manrope-400.ttf"),
  ]);
  return [
    { name: "Unbounded", data: unbounded, weight: 700, style: "normal" },
    { name: "Manrope", data: manropeBold, weight: 700, style: "normal" },
    { name: "Manrope", data: manrope, weight: 400, style: "normal" },
  ];
}

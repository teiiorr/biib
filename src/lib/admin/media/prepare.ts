import "server-only";

import { createHash } from "node:crypto";
import sharp, { type Sharp } from "sharp";

import { PURPOSE_BLUR, PURPOSE_WIDTHS, type MediaPurpose } from "./purposes";

/* scripts/images.mjs bilan bir xil: AVIF 52 koʻzga farqsiz, WebP 78 eski Safari uchun zaxira.
   AVIF effort 4: server vaqti 60 soniyaga sigʻadi, hajm farqi bir necha foiz. */
const AVIF = { quality: 52, effort: 4 } as const;
const WEBP = { quality: 78 } as const;
/* Oʻrtacha nisbiy yorugʻlik shundan yuqori boʻlsa rasm «yorugʻ»: ustidagi oyna yorugʻ muzga oʻtadi. */
const BRIGHT_MIN = 0.35;

export interface ImageVariant {
  readonly name: string;
  readonly contentType: "image/avif" | "image/webp";
  readonly body: Buffer;
}

export interface PreparedUpload {
  /** Burilgan asl nusxa xeshining boshi: fayl nomi, bir xil rasm ikki marta saqlanmaydi. */
  readonly hash: string;
  readonly width: number;
  readonly height: number;
  readonly widths: readonly number[];
  readonly blur: string | null;
  readonly bright: boolean;
  readonly variants: readonly ImageVariant[];
}

function linear(channel: number): number {
  const v = channel / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

type Source = () => Sharp;

/* Har piksel yorugʻligining oʻrtachasi (oʻrtacha rangniki emas): 64 px nusxa yetarli. */
async function isBright(source: Source): Promise<boolean> {
  const { data } = await source()
    .resize({ width: 64 })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let sum = 0;
  for (let i = 0; i + 2 < data.length; i += 3) {
    sum += 0.2126 * linear(data[i] ?? 0) + 0.7152 * linear(data[i + 1] ?? 0);
    sum += 0.0722 * linear(data[i + 2] ?? 0);
  }
  return sum / (data.length / 3) > BRIGHT_MIN;
}

function encode(source: Source, hash: string, width: number): Promise<ImageVariant>[] {
  const resized = source().resize({ width, withoutEnlargement: true });
  return [
    resized
      .clone()
      .avif(AVIF)
      .toBuffer()
      .then((body: Buffer) => ({ name: `${hash}-${width}.avif`, contentType: "image/avif", body })),
    resized
      .clone()
      .webp(WEBP)
      .toBuffer()
      .then((body: Buffer) => ({ name: `${hash}-${width}.webp`, contentType: "image/webp", body })),
  ];
}

/**
 * Yuklangan rasmdan sahifa nusxalari: EXIF boʻyicha buriladi (metamaʼlumot, jumladan joylashuv,
 * nusxalarga oʻtmaydi), maqsad kengliklarida AVIF va WebP, 16 px xira fon va yorugʻlik belgisi.
 * Oraliq nusxa siqilmagan piksellar: ikki marta siqish sifatni tushirmaydi.
 */
export async function prepareImage(input: Buffer, purpose: MediaPurpose): Promise<PreparedUpload> {
  const { data: pixels, info } = await sharp(input, { failOn: "error" })
    .rotate()
    .toColourspace("srgb")
    .raw({ depth: "uchar" })
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const source: Source = () => sharp(pixels, { raw: { width, height, channels } });
  const hash = createHash("sha256")
    .update(`${width}x${height}x${channels}:`)
    .update(pixels)
    .digest("hex")
    .slice(0, 20);
  const widths = [...new Set(PURPOSE_WIDTHS[purpose].map((w) => Math.min(w, width)))].sort(
    (a, b) => a - b,
  );
  const variants = await Promise.all(widths.flatMap((w) => encode(source, hash, w)));
  const blur = PURPOSE_BLUR[purpose]
    ? `data:image/webp;base64,${(
        await source().resize({ width: 16 }).blur(1).webp({ quality: 40 }).toBuffer()
      ).toString("base64")}`
    : null;
  const bright = channels === 4 ? false : await isBright(source);
  return { hash, width, height, widths, blur, bright, variants };
}

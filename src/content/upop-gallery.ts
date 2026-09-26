import type { Localized } from "./types";

/** Ramka: har joyning oʻz koʻrinishi (pages.css va materials.css, .upop-shot). */
export type UpopFrame = "stage" | "gold" | "glass" | "ticket" | "film" | "mat";

/** Skroll bilan kirish (ikki yoʻnalishda qaytadi): har joyning oʻz harakati. */
export type UpopMotion =
  "curtain" | "slide-end" | "wipe" | "rise" | "iris" | "tilt" | "slide-start" | "zoom";

export interface UpopShot {
  readonly kind: "photo" | "video";
  /** public/ ichidagi fayl yoʻli, masalan "/upop/1.jpg" yoki "/upop/5.mp4" (tashqi havola CSP da bloklanadi). */
  readonly src: string;
  /** Faqat video uchun: birinchi kadr surati (boʻlmasa kadr video yuklanguncha boʻsh turadi). */
  readonly poster?: string;
  readonly frame: UpopFrame;
  readonly motion: UpopMotion;
  /** Ixtiyoriy tavsif; berilmasa lugʻatdagi «UPOP TREND: N-lavha» ishlatiladi. */
  readonly alt?: Localized;
}

/*
 * ================================================================================================
 *  UPOP TREND GALEREYASI — 8 ta joy (loyiha sahifasida «Jarayon» filmidan keyin).
 *
 *  Hozir hammasi izohda: roʻyxat boʻsh, shuning uchun galereya saytda koʻrinmaydi.
 *
 *  Yoqish uchun:
 *    1. Suratlar va videolarni public/upop/ papkasiga qoʻying (masalan public/upop/1.jpg).
 *    2. Quyidagi qatorlar boshidagi «// » ni olib tashlang (bitta yoki hammasini).
 *    3. src (va video uchun poster) yoʻlini oʻz faylingizga almashtiring.
 *  Tartib = joy: 1-qator eng katta kadr, keyingilari toʻrda ketma-ket. Eng chiroylisi — 8 tasi toʻliq.
 *  Video: .mp4 (H.264), ovozsiz halqa sifatida oʻynaydi; poster — shu videoning birinchi kadri (.jpg).
 *  Ramka va harakatni oʻzgartirish mumkin: frame va motion qiymatlari yuqoridagi turlarda.
 * ================================================================================================
 */
export const UPOP_GALLERY: readonly UpopShot[] = [
  // { kind: "video", src: "/upop/1.mp4", poster: "/upop/1.jpg", frame: "stage", motion: "curtain" },
  // { kind: "photo", src: "/upop/2.jpg", frame: "gold", motion: "slide-end" },
  // { kind: "photo", src: "/upop/3.jpg", frame: "glass", motion: "wipe" },
  // { kind: "photo", src: "/upop/4.jpg", frame: "ticket", motion: "rise" },
  // { kind: "video", src: "/upop/5.mp4", poster: "/upop/5.jpg", frame: "film", motion: "iris" },
  // { kind: "photo", src: "/upop/6.jpg", frame: "mat", motion: "tilt" },
  // { kind: "photo", src: "/upop/7.jpg", frame: "glass", motion: "slide-start" },
  // { kind: "video", src: "/upop/8.mp4", poster: "/upop/8.jpg", frame: "gold", motion: "zoom" },
];

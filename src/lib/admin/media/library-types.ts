import type { MediaItem } from "../news/types";

/** Media sahifasidagi bitta fayl: koʻrinishi, oʻlchami va necha joyda ishlatilgani. */
export interface LibraryItem extends MediaItem {
  readonly kind: "image" | "video";
  /** static: public/ dagi fayl (kod bilan keladi); storage: panel orqali yuklangan. */
  readonly origin: "static" | "storage";
  /** Fayl nomi (yoʻlning oxirgi qismi). */
  readonly name: string;
  readonly width: number | null;
  readonly height: number | null;
  readonly bytes: number | null;
  readonly uses: number;
}

export type DeleteMediaResult =
  | { readonly ok: true; readonly filesLeft: boolean }
  | { readonly ok: false; readonly message: string };

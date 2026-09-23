import type { uz } from "./uz";

/** uz lugʻati kalitlarning manbai: boshqa tillar shu shaklga mos kelishi shart. */
export type Dictionary = typeof uz;

export type DeepPartial<T> = T extends readonly (infer U)[]
  ? readonly DeepPartial<U>[]
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

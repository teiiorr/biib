export const LAYOUT_CHECKS = [
  "overflow",
  "clip",
  "under-header",
  "under-tabbar",
  "overlap",
  "target-size",
  "target-spacing",
  "grid-edges",
  "spacing-scale",
  "card-rows",
  "icon-centre",
] as const;
export type LayoutCheck = (typeof LAYOUT_CHECKS)[number];

export interface Finding {
  readonly check: LayoutCheck;
  readonly target: string;
  readonly detail: string;
}

export const SPACING_SCALE = [0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128] as const;

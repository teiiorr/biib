import type { ArtMap } from "../registry";

/** Atlas badiiy qatlami: har uya alohida chunk. */
export const art: ArtMap = {
  "home-hero": () => import("./AbrSilk"),
  "home-portal": () => import("./AbrSilk"),
  "project-media": () => import("./AbrReveal"),
};

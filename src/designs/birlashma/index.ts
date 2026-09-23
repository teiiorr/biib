import type { ArtMap } from "../registry";

/** Birlashma badiiy qatlami: har uya alohida chunk. */
export const art: ArtMap = {
  "home-hero": () => import("./ColoringHero"),
  "about-timeline": () => import("./Clothespin"),
  "contacts-band": () => import("./Postcard"),
  "footer-crown": () => import("./CrayonHorizon"),
  "not-found": () => import("./DrawCanvas"),
  error: () => import("./CrumpledPaper"),
  "project-media": () => import("./ProjectMedia"),
  "news-header": () => import("./Masthead"),
  "news-progress": () => import("./PencilProgress"),
};

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bolalar Ijodkorligi Ijodiy Birlashmasi",
    short_name: "Bolalar ijodkorligi",
    description: "Oʻzbekistonda bolalar va oʻsmirlar ijodini qoʻllab-quvvatlaydigan birlashma",
    start_url: "/uz",
    display: "standalone",
    background_color: "#f7f3ea",
    theme_color: "#0e1733",
    lang: "uz-Latn",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}

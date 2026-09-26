import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bolalar Ijodkorligi Ijodiy Birlashmasi",
    short_name: "Bolalar ijodkorligi",
    description: "Oʻzbekistonda bolalar va oʻsmirlar ijodini qoʻllab-quvvatlaydigan birlashma",
    start_url: "/uz",
    display: "standalone",
    background_color: "#0a1026",
    theme_color: "#0a1026",
    lang: "uz-Latn",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}

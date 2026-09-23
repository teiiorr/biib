// Avtomatik: scripts/transliterate.mts uz/appearance.ts dan. Qoʻlda tuzatish uchun overrides.ts.
import type { appearance as source } from "../uz/appearance";

export const appearance: typeof source = {
  panel: "Köriniş",
  open: "Körinişni sozlaş",
  close: "Yopiş",
  theme: {
    label: "Mavzu",
    light: "Yoruğ",
    dark: "Tungi",
    system: "Tizim",
  },
  transparency: "Şaffoflik",
  transparencyFrom: "Xira",
  transparencyTo: "Tiniq",
  density: "Ziçlik",
  densityFrom: "Yupqa",
  densityTo: "Qalin",
  reset: "Asliga qaytariş",
  sound: "Ovoz",
  soundHint: "Mavzu va sahifa almaşganda yengil doira ovozi",
  motion: "Harakat",
  motionHint: "Bezak harakatlari; matn va sahifa ötişlari saqlanadi",
  design: "Dizayn",
  designAtlas: "Atlas",
  designAtlasHint: "Milliy naqşlar va oyna",
  designBirlashma: "Birlaşma",
  designBirlashmaHint: "Bolalar ijodi ruhida",
  valueText: "{value}%",
  reducedTransparency: "Tizimda şaffoflik kamaytirilgan, şu sabab sozlagiçlar öçirilgan",
  previewAlt: "{design} dizaynining kiçik namunasi",
};

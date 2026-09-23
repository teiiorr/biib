// Avtomatik: scripts/transliterate.mts uz/birlashma.ts dan. Qoʻlda tuzatish uchun overrides.ts.
import type { birlashma as source } from "../uz/birlashma";

export const birlashma: typeof source = {
  note: {
    hero: "Bu yerda har bir çiziq bolaniki",
    mission: "Sahna keyin topiladi",
  },
  stickers: {
    age: "{from}–{to} yoş",
    new: "Yangi",
    free: "Bepul",
  },
  paperAlt: "Skanerlangan qoğoz teksturasi",
  chalkAlt: "Doska teksturasi",
  pinAlt: "Magnit",
  clothespinAlt: "Kir qisqiç",
  filmstrip: "Kinolenta",
  poster: "Konsert afişasi",
  ticket: "Çipta",
  easel: "Molbert",
  curtain: "Parda",
  confettiLabel: "Qoğoz konfetti",
  horizon: "Qalam bilan çizilgan ufq çiziği",
  gallery: {
    wall: "Devor",
    caption: "{name}, {age} yoş, {region} · «{title}»",
  },
  sounds: {
    pencil: "Qalam ovozi",
    paper: "Qoğoz şitirlaşi",
    xylophone: "Ksilofon",
  },
};

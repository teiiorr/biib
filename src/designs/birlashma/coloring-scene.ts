/**
 * Boʻyash sahnasi (400×300): kichik sahna, parda, quyosh, molbert, bulutlar, tepaliklar, varrak.
 * Har boʻlak yopiq yoʻl; chiziqlar alohida, boʻyalmaydi.
 */
export interface ColoringRegion {
  readonly id: string;
  readonly d: string;
}

export const COLORING_REGIONS: readonly ColoringRegion[] = [
  { id: "sky", d: "M8 8h384v150H8z" },
  { id: "sun", d: "M330 58a26 26 0 1 1 0 52 26 26 0 0 1 0-52z" },
  {
    id: "cloud-1",
    d: "M70 60c-14 0-20-12-12-20 6-6 14-4 18 0 4-10 22-10 26 0 12-4 22 6 16 16 4 6-2 12-10 12z",
  },
  {
    id: "cloud-2",
    d: "M230 40c-10 0-14-9-8-15 5-5 11-3 14 0 3-8 17-8 20 0 9-3 17 5 12 12 3 5-2 9-8 9z",
  },
  { id: "hill-left", d: "M8 200c50-40 110-48 170-20v50H8z" },
  { id: "hill-right", d: "M180 230c50-46 120-56 212-30v30H180z" },
  { id: "ground", d: "M8 230h384v62H8z" },
  { id: "stage", d: "M120 150h160v80H120z" },
  { id: "curtain-left", d: "M120 150c22 20 22 60 0 80h30c-10-24-10-56 0-80z" },
  { id: "curtain-right", d: "M280 150c-22 20-22 60 0 80h-30c10-24 10-56 0-80z" },
  { id: "curtain-top", d: "M112 142h176v14H112z" },
  { id: "easel-paper", d: "M48 160h56v60H48z" },
  { id: "easel-frame", d: "M44 156h64v6H44zM52 220l-8 60h6l8-60zM100 220l8 60h-6l-8-60z" },
  { id: "kite", d: "M336 176l22 22-22 30-22-30z" },
  {
    id: "kite-tail",
    d: "M336 228c-6 10 6 16 0 26-6 10 6 16 0 26h4c6-10-6-16 0-26 6-10-6-16 0-26z",
  },
  { id: "bird", d: "M170 78c6-8 14-8 18 0 4-8 12-8 18 0-6 2-12 6-18 12-6-6-12-10-18-12z" },
];

/* Kontur chiziqlari: marker uslubi, bitta yoʻl. */
export const COLORING_STROKES = [
  "M8 8h384v284H8z",
  "M330 58a26 26 0 1 1 0 52 26 26 0 0 1 0-52z",
  "M330 26v12M330 132v12M280 84h12M368 84h12M295 49l8 8M357 111l8 8M365 49l-8 8M303 111l-8 8",
  "M70 60c-14 0-20-12-12-20 6-6 14-4 18 0 4-10 22-10 26 0 12-4 22 6 16 16 4 6-2 12-10 12z",
  "M230 40c-10 0-14-9-8-15 5-5 11-3 14 0 3-8 17-8 20 0 9-3 17 5 12 12 3 5-2 9-8 9z",
  "M8 200c50-40 110-48 170-20M180 230c50-46 120-56 212-30M8 230h384",
  "M120 150h160v80H120zM112 142h176v14H112z",
  "M120 150c22 20 22 60 0 80M150 150c-10 24-10 56 0 80M280 150c-22 20-22 60 0 80M250 150c10 24 10 56 0 80",
  "M48 160h56v60H48zM44 156h64v6H44zM52 220l-8 60M100 220l8 60M60 190c8-10 16-10 24 0",
  "M336 176l22 22-22 30-22-30zM336 176v52M314 198h44M336 228c-6 10 6 16 0 26-6 10 6 16 0 26",
  "M170 78c6-8 14-8 18 0 4-8 12-8 18 0",
].join(" ");

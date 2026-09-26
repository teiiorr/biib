/* 24 px toʻr, 20 px jonli maydon (2…22). Faqat absolyut buyruqlar: M L H V Q C A Z. */

export const ICON_NAMES = [
  "menu",
  "close",
  "language",
  "external",
  "arrow-right",
  "arrow-left",
  "arrow-up",
  "chevron-down",
  "chevron-right",
  "play",
  "pause",
  "copy",
  "check",
  "link",
  "share",
  "download",
  "mail",
  "phone",
  "map-pin",
  "clock",
  "telegram",
  "instagram",
  "youtube",
  "facebook",
  "sun",
  "moon",
  "system",
  "sliders",
  "sound",
  "motion",
  "home",
  "projects",
  "news",
  "contact",
  "about",
] as const;

export type IconName = (typeof ICON_NAMES)[number];

export const ICON_PATHS: Record<IconName, string> = {
  menu: "M4 7 L20 7 M4 12 L20 12 M4 17 L20 17",
  close: "M6 6 L18 18 M18 6 L6 18",
  language:
    "M12 21 A9 9 0 1 0 12 3 A9 9 0 1 0 12 21 Z M3 12 H21 M12 3 Q16.5 7.5 16.5 12 Q16.5 16.5 12 21 Q7.5 16.5 7.5 12 Q7.5 7.5 12 3 Z",
  external: "M10 5 H6 Q5 5 5 6 V18 Q5 19 6 19 H18 Q19 19 19 18 V14 M11 13 L20 4 M14 4 H20 V10",
  /* Strelkalar uchi tomon 1 px siljigan. */
  "arrow-right": "M5 12 L21 12 M15 6 L21 12 L15 18",
  "arrow-left": "M19 12 L3 12 M9 6 L3 12 L9 18",
  "arrow-up": "M12 19 L12 3 M6 9 L12 3 L18 9",
  "chevron-down": "M6 9 L12 15 L18 9",
  "chevron-right": "M10 6 L16 12 L10 18",
  play: "M8 5 L19 12 L8 19 Z",
  pause: "M8 5 V19 M16 5 V19",
  copy: "M9 9 H19 Q20 9 20 10 V19 Q20 20 19 20 H10 Q9 20 9 19 Z M15 9 V5 Q15 4 14 4 H5 Q4 4 4 5 V14 Q4 15 5 15 H9",
  check: "M5 12.5 L10 17.5 L19 7",
  link: "M10 13 A5 5 0 0 0 17.54 13.54 L20.54 10.54 A5 5 0 0 0 13.47 3.47 L11.75 5.18 M14 11 A5 5 0 0 0 6.46 10.46 L3.46 13.46 A5 5 0 0 0 10.53 20.53 L12.24 18.82",
  share:
    "M12 15 V3 M8 7 L12 3 L16 7 M6 11 H5 Q4 11 4 12 V19 Q4 20 5 20 H19 Q20 20 20 19 V12 Q20 11 19 11 H18",
  download: "M12 4 V15 M7 11 L12 16 L17 11 M4 19 H20",
  mail: "M3 7 Q3 6 4 6 H20 Q21 6 21 7 V17 Q21 18 20 18 H4 Q3 18 3 17 Z M3 8 L12 14 L21 8",
  phone:
    "M5 4 H8.5 L10.5 8.5 L8 10 Q10 14.5 14 16 L15.5 13.5 L20 15.5 V19 Q20 20.5 18.5 20.5 Q5.5 19.5 3.5 6 Q3.5 4 5 4 Z",
  "map-pin":
    "M12 21 Q5 14.5 5 10 A7 7 0 0 1 19 10 Q19 14.5 12 21 Z M12 13 A3 3 0 1 0 12 7 A3 3 0 1 0 12 13 Z",
  clock: "M12 21 A9 9 0 1 0 12 3 A9 9 0 1 0 12 21 Z M12 7 V12 L15.5 14",
  telegram:
    "M20.5 3.5 L3.5 10.5 L9.5 13 L11.5 19.5 L14.5 15.5 L18.5 18.5 Z M9.5 13 L20.5 3.5 L14.5 15.5",
  instagram:
    "M7 3 H17 Q21 3 21 7 V17 Q21 21 17 21 H7 Q3 21 3 17 V7 Q3 3 7 3 Z M12 16 A4 4 0 1 0 12 8 A4 4 0 1 0 12 16 Z M17.4 6.5 L17.6 6.5",
  youtube:
    "M3 8 Q3 5.5 5.5 5.5 H18.5 Q21 5.5 21 8 V16 Q21 18.5 18.5 18.5 H5.5 Q3 18.5 3 16 Z M10 9 L15.5 12 L10 15 Z",
  facebook: "M16.5 3.5 H14 Q10.5 3.5 10.5 7 V21 M7.5 10.5 H15",
  sun: "M12 16 A4 4 0 1 0 12 8 A4 4 0 1 0 12 16 Z M12 2.5 V5 M12 19 V21.5 M2.5 12 H5 M19 12 H21.5 M5.3 5.3 L7 7 M17 17 L18.7 18.7 M5.3 18.7 L7 17 M17 7 L18.7 5.3",
  moon: "M12 3 A6 6 0 0 0 21 12 A9 9 0 1 1 12 3 Z",
  system: "M4 4 H20 Q21 4 21 5 V15 Q21 16 20 16 H4 Q3 16 3 15 V5 Q3 4 4 4 Z M8 20 H16 M12 16 V20",
  sliders:
    "M4 6 H6 M10 6 H20 M9.5 6 A1.5 1.5 0 1 0 6.5 6 A1.5 1.5 0 1 0 9.5 6 Z M4 12 H14 M18 12 H20 M17.5 12 A1.5 1.5 0 1 0 14.5 12 A1.5 1.5 0 1 0 17.5 12 Z M4 18 H8 M12 18 H20 M11.5 18 A1.5 1.5 0 1 0 8.5 18 A1.5 1.5 0 1 0 11.5 18 Z",
  sound: "M4 9.5 H7.5 L12.5 5.5 V18.5 L7.5 14.5 H4 Z M16 9 Q18 12 16 15 M18.5 6.5 Q22 12 18.5 17.5",
  motion: "M3 15 Q7 5 12 12 Q17 19 21 9 M17.5 8.5 L21 9 L20.5 12.5",
  home: "M3 11 L12 3.5 L21 11 M5 9.5 V20 Q5 21 6 21 H18 Q19 21 19 20 V9.5 M10 21 V14 H14 V21",
  /* Sahna: peshtoq va ikki parda. */
  projects: "M3 4 H21 M4 4 V20 M20 4 V20 M4 4 Q10 7 7.5 20 M20 4 Q14 7 16.5 20 M4 20 H21",
  news: "M4 4 H17 Q18 4 18 5 V19 Q18 20.5 19.5 20.5 Q21 20.5 21 19 V9 H18 M5.5 20.5 H19.5 M4 4 V19 Q4 20.5 5.5 20.5 M7 8 H11 V12 H7 Z M14 8 H15 M14 12 H15 M7 16 H15",
  contact: "M3 9 L12 3.5 L21 9 V19 Q21 20 20 20 H4 Q3 20 3 19 Z M3 9 L12 15 L21 9",
  about:
    "M12 6.5 Q9 4.5 3.5 5 V18 Q9 17.5 12 19.5 Q15 17.5 20.5 18 V5 Q15 4.5 12 6.5 Z M12 6.5 V19.5",
};

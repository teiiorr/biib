/* Panelning oʻz belgilari: sayt toʻplami bilan bir oilada (24 px toʻr, 20 px jonli maydon, 1.75 px chiziq,
   faqat absolyut buyruqlar). Ommaviy sprit kattalashmaydi: bular faqat panel HTML ida. */

export const ADMIN_ICON_NAMES = ["dashboard", "image", "text", "folder", "log-out"] as const;

export type AdminIconName = (typeof ADMIN_ICON_NAMES)[number];

export const ADMIN_ICON_PATHS: Record<AdminIconName, string> = {
  dashboard:
    "M5 4 H9 Q10 4 10 5 V9 Q10 10 9 10 H5 Q4 10 4 9 V5 Q4 4 5 4 Z M15 4 H19 Q20 4 20 5 V9 Q20 10 19 10 H15 Q14 10 14 9 V5 Q14 4 15 4 Z M5 14 H9 Q10 14 10 15 V19 Q10 20 9 20 H5 Q4 20 4 19 V15 Q4 14 5 14 Z M15 14 H19 Q20 14 20 15 V19 Q20 20 19 20 H15 Q14 20 14 19 V15 Q14 14 15 14 Z",
  image:
    "M4 5 H20 Q21 5 21 6 V18 Q21 19 20 19 H4 Q3 19 3 18 V6 Q3 5 4 5 Z M3 16 L8 11 L13 16 M11 14 L15 10 L21 16 M8.5 9 A1.5 1.5 0 1 0 8.5 6 A1.5 1.5 0 1 0 8.5 9 Z",
  text: "M4 6 H20 M4 10 H20 M4 14 H20 M4 18 H13",
  folder: "M3 7 Q3 5 5 5 H9 L11 7 H19 Q21 7 21 9 V17 Q21 19 19 19 H5 Q3 19 3 17 Z M3 10 H21",
  "log-out": "M10 4 H6 Q4 4 4 6 V18 Q4 20 6 20 H10 M15 8 L19 12 L15 16 M19 12 H9",
};

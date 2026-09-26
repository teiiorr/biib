/* Havola 60 belgidan oshmaydi: Telegram va pochtada toʻliq koʻrinadi, -2 qoʻshimchasiga ham joy qoladi. */
const SLUG_MAX = 60;
/* Band boʻlsa sinab koʻriladigan qoʻshimchalar soni (-2 … -20). */
const SUFFIX_LIMIT = 20;

/**
 * Oʻzbekcha sarlavhadan ASCII havola: oʻ/gʻ → o/g, tutuq va apostroflar tushadi, diakritika olinadi,
 * qolgan hamma belgi «-» boʻladi. Uzun boʻlsa soʻz chegarasida qirqiladi.
 */
export function slugFromUz(title: string): string {
  const base = title
    .replace(/([oOgG])['‘’`ʻʼ]/g, "$1")
    .replace(/['‘’`ʻʼ]/g, "")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (base.length <= SLUG_MAX) return base;
  const cut = base.slice(0, SLUG_MAX + 1);
  const boundary = cut.lastIndexOf("-");
  return (boundary > 0 ? cut.slice(0, boundary) : base.slice(0, SLUG_MAX)).replace(/-+$/, "");
}

/** Birinchisi asl havola, keyin -2, -3 …: birinchi boʻshi olinadi. */
export function slugCandidates(base: string): readonly string[] {
  return [base, ...Array.from({ length: SUFFIX_LIMIT - 1 }, (_, i) => `${base}-${i + 2}`)];
}

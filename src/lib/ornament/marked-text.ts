export interface TextRun {
  readonly text: string;
  readonly marked: boolean;
}

const MARK = /\{\{([^{}]+)\}\}/g;

/**
 * "{{soʻz}}" belgilarini ajratadi. Lugʻat matnida koʻpi bilan `max` ta soʻz belgilanadi (§11.6:
 * bir koʻrinishda uchtadan ortiq zardoʻzi yoʻq); ortiqchasi oddiy matn boʻlib qoladi.
 */
export function splitMarked(text: string, max = 3): TextRun[] {
  const runs: TextRun[] = [];
  let last = 0;
  let count = 0;
  for (const match of text.matchAll(MARK)) {
    const index = match.index ?? 0;
    const word = match[1] ?? "";
    if (index > last) runs.push({ text: text.slice(last, index), marked: false });
    if (count < max) {
      runs.push({ text: word, marked: true });
      count += 1;
    } else {
      runs.push({ text: word, marked: false });
    }
    last = index + match[0].length;
  }
  if (last < text.length) runs.push({ text: text.slice(last), marked: false });
  return mergePlain(runs);
}

function mergePlain(runs: readonly TextRun[]): TextRun[] {
  const out: TextRun[] = [];
  for (const run of runs) {
    const prev = out[out.length - 1];
    if (prev && !prev.marked && !run.marked) {
      out[out.length - 1] = { text: prev.text + run.text, marked: false };
    } else {
      out.push(run);
    }
  }
  return out;
}

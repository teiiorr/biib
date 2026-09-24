/** Havola, pochta va {oʻrinbosar} qismlari transliteratsiya qilinmaydi; {{soʻz}} belgilari ichidagi soʻz oʻgiriladi. */
const PROTECTED =
  /(Designed & Developed by teiior|https?:\/\/\S+|[\w.+-]+@[\w-]+\.[\w.]+|\b[a-z0-9-]+\.(?:uz|com|org|net|ru|io)\b|\{(?!\{)[^}]+\}|<[^>]+>|\/[\w/-]+)/g;
const WORD = /[A-Za-zÀ-ÿʻʼ][A-Za-zÀ-ÿʻʼ-]*/g;

export function matchCase(source: string, target: string): string {
  const first = source[0] ?? "";
  if (source.length > 1 && source === source.toUpperCase() && /[A-Z]/.test(source)) {
    return target.toUpperCase();
  }
  if (first === first.toUpperCase() && first !== first.toLowerCase()) {
    return (target[0] ?? "").toUpperCase() + target.slice(1);
  }
  return target;
}

export function mapWords(text: string, transform: (word: string) => string): string {
  const parts = text.split(PROTECTED);
  return parts
    .map((part, index) => {
      if (index % 2 === 1) return part;
      return part.replace(WORD, (word) => {
        // Qisqartmalar (PDF, SVG) lotinda qoladi.
        if (word.length <= 5 && word === word.toUpperCase() && /^[A-Z]+$/.test(word)) return word;
        return transform(word);
      });
    })
    .join("");
}

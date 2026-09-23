import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/locales";
import { getMilestones, t } from "@/content";

import { PaperSheet } from "./PaperSheet";
import type { ArtProps } from "../registry";

/** Tarix ipi: chizmalar kir qisqichlari bilan ipga osilgan; telefonda vertikal. */
export default function Clothespin({ locale, className }: ArtProps) {
  const items = getMilestones();
  const dict = getDictionary(locale);
  return (
    <div className={className ? `clothesline ${className}` : "clothesline"}>
      <svg
        viewBox="0 0 1000 40"
        preserveAspectRatio="none"
        className="clothesline-rope"
        aria-hidden="true"
      >
        <path d="M0 8c250 30 500 30 1000 8" fill="none" stroke="var(--ink-3)" strokeWidth="2" />
      </svg>
      <ol className="clothesline-items">
        {items.map((m, i) => (
          <li key={m.id} className="clothesline-item">
            <span className="clothespin" aria-hidden="true" title={dict.birlashma.clothespinAlt} />
            <PaperSheet
              as="div"
              seed={m.id}
              rotate={i % 2 ? 1.4 : -1.2}
              className="clothesline-card"
            >
              <span className="t-note text-ink-3 tnum">{m.year ?? "····"}</span>
              <p className="t-h4">{t(m.title, locale as Locale)}</p>
              <p className="t-small text-ink-2">{t(m.text, locale as Locale)}</p>
            </PaperSheet>
          </li>
        ))}
      </ol>
    </div>
  );
}

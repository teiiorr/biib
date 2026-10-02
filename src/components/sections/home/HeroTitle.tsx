import { Fragment, type CSSProperties } from "react";

import { headingClass } from "@/components/ui/Heading";
import { cx } from "@/lib/cx";

interface HeroTitleProps {
  readonly name: string;
}

/**
 * Nom serverda soʻzlarga boʻlinadi va har soʻz CSS bilan koʻtariladi, JS kutilmaydi. Toʻliq nom aria-label da,
 * soʻz qutilari yordamchi texnologiyalardan yashirilgan. h1 hech qachon SplitText bilan boʻlinmaydi.
 * data-text: koʻtariladigan oltin nusxa (::after) matni; DOM matni joyida qolib, LCP boʻladi (motion.css).
 */
export function HeroTitle({ name }: HeroTitleProps) {
  const words = name.split(/\s+/).filter(Boolean);
  return (
    <h1
      id="hero-title"
      className={cx(headingClass(1, "display-xl", "center"), "home-hero-title")}
      aria-label={name}
    >
      {words.map((word, index) => (
        <Fragment key={`${index}-${word}`}>
          {index > 0 ? " " : null}
          <span className="hero-word" style={{ "--i": index } as CSSProperties} aria-hidden="true">
            <span className="hero-word-in" data-text={word}>
              {word}
            </span>
          </span>
        </Fragment>
      ))}
    </h1>
  );
}

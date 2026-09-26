import { Fragment, type CSSProperties } from "react";

import { headingClass } from "@/components/ui/Heading";
import { cx } from "@/lib/cx";

interface HeroTitleProps {
  readonly name: string;
}

/**
 * Nom serverda soʻzlarga boʻlinadi: har soʻz oʻz niqogʻi ostidan CSS bilan koʻtariladi (hero-enter),
 * JS kutilmaydi. aria-label butun nomni beradi, soʻz qutilari yordamchi texnologiyaga koʻrinmaydi
 * (SplitText aria: "auto" bilan bir xil). h1 hech qachon SplitText bilan boʻlinmaydi (§13.2).
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
            <span className="hero-word-in">{word}</span>
          </span>
        </Fragment>
      ))}
    </h1>
  );
}

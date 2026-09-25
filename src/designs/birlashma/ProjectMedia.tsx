import Curtain from "./Curtain";
import { CurtainFrame, Poster } from "./PaperObjects";
import type { ArtProps } from "../registry";

/**
 * UPOP TREND mediasi uchun qogʻoz obyekti (25.8): bosh sahifada afisha va chipta stikeri,
 * loyiha sahifasida skroll bilan ochiladigan parda. Tanlov `variant` orqali, rang hikoyasidan emas.
 */
export default function ProjectMedia({
  variant = "poster",
  children,
  className,
  story,
  locale,
  copy,
}: ArtProps) {
  const extra = className ? { className } : {};
  if (variant === "curtain") {
    return (
      <CurtainFrame {...extra}>
        <Curtain locale={locale} {...(copy ? { copy } : {})}>
          {children}
        </Curtain>
      </CurtainFrame>
    );
  }
  return (
    <Poster
      {...(story ? { story } : {})}
      {...(copy?.ageSticker ? { age: copy.ageSticker } : {})}
      {...extra}
    >
      {children}
    </Poster>
  );
}

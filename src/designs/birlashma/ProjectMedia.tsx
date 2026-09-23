import Curtain from "./Curtain";
import { CurtainFrame, Easel, FilmStrip, Poster } from "./PaperObjects";
import type { ArtProps } from "../registry";

/**
 * Loyiha mediasi uchun qogʻoz obyekti (25.8): UPOP TREND — afisha va chipta, Sahna bolalari — parda,
 * Ertak ustaxonasi — kinolenta, Rangli olam — molbert. Tanlov rang hikoyasidan.
 */
export default function ProjectMedia({ children, className, story, locale }: ArtProps) {
  const extra = className ? { className } : {};
  switch (story?.primary) {
    case "art-1":
      return (
        <Poster story={story} {...extra}>
          {children}
        </Poster>
      );
    case "art-5":
      return (
        <CurtainFrame story={story} {...extra}>
          <Curtain locale={locale}>{children}</Curtain>
        </CurtainFrame>
      );
    case "art-3":
      return <FilmStrip {...extra}>{children}</FilmStrip>;
    default:
      return (
        <Easel {...(story ? { story } : {})} {...extra}>
          {children}
        </Easel>
      );
  }
}

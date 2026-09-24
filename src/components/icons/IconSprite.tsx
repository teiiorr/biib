import { MARKER_PATHS } from "./paths-marker";
import { ICON_NAMES, ICON_PATHS } from "./paths";

/**
 * Ikkala belgi toʻplami (Atlas 1.75 px, Birlashma marker 2 px) bir marta layoutda: Icon <use>
 * bilan ishora qiladi, shuning uchun yoʻl maʼlumotlari mijoz JS iga kirmaydi.
 */
export function IconSprite() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
      {ICON_NAMES.map((name) => (
        <symbol key={name} id={`i-a-${name}`} viewBox="0 0 24 24">
          <path d={ICON_PATHS[name]} />
        </symbol>
      ))}
      {ICON_NAMES.map((name) => (
        <symbol key={name} id={`i-b-${name}`} viewBox="0 0 24 24">
          <path d={MARKER_PATHS[name]} />
        </symbol>
      ))}
    </svg>
  );
}

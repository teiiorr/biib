import { ICON_NAMES, ICON_PATHS } from "./paths";

/**
 * Belgilar toʻplami (1.75 px chiziq) bir marta layoutda: Icon <use> bilan ishora qiladi, shuning
 * uchun yoʻl maʼlumotlari mijoz JS iga kirmaydi.
 */
export function IconSprite() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
      {ICON_NAMES.map((name) => (
        <symbol key={name} id={`i-${name}`} viewBox="0 0 24 24">
          <path d={ICON_PATHS[name]} />
        </symbol>
      ))}
    </svg>
  );
}

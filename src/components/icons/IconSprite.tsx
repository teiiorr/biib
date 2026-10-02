import { ICON_NAMES, ICON_PATHS } from "./paths";

/** Belgilar sahifa qolipida bir marta chiziladi, Icon ularga <use> orqali murojaat qiladi. */
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

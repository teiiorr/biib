import { ADMIN_ICON_NAMES, ADMIN_ICON_PATHS } from "./admin-icon-paths";

/** Panel belgilari layout ichida bir marta chiziladi, AdminIcon ularga <use> orqali murojaat qiladi. */
export function AdminIconSprite() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
      {ADMIN_ICON_NAMES.map((name) => (
        <symbol key={name} id={`ai-${name}`} viewBox="0 0 24 24">
          <path d={ADMIN_ICON_PATHS[name]} />
        </symbol>
      ))}
    </svg>
  );
}

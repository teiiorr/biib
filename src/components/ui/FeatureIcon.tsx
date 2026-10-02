import { Icon } from "@/components/icons/Icon";
import type { IconName } from "@/components/icons/paths";

/** Bezak: ekran oʻquvchisi punkt matnini oʻqiydi. Hover uslubi ui.css faylida (.feature). */
export function FeatureIcon({ name }: { readonly name: IconName }) {
  return (
    <span className="feature-icon" aria-hidden="true">
      <Icon name={name} size={20} />
    </span>
  );
}

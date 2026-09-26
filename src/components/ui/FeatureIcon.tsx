import { Icon } from "@/components/icons/Icon";
import type { IconName } from "@/components/icons/paths";

/**
 * Punktning belgi plitkasi (egasining talabi: punkt faqat matn boʻlmasin). Belgi skrollda chiziladi,
 * hoverda plitka koʻtarilib oltin halqa oladi (ui.css .feature). Bezak: ekran oʻquvchisi matnni oʻqiydi.
 */
export function FeatureIcon({ name }: { readonly name: IconName }) {
  return (
    <span className="feature-icon" aria-hidden="true">
      <Icon name={name} size={20} />
    </span>
  );
}
